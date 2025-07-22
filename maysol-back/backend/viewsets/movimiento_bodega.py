from django.conf import settings
from django.db import transaction, DatabaseError
from django.db.models import Q, F, Sum, Count, Prefetch
from django.db import transaction


from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response

from datetime import datetime
from django_filters.rest_framework import DjangoFilterBackend

from backend.utils.calcuclar_prod_rent import CalcFechas, CalProduccionGallinero
from backend.utils.exceptions import ErrorDeUsuario
from backend.utils.bodega.bodega import validaciones, validarExistencias, cantidadActual,\
    calcularNumero, reducirLote


from backend.models import Producto, Fraccion, Usuario, MovimientoBodega, \
    DetalleMovBodega, Bodega, Movimiento, Lote, DetalleMovimiento, Inventario, Cuenta, MovimientoGranja
from backend.serializers import MovimientoBodegaSerializer, MovimientoBodegaReadSerializer, MovBodegaReadSerializer,\
    GraficaBodegaDespachoSerializer, GraficaBodegaIngresoSerializer, GraficaBodegaReajusteSerializer
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
import pytz

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

from datetime import datetime, date
from dateutil.relativedelta import relativedelta

class MovimientoBodegaViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = MovimientoBodega.objects.all().order_by('-fecha')

    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = [
        'bodega__empresa',
        'bodega',
        'tipo',
        'detalle_movimiento__stock__id'
    ]
    search_fields = (
        'bodega__empresa__nombre',
        'bodega__nombre',
        'justificacion',
        'movimiento__proveedor__nombre'
    )

    def get_queryset(self):
        movBodega = MovimientoBodega.objects.filter(activo=True)
        self.filter_queryset(movBodega)
        return movBodega

    def get_serializer_class(self):
        """Define serializer for API"""

        if self.action == "list" or self.action == "retrieve":
            return MovimientoBodegaReadSerializer
        else:
            return MovimientoBodegaReadSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            productos = data.get('productos', False)
            usuario = self.request.user
            if productos is False:
                raise ErrorDeUsuario('Se debe de seleccionar productos para hacer un ingreso a bodega.')


            compra = Movimiento.objects.get(id=data.get('movimiento'))
            bodega = Bodega.objects.get(id=data.get('bodega'))

            mensaje = "Ingreso por orden de compra No. {}".format(compra.id)
            _fecha = datetime.utcnow().date()

            with transaction.atomic():
                no_movimiento = calcularNumero(bodega.id, MovimientoBodega.INGRESO)
                movimientoBodega = MovimientoBodega(
                    bodega=bodega,
                    movimiento=compra,
                    usuario=usuario,
                    justificacion=data.get('nota', mensaje),
                    nota=data.get('nota', None),
                    fecha=_fecha,
                    no_movimiento=no_movimiento,
                    tipo=MovimientoBodega.INGRESO,
                    tipoIngreso=MovimientoBodega.INGRESOCOMPRA
                )
                movimientoBodega.save()
                lote = Lote(
                    bodega=bodega,
                    lote=_fecha
                )
                lote.save()
                movimientoBodega.lotes.add(lote)


                for producto in productos:
                    detalleMov = DetalleMovimiento.objects.get(id=producto.get('id'))
                    cantidadIngreso = int(producto.get('cantidadIngreso'))
                    if cantidadIngreso > 0:
                        detalleMov.cantidadActual = detalleMov.cantidadActual - cantidadIngreso
                        detalleMov.save()
                        stock = producto.get('stock')
                        costo = detalleMov.precio_costo * cantidadIngreso
                        movimientoCosto = Movimiento(
                            proyecto=bodega.empresa,
                            monto=costo,
                            precioUnitario=detalleMov.precio_costo,
                            fecha=_fecha,
                            es_costo=True,
                            linea=None,
                            usuario=usuario,
                            moneda=compra.moneda
                        )
                        movimientoCosto.save()
                        detalle = DetalleMovBodega(
                            lote=lote,
                            stock_id=stock.get('id'),
                            cantidadInicial= cantidadIngreso,
                            cantidadFinal=cantidadIngreso,
                            cantidad=cantidadIngreso,
                            movimiento=movimientoBodega,
                            costo_unitario=detalleMov.precio_costo,
                            costo_total=costo
                        )
                        detalle.save()
                        #Creación de registro en el inventario
                        inventario = Inventario(
                            lote=lote,
                            bodega=bodega,
                            stock_id=stock.get('id'),
                            cantidad=cantidadIngreso,
                            costo_unitario=detalleMov.precio_costo,
                            costo_total=costo,
                            movimiento=movimientoCosto
                        )
                        inventario.save()

                    compraEntregada = True
                    ##Se verifica si todos los productos ya han sido ingresados
                    ## para cambiar el estado de la orden de compra a entregado
                    productos = compra.detalle_movimiento.all()
                    for _producto in productos:
                        if  0 < _producto.cantidadActual:
                            compraEntregada = False
                            break;
                    compra.ingresado = compraEntregada
                    compra.save()

                return Response({'detail': 'Se ha ingresado el producto desde una compra'})
            return Response({'detail': 'No se logró realizar el ingreso'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    @list_route(methods=["put"], url_path="reajuste/(?P<pk>[0-9]+)")
    def reajuste(self, request, pk=None, *args, **kwargs):
        """
            Realiza un movimiento de tipo baja o reajuste según el parámetro
            "tipo"
            :body:

        """
        try:
            data = request.data
            usuario = self.request.user
            inventario = Inventario.objects.get(id=pk)
            nota = data.get('nota', None)

            with transaction.atomic():
                # Validaciones
                if data.get('reajuste', None) is None:
                    raise ErrorDeUsuario('Debe de ingresar una cantidad de reajuste.')


                mensaje = 'Se ha realizado un reajuste y se actualizó de {} a {}'.format(inventario.cantidad, data.get('reajuste'))
                if nota is not None:
                    mensaje = nota
                _fecha = datetime.utcnow().date()
                #Registro del movimiento
                movimientoBodega = MovimientoBodega(
                    bodega=inventario.bodega,
                    justificacion=mensaje,
                    nota=data.get('nota', None),
                    fecha=_fecha,
                    tipo=MovimientoBodega.REAJUSTE,
                    usuario=usuario
                )
                movimientoBodega.save()
                movimientoBodega.lotes.add(inventario.lote)

                detalle = DetalleMovBodega(
                    lote=inventario.lote,
                    stock=inventario.stock,
                    cantidadInicial=inventario.cantidad,
                    cantidadFinal=data.get('reajuste'),
                    cantidad=data.get('reajuste'),
                    movimiento=movimientoBodega
                )
                detalle.save()

                #Actualización del inventario
                inventario.cantidad = data.get('reajuste')
                inventario.save()
                return Response({'detail': 'Se ha hecho el reajuste'}, status=status.HTTP_200_OK)
            return Response({'detail': 'No se logró realizar la baja.'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Inventario.DoesNotExist:
            return Response({'detail': 'No existe el producto en bodega'}, status=status.HTTP_400_BAD_REQUEST)

    ########################################################
    ## Descripción: Historico
    ########################################################
    @list_route(methods=["get"], url_path="historico/(?P<pk>[0-9]+)")
    def historico(self, request, pk, *args, **kwargs):
        fechaInicio = self.request.GET.get("dateStart")
        fechaFinal = self.request.GET.get("dateEnd")
        fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
        fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")
        try:
            movimientos = MovimientoBodega.objects.filter(bodega=pk) \
                .filter(fecha__range=[fechaInicio, fechaFinal])\
                .order_by('-fecha').distinct()
            movimientos = self.filter_queryset(movimientos)
            serializer = MovBodegaReadSerializer(movimientos, many=True)
            page = self.paginate_queryset(movimientos)
            if page is not None:
                serializer = MovBodegaReadSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = MovBodegaReadSerializer(movimientos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    ########################################################
    ## Descripción: Ingresos
    ########################################################

    @list_route(methods=["post"], url_path="ingresodespacho")
    def ingresoDespacho(self, request, *args, **kwargs):
        """
            :pk: Se recibe la pk del movimiento del tipo despacho
            :body:


        """
        try:
            data = request.data
            usuario = self.request.user
            bodega = data.get('bodega')
            productos = data.get('productos', [])
            movimientoDespacho = MovimientoBodega.objects.get(id=data.get("movimiento"))
            mensaje = "Ingreso desde despacho de bodega."
            _fecha = datetime.utcnow().date()

            if len(productos) == 0:
                raise ErrorDeUsuario('Se debe ingresar productos para realizar el movimiento.')
            with transaction.atomic():
                no_movimiento = calcularNumero(bodega, MovimientoBodega.INGRESO)
                movimientoBodega = MovimientoBodega(
                    padre=movimientoDespacho,
                    bodega_id=bodega,
                    justificacion=data.get('nota', mensaje),
                    nota=data.get('nota', None),
                    fecha=movimientoDespacho.fecha,
                    usuario=usuario,
                    no_movimiento=no_movimiento,
                    tipo=MovimientoBodega.INGRESO,
                    tipoIngreso=MovimientoBodega.INGRESOBODEGA
                )
                movimientoBodega.save()

                for producto in productos:
                    detalleMov = movimientoDespacho.detalle_movimiento.get(id=producto.get('id'))
                    cantidadIngreso = int(producto.get('cantidadIngreso'))
                    if detalleMov.cantidadActual < cantidadIngreso:
                        raise ErrorDeUsuario(
                            'La cantidad disponible de producto {} del lote {} en la orden de despacho es menor que la cantidad a ingresar'.format(
                                    detalleMov.stock.producto.nombre,
                                    detalleMov.lote.lote.strftime("%d/%m/%Y")
                                )
                            )
                    if cantidadIngreso > 0:
                        detalleMov.cantidadActual = detalleMov.cantidadActual - cantidadIngreso
                        detalleMov.save()
                        lote = Lote(
                            bodega_id=bodega,
                            lote=detalleMov.lote.lote,
                            linea=detalleMov.lote.linea,
                            empresa=detalleMov.lote.empresa
                        )
                        lote.save()
                        movimientoBodega.lotes.add(lote)
                        costo_total = cantidadIngreso * detalleMov.costo_unitario

                        detalle = DetalleMovBodega(
                            lote=lote,
                            stock=detalleMov.stock,
                            cantidadInicial=producto.get('cantidadIngreso'),
                            cantidadFinal=producto.get('cantidadIngreso'),
                            cantidad=producto.get('cantidadIngreso'),
                            movimiento=movimientoBodega,
                            costo_unitario=detalleMov.costo_unitario,
                            costo_total=costo_total
                        )
                        detalle.save()
                        #Creación de registro en el inventario
                        inventario = Inventario(
                            lote=lote,
                            bodega_id=bodega,
                            stock=detalleMov.stock,
                            cantidad=producto.get('cantidadIngreso'),
                            costo_unitario=detalleMov.costo_unitario,
                            costo_total=costo_total,
                            movimiento=detalleMov.movimientoCosto
                        )
                        inventario.save()
                ########################################################
                ## Descripción: Verificicar si ya se entregaron todos los
                ## productos para pasar el despacho a entregado.
                ########################################################
                productos = movimientoDespacho.detalle_movimiento.all()


                despachoEntregado = True
                completo = data.get('completo', False)
                if completo:
                    despachoEntregado = True
                else:
                    for _producto in productos:
                        if 0 < _producto.cantidadActual:
                            despachoEntregado = False
                            break;
                movimientoDespacho.entregado = despachoEntregado
                movimientoDespacho.save()
                return Response({'detail': 'Ingreso realizado'}, status=status.HTTP_200_OK)
            return Response({'detail': 'No se logró realizar el ingreso'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["post"], url_path="ingresoLineaProduccion")
    def ingresoLineaProduccion(self, request, *args, **kwargs):
        try:
            data = request.data
            productos = data.get('productos', False)
            usuario = self.request.user
            if productos is False:
                raise ErrorDeUsuario('Se debe de seleccionar productos para hacer un ingreso a bodega.')

            mensaje = "Ingreso desde línea de producción."

            empresa = data.get('empresa')
            if empresa is None:
                empresa = Bodega.objects.get(id=data.get("bodega")).empresa.id

            with transaction.atomic():
                no_movimiento = calcularNumero(data.get("bodega"), MovimientoBodega.INGRESO)
                movimientoBodega = MovimientoBodega(
                    bodega_id=data.get("bodega"),
                    no_movimiento=no_movimiento,
                    empresa_id=empresa,
                    linea_id=data.get('linea'),
                    justificacion=data.get('nota', mensaje),
                    usuario=usuario,
                    nota=data.get('nota', None),
                    fecha=data.get('fecha'),
                    tipo=MovimientoBodega.INGRESO,
                    tipoIngreso=MovimientoBodega.INGRESOLINEA
                )
                movimientoBodega.save()
                lote = Lote(
                    bodega_id=data.get("bodega"),
                    lote=data.get('fecha'),
                    empresa_id=empresa,
                    linea_id=data.get('linea')
                )
                lote.save()
                movimientoBodega.lotes.add(lote)
                for producto in productos:
                    id_prod = producto["producto"]
                    if isinstance(producto["producto"], str) is True:
                        id_prod = self.crearProducto(producto["producto"], usuario.proyecto, Cuenta.QUETZAL)
                    detalle = DetalleMovBodega(
                        lote=lote,
                        stock_id=id_prod,
                        cantidadInicial=producto.get('cantidad'),
                        cantidadFinal=producto.get('cantidad'),
                        cantidad=producto.get('cantidad'),
                        movimiento=movimientoBodega
                    )
                    detalle.save()
                    #Creación de registro en el inventario
                    inventario = Inventario(
                        lote=lote,
                        bodega_id=data.get("bodega"),
                        stock_id=id_prod,
                        cantidad=producto.get('cantidad')
                    )
                    inventario.save()

            fecha_reg = datetime.strptime(data.get("fecha"), "%Y-%m-%d")
            fechas = CalcFechas(fecha_reg)
            movimientoGallinero = MovimientoGranja.objects.filter(
                gallinero_id=data.get('empresa', None),
                fecha__range=[fechas.fecha_i, fechas.fecha_f]
            ).last()
            if movimientoGallinero is not None:
                calculo = CalProduccionGallinero(movimientoGallinero, fecha_reg)
                movimientoGallinero.rentabilidad = calculo.rentabilidad
                movimientoGallinero.produccion = calculo.produccion
                movimientoGallinero.venta = calculo.ventas
                movimientoGallinero.postura = calculo.postura
                movimientoGallinero.save()

            return Response({'detail': 'Se ha ingresado el producto desde una compra'})
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    ########################################################
    ## Descripción: Despachos
    ########################################################
    @list_route(methods=["get"], url_path="getDespachosBodega/(?P<pk>[0-9]+)")
    def getDespachosBodega(self, request, pk, *args, **kwargs):
        #MovBodegaReadSerializer
        try:
            despachos = MovimientoBodega.objects.filter(destino=pk, entregado=False, activo=True)\
                .order_by('-fecha')
            serializer = MovBodegaReadSerializer(despachos, many=True)
            return Response(serializer.data)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getDespachosPendientes(self, request, *args, **kwargs):
        id = self.request.GET.get("id",None)
        try:
            despachos = MovimientoBodega.objects.filter(bodega_id=id, entregado=False, activo=True,
                                                        tipo=MovimientoBodega.DESPACHO)\
                                                        .exclude(tipoDespacho=MovimientoBodega.DESPACHOLINEA)\
                                                        .order_by('fecha')
            despachos = self.filter_queryset(despachos)
            page = self.paginate_queryset(despachos)
            if page is not None:
                serializer = MovBodegaReadSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = MovBodegaReadSerializer(despachos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def reducir(self, lotes, movimiento, cantidad, stock, bodega, hacia=None, linea=None, contar=True):
        cantidad = int(cantidad)
        if cantidad <= 0:
            return
        if not lotes.count():
            raise ErrorDeUsuario("Revise la cantidad de productos a ingresar.")
        
        # Procesar cada lote
        for lote in lotes:
            if cantidad <= 0:
                break
                
            movimiento.lotes.add(lote)
            movimiento.save()
            
            # CAMBIO PRINCIPAL: Usar filter en lugar de get para manejar múltiples registros
            inventarios = Inventario.objects.filter(lote=lote, stock=stock, bodega=bodega, activo=True)
            
            # Procesar cada inventario del lote
            for inventario in inventarios:
                if cantidad <= 0:
                    break
                    
                cantidadInicial = inventario.cantidad
                cantidadFinal = 0

                if cantidad <= inventario.cantidad:
                    cantidadNuevo = cantidad - inventario.cantidad
                    cantidadMovimiento = inventario.cantidad - (inventario.cantidad - cantidad)
                    inventario.cantidad = inventario.cantidad - cantidad
                    inventario.save()
                    cantidadFinal = inventario.cantidad
                    cantidad = 0  # Ya se cubrió toda la cantidad solicitada
                else:
                    cantidadNuevo = cantidad - inventario.cantidad
                    cantidadMovimiento = inventario.cantidad
                    inventario.cantidad = 0
                    inventario.save()
                    cantidadFinal = inventario.cantidad
                    cantidad = cantidadNuevo  # Aún falta cubrir parte de la cantidad
                    
                costo_unitario = 0
                costo_total = 0
                if inventario.costo_unitario > 0:
                    costo_unitario = inventario.costo_unitario
                    costo_total = costo_unitario * cantidadMovimiento

                responsable = inventario.lote.empresa
                lineaR = inventario.lote.linea
                costo_cargo = 0
                if hacia is not None:
                    responsable = hacia
                    inventario.costo_total = inventario.costo_unitario * inventario.cantidad
                    inventario.save()
                    costo_cargo = inventario.costo_unitario * cantidadMovimiento  # Cambio: usar cantidadMovimiento en lugar de cantidad
                if linea is not None:
                    lineaR = linea
                    
                if inventario.movimiento and inventario.movimiento.monto > 0:
                    movimiento_original = inventario.movimiento
                    movimiento_original.monto = movimiento_original.monto - costo_cargo
                    movimiento_original.save()
                    
                movimientoCosto = None
                if contar == True and inventario.costo_unitario > 0 and costo_cargo > 0:
                    _moneda = Cuenta.QUETZAL
                    if inventario.movimiento and inventario.movimiento.moneda:
                        _moneda = inventario.movimiento.moneda
                    movimientoCosto = Movimiento(
                                    proyecto=responsable,
                                    monto=costo_cargo,
                                    precioUnitario=inventario.costo_unitario,
                                    fecha=movimiento.fecha,
                                    es_costo=True,
                                    linea=lineaR,
                                    usuario=movimiento.usuario,
                                    padreCosto=inventario.movimiento,
                                    moneda=_moneda
                                )
                    movimientoCosto.save()
                    
                detRow = DetalleMovBodega(
                    lote=lote,
                    stock=stock,
                    cantidadInicial=cantidadInicial,
                    cantidadFinal=cantidadFinal,
                    cantidad=cantidadMovimiento,
                    cantidadActual=cantidadMovimiento,
                    movimiento=movimiento,
                    costo_unitario=costo_unitario,
                    costo_total=costo_total,
                    movimientoCosto=movimientoCosto
                )
                detRow.save()

        # Si aún queda cantidad por cubrir después de procesar todos los lotes
        if cantidad > 0:
            raise ErrorDeUsuario(f"No hay suficiente inventario disponible. Falta por cubrir: {cantidad}")

    @list_route(methods=["put"], url_path="despachoBodega/(?P<pk>[0-9]+)")
    def despachoBodega(self, request, pk, *args, **kwargs):
        """
            {
                "empresa":2,
                "bodega":1,
                "fecha":"2019-01-2",
                "productos":[
                    {"producto":4,"despachar":"12"},
                    {"producto":1,"despachar":"23"}
                ],
                "bodegaSalida":"1"
            }
        """
        try:

            data = request.data
            usuario = self.request.user
            bodega = Bodega.objects.get(id=data.get('bodegaSalida'))
            productos = data.get('productos', [])
            contar=True
            if len(productos) == 0:
                raise ErrorDeUsuario('Se debe de seleccionar productos para realizar un despacho')

            mensaje = "Despacho hacia bodega."
            with transaction.atomic():
                no_movimiento = calcularNumero(bodega.id, MovimientoBodega.DESPACHO)
                movimientoBodega = MovimientoBodega(
                    bodega_id=data.get("bodegaSalida"),
                    destino_id=data.get('bodega'),
                    no_movimiento=no_movimiento,
                    justificacion=mensaje,
                    usuario=usuario,
                    nota=data.get('nota', None),
                    fecha=data.get('fecha'),
                    tipo=MovimientoBodega.DESPACHO,
                    tipoDespacho=MovimientoBodega.DESPACHOBODEGA
                )
                movimientoBodega.save()

                if movimientoBodega.bodega.empresa == movimientoBodega.destino.empresa:
                    contar = False
                #REcorrer productos para realizar el despacho
                for _producto in productos:
                        validarExistencias(bodega, _producto)
                for _producto in productos:
                    fraccion_pivote = Fraccion.objects.get(id= _producto.get('producto'))
                    #Cantidad de respaldo
                    _detalle_copia = DetalleMovBodega.objects.create(
                        movimiento_original=movimientoBodega,
                        stock=fraccion_pivote,
                        cantidadInicial=int(_producto.get('despachar')),
                        cantidadFinal=int(_producto.get('despachar')),
                        cantidad=int(_producto.get('despachar')),
                        cantidadActual=int(_producto.get('despachar')),
                    )
                    #Fin de copia de respaldo
                    producto = fraccion_pivote.producto
                    fraccion_unitario = producto.fracciones.all().first()
                    consulta = Inventario.objects.filter(bodega=bodega, stock=fraccion_unitario)
                    detalle = consulta.values("stock", "lote")\
                        .annotate(cantidad=Sum('cantidad'))\
                        .filter(cantidad__gt=0)\
                        .values_list('lote', flat=True)
                    lotes = Lote.objects.filter(id__in=detalle).order_by('lote')
                    cantidad = int(_producto.get('despachar')) * fraccion_pivote.capacidad_maxima
                    stock = Fraccion.objects.get(id=_producto.get('producto'))
                    self.reducir(lotes, movimientoBodega,
                                 cantidad, fraccion_unitario, bodega, movimientoBodega.destino.empresa, None,contar)
                return Response({'detail': 'Se ha realizado el despacho'}, status=status.HTTP_200_OK)
            return Response({'detail': 'No se logró realizar el despacho'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["put"], url_path="despachoLineaProduccion/(?P<pk>[0-9]+)")
    def despachoLineaProduccion(self, request, pk, *args, **kwargs):
        """
            {
                "empresa":2,
                "fecha":"2019-01-2",
                "linea": 1,
                "productos":[
                    {"producto":4,"despachar":"12"},
                    {"producto":1,"despachar":"23"}
                ],
                "bodegaSalida":"1"
            }
        """
        try:
            data = request.data
            bodega = Bodega.objects.get(id=data.get('bodegaSalida'))
            productos = data.get('productos', [])
            usuario = self.request.user
            if len(productos) == 0:
                raise ErrorDeUsuario('Se debe de seleccionar productos para realizar un despacho')

            mensaje = "Despacho hacia línea de producción."
            with transaction.atomic():
                no_movimiento = calcularNumero(bodega.id, MovimientoBodega.DESPACHO)
                movimientoBodega = MovimientoBodega(
                    bodega_id=data.get("bodegaSalida"),
                    empresa_id=data.get('empresa'),
                    linea_id=data.get('linea'),
                    justificacion=data.get('nota', mensaje),
                    usuario=usuario,
                    nota=data.get('nota', None),
                    fecha=data.get('fecha'),
                    no_movimiento=no_movimiento,
                    tipo=MovimientoBodega.DESPACHO,
                    tipoDespacho=MovimientoBodega.DESPACHOLINEA
                )
                movimientoBodega.save()

                #REcorrer productos para realizar el despacho
                for _producto in productos:
                        validarExistencias(bodega, _producto)
                for _producto in productos:
                    fraccion_pivote = Fraccion.objects.get(id= _producto.get('producto'))
                    producto = fraccion_pivote.producto
                    fraccion_unitario = producto.fracciones.all().first()
                    consulta = Inventario.objects.filter(bodega=bodega, stock=fraccion_unitario)
                    detalle = consulta.values("stock", "lote")\
                        .annotate(cantidad=Sum('cantidad'))\
                        .filter(cantidad__gt=0)\
                        .values_list('lote', flat=True)
                    lotes = Lote.objects.filter(id__in=detalle).order_by('lote')
                    cantidad = int(_producto.get('despachar')) * fraccion_pivote.capacidad_maxima
                    stock = Fraccion.objects.get(id=_producto.get('producto'))
                    self.reducir(lotes, movimientoBodega,
                                 cantidad, fraccion_unitario, bodega, movimientoBodega.empresa, movimientoBodega.linea)
                return Response({'detail': 'Se ha realizado el despacho'}, status=status.HTTP_200_OK)
            return Response({'detail': 'No se logró realizar el despacho'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["put"], url_path="despachoVenta/(?P<pk>[0-9]+)")
    def despachoVenta(self, request, pk, *args, **kwargs):
        """
            {
                "empresa":2,
                "bodega":1,
                "fecha":"2019-01-2",
                "linea": 1,
                "productos":[
                    {"producto":4,"cantidadIngreso":"12"},
                    {"producto":1,"cantidadIngreso":"23"}
                ],
                "bodegaSalida":"1"
            }
        """
        try:
            #El atributo cantidad ingreso sirve para saber
            #cuantos productos saldrán
            data = request.data
            productos = data.get('productos', False)
            usuario = self.request.user
            if productos is False:
                raise ErrorDeUsuario('Se debe de seleccionar productos para hacer un ingreso a bodega.')


            venta = Movimiento.objects.get(id=data.get('movimiento'))
            bodega = Bodega.objects.get(id=data.get('bodegaSalida'))

            _mensaje = "Despacho por orden de venta No. {}".format(venta.numero_oc)
            _fecha = datetime.utcnow().date()

            #######################  Verificar la existencia de  los productos ############################
            detalleVenta = venta.detalle_movimiento.all()
            detalleVenta = detalleVenta.values("stock__producto").annotate(cantidad=Sum("cantidadActual"))\
                .values_list('stock__producto', flat=True)

            # for _pk in detalleVenta:
            #     inventarioTotal = Inventario.objects.filter(bodega=bodega, stock__producto=_pk,cantidad__gt=0)\
            #         .aggregate(Sum('cantidad'))["cantidad__sum"]
            #     cantDespacho = 0
            #     nombreProducto = ''
            #     detalle_venta_producto = venta.detalle_movimiento.filter(stock__producto=_pk)
            #     for _det in detalle_venta_producto:
            #         nombreProducto = _det.stock.producto.nombre
            #         cantDespacho = cantDespacho + (_det.cantidadActual * _det.stock.capacidad_maxima)

            #     if inventarioTotal < cantDespacho:
            #         raise ErrorDeUsuario('No existe suficiente stock para despachar el producto {}'.format(nombreProducto))

            #######################  Despacho del producto ############################
            with transaction.atomic():
                no_movimiento = calcularNumero(bodega, MovimientoBodega.DESPACHO)
                movimientoBodega = MovimientoBodega(
                    bodega=bodega,
                    empresa=bodega.empresa,
                    movimiento=venta,
                    justificacion=data.get('nota', _mensaje),
                    usuario=usuario,
                    fecha=venta.fecha,
                    no_movimiento=no_movimiento,
                    tipo=MovimientoBodega.DESPACHO,
                    tipoDespacho=MovimientoBodega.DESPACHOVENTA,
                    entregado=True
                )
                movimientoBodega.save()
                for _producto in productos:
                    detalleMov = venta.detalle_movimiento.get(id=_producto.get('id'))
                    cantidadDespacho = int(_producto.get('cantidadIngreso'))
                    stockUnitario = Fraccion.objects.get(
                        producto=detalleMov.stock.producto, capacidad_maxima=1)
                    consulta = Inventario.objects.filter(
                        bodega=bodega, stock=stockUnitario)
                    detalle = consulta.values("stock", "lote")\
                        .annotate(cantidad=Sum('cantidad'))\
                        .filter(cantidad__gt=0)\
                        .values_list('lote', flat=True)
                    lotes = Lote.objects.filter(id__in=detalle).order_by('lote')
                    cantidad = cantidadDespacho * detalleMov.stock.capacidad_maxima
                    cant_actual = detalleMov.cantidadActual
                    reducirLote(lotes,
                                 movimientoBodega,
                                 cantidad,
                                 detalleMov.stock.capacidad_maxima,
                                 stockUnitario,
                                 detalleMov,
                                 bodega)
                    detalleMov.cantidadActual = cant_actual - (cantidadDespacho)
                    detalleMov.save()
                # Marcar la orden de venta como despachada
                ventaDespachada = True
                ##Se verifica si todos los productos ya han sido ingresados
                ## para cambiar el estado de la orden de compra a entregado
                productos = venta.detalle_movimiento.all()
                for _producto in productos:
                    if 0 < _producto.cantidadActual:
                        ventaDespachada = False
                        break;
                venta.ingresado = ventaDespachada
                venta.save()
            return Response({'detail': 'Se ha realizado el despacho por una venta'}, status=status.HTTP_200_OK)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    ########################################################
    ## Descripción: Anular despacho
    ########################################################
    @list_route(methods=["post"])
    def anularDespacho(self, request, *args, **kwargs):
        try:
            data = request.data
            idMovimiento = data.get('id', None)
            justificacion = data.get('justificacion', None)

            if id is None or justificacion is None:
                raise ErrorDeUsuario("Debe de ingresar una justificación.")
            with transaction.atomic():
                movimiento = MovimientoBodega.objects.get(id=idMovimiento)
                detalleMov = movimiento.detalle_movimiento.all()
                #######################  Se verifica si no hay despachos o ingresos parciales ############################
                for _row in detalleMov:
                    if _row.cantidad != _row.cantidadActual:
                        raise ErrorDeUsuario("No se puede anular el movimiento de bodega, ya se han hecho despachos de productos.")
                ## Reintegro de costos
                for _row in detalleMov:
                    mov_costo = _row.movimientoCosto
                    if mov_costo is not None:
                        mov_padre = mov_costo.padreCosto
                        if mov_padre is not None:
                            mov_padre.monto += mov_costo.monto
                            mov_padre.save()
                        mov_costo.activo=False
                        mov_costo.save()
                #######################  reintegro de producto ############################
                for _row in detalleMov:
                    inventario = Inventario.objects.get(lote=_row.lote, stock=_row.stock, bodega=movimiento.bodega)
                    inventario.cantidad += _row.cantidad
                    inventario.save()

                movimiento.activo = False
                movimiento.justificacionAnulacion = justificacion
                movimiento.save()
                # justificacionAnulacion

                return Response({'detail': 'Se ha logrado realizar la anulación.'})
            return Response({'detail': 'No se logró realizar la anulación'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    ########################################################
    ## Descripción: Funciones auxiliares
    ########################################################
    def crearProducto(self, nombre, empresa, moneda):
        try:
            producto = Producto.objects.create(
                nombre=nombre,
                empresa=empresa,
                descripcion='',
                multiplos=False,
                moneda=moneda,
            )
            producto.save()

            # Guarda la fraccion minima que representa la unidad
            padre = Fraccion.objects.create(
                producto=producto,
                presentacion='Unidad',
                capacidad_maxima=1,
                vendible=False,
                precio=0
            )
            padre.save()
            return padre.id
        except Exception as e:
            raise Exception('No se pudo crear el nuevo producto', e)

    @list_route(methods=["get"],url_path="getGraficas/(?P<pk>[0-9]+)")
    def getGraficas(self, request, pk, *args, **kwargs):
        try:
            startdate = datetime.today()
            enddate = startdate - relativedelta(days=7)
            movimiento = MovimientoBodega.objects.filter(bodega=pk, fecha__range=[enddate, startdate])
            grafDespacho = movimiento.filter(tipo=MovimientoBodega.DESPACHO).exclude(tipoDespacho=None)\
                .values('tipoDespacho').annotate(cantidad=Count('tipoDespacho'))
            serializer = GraficaBodegaDespachoSerializer(grafDespacho, many=True)

            grafIngreso = movimiento.filter(tipo=MovimientoBodega.INGRESO).exclude(tipoIngreso=None)\
                .values('tipoIngreso').annotate(cantidad=Count('tipoIngreso'))
            serializerIngreso = GraficaBodegaIngresoSerializer(grafIngreso, many=True)

            # detalleMovimiento = DetalleMovBodega.objects.filter(movimiento__bodega=pk, movimiento__tipo=MovimientoBodega.REAJUSTE)
            # graficaReajuste = detalleMovimiento.values('stock__producto__nombre').annotate(cantidad=Count('stock__producto__nombre'))
            # serializerReajuste = GraficaBodegaReajusteSerializer(graficaReajuste, many=True)

            data = {
                'despacho': serializer.data,
                'ingreso': serializerIngreso.data
            }

            return Response(data)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)})
"""
     
     
     Ingreso
 {
            "bodega": 1,
            "movimiento": 21,
            "fecha": "2018-12-18",
            "tipo": 10,
            "empresa": "GRANJAS MAYSOL",
            "justificacion": "Por un ingreso",
            "nombreBodega": "huitan 12",
            "padre": null,
            "lotes": [
                {
                    "lote": "2018-12-18",
                    "vencimiento": "2018-12-22",
                    "justificacionAnulacion": "",
                    "lote_detalle": [
                        {
                            "cantidadInicial": 90,
                            "stock": 1
                        }
                    ]
                }
            ]
  }
  
  Baja:
  {
            "bodega": 1,
            "movimiento": null,
            "fecha": "2018-12-18",
            "tipo": 50 o 40,
            "justificacion": "Por dar de baja de huevos",
            "padre": 2,
            "lotes": [
                {
                    "id": 2,
                    "lote_detalle": [
                        {
                            "baja": 20,
                            "stock": 1
                        }
                    ]
                }
            ]
  }
  
  
  Despacho
   {
            "movimiento": null,
            "fecha": "2018-12-18",
            "tipo": 50,
            "destino": 3,
            "justificacion": "Por despacho de bodega",
            "productos": [
             
                        {
                            "cantidad": 20,
                            "stock": 1
                        }
                   
            ]
  }

  ingresoDespacho
{
    "movimiento": null,
    "fecha": "2018-12-18",
    "tipo": 50,
    "bodega": 3,
    "justificacion": "Ingreso a bodega por medio de despacho",
    "fracciones": [
        {
            "cantidad": 20,
            "stock": 1
        }       
    ]
}
"""