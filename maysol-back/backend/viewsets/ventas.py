# -*- coding: utf-8 -*-
# Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, Q

from backend.models import Proveedor, Movimiento, Producto, DetalleMovimiento, \
    Cuenta, Cierre, Fraccion, Inventario, MovimientoBodega, DetalleMovBodega, Bodega, Lote, Usuario
from backend.models.afectados import Afectados
from backend.serializers import VentaSerializer, VentaHeaderSerializer
from django_filters.rest_framework import DjangoFilterBackend
# Importación de permisos
from backend.permisos import ComprasPermission, VentasPermission
from rest_framework.permissions import IsAuthenticated
from datetime import datetime

# Impotación en utils
from backend.utils import tiposcuentas, calcularSaldo, permisos
from backend.utils.cuentas.getcierre import obtenerCierre
from backend.utils.cuentas.verficarAnular import verficarAnulado
from backend.utils.calcularNoOC import calcularNumeroVenta
from backend.utils.bodega.bodega import calcularNumero, reducirLote
from backend.utils.exceptions import ErrorDeUsuario

from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django.db.models.functions import Coalesce

from backend.utils.paginationVentas import CustomPaginationVentas


def query_sum_field(query, field):
    total = query.aggregate(Sum(field))["{}__sum".format(field)]
    return float(total if total else 0)


class VentasViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, VentasPermission]
    serializer_class = VentaSerializer
    serializer_classes = {
        'GET': VentaSerializer
    }
    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = (
        'id',
        'proyecto',
        'ingresado',
        'usuario',
        'detalle_movimiento__stock__id',
        'proveedor__id'
    )
    search_fields = (
        'id',
        'descripcion',
        'proveedor__nombre',
        'usuario__first_name',
        'numero_oc'
    )

    def get_queryset(self):

        usuario = self.request.user
        ordenes_compra = Movimiento.objects.filter(
            es_ov=True, activo=True, anulado=False)
        if not usuario.accesos.administrador:
            if usuario.accesos.bodeguero:
                ordenes_compra = Movimiento.objects.filter(
                    es_ov=True, activo=True)
            else:
                ordenes_compra = Movimiento.objects.filter(
                    es_ov=True, activo=True, usuario=usuario)
            ordenes_compra = ordenes_compra.filter(
                proyecto=usuario.proyecto,
                anulado=False,
            )
        _fecha_inicial = self.request.GET.get("fecha_inicial", None)
        fecha_inicial = None
        if _fecha_inicial is not None and _fecha_inicial != "":
            fecha_inicial = timezone.datetime.strptime(_fecha_inicial, '%Y-%m-%d')

        _fecha_final = self.request.GET.get("fecha_final", None)
        fecha_final = None
        if _fecha_final is not None and _fecha_final != "":
            fecha_final = timezone.datetime.strptime(_fecha_final, '%Y-%m-%d')
            fecha_final = fecha_final + timezone.timedelta(days=1)
        # Si hay un rango de fechas seleccionadas se hace el
        # Filtro de rangos
        if fecha_final is not None and fecha_inicial is not None:
            ordenes_compra = ordenes_compra.filter(
                fecha__gte=fecha_inicial,
                fecha__lte=fecha_final
            )
        if self.request.GET.get("pago_pendiente", None) is not None:
            ordenes_compra = ordenes_compra.filter(pago_completo=False)
        if self.request.GET.get("pendiente_entrega", None) is not None:
            ordenes_compra = ordenes_compra.filter(ingresado=False)
        self.filter_queryset(ordenes_compra)
        return ordenes_compra.order_by('-creado')

    @list_route(methods=["get"])
    def listar(self, request):
        self.pagination_class = CustomPaginationVentas
        usuario = self.request.user
        ordenes_compra = Movimiento.objects.filter(
            es_ov=True, activo=True,
        )

        ocultar_anulados = self.request.GET.get("ocultarAnulados", False)
        if (ocultar_anulados):
            ordenes_compra = ordenes_compra.filter(anulado=False)

        producto = self.request.GET.get("detalle_movimiento__stock__id", None)
        if producto is not None:
            print(f"\n\n\n\n{producto}\n\n\n\n")
            producto = producto.split(',')
            print(f"\n\n\n\n{producto}\n\n\n\n")
            ordenes_compra = ordenes_compra.filter(detalle_movimiento__stock__id__in=producto).distinct()
       
        vendedor = self.request.GET.get("usuario", None)
        if vendedor is not None:
            user = Usuario.objects.get(id=vendedor)
            ordenes_compra = ordenes_compra.filter(usuario=user)

        cliente = self.request.GET.get("proveedor__id", None)
        if cliente is not None:
            ordenes_compra = ordenes_compra.filter(proveedor__id=cliente)

        proyecto = self.request.GET.get("proyecto", None)
        if proyecto is not None:
            ordenes_compra = ordenes_compra.filter(proyecto__id=proyecto)

        _fecha_inicial = self.request.GET.get("fecha_inicial", None)
        fecha_inicial = None
        if _fecha_inicial is not None and _fecha_inicial != "":
            fecha_inicial = timezone.datetime.strptime(_fecha_inicial, '%Y-%m-%d')

        _fecha_final = self.request.GET.get("fecha_final", None)
        fecha_final = None
        if _fecha_final is not None and _fecha_final != "":
            fecha_final = timezone.datetime.strptime(_fecha_final, '%Y-%m-%d')
            # fecha_final = fecha_final + timezone.timedelta(days=1)
        # Si hay un rango de fechas seleccionadas se hace el
        # Filtro de rangos
        if fecha_final is not None and fecha_inicial is not None:
            ordenes_compra = ordenes_compra.filter(
                fecha__gte=fecha_inicial,
                fecha__lte=fecha_final
            )
        search = self.request.GET.get('search', None)
        if search is not None:
            ordenes_compra = ordenes_compra.filter(numero_oc__icontains=search)
        if self.request.GET.get("pago_pendiente", None) is not None:
            ordenes_compra = ordenes_compra.filter(pago_completo=False)
        if self.request.GET.get("pendiente_entrega", None) is not None:
            ordenes_compra = ordenes_compra.filter(ingresado=False)
        # self.filter_queryset(ordenes_compra)
        
        sumas = ordenes_compra.filter(
            anulado=False,
            activo=True,
        ).annotate(
            sumaPagos=Coalesce(Sum('movimiento__monto', filter=Q(movimiento__anulado=False) & Q(movimiento__orden__in=ordenes_compra)), 0)
        ).aggregate(
            Sum('monto'),
            Sum('sumaPagos')
        )
        for orden in ordenes_compra:
            monto_ov = orden.monto
            
            pagos = Movimiento.objects.filter(orden=orden, activo=True, anulado=False)
            monto_pagos = query_sum_field(pagos, 'monto')
            # Si los pagos son mayor o igual al monto de la OC entonces se marca como completado
            if round(float(monto_pagos),2) >= round(float(monto_ov),2):
                orden.pago_completo = True
                orden.save()
            else:
                orden.pago_completo=False
                orden.save()
        monto = sumas.get("monto__sum") if sumas.get("monto__sum") is not None else 0
        sumaPagos = sumas.get("sumaPagos__sum") if sumas.get("sumaPagos__sum") is not None else 0
        saldo = monto - sumaPagos
        page = self.paginate_queryset(ordenes_compra.order_by('-creado'))
        serializer = VentaSerializer(page, many=True)
        result = {
            'tMonto': sumas.get("monto__sum"),
            'tPagos': sumas.get("sumaPagos__sum"),
            'tSaldo': saldo,
            'data': serializer.data
        }
        return self.get_paginated_response(result)

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        usuario = request.user
        descripcion = data.get("descripcion", None)
        moneda = data.get("moneda", None)
        productos = data.get("productos", None)
        cliente = data.get("cliente", None)
        pago_automatico = data.get("pago_automatico", False)
        despacho_inmediato = data.get("despacho_inmediato", "false")
        bodega = data.get("bodega", None)
        descuento = float(data.get("descuento", 0))
        fecha = data.get("fecha", datetime.now())
        try:
            with transaction.atomic():
                # Si el cliente es un diccionario entonces obtiene su propiedad value
                if type(cliente) is dict:
                    cliente = cliente.get("value", None)

                total_prods = 0
                if productos is not None:
                    for prod in productos:
                        total_prods += float(prod["precio_costo"]) * \
                            float(prod["cantidad"])
                else:
                    raise ErrorDeUsuario(
                        'Debe ingresar productos para realizar una venta.')

                # Crear el cliente si se envia el nombre y si no existe
                if isinstance(cliente, str) is True:
                    _cliente, created = Proveedor.objects.get_or_create(
                        es_cliente=True,
                        nombre=cliente)
                    cliente = _cliente.id
                #######################  Descuento al total ############################
                total_apagar = round(total_prods,2) - round(descuento, 2)
                ########################################################
                # Descripción: Crear la orden de venta y su detalle
                ########################################################
                numero_orden = calcularNumeroVenta(usuario.proyecto)
                orden_venta = Movimiento(
                    es_ov=True,
                    descripcion=descripcion,
                    moneda=moneda,
                    usuario=usuario,
                    proyecto=usuario.proyecto,
                    proveedor_id=cliente,
                    monto=total_apagar,
                    descuento=descuento,
                    fecha=fecha,
                    numero_oc=numero_orden
                )
                orden_venta.save()
                if productos is not None:
                    for prod in productos:
                        id_prod = prod["producto"]
                        subtotal = float(
                            prod["precio_costo"]) * float(prod["cantidad"])
                        detalle_movimiento = DetalleMovimiento(
                            orden_compra=orden_venta,
                            stock_id=id_prod,
                            cantidad=prod["cantidad"],
                            cantidadActual=prod["cantidad"],
                            precio_costo=prod["precio_costo"],
                            subtotal=subtotal
                        )
                        detalle_movimiento.save()

                ########################################################
                # Descripción: manejo de pagos
                ########################################################
                if pago_automatico == "true":
                    # Se paga que el pago es completo y que fue automatico
                    orden_venta.pago_completo = True
                    orden_venta.pago_automatico = True
                    orden_venta.save()
                    self.pagoAutomatico(orden_venta, data, usuario, total_apagar)
                else:
                    # Si el pago es al credito, puede introducir un adelanto
                    if data.get("pagos", None) is not None:
                        pagos = data.get("pagos")
                        for pago in pagos:
                            monto = float(pago.get("monto", 0))
                            # se recorren los pagos enviados y se reutiliza la funcion ya que usa los mismos campos
                            # Pero no se marca como completo ni automatico
                            self.pagoAutomatico(orden_venta, pago, usuario, monto)

                ########################################################
                # Descripción: Tipos de despachos
                ########################################################
                if despacho_inmediato == "true":
                    # Realiza un despacho inmediato
                    orden_venta.despacho_inmediato = True
                    orden_venta.ingresado = True
                    orden_venta.bodega_entrega_id = bodega
                    orden_venta.save()
                    detalleMovmiento = orden_venta.detalle_movimiento.all()
                    self.realizarDespacho(
                        orden_venta,
                        detalleMovmiento,
                        numero_orden,
                        usuario, data.get("bodega"))

                return Response({'detail': 'Se ha realizado la venta.'}, status=status.HTTP_200_OK)
            return Response({'detail': 'No se logró realizar la venta.'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)



    @transaction.atomic
    @list_route(methods=["post"], permission_classes=[VentasPermission])
    def registrarPago(self, request, *args, **kwargs):
        data = request.data
        usuario = request.user
        orden_venta_id = data.get("orden_venta", None)
        pago_completo = data.get("pago_completo", False)
        pagos = data.get("pagos", None)

        try:
            with transaction.atomic():
                orden_venta = Movimiento.objects.get(pk=orden_venta_id)
                orden_venta.save()
                concepto = "Por abono de de OV No. " + str(orden_venta.numero_oc)
                # if pago_completo:
                #     orden_venta.pago_completo = True
                #     orden_venta.save()
                if pagos is not None:
                    for pago in pagos:
                        no_documento = pago.get("noDocumento", None)
                        no_comprobante = pago.get("noComprobante", None)
                        forma_pago = int(pago.get("formaPago",0))
                        cuenta_id = pago.get("cuenta", None)
                        monto = float(pago.get("monto", 0))
                        fecha = pago.get("fecha", datetime.now())
                        caja_venta = pago.get("caja_chica", None)
                        if fecha is not None:
                            if 'T' in fecha:
                                _datetime = fecha.split("T")
                                _fecha = _datetime[0]
                                anio = fecha[0: 4]
                                mes = fecha[5: 7]
                            else:
                                _fecha = fecha
                                anio = fecha[0: 4]
                                mes = fecha[5: 7]
                        else:
                            _fecha = datetime.now()
                            mes = datetime.now().month
                            anio = datetime.now().year

                        # Si tiene ID entonces se actualiza la categoria
                        if not pago.get("id", False):
                            if forma_pago == Movimiento.EFECTIVO or forma_pago == Movimiento.CHEQUE:
                                cuenta = usuario.caja_venta
                                # Se crea el pago
                                _pago = Movimiento(monto=monto,
                                                   usuario=usuario,
                                                   proyecto=usuario.proyecto,
                                                   formaPago=forma_pago,
                                                   caja_chica=True,
                                                   noDocumento=no_documento,
                                                   concepto=concepto,
                                                   moneda=cuenta.moneda,
                                                   orden_id=orden_venta_id,
                                                   fecha=_fecha,
                                                   noComprobante=no_comprobante)
                                _pago.save()
                                # Si los pagos son mayor o igual al monto de la OC entonces se marca como completado
                                monto_ov = orden_venta.monto
                                pagos = Movimiento.objects.filter(orden=orden_venta, activo=True, anulado=False)
                                monto_pagos = query_sum_field(pagos, 'monto')
                                if monto_pagos >= monto_ov:
                                    orden_venta.pago_completo = True
                                    orden_venta.save()
                                self.registrarAfectado(cuenta, anio, mes, _pago, monto)
                            else:
                                # Se registra el pago normal
                                cuenta = Cuenta.objects.get(pk=cuenta_id)
                                _pago = Movimiento(monto=monto,
                                                   usuario=usuario,
                                                   proyecto=usuario.proyecto,
                                                   formaPago=forma_pago,
                                                   noDocumento=no_documento,
                                                   concepto=concepto,
                                                   moneda=cuenta.moneda,
                                                   orden_id=orden_venta_id,
                                                   fecha=_fecha,
                                                   noComprobante=no_comprobante)
                                _pago.save()
                                monto_ov = orden_venta.monto
                                pagos = Movimiento.objects.filter(orden=orden_venta, activo=True, anulado=False)
                                monto_pagos = query_sum_field(pagos, 'monto')
                                # Si los pagos son mayor o igual al monto de la OC entonces se marca como completado
                                if monto_pagos >= monto_ov:
                                    orden_venta.pago_completo = True
                                    orden_venta.save()
                                # registrar el pago en el cierre correspondiente
                                self.registrarAfectado(cuenta, anio, mes, _pago, monto)

                # Anular un movimiento (pago)
                # for pagos_b in pagos_borrados:
                #     _pago = Movimiento.objects.get(pk=pagos_b["id"])
                #     _pago.anulado = True
                #     _pago.save()
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail':'Se ha creado el abono'}, status=status.HTTP_201_CREATED)


    @transaction.atomic
    @list_route(methods=["post"], permission_classes=[VentasPermission])
    def anularPago(self, request, *args, **kwargs):
        data = request.data
        try:
            id = data.get("id", None)
            justificacion = data.get("justificacion", "")
            movimiento = Movimiento.objects.get(pk=id)
            verficarAnulado(movimiento)
            movimiento.anulado = True
            movimiento.justificacion = justificacion
            movimiento.save()
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Se ha anulado el pago correctamente'},status=status.HTTP_201_CREATED)


    ########################################################
    ## Descripción: Funciones auxiliares
    ########################################################
    def registrarAfectado(self, cuenta, anio, mes, pago, total):
        # registrar el pago en el cierre correspondiente
        # cierre = Cierre.objects.get(cuenta=cuenta, mes=mes, anio=anio)
        if cuenta.tipo == Cuenta.VENTA:
            cierreUltimo = Cierre.objects.filter(cuenta=cuenta, anulado=False, cerrado=False).first()
            if cierreUltimo is None:
                anio = datetime.now().year
                mes = datetime.now().month
                cierre = Cierre(
                    cuenta=cuenta,
                    inicio=0,
                    mes=mes,
                    anio=anio,
                    fechaInicio=datetime.now()
                )
                cierre.save()
            else:
                cierre = cierreUltimo
        else:
            cierre = obtenerCierre(cuenta, anio, mes)
        if cierre.cerrado:
            raise Exception('La fecha seleccionada corresponde a un mes que ya esta cerrado')
        else:
            # se verifica que no se haga un pago mayor al saldo
            afectado = Afectados(cierre=cierre, movimiento=pago, tipo=Afectados.VENTA)
            afectado.save()
            return True

    def pagoAutomatico(self, orden_venta, data, usuario, total):
        no_documento = data.get("noDocumento", None)
        no_comprobante = data.get("noComprobante", None)
        forma_pago = int(data.get("formaPago", 10))
        fecha = data.get("fecha", None)
        moneda = data.get("moneda", None)
        cuenta = data.get("cuenta", None)

        if fecha is not None:
            _fecha = fecha.split("T")
            anio = fecha[0: 4]
            mes = fecha[5: 7]
        else:
            _fecha = datetime.now()
            mes = datetime.now().month
            anio = datetime.now().year
        concepto = "Por pago de OV No. " + str(orden_venta.numero_oc)
        cuenta_id = data.get("cuenta", None)
        caja_id = data.get("caja", None)

        if forma_pago == Movimiento.EFECTIVO or forma_pago == Movimiento.CHEQUE:
            #######################  Se hace el ingreso de dinero a la caja de venta ############################
            # Cuando se carga el monto a la caja de venta solo debe de ser en quetzales no se puede generar la OV
            if moneda != Cuenta.QUETZAL:
                raise ErrorDeUsuario('No es posible registrar el pago a caja de venta en una moneda que no sea Quetzales')
            cuenta = usuario.caja_venta
            if cuenta.moneda != moneda:
                raise ErrorDeUsuario('La moneda de la orden de venta y de la caja no coinciden')
            pago = Movimiento(
                    monto=total,
                    usuario=usuario,
                    proyecto=usuario.proyecto,
                    formaPago=forma_pago,
                    fecha=_fecha[0],
                    noDocumento=no_documento,
                    noComprobante=no_comprobante,
                    concepto=concepto,
                    moneda=cuenta.moneda,
                    orden=orden_venta, caja_chica=True)
            pago.save()
            # Calcula si los pagos cubren el monto de la OV
            monto_ov = orden_venta.monto
            pagos = Movimiento.objects.filter(orden=orden_venta, activo=True)
            monto_pagos = query_sum_field(pagos, 'monto')
            # Si los pagos son mayor o igual al monto de la OC entonces se marca como completado
            if monto_pagos >= monto_ov:
                orden_venta.pago_completo = True
                orden_venta.save()

            # registrar el pago en el cierre correspondiente
            self.registrarAfectado(cuenta, anio, mes, pago, total)
        else:
            #######################  Se hace el ingreso de dinero al banco ############################
            cuenta = Cuenta.objects.get(pk=cuenta_id)
            if cuenta.moneda != moneda:
                raise ErrorDeUsuario('No es posible registrar el pago con una cuenta de diferente moneda de la venta')
            if cuenta.moneda != moneda:
                raise ErrorDeUsuario('La moneda de la orden de venta y de la cuenta no coinciden')
            pago = Movimiento(
                    monto=total,
                    usuario=usuario,
                    proyecto=usuario.proyecto,
                    formaPago=forma_pago,
                    fecha=_fecha[0],
                    noDocumento=no_documento,
                    noComprobante=no_comprobante,
                    concepto=concepto,
                    moneda=cuenta.moneda,
                    orden=orden_venta,
                )
            pago.save()
            monto_ov = orden_venta.monto
            pagos = Movimiento.objects.filter(orden=orden_venta, activo=True)
            monto_pagos = query_sum_field(pagos, 'monto')
            # Si los pagos son mayor o igual al monto de la OC entonces se marca como completado
            if monto_pagos >= monto_ov:
                orden_venta.pago_completo = True
                orden_venta.save()
            # registrar el pago en el cierre correspondiente
            self.registrarAfectado(cuenta, anio, mes, pago, total)




    def realizarDespacho(self, movimiento, detalleMoviento, numero_orden, usuario, bodega):
        #######################  Verificar la existencia de  los productos ############################
        detalleVenta = movimiento.detalle_movimiento.all()
        detalleVenta = detalleVenta.values("stock__producto").annotate(cantidad=Sum("cantidadActual"))\
            .values_list('stock__producto', flat=True)
        for _pk in detalleVenta:
            inventarioTotal = Inventario.objects.filter(bodega=bodega, stock__producto=_pk,cantidad__gt=0)\
                .aggregate(Sum('cantidad'))["cantidad__sum"]
            cantDespacho = 0
            nombreProducto = ''
            detalle_venta_producto = movimiento.detalle_movimiento.filter(stock__producto=_pk)
            for _det in detalle_venta_producto:
                nombreProducto = _det.stock.producto.nombre
                cantDespacho = cantDespacho + (_det.cantidadActual * _det.stock.capacidad_maxima)
            if inventarioTotal < cantDespacho:
                raise ErrorDeUsuario('No existe suficiente stock para despachar el producto {}'.format(nombreProducto))


        _mensaje = "Despacho por OV No. {}".format(numero_orden)
        bodega = Bodega.objects.get(id=bodega)
        no_movimiento = calcularNumero(bodega, MovimientoBodega.DESPACHO)


        movimientoBodega = MovimientoBodega(
            bodega=bodega,
            empresa=bodega.empresa,
            movimiento=movimiento,
            justificacion=_mensaje,
            usuario=usuario,
            fecha=movimiento.fecha,
            no_movimiento=no_movimiento,
            tipo=MovimientoBodega.DESPACHO,
            entregado=True
        )
        movimientoBodega.save()
        for _detalleMov in detalleMoviento:
            _detalleMov.movimiento = movimiento
            stockUnitario = Fraccion.objects.get(
                producto=_detalleMov.stock.producto, capacidad_maxima=1)
            consulta = Inventario.objects.filter(
                bodega=bodega, stock=stockUnitario)
            detalle = consulta.values("stock", "lote")\
                .annotate(cantidad=Sum('cantidad'))\
                .filter(cantidad__gt=0)\
                .values_list('lote', flat=True)
            lotes = Lote.objects.filter(id__in=detalle).order_by('lote')
            cantidad = _detalleMov.cantidad * _detalleMov.stock.capacidad_maxima
            reducirLote(lotes,
                         movimientoBodega,
                         cantidad,
                         _detalleMov.stock.capacidad_maxima,
                         stockUnitario,
                         _detalleMov,
                         bodega)
        # Marcar la orden de venta como despachada
        movimiento.ingresado = True
        movimiento.save()

    @transaction.atomic
    @list_route(methods=["post"], url_path='anular/(?P<pk>[0-9]+)', permission_classes=[VentasPermission])
    def anular(self, request, *args, **kwargs):
        data = request.data
        model = self.get_object()
        venta = movimiento = Movimiento.objects.get(pk=model.id)
        try:
            if data.get('justificacion', None) is None:
                raise ErrorDeUsuario('Debe de escribir una justificación')
            detalle_pagos = movimiento.movimiento.all()
            #Validación de pagos, verifica que los pagos se encuentran
            #En un cierre abierto
            for _pago in detalle_pagos:
                afectados = _pago.afectados.all()
                for afectado in afectados:
                    # Si el afectado esta dentro de un cierre y el monto es mayor a cero [si no se puede anular]
                    if afectado.cierre.cerrado == True and afectado.movimiento.monto > 0:
                        raise ErrorDeUsuario('Los pagos de esta venta están dentro de un periodo cerrado o una caja cerrada, no se puede anular la venta')

            with transaction.atomic():
                ##Anulacion de pagos realizados
                for _pago in detalle_pagos:
                    _pago.justificacion = data.get('justificacion')
                    _pago.delete()
                ## Fin de anulación de pagos
                ## anulación de despachos
                movimientosBodega = MovimientoBodega.objects.filter(
                    movimiento=venta
                )
                for _movBodega in movimientosBodega:
                    detalleMov = _movBodega.detalle_movimiento.all()
                    for _row in detalleMov:
                        inventario = Inventario.objects.get(lote=_row.lote, stock=_row.stock, bodega=_movBodega.bodega)
                        inventario.cantidad += _row.cantidad
                        inventario.save()
                    _movBodega.activo = False
                    _movBodega.justificacionAnulacion = data.get('justificacion')
                    _movBodega.save()
                ## Anulación de compra
                venta.justificacion = data.get('justificacion')
                venta.save()
                venta.delete()
        except ErrorDeUsuario as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)
