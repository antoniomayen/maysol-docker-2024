# Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Sum, Q
from backend.models import Proveedor, CuentaProveedor, ContactoProveedor, Movimiento, Producto, DetalleMovimiento, \
    Cuenta, Cierre, Fraccion, MovimientoBodega
from backend.models.afectados import Afectados
from backend.serializers import CompraSerializer, CompraHeaderSerializer
from django_filters.rest_framework import DjangoFilterBackend
# Importación de permisos
from backend.permisos import ComprasPermission
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from backend.utils import tiposcuentas, calcularSaldo, permisos
from backend.utils.cuentas.getcierre import obtenerCierre
from backend.utils.cuentas.verficarAnular import verficarAnulado
from backend.utils.calcularNoOC import calcularNumero
from backend.utils.exceptions import ErrorDeUsuario
from django.db.models.functions import Coalesce
from backend.utils.paginationCompras import CustomPaginationCompras

def query_sum_field(query, field):
    total = query.aggregate(Sum(field))["{}__sum".format(field)]
    return float(total if total else 0)
class ComprasViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, ComprasPermission]
    serializer_class = CompraSerializer
    serializer_classes = {
        'GET': CompraSerializer
    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = (
        'id',
        'proyecto',
        'ingresado'
    )
    search_fields = (
        'id',
        'descripcion',
        'proveedor__nombre',
        'numero_oc'
    )

    def get_queryset(self):
        ordenes_compra = Movimiento.objects.filter(es_oc=True, activo=True).order_by('-creado')
        usuario = self.request.user
        if not usuario.accesos.administrador:
            if not usuario.accesos.bodeguero:
                ordenes_compra = Movimiento.objects.filter(es_oc=True, activo=True,  proyecto=usuario.proyecto).order_by('-creado')
            else:
                ordenes_compra = Movimiento.objects.filter(es_oc=True, activo=True, ).order_by('-creado')
        if self.request.GET.get("pago_pendiente", None) is not None:
            ordenes_compra = ordenes_compra.filter(pago_completo=False)
        if self.request.GET.get("pendiente_entrega", None) is not None:
            ordenes_compra = ordenes_compra.filter(ingresado=False)

        self.filter_queryset(ordenes_compra)

        return ordenes_compra

    @list_route(methods=["get"])
    def listar(self, request):
        self.pagination_class = CustomPaginationCompras
        ordenes_compra = Movimiento.objects.filter(es_oc=True, activo=True).order_by('-creado')
        usuario = self.request.user
        if not usuario.accesos.administrador:
            if not usuario.accesos.bodeguero:
                ordenes_compra = Movimiento.objects.filter(es_oc=True, activo=True,  proyecto=usuario.proyecto).order_by('-creado')
            else:
                ordenes_compra = Movimiento.objects.filter(es_oc=True, activo=True, ).order_by('-creado')
        if self.request.GET.get("pago_pendiente", None) is not None:
            ordenes_compra = ordenes_compra.filter(pago_completo=False)
        if self.request.GET.get("pendiente_entrega", None) is not None:
            ordenes_compra = ordenes_compra.filter(ingresado=False)

        proyecto = self.request.GET.get("proyecto", None)
        if proyecto is not None:
            ordenes_compra = ordenes_compra.filter(proyecto__id=proyecto)

        search = self.request.GET.get('search', None)
        if search is not None:
            ordenes_compra = ordenes_compra.filter(Q(numero_oc__icontains=search) | Q(proveedor__nombre__icontains=search) | Q(descripcion__icontains=search))

        total=0
        pagos = 0
        ordenes= ordenes_compra.filter(anulado=False, activo=True)
        for orden in ordenes:
            productos = DetalleMovimiento.objects.filter(orden_compra=orden)
            for producto in productos:
                total += producto.cantidad * producto.precio_costo
            pago = Movimiento.objects.filter(orden=orden, anulado=False).aggregate(Sum('monto'))
            if pago.get("monto__sum") is not None:
                pagos += pago.get("monto__sum")

        page = self.paginate_queryset(ordenes_compra.order_by('-creado'))
        serializer = CompraSerializer(page, many=True)
        result = {
            'tTotal': total,
            'tPagos': pagos,
            'data': serializer.data
        }
        return self.get_paginated_response(result)

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

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        usuario = request.user
        descripcion = data.get("descripcion", None)
        moneda = data.get("moneda", None)
        productos = data.get("productos", None)
        proveedor = data.get("proveedor", None)
        pago_automatico = data.get("pago_automatico", False)
        categoria = data.get("categoria", None)
        fecha = data.get("fecha", None)
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

        try:
            with transaction.atomic():
                # Si el proveedor es un diccionario entonces obtiene su propiedad value
                if type(proveedor) is dict:
                    proveedor = proveedor.get("value", None)

                total_prods = 0
                if productos is not None:
                    for prod in productos:
                        total_prods += float(prod["precio_costo"]) * float(prod["cantidad"])

                # Crear el proveedor si se envia el nombre y si no existe
                if isinstance(proveedor, str) is True:
                    _proveedor, created = Proveedor.objects.get_or_create(nombre=proveedor, empresa_id=usuario.proyecto_id)
                    proveedor = _proveedor.id
                numero_orden = calcularNumero(usuario.proyecto)
                orden_compra = Movimiento(es_oc=True, descripcion=descripcion, moneda=moneda, usuario=usuario,
                                          proyecto=usuario.proyecto, proveedor_id=proveedor, monto=total_prods,
                                          fecha=_fecha, numero_oc=numero_orden, categoria_id=categoria)
                orden_compra.save()
                if productos is not None:
                    for prod in productos:
                        id_prod = prod["producto"]
                        if type(prod["producto"]) is dict:
                            id_prod = prod["producto"].get("value", None)
                        if isinstance(prod["producto"].get("value", None), str) is True:
                            id_prod = self.crearProducto(prod["producto"].get("value"), usuario.proyecto, moneda)
                        subtotal = float(prod["precio_costo"]) * float(prod["cantidad"])
                        detalle_movimiento = DetalleMovimiento(orden_compra=orden_compra, stock_id=id_prod,
                                                               cantidad=prod["cantidad"],
                                                               cantidadActual=prod["cantidad"],
                                                               precio_costo=prod["precio_costo"], subtotal=subtotal)
                        detalle_movimiento.save()

                # Si el pago se requiere que sea inmediato
                if pago_automatico == "true":
                    # Se paga que el pago es completo y que fue automatico
                    orden_compra.pago_completo = True
                    orden_compra.pago_automatico = True
                    orden_compra.save()
                    self.pagoAutomatico(orden_compra, data, usuario, total_prods, categoria)
                else:
                    # Si el pago es al credito, puede introducir un adelanto
                    if data.get("pagos", None) is not None:
                        pagos = data.get("pagos")
                        for pago in pagos:
                            monto = float(pago.get("monto", 0))
                            # se recorren los pagos enviados y se reutiliza la funcion ya que usa los mismos campos
                            # Pero no se marca como completo ni automatico
                            self.pagoAutomatico(orden_compra, pago, usuario, monto, categoria)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

    def registrarAfectado(self, cuenta, anio, mes, pago, total, con_caja, caja):
        # registrar el pago en el cierre correspondiente
        # cierre = Cierre.objects.get(cuenta=cuenta, mes=mes, anio=anio)
        if con_caja is True:
            cierre = caja
            if cierre.cerrado:
                raise Exception('La fecha seleccionada corresponde a un mes que ya esta cerrado')
            else:
                # se verifica que no se haga un pago mayor al saldo
                saldo = calcularSaldo.calcularSaldo(cierre)
                if saldo >= total:
                    afectado = Afectados(cierre=cierre, movimiento=pago, tipo=Afectados.GASTO)
                    afectado.save()
                    return True
                else:
                    raise Exception('El saldo disponible no cubre el monto total de la Orden de compra')
        else:
            cierre = obtenerCierre(cuenta, anio, mes)
            if cierre.cerrado:
                raise Exception('La fecha seleccionada corresponde a un mes que ya esta cerrado')
            else:
                # se verifica que no se haga un pago mayor al saldo
                saldo = calcularSaldo.calcularSaldo(cierre)
                if saldo >= total:
                    afectado = Afectados(cierre=cierre, movimiento=pago, tipo=Afectados.GASTO)
                    afectado.save()
                    return True
                else:
                    raise Exception('El saldo disponible no cubre el monto total de la Orden de compra')

    def pagoAutomatico(self, orden_compra, data, usuario, total, categoria):
        no_documento = data.get("noDocumento", None)
        no_comprobante = data.get("noComprobante", None)
        forma_pago = data.get("formaPago")
        fecha = data.get("fecha", None)
        moneda = data.get("moneda", None)
        caja_chica = data.get("caja_chica", None)

        if fecha is not None:
            _fecha = fecha.split("T")
            anio = fecha[0: 4]
            mes = fecha[5: 7]
        else:
            _fecha = datetime.now()
            mes = datetime.now().month
            anio = datetime.now().year
        concepto = "Por pago de OC No. " + str(orden_compra.numero_oc)
        cuenta_id = data.get("cuenta", None)
        caja_id = data.get("caja", None)
        if caja_chica != "true":
            cuenta = Cuenta.objects.get(pk=cuenta_id)
            if cuenta.moneda != moneda:
                raise Exception('La moneda de la orden de compra y de la cuenta no coinciden')
            pago = Movimiento(monto=total, usuario=usuario, proyecto=usuario.proyecto, formaPago=forma_pago,
                              fecha=_fecha[0], noDocumento=no_documento, noComprobante=no_comprobante,
                              concepto=concepto, moneda=cuenta.moneda, orden=orden_compra, categoria_id=categoria)
            pago.save()
            # registrar el pago en el cierre correspondiente
            self.registrarAfectado(cuenta, anio, mes, pago, total, False, 0)

        else:
            caja = Cierre.objects.get(pk=caja_id)
            cuenta = caja.cuenta
            if cuenta.moneda != moneda:
                raise Exception('La moneda de la orden de compra y de la caja no coinciden')
            pago = Movimiento(monto=total, usuario=usuario, proyecto=usuario.proyecto, formaPago=forma_pago,
                              fecha=_fecha[0], noDocumento=no_documento, noComprobante=no_comprobante,
                              concepto=concepto, moneda=cuenta.moneda, orden=orden_compra, caja_chica=True,
                              categoria_id=categoria)
            pago.save()
            # registrar el pago en el cierre correspondiente
            self.registrarAfectado(cuenta, anio, mes, pago, total, True, caja)


    @transaction.atomic
    @list_route(methods=["post"], permission_classes=[ComprasPermission])
    def registrarPago(self, request, *args, **kwargs):
        data = request.data
        usuario = request.user
        orden_compra_id = data.get("orden_compra", None)
        pago_completo = data.get("pago_completo", False)
        pagos = data.get("pagos", None)
        pagos_borrados = data.get("pagosBorrados", None)
        categoria = data.get("categoria", None)
        try:
            categoria = categoria.get('id')
        except:
            pass


        try:
            with transaction.atomic():
                orden_compra = Movimiento.objects.get(pk=orden_compra_id)
                if orden_compra.anulado:
                    raise ErrorDeUsuario('La orden de compra no se puede editar porque ya está anulada.')
                orden_compra.categoria_id = categoria
                orden_compra.save()
                concepto = "Por pago de OC No. " + str(orden_compra.numero_oc)
                if pago_completo:
                    orden_compra.pago_completo = True
                    orden_compra.save()
                if pagos is not None:
                    for pago in pagos:
                        no_documento = pago.get("noDocumento", None)
                        no_comprobante = pago.get("noComprobante", None)
                        forma_pago = pago.get("formaPago")
                        cuenta_id = pago.get("cuenta", None)
                        monto = float(pago.get("monto", 0))
                        fecha = pago.get("fecha", datetime.now())
                        caja_chica = pago.get("caja_chica", None)
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
                        if pago.get("id", False):
                            _pago = Movimiento.objects.get(pk=pago["id"])
                            _pago.categoria_id = categoria
                            _pago.save()
                        else:
                            if caja_chica == "true":
                                caja_id = pago.get("caja", None)
                                caja = Cierre.objects.get(pk=caja_id)
                                cuenta = caja.cuenta
                                # Se crea el pago
                                _pago = Movimiento(monto=monto, usuario=usuario, proyecto=usuario.proyecto,
                                                   formaPago=forma_pago, caja_chica=True,
                                                   noDocumento=no_documento, concepto=concepto, moneda=cuenta.moneda,
                                                   orden_id=orden_compra_id, fecha=_fecha, noComprobante=no_comprobante,
                                                   categoria_id=categoria)
                                _pago.save()
                                self.registrarAfectado(cuenta, anio, mes, _pago, monto, True, caja)
                            else:
                                # Se registra el pago normal
                                cuenta = Cuenta.objects.get(pk=cuenta_id)
                                _pago = Movimiento(monto=monto, usuario=usuario, proyecto=usuario.proyecto,
                                                   formaPago=forma_pago,
                                                   noDocumento=no_documento, concepto=concepto, moneda=cuenta.moneda,
                                                   orden_id=orden_compra_id, fecha=_fecha, noComprobante=no_comprobante,
                                                   categoria_id=categoria)
                                _pago.save()
                                # registrar el pago en el cierre correspondiente
                                self.registrarAfectado(cuenta, anio, mes, _pago, monto, False, 0)

                # Anular un movimiento (pago)
                for pagos_b in pagos_borrados:
                    _pago = Movimiento.objects.get(pk=pagos_b["id"])
                    _pago.anulado = True
                    _pago.save()
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

    @transaction.atomic
    @list_route(methods=["post"], permission_classes=[ComprasPermission])
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
        return Response(status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        query = request.query_params
        usuario = request.user
        data = request.data
        contactos_borrados = data.get("contactosBorrados", None)
        cuentas_borradas = data.get("cuentasBorrados", None)
        contactos = data.get("contactos", None)
        cuentas = data.get("cuentas", None)
        categoria = data.get("categoria", None)


        try:
            orden_compra = Movimiento.objects.get(pk=kwargs["pk"])
            if orden_compra.anulado:
                raise ErrorDeUsuario('No se puede editar la compra porque ya está anulada.')
            pagos = Movimiento.objects.filter(orden_id=orden_compra.id).count()
            obj_pagos = Movimiento.objects.filter(orden_id=orden_compra.id)
            productos = data.get("productos", None)
            productosBorrados = data.get('productosBorrados', None)

            # Sea actualiza la categoria de la OC
            orden_compra.categoria_id = categoria
            orden_compra.save()
            # Si tiene pagos se actualiza la categoria
            if pagos > 0:
                for pago in obj_pagos:
                    pago.categoria_id = categoria
                    pago.save()

            # Si no se a ingresado a bodega y no se tienen pagos registrados y no se realizo un pago automatico
            if not orden_compra.ingresado and pagos <= 0 and not orden_compra.pago_automatico:
                # Entonces se actualiza
                serializer = CompraHeaderSerializer(orden_compra, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                pagos = data.get("pagos", None)
                concepto = "Por pago de OC No. " + str(orden_compra.id)
                for pago in pagos:
                        no_documento = pago.get("noDocumento", None)
                        no_comprobante = data.get("noComprobante", None)
                        forma_pago = pago.get("forma_pago")
                        cuenta_id = pago.get("cuenta", None)
                        monto = float(pago.get("monto", 0))
                        fecha = pago.get("fecha", datetime.now())
                        if fecha is not None:
                            _fecha = fecha.split("T")
                            anio = fecha[0: 4]
                            mes = fecha[5: 7]
                        else:
                            _fecha = datetime.now()
                            mes = datetime.now().month
                            anio = datetime.now().year

                        # Si tiene ID entonces se actualiza
                        if pago.get("id", False):
                            pago = Movimiento.objects.get(pk=pago["id"])
                            pago.monto = monto
                            pago.noComprobante = no_comprobante
                            pago.noDocumento = no_documento
                        else:
                            # Se crea el pago
                            cuenta = Cuenta.objects.get(pk=cuenta_id)
                            pago = Movimiento(monto=monto, usuario=usuario, proyecto=usuario.proyecto, formaPago=forma_pago,
                                              noDocumento=no_documento, concepto=concepto, moneda=cuenta.moneda,
                                              orden_id=orden_compra.id, fecha=_fecha[0])
                            pago.save()
                            # registrar el pago en el cierre correspondiente
                            self.registrarAfectado(cuenta, anio, mes, pago, monto, False, 0)
                for _borrar in productosBorrados:
                    _detalle = DetalleMovimiento.objects.get(id=_borrar.get('id')).delete()

                for prod in productos:
                    subtotal = float(prod["precio_costo"]) * float(prod["cantidad"])
                    if prod.get('id', None) is None:
                        detalle_movimiento = DetalleMovimiento(orden_compra=orden_compra, stock_id=prod["producto"],
                                                               cantidad=prod["cantidad"],
                                                               cantidadActual=prod["cantidad"],
                                                               precio_costo=prod["precio_costo"], subtotal=subtotal)
                        detalle_movimiento.save()
                    else:
                        detalle_movimiento = DetalleMovimiento.objects.get(id=prod.get('id'))
                        stock = prod["producto"]
                        if type(stock) is dict:
                            detalle_movimiento.stock_id = stock.get('id')
                        else:
                            detalle_movimiento.stock_id = stock
                        detalle_movimiento.cantidad = prod["cantidad"]
                        detalle_movimiento.precio_costo = prod["precio_costo"]
                        detalle_movimiento.subtotal = subtotal
                        detalle_movimiento.save()

                # orden_compra.proveedor = data.get("proveedor", None)
                # orden_compra.bodega_entrega = data.get("bodega", None)

                orden_compra.save()
        except Movimiento.DoesNotExist:
            return Response({"detail": "La orden de compra que se quiere actualizar no existe"},
                            status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

    @transaction.atomic
    @list_route(methods=["post"], url_path='anular/(?P<pk>[0-9]+)', permission_classes=[ComprasPermission])
    def anular(self, request, *args, **kwargs):
        data = request.data
        model = self.get_object()
        compra = movimiento = Movimiento.objects.get(pk=model.id)
        try:
            if data.get('justificacion', None) is None:
                raise ErrorDeUsuario('Debe de escribir una justificación')
            detalle_pagos = movimiento.movimiento.all()
            #Validación de pagos, verifica que los pagos se encuentran
            #En un cierre abierto
            for _pago in detalle_pagos:
                afectados = _pago.afectados.all()
                for afectado in afectados:
                    if afectado.cierre.cerrado == True:
                        raise ErrorDeUsuario('Los pagos de esta compra están dentro de un periodo cerrado o una caja cerrada, no se puede anular la compra')
            #Validacion que no exista ingresos a bodega
            movimientosBodega = MovimientoBodega.objects.filter(
                    movimiento=compra
            )
            if movimientosBodega.count() > 0:
                raise ErrorDeUsuario('Ya se ha ingresado los productos a bodega, no se puede anular la compra.')
            with transaction.atomic():
                ##Anulacion de pagos realizados
                for _pago in detalle_pagos:
                    _pago.justificacion = data.get('justificacion')
                    _pago.delete()
                ## Anulación de compra
                compra.justificacion = data.get('justificacion')
                compra.save()
                compra.delete()
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

