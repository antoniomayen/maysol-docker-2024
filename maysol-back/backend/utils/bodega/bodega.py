from backend.models import Producto, Fraccion, Usuario, MovimientoBodega,\
 DetalleMovBodega, Bodega, Movimiento, Lote, Inventario
from backend.utils.exceptions import ErrorDeUsuario
# type: ignore
from django.db.models import Q, F, Sum
import math

def query_sum_field(query, field):
    total = query.aggregate(Sum(field))["{}__sum".format(field)]
    return float(total if total else 0)

def validaciones( lotes, usuario, bodega, data):
   
    if len(lotes) <= 0:
        raise ErrorDeUsuario("Se debe ingresar el lote a modificar.")
    if usuario.accesos.administrador != True:
        if bodega.empresa != usuario.proyecto:
            raise ErrorDeUsuario('No puede realizar un movimiento de bodega, no tiene los permisos necesarios.')
    if data.get('justificacion', None) is None:
        raise ErrorDeUsuario('Se debe de ingresar una justificación.')

def validarExistencias(bodega, fraccion):
    stock = fraccion.get('producto')
    cantidad = int(fraccion.get('despachar', 0))
    fraccion_verificar = Fraccion.objects.get(id=stock)
    producto = fraccion_verificar.producto
    fraccion_unitario = producto.fracciones.all().first()
    total = Inventario.objects.filter(bodega=bodega, stock=fraccion_unitario).aggregate(Sum('cantidad'))['cantidad__sum']
    total = int(total if total else 0)
    total = math.ceil(total / fraccion_verificar.capacidad_maxima)
    if total < cantidad:
        raise ErrorDeUsuario('La cantidad actual del  {} no cubre la cantidad de {}'.format(fraccion_verificar.producto.nombre, cantidad))
        

def cantidadActual(lote, stock, bodega):
    consulta = Inventario.objects.filter(bodega=bodega, stock_id=stock).aggregate(Sum('cantidad'))['cantidad__sum']
    return int(consulta if consulta else 0)


def calcularNumero(bodega, tipo):
    cantidad_movimiento = MovimientoBodega.objects.filter(bodega_id=bodega, tipo= tipo).count()
    correlativo = str(cantidad_movimiento + 1)
    while len(correlativo) < 8:
        correlativo = "0" + correlativo
    prefijo = "OI"
    if tipo == MovimientoBodega.DESPACHO:
        prefijo = "OD"
    numero = prefijo + "-" + str(bodega) + "-" + str(correlativo)
    return numero

  
########################################################
## Descripción: Reduce el producto en el invetario
########################################################
import logging

def reducirLote(lotes, movimiento, cantidad, capacidad, stock, bodega, detalleMov, hacia=None):
    try:
        cantidad = int(cantidad)
        logging.info(f"Inicio de reducirLote con cantidad: {cantidad}, capacidad: {capacidad}, stock: {stock}, bodega: {bodega}")
        
        if cantidad <= 0:
            detalleMov.cantidadActual = 0
            detalleMov.save()
            logging.info(f"Cantidad <= 0. Detalle de movimiento actualizado: {detalleMov.cantidadActual}")
            return

        # Recorrer todos los lotes en lugar de obtener solo el primero
        for lote in lotes:
            logging.info(f"Procesando lote: {lote}")
            movimiento.lotes.add(lote)
            movimiento.save()

            # Obtener el inventario correspondiente al lote y al stock
            inventarios = Inventario.objects.filter(lote=lote, stock=stock)

            for inventario in inventarios:
                logging.info(f"Inventario inicial - Lote: {lote}, Stock: {stock}, Cantidad inicial: {inventario.cantidad}")

                cantidadInicial = inventario.cantidad
                cantidadFinal = 0

                if cantidad <= inventario.cantidad:
                    cantidadNuevo = cantidad - inventario.cantidad
                    cantidadMovimiento = inventario.cantidad - (inventario.cantidad - cantidad)
                    inventario.cantidad = inventario.cantidad - cantidad
                    inventario.save()
                    cantidadFinal = inventario.cantidad
                    cantidad = 0  # Ya hemos cubierto la cantidad total solicitada
                    logging.info(f"Cantidad procesada: {cantidadMovimiento}, Cantidad final en inventario: {cantidadFinal}")
                else:
                    cantidadNuevo = cantidad - inventario.cantidad
                    cantidadMovimiento = inventario.cantidad
                    inventario.cantidad = 0
                    inventario.save()
                    cantidadFinal = inventario.cantidad
                    cantidad = cantidadNuevo  # Aún falta cubrir parte de la cantidad
                    logging.info(f"No hay suficiente inventario, se movió todo el stock disponible. Cantidad restante: {cantidad}")

                costo_unitario = 0
                costo_total = 0
                if inventario.costo_unitario > 0:
                    costo_unitario = inventario.costo_unitario
                    costo_total = costo_unitario * cantidadMovimiento
                    logging.info(f"Costo unitario: {costo_unitario}, Costo total: {costo_total}")

                if hacia is not None:
                    inventario.costo_total = inventario.costo_unitario * inventario.cantidad
                    inventario.save()
                    logging.info(f"Inventario actualizado con costo total: {inventario.costo_total}")

                # Crear el detalle de movimiento de bodega
                detRow = DetalleMovBodega(
                    lote=inventario.lote,
                    stock=stock,
                    cantidadInicial=cantidadInicial,
                    cantidadFinal=cantidadFinal,
                    cantidad=cantidadMovimiento,
                    cantidadActual=cantidadMovimiento,
                    movimiento=movimiento,
                    costo_unitario=costo_unitario,
                    costo_total=costo_total
                )
                detRow.save()
                logging.info(f"Detalle de movimiento de bodega guardado: {detRow}")

                # Actualizar el detalle del movimiento
                detalleMov.cantidadActual = cantidadNuevo
                detalleMov.save()
                logging.info(f"DetalleMov actualizado con cantidad nueva: {detalleMov.cantidadActual}")

                # Si ya se ha cubierto toda la cantidad requerida, se detiene el proceso
                if cantidad <= 0:
                    break

    except Exception as e:
        logging.error(f"Error en reducirLote: {e}")
        raise ErrorDeUsuario(f'No se puede realizar el despacho, error: {e}')



    


    