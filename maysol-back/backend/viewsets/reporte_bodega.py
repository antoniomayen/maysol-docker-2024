from django.conf import settings
from django.db import transaction, DatabaseError
from django.db.models import Q, F, Sum, Count
from django.db import transaction


from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response

from datetime import datetime
from django_filters.rest_framework import DjangoFilterBackend
from backend.utils.exceptions import ErrorDeUsuario


from backend.models import MovimientoBodega, DetalleMovBodega, Afectados, Movimiento, Proyecto, Fraccion, Usuario, \
    MovimientoGranja
from backend.serializers import GraficasSerializer, DetalleMovBodegaReadSerializer, \
    DetalleProduccionSerializer, GraficasLinealSerializer, GraficaSimpleSerializer, \
    GananciasSerializers, GastosSerializer, MovimientoSerializer, MovimientoSerializerDepositos, \
    MovimientoGranjaSerializer
from backend.utils.generar_excel_ventas import descargar_reporte_ventas
from backend.utils.paginationReportPagination import CustomPaginationGranja
from backend.utils.paginationSum import CustomPagination
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
import pytz

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers

from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from dateutil import rrule

class ReporteBodegaViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = DetalleMovBodega.objects.all().order_by('-fecha')
    serializer_class = DetalleMovBodegaReadSerializer
    serializer_classes = {
        'GET': DetalleMovBodegaReadSerializer
    }
    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = [
        'movimiento',
        'movimiento__linea',
        'movimiento__empresa',
        'movimiento__empresa__empresa',
    ]
    search_fields = (
    )

    def get_queryset(self):
        movBodega = DetalleMovBodega.objects.filter(activo=True)
        self.filter_queryset(movBodega)
        return movBodega
    ########################################################
    ## Descripción: costos de reperación granajas
    ########################################################
    @list_route(methods=["get"])
    def recuperacion(self, request, *args, **kwargs):
        data = request.data
        anio_reporte =int(self.request.GET.get("anio"))
        _fecha_inicial = "{}-{}-{}".format(str(anio_reporte), str(3), str(1))
        _fecha_inicial_siguiente = "{}-{}-{}".format(str(int(anio_reporte) + 1), str(3), str(1))
        fecha_inicial = datetime.strptime(_fecha_inicial, '%Y-%m-%d')
        fecha_final = datetime.strptime(_fecha_inicial_siguiente, '%Y-%m-%d')
        data = {

        }
        subEmpreas = Proyecto.objects.exclude(empresa=None)
        for dt in rrule.rrule(rrule.MONTHLY, dtstart=fecha_inicial, until=fecha_final):

            mes = dt.month
            anio = dt.year
            _fecha_mes = "{}-{}-{}".format(str(anio), str(mes), str(1))
            fecha_mes = datetime.strptime(_fecha_mes, '%Y-%m-%d')
            mes_siguiente = fecha_mes + relativedelta(months=1)
            sub_empresas = subEmpreas.filter(fecha_inicio_costo__lte=fecha_mes, fechaFinal__gte=mes_siguiente)
            cantidad = 0
            for _sub in sub_empresas:
                cantidad = cantidad + (_sub.monto / _sub.plazo)
            data["{}-{}".format(mes,anio)] = cantidad

        return Response(data)




    ########################################################
    ## Descripción: Consultas para el reporte costos y ganancias
    ########################################################
    @list_route(methods=["get"])
    def getGanacias(self, request, *args, **kwargs):
        # try:
        fechaInicio = self.request.GET.get("dateStart")
        fechaFinal = self.request.GET.get("dateEnd")
        linea = self.request.GET.get("linea", None)
        empresa = self.request.GET.get("empresa", None)
        subempresa = self.request.GET.get("subempresa", None)
        moneda = self.request.GET.get("moneda", None)
        data = {
            'count': 0,
            'results':[]
        }
        fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
        fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")
        if empresa is not None:
            query = DetalleMovBodega.objects\
                .filter(
                    movimiento__movimiento__es_ov=True,
                    movimiento__movimiento__moneda=moneda, movimiento__movimiento__fecha__range=[fechaInicio, fechaFinal])\
                .order_by("movimiento__fecha")
            if subempresa is not None:
                query = query.filter(lote__empresa=subempresa)
            else:
                query = query.filter(Q(lote__empresa=empresa) | Q(lote__empresa__empresa=empresa))
            if linea is not None:
                query = query.filter(lote__linea=linea)
            ventas = query.values_list('movimiento__movimiento', flat=True)
            movimientos = Movimiento.objects.filter(orden_id__in=ventas)
            pagos = movimientos.values('orden').annotate(cantidad=Sum('monto'), moneda=F('moneda'), descripcion=F('descripcion'))

            page = self.paginate_queryset(pagos)
            if page is not None:
                serializer = GananciasSerializers(page, many=True, context={'empresa': empresa, 'subempresa':subempresa, 'linea':linea})
                return self.get_paginated_response(serializer.data)

            serializer = GananciasSerializers(pagos, many=True, context={'empresa': empresa, 'subempresa':subempresa, 'linea':linea})
            data = serializer.data
            # query = DetalleMovBodega.objects.filter(activo=True, movimiento__fecha__range=[fechaInicio, fechaFinal]).order_by("movimiento__fecha")
            # if subempresa is not None:
            #     query = query.filter(movimiento__empresa=subempresa)
            # else:
            #     query = query.filter(Q(movimiento__empresa=empresa) | Q(movimiento__empresa__empresa=empresa))
            # if linea is not None:
            #     query = query.filter(movimiento__linea=linea)
            # grafica = query.values('stock__producto', 'movimiento__fecha')\
            #     .annotate(cantidad=Sum('cantidad'), nombre=F('stock__producto__nombre'))
            # serializer = GraficasLinealSerializer(grafica, many=True)
            # data = serializer.data
        return Response(data)
        # except:
        #     return Response({'detail': 'Error al obtener las Ganacias'})

    @list_route(methods=["get"])
    def getCostos(self, request, *args, **kwargs):
        # try:
        fechaInicio = self.request.GET.get("dateStart")
        fechaFinal = self.request.GET.get("dateEnd")
        linea = self.request.GET.get("linea", None)
        empresa = self.request.GET.get("empresa", None)
        subempresa = self.request.GET.get("subempresa", None)
        moneda = self.request.GET.get("moneda", None)
        data = {
            'count': 0,
            'results':[]
        }
        fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
        fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")
        if empresa is not None:
            # query = Movimiento.objects.filter(activo=True, fecha__range=[fechaInicio, fechaFinal])\
            #     .order_by("fecha")

            query=None
            if subempresa is not None:
                movimientos_afectado = Afectados.objects.filter(tipo=Afectados.GASTO, movimiento__fecha__range=[fechaInicio, fechaFinal])\
                    .exclude(
                                Q(movimiento__destino=Movimiento.REINTEGRO) | Q(movimiento__destino=Movimiento.BANCO) | Q(movimiento__destino=Movimiento.CAJACHICA)
                    )\
                    .filter(
                        movimiento__proyecto=subempresa,
                        movimiento__es_costo=False,
                        movimiento__moneda=moneda,
                        movimiento__orden=None,
                        movimiento__es_oc=False)\
                    .values_list('movimiento',flat=True)
                query = (
                    Movimiento.objects.filter(id__in=movimientos_afectado) |
                    Movimiento.objects.filter(es_costo=True,moneda=moneda, proyecto=subempresa,fecha__range=[fechaInicio, fechaFinal]) ).distinct()
            else:
                movimientos_afectado = Afectados.objects.filter(tipo=Afectados.GASTO, movimiento__fecha__range=[fechaInicio, fechaFinal])\
                    .exclude(
                                Q(movimiento__destino=Movimiento.REINTEGRO) | Q(movimiento__destino=Movimiento.BANCO) | Q(movimiento__destino=Movimiento.CAJACHICA)
                    )\
                    .filter(
                        Q(movimiento__proyecto=empresa) | Q(movimiento__proyecto__empresa=empresa),
                        movimiento__es_costo=False,
                        movimiento__moneda=moneda,
                        movimiento__orden=None,
                        movimiento__es_oc=False)\
                    .values_list('movimiento',flat=True)
                query = (
                    Movimiento.objects.filter(id__in=movimientos_afectado) |
                    Movimiento.objects.filter(Q(proyecto=empresa) | Q(proyecto__empresa=empresa),es_costo=True,moneda=moneda, fecha__range=[fechaInicio, fechaFinal]) ).distinct()
            if linea is not None:
                query = query.filter(linea=linea)
            gastos = query.values('fecha')\
                .annotate(cantidad=Sum('monto'), linea=F('linea__nombre'), empresa=F('proyecto__nombre'), id=F('id'), moneda=F('moneda'))
            page = self.paginate_queryset(gastos)
            if page is not None:
                serializer = GastosSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = GastosSerializer(gastos, many=True)
            data = serializer.data
        return data
        # except:
        #     return Response({'detail': 'Error al obtener las Ganacias'})

    @list_route(methods=["get"])
    def getCostoGananciaGrafica(self, request, *args, **kwargs):
        try:
            fechaInicio = self.request.GET.get("dateStart")
            fechaFinal = self.request.GET.get("dateEnd")
            linea = self.request.GET.get("linea", None)
            empresa = self.request.GET.get("empresa", None)
            subempresa = self.request.GET.get("subempresa", None)
            moneda = self.request.GET.get("moneda", None)
            data = []


            fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
            fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")

            dateStart = fechaInicio
            dateEnd = fechaFinal

            step_date = relativedelta(days=1)

            while dateStart <= dateEnd:
                ganancia = 10
                costo = 6
                if empresa is not None:
                    #######################  Calcula las ganancias ############################
                    query = DetalleMovBodega.objects.filter(
                        movimiento__movimiento__es_ov=True,
                        movimiento__movimiento__moneda=moneda, movimiento__movimiento__fecha=dateStart)\
                        .order_by("movimiento__fecha")
                    if subempresa is not None:
                        query = query.filter(lote__empresa=subempresa)
                    else:
                        query = query.filter(Q(lote__empresa=empresa) | Q(lote__empresa__empresa=empresa))
                    if linea is not None:
                        query = query.filter(lote__linea=linea)
                    ventas = query.values_list('movimiento__movimiento', flat=True)
                    movimientos = Movimiento.objects.filter(orden_id__in=ventas)
                    pagos = movimientos.values('orden').annotate(cantidad=Sum('monto'), moneda=F('moneda'))
                    resultado = movimientos.aggregate(Sum('monto'))['monto__sum']
                    ganancia = float(resultado if resultado else 0)
                    #######################  Calcula los costos ############################
                    query=None
                    if subempresa is not None:
                        movimientos_afectado = Afectados.objects.filter(tipo=Afectados.GASTO, movimiento__fecha=dateStart)\
                            .exclude(
                                Q(movimiento__destino=Movimiento.REINTEGRO) | Q(movimiento__destino=Movimiento.BANCO) | Q(movimiento__destino=Movimiento.CAJACHICA)
                            )\
                            .filter(
                                movimiento__proyecto=subempresa,
                                movimiento__es_costo=False,
                                movimiento__orden=None,
                                movimiento__moneda=moneda)\
                            .values_list('movimiento',flat=True)
                        # query = Movimiento.objects.filter(id__in=movimientos_afectado)
                        query = (
                            Movimiento.objects.filter(id__in=movimientos_afectado) |
                            Movimiento.objects.filter(es_costo=True, proyecto=subempresa, moneda=moneda, fecha=dateStart) ).distinct()
                    else:
                        movimientos_afectado = Afectados.objects.filter(tipo=Afectados.GASTO, movimiento__fecha=dateStart)\
                            .exclude(
                                Q(movimiento__destino=Movimiento.REINTEGRO) | Q(movimiento__destino=Movimiento.BANCO) | Q(movimiento__destino=Movimiento.CAJACHICA)
                            )\
                            .filter(
                                Q(movimiento__proyecto=empresa) | Q(movimiento__proyecto__empresa=empresa),
                                movimiento__es_costo=False,
                                movimiento__orden=None,
                                movimiento__moneda=moneda)\
                            .values_list('movimiento',flat=True)
                        # query = Movimiento.objects.filter(id__in=movimientos_afectado)
                        query = (
                            Movimiento.objects.filter(id__in=movimientos_afectado) |
                            Movimiento.objects.filter(Q(proyecto=empresa) | Q(proyecto__empresa=empresa),es_costo=True, moneda=moneda, fecha=dateStart) ).distinct()

                    if linea is not None:
                        query = query.filter(linea=linea)
                    resultado = query.aggregate(Sum('monto'))['monto__sum']
                    costo = float(resultado if resultado else 0)

                data.append({
                    'fecha': dateStart.date(),
                    'ganancia': ganancia,
                    'costo': costo
                })
                dateStart += step_date
            return Response(data)
        except:
            return Response({'detail': 'Error al obtener las Ganacias'})
    ########################################################
    ## Descripción: Consultas para el reporte de Producción
    ########################################################
    @list_route(methods=["get"])
    def getProduccionGrafica(self, request, *args, **kwargs):
        try:
            fechaInicio = self.request.GET.get("dateStart")
            fechaFinal = self.request.GET.get("dateEnd")
            linea = self.request.GET.get("linea", None)
            empresa = self.request.GET.get("empresa", None)
            subempresa = self.request.GET.get("subempresa", None)
            reporte_gallinero = self.request.GET.get("reporteGallinero", False)
            data = []

            fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
            fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")

            fracciones_vendibles = Fraccion.objects.filter(vendible=True)
            fracciones_vendibles = fracciones_vendibles.values_list("producto", flat=True).distinct()

            if empresa is not None:
                query = DetalleMovBodega.objects.filter(activo=True,
                    stock__producto__in=fracciones_vendibles,
                    movimiento__fecha__range=[fechaInicio, fechaFinal]).order_by("movimiento__fecha")
                if reporte_gallinero is True:
                    if subempresa is not None:
                        query = query.filter(movimiento__empresa=subempresa)
                    else:
                        query = query.filter(Q(movimiento__empresa__empresa=empresa))
                    query = query.filter(movimiento__linea__sumar_en_reporte=True, activo=True).exclude(
                        movimiento__tipoDespacho=MovimientoBodega.DESPACHOLINEA
                    )
                else:
                    if subempresa is not None:
                        query = query.filter(movimiento__empresa=subempresa)
                    else:
                        query = query.filter(Q(movimiento__empresa=empresa) | Q(movimiento__empresa__empresa=empresa))

                if linea is not None:
                    query = query.filter(movimiento__linea=linea)


                grafica = query.values('stock__producto', 'movimiento__fecha')\
                    .annotate(cantidad=Sum('cantidad'), nombre=F('stock__producto__nombre'))
                serializer = GraficasLinealSerializer(grafica, many=True)
                data = serializer.data
            return Response(data)
        except:
            return Response({'detail': 'Error al cargar los datos'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getProduccionDetalle(self, request, *args, **kwargs):
        try:
            fechaInicio = self.request.GET.get("dateStart")
            fechaFinal = self.request.GET.get("dateEnd")
            linea = self.request.GET.get("linea", None)
            empresa = self.request.GET.get("empresa", None)
            subempresa = self.request.GET.get("subempresa", None)
            data = {
                'count': 1,
                'next': None,
                'previous': None,
                'results': []
            }


            fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
            fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")

            fracciones_vendibles = Fraccion.objects.filter(vendible=True)
            fracciones_vendibles = fracciones_vendibles.values_list("producto", flat=True).distinct()

            if empresa is not None:
                query = DetalleMovBodega.objects.filter(activo=True,
                    stock__producto__in=fracciones_vendibles,
                    movimiento__fecha__range=[fechaInicio, fechaFinal]).order_by("movimiento__fecha")
                if subempresa is not None:
                    query = query.filter(movimiento__empresa=subempresa)

                else:
                    query = query.filter(Q(movimiento__empresa=empresa) | Q(movimiento__empresa__empresa=empresa))
                if linea is not None:
                    query = query.filter(movimiento__linea=linea)
                page = self.paginate_queryset(query)
                if page is not None:
                    serializer = DetalleProduccionSerializer(page, many=True)
                    return self.get_paginated_response(serializer.data)
                serializerDetalle = DetalleProduccionSerializer(query, many=True)
                data = serializerDetalle.data
            return Response(data)
        except:
            return Response({'detail': 'Errror al cargar el detalle'}, status=status.HTTP_400_BAD_REQUEST)


    @list_route(methods=["get"])
    def getProduccionGallineros(self, request, *args, **kwargs):
        try:
            fechaInicio = self.request.GET.get("dateStart")
            fechaFinal = self.request.GET.get("dateEnd")
            linea = self.request.GET.get("linea", None)
            empresa = self.request.GET.get("empresa", None)
            subempresa = self.request.GET.get("subempresa", None)
            data = {
                'count': 1,
                'next': None,
                'previous': None,
                'results': []
            }

            fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
            fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")

            fracciones_vendibles = Fraccion.objects.filter(vendible=True)
            fracciones_vendibles = fracciones_vendibles.values_list("producto", flat=True).distinct()


            movimientos = MovimientoGranja.objects.filter(
                peso_gallinas=False,
                fecha__range=[fechaInicio, fechaFinal],
            ).order_by('-creado')

            if subempresa is not None:
                movimientos = movimientos.filter(gallinero_id=subempresa)

            if linea is not None:
                movimientos = movimientos.filter(gallinero__lotes__linea=linea).distinct()

            sumas = movimientos.aggregate(
                produccion=Sum('produccion'),
                rentabilidad=Sum('rentabilidad')
            )


            self.pagination_class = CustomPaginationGranja
            page = self.paginate_queryset(movimientos)
            if page is not None:
                serializer = MovimientoGranjaSerializer(page, many=True)
                data = {
                    "produccion": sumas.get("produccion"),
                    "rentabilidad": sumas.get("rentabilidad"),
                    "data": serializer.data,
                }
                return self.get_paginated_response(data)
            serializer = MovimientoGranjaSerializer(movimientos, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': 'Errror al cargar el detalle'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getProduccionTotales(self, request, *args, **kwargs):
        try:
            fechaInicio = self.request.GET.get("dateStart")
            fechaFinal = self.request.GET.get("dateEnd")
            linea = self.request.GET.get("linea", None)
            empresa = self.request.GET.get("empresa", None)
            subempresa = self.request.GET.get("subempresa", None)
            data = []

            fracciones_vendibles = Fraccion.objects.filter(vendible=True)
            fracciones_vendibles = fracciones_vendibles.values_list("producto", flat=True).distinct()

            fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
            fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")
            if empresa is not None:
                query = DetalleMovBodega.objects.filter(activo=True,
                                                        stock__producto__in=fracciones_vendibles,
                                                        movimiento__fecha__range=[fechaInicio, fechaFinal], movimiento__tipoIngreso=10)
                if subempresa is not None:
                    query = query.filter(movimiento__empresa=subempresa)

                else:
                    query = query.filter(Q(movimiento__empresa=empresa) | Q(movimiento__empresa__empresa=empresa))
                if linea is not None:
                    query = query.filter(movimiento__linea=linea)
                grafica = query.values('stock__producto') \
                    .annotate(cantidad=Sum('cantidad'), nombre=F('stock__producto__nombre'))
                serializer = GraficaSimpleSerializer(grafica, many=True)
                data = serializer.data

            return Response(data)
        except:
            return Response({'detail': 'Error al cargar los totoles'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getCobrosVentas(self, request, *args, **kwargs):
        self.pagination_class = CustomPagination
        try:
            fechaInicio = self.request.GET.get("dateStart")
            fechaFinal = self.request.GET.get("dateEnd")
            empresa = self.request.GET.get("empresa", None)
            vendedor = self.request.GET.get("vendedor", None)
            noBoleta = self.request.GET.get("noBoleta", None)
            data = {
                "suma": 0.0,
                'count': 1,
                'next': None,
                'previous': None,
                'results': []
            }

            fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
            fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")

            if empresa is not None:
                query = Movimiento.objects.filter(
                    Q(proyecto=empresa) | Q(proyecto__empresa=empresa),
                    fecha__gte=fechaInicio,
                    fecha__lte=fechaFinal,
                    orden__es_ov=True,
                    activo=True,
                    anulado=False,
                    orden__anulado=False,
                ).exclude(
                    orden__isnull=True,
                ).all().order_by('-fecha')

                if noBoleta is not None:
                    query = query.filter(Q(noComprobante__contains=noBoleta) | Q(ventas_ids__noDocumento__contains=noBoleta))

                if vendedor is not None:
                    user = Usuario.objects.get(id=vendedor)
                    query = query.filter(usuario=user)
                page = self.paginate_queryset(query)
                resultado = query.aggregate(Sum('monto'))['monto__sum']
                sum = float(resultado if resultado else 0)
                if page is not None:
                    serializer = MovimientoSerializerDepositos(page, many=True)
                    return self.get_paginated_response({"data": serializer.data, "sum_items": sum})
                serializer_detalle = MovimientoSerializerDepositos(query, many=True)
                data.sum = sum
                data.count = len(serializer_detalle.data)
                data.results = serializer_detalle.data
            return Response(data)
        except Exception as e:
            return Response({'detail': 'Errror al cargar el detalle'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getCobrosVentasExcel(self, request, *args, **kwargs):
        try:
            fechaInicio = self.request.GET.get("dateStart")
            fechaFinal = self.request.GET.get("dateEnd")
            empresa = self.request.GET.get("empresa", None)
            vendedor = self.request.GET.get("vendedor", None)
            noBoleta = self.request.GET.get("noBoleta", None)
            nombre = ""

            fechaInicio = datetime.strptime(fechaInicio, "%Y-%m-%d")
            fechaFinal = datetime.strptime(fechaFinal, "%Y-%m-%d")

            if empresa is not None:
                query = Movimiento.objects.filter(
                    Q(proyecto=empresa) | Q(proyecto__empresa=empresa),
                    fecha__gte=fechaInicio,
                    fecha__lte=fechaFinal,
                    orden__es_ov=True,
                    activo=True,
                    anulado=False,
                    orden__anulado=False,
                ).exclude(
                    orden__isnull=True,
                ).all().order_by('-fecha')

                if noBoleta is not None:
                    query = query.filter(
                        Q(noComprobante__contains=noBoleta) | Q(ventas_ids__noDocumento__contains=noBoleta))

                if vendedor is not None:
                    user = Usuario.objects.get(id=vendedor)
                    nombre = f"{user.first_name}, {user.last_name}"
                    query = query.filter(usuario=user)
                resultado = query.aggregate(Sum('monto'))['monto__sum']
                sum = float(resultado if resultado else 0)
                serializer_detalle = MovimientoSerializerDepositos(query, many=True)
                excel = descargar_reporte_ventas(
                    serializer_detalle.data,
                    sum,
                    nombre,
                    fechaInicio,
                    fechaFinal
                )
                return excel
            return Response({'detail': 'Reporte Vacio'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': 'Errror al cargar el detalle'}, status=status.HTTP_400_BAD_REQUEST)
