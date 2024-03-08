from backend.models import Producto, Fraccion, Usuario, MovimientoBodega,\
 DetalleMovBodega, Bodega, Movimiento, Lote, Inventario
from backend.utils.exceptions import ErrorDeUsuario
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
def reducirLote(lotes, movimiento, cantidad, capacidad, stock, bodega, detalleMov, hacia=None):
    try:
        cantidad = int(cantidad)
        if cantidad <= 0:
            detalleMov.cantidadActual = 0
            detalleMov.save()
            return
        lote = lotes.first()
        movimiento.lotes.add(lote)
        movimiento.save()
        inventario = Inventario.objects.get(lote=lote, stock=stock)
        cantidadInicial = inventario.cantidad
        cantidadFinal = 0

        if cantidad <= inventario.cantidad:
            cantidadNuevo = cantidad - inventario.cantidad
            cantidadMovimiento = inventario.cantidad - (inventario.cantidad - cantidad)
            inventario.cantidad = inventario.cantidad - cantidad
            inventario.save()
            cantidadFinal = inventario.cantidad
        else:
            cantidadNuevo = cantidad - inventario.cantidad
            cantidadMovimiento = inventario.cantidad
            inventario.cantidad = 0
            inventario.save()
            cantidadFinal = inventario.cantidad
        costo_unitario = 0
        costo_total = 0
        if inventario.costo_unitario > 0:
            costo_unitario = inventario.costo_unitario
            costo_total = costo_unitario * cantidadMovimiento
        if hacia is not None:
            inventario.costo_total = inventario.costo_unitario * inventario.cantidad
            inventario.save()
        detRow = DetalleMovBodega(
            lote=lote,
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
        lotes = lotes.exclude(id=lote.id)
        detalleMov.cantidadActual = cantidadNuevo
        detalleMov.save()
        reducirLote(lotes, movimiento, cantidadNuevo,capacidad, stock, detalleMov, bodega)
    except:
        raise ErrorDeUsuario('No se puede realizar el despacho')
    


    