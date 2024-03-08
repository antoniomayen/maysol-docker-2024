from calendar import month_name, different_locale
from django.db.models import Q, F, Sum
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from backend.models import Movimiento, Cuenta, Cierre, Afectados, CambioMoneda, Proyecto, Categorias
from backend.serializers import  MovimientoNormalSerializer, MovimientoSerializer, GraficasSerializer
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
from backend.utils.categorias import ARR_CF, ARR_PL, ARR_RECUPERACION, TIPOS_CF, TIPOS_PL, PL, CF
from backend.utils import categorias
from rest_framework.permissions import IsAuthenticated
from datetime import datetime, date, timedelta
from dateutil import rrule
from django.db.models import Case, CharField, Value, When, DecimalField
from backend.utils.generar_excel import descargar_reporte,descargar_reporte_detalle
from dateutil.relativedelta import relativedelta

def query_sum_field(query, field):
    total = query.aggregate(Sum(field))["{}__sum".format(field)]
    return float(total if total else 0)


def suma_con_moneda(query, moneda, ultimo_cambio):
    try:
        cambio_dolar = ultimo_cambio.cambio_dolar
        cambio_yen_quetzal = ultimo_cambio.cambio_yen
        cambio_yen_dolar = ultimo_cambio.cambio_yen_dolar

        if moneda == Cuenta.QUETZAL:
            # Verifica si el monto esta en dolares multiplica su valor por el ultimo cambio del mes
            # De lo contrario suma la cantidad como está (se asume que son quetzales
            total = query.annotate(total_s=Case(When(moneda=Cuenta.DOLAR, then=(F('monto') * cambio_dolar)),
                                                default=(Sum(F('monto'))))).aggregate(tot=Sum(F('total_s')))['tot']
            return round(total, 2)
        if moneda == Cuenta.DOLAR:
            # Verifica si el monto esta en quetzales y lo convierte a dolares
            # De lo contrario suma la cantidad como está (se asume que son quetzales
            total = query.annotate(total_s=Case(When(moneda=Cuenta.QUETZAL, then=(F('monto') / cambio_dolar)),
                                                default=(Sum(F('monto'))))).aggregate(tot=Sum(F('total_s')))['tot']
            return round(total, 2)
        if moneda == 'YEN':
            # Verifica si el monto esta en dolares y en quezales y lo convierte a yenes
            # De lo contrario suma la cantidad como está (se asume que son quetzales
            total = query.annotate(total_s=Case(When(moneda=Cuenta.QUETZAL, then=(F('monto') * cambio_yen_quetzal)),
                                                When(moneda=Cuenta.DOLAR, then=(F('monto') * cambio_yen_dolar)),
                                                default=(Sum(F('monto'))))).aggregate(tot=Sum(F('total_s')))['tot']
            return round(total, 2)
    except Exception as e:
        return 0


class ReporteCfViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = MovimientoSerializer
    serializer_classes = {
        'GET': MovimientoNormalSerializer
    }
    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = [
        # 'cierre__cuenta__tipo',
        'afectados__tipo',
        'categoria',
        'usuario',
        'moneda'
    ]
    search_fields = (
        'proveedor',
        'concepto',
        'noComprobante',
        'noDocumento',
        'proveedor',
        'concepto'
    )

    def get_queryset(self):
        usuario = self.request.user
        filtroTipo = self.request.GET.get("tipo")
        empresa = self.request.GET.get("empresa", usuario.proyecto.id)
        mes = self.request.GET.get("mes")
        anio = self.request.GET.get("anio")

        tipoCuentas = [Cuenta.BANCO, Cuenta.CAJACHICA]
        cuentas = Cuenta.objects.filter(
            tipo__in=tipoCuentas,
            proyecto=empresa
        ).values_list('pk', flat=True)

        cierres = Cierre.objects.filter(
            mes=mes,
            anio=anio,
            cuenta__in=cuentas
        ).values_list('pk', flat=True)

        queryset = Movimiento.objects.filter(
            afectados__cierre__in=cierres
        )

        if filtroTipo == "CF":
            queryset = queryset.filter(categoria__cf__in=ARR_CF)
        elif filtroTipo == "PL":
            queryset = queryset.filter(categoria__pl__in=ARR_PL)

        return queryset.order_by("fecha")



    def getResumen(self, tipo, query):
        resumen = []
        if tipo == "CF":
            for choice  in TIPOS_CF:
                objecto = query.filter(categoria__cf=choice[0])
                if 0 < objecto.count() :
                    total = query_sum_field(objecto, 'monto')
                    resumen.append(
                        {'categoria': choice[0], 'total': total, 'es': CF[choice[0]]['es'], 'jp': CF[choice[0]]['jp']})
                else:
                    resumen.append(
                        {'categoria': choice[0], 'total': 0, 'es': CF[choice[0]]['es'], 'jp': CF[choice[0]]['jp']})
        else:
            for choice in TIPOS_PL:
                # Si las opciones son menores a 159, de 159 hacia arriba son plazo recuperacion
                if choice[0] < 159:
                    objecto = query.filter(categoria__pl=choice[0])
                    if 0 < objecto.count():
                        total = query_sum_field(objecto, 'monto')
                        resumen.append(
                            {'categoria': choice[0], 'total': total, 'es': PL[choice[0]]['es'], 'jp': PL[choice[0]]['jp']})
                    else:
                        resumen.append(
                            {'categoria': choice[0], 'total': 0, 'es': PL[choice[0]]['es'], 'jp': PL[choice[0]]['jp']})
        return resumen

    @list_route(methods=["get"])
    def getReporte(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        query = request.query_params
        tipo = self.request.GET.get("tipo")
        mes = self.request.GET.get("mes")
        anio = self.request.GET.get("anio")
        moneda = self.request.GET.get("moneda")
        usuario = self.request.user
        empresa = self.request.GET.get("empresa", usuario.proyecto.id)

        tipo_lower = str(tipo).lower()

        opcion = query.get("opcion", None)

        queryset = self.filter_queryset(queryset)
        # Filtrar el queryset de datos por moneda
        if moneda is not None:
            queryset = queryset.filter(moneda=moneda)

        if opcion is not None and int(opcion) == 1:
            #Se recupera el detalle del mes
            queryset = self.filter_queryset(queryset)
            serializerDetalle = MovimientoNormalSerializer(queryset, many=True)
            data = {
                'detalle': serializerDetalle.data,
            }
        elif opcion is not None and  int(opcion) == 2:
            #Se recupera la grafica 1 radial
            #Datos de gráfica de pie

            cantidad_top_gastos = queryset \
                .values("categoria__{}".format(str(tipo).lower())) \
                .annotate(cantidad = Sum('monto'), tipo=F('categoria__{}'.format(str(tipo).lower()))) \
                .order_by("-cantidad")[:5]
            grafica1= GraficasSerializer(cantidad_top_gastos, many=True)
            data= {'grafica1': grafica1.data}
        elif opcion is not None and  int(opcion) == 3:
            #se recupera la grafica 2 lineal
            tipoCuentas = [Cuenta.BANCO, Cuenta.CAJACHICA]
            cuentas = Cuenta.objects.filter(
                tipo__in=tipoCuentas,
                proyecto=empresa
            ).values_list('pk', flat=True)

            cierres = Cierre.objects.filter(
                mes=mes,
                anio=anio,
                cuenta__in=cuentas
            ).values_list('pk', flat=True)

            top_gastos = queryset \
                .values("categoria__{}".format(str(tipo).lower())) \
                .annotate(cantidad = Sum('monto'), tipo=F('categoria__{}'.format(str(tipo).lower()))) \
                .order_by("-cantidad") \
                .values_list('tipo', flat=True) \
                .distinct()[:5]

            if tipo_lower == "cf":
                filtro = Q(categoria__cf__in=list(top_gastos))
            else:
                filtro = Q(categoria__pl__in=list(top_gastos))

            gastos_por_dia = Movimiento.objects \
                .filter(afectados__cierre__in=cierres, moneda=moneda) \
                .filter(filtro) \
                .values("categoria__{}".format(str(tipo).lower()),  'fecha') \
                .annotate(cantidad = Sum('monto'), tipo=F('categoria__{}'.format(str(tipo).lower()))) \
                .order_by("fecha")
            gastos_por_dia = self.filter_queryset(gastos_por_dia)
            grafica2= GraficasSerializer(gastos_por_dia, many=True)
            data = {'grafica2': grafica2.data}
        else:
            resumen = self.getResumen(tipo, queryset)
            data={'resumen': resumen}
        return Response(data, status=status.HTTP_200_OK)

    def datos_excel(self, args, usuario):
        # Nuevos filtros agregados
        categoriaP = args.get('categoria', None)
        usuarioP = args.get('usuario', None)

        empresa = args.get('empresa', None)
        # empresa = args.get("empresa", usuario.proyecto.id)
        moneda = args.get("moneda", Cuenta.QUETZAL)
        anio_reporte = args["anio"]
        _fecha_inicial = "{}-{}-{}".format(str(anio_reporte), str(3), str(1))
        _fecha_inicial_pasado = "{}-{}-{}".format(str(int(anio_reporte) - 1), str(3), str(1))
        fecha_inicial = datetime.strptime(_fecha_inicial, '%Y-%m-%d')
        fecha_inicial_pasado = datetime.strptime(_fecha_inicial_pasado, '%Y-%m-%d')
        anio_despues = fecha_inicial + timedelta(days=365)
        anio_despues_pasado = fecha_inicial_pasado + timedelta(days=365)

        tipo_cuentas = [Cuenta.BANCO, Cuenta.CAJACHICA]
        cuentas = Cuenta.objects.filter(tipo__in=tipo_cuentas, proyecto=empresa).values_list('pk', flat=True)

        resultados_PL = dict()
        resultados_CF = dict()
        recuperacion = {'159': dict(), '160': dict(), '161': dict()}
        resultados_ventas = {'total': 0}
        ventas_totales = dict()
        ventas_ateriores = {'total': 0}
        deudas = {'haber': {'total': 0}, 'debe': {'total': 0}, 'sumatoria': {'total': 0}}

        cuentas_deuda = Cuenta.objects.filter(tipo=Cuenta.DEUDA, deudor=empresa).values_list('pk', flat=True)
        cierres_deuda = Cierre.objects.filter(cuenta__in=cuentas_deuda).values_list('pk', flat=True)
        subEmpreas = Proyecto.objects.filter(empresa=empresa, subempresa=True)

        # Recorre los meses del año anterior para calcular el historial de ventas
        for dt in rrule.rrule(rrule.MONTHLY, dtstart=fecha_inicial_pasado, until=anio_despues_pasado):
            mes = dt.month
            anio = dt.year
            ultimo_cambio = CambioMoneda.objects.filter(fecha_dolar__month=mes, fecha_dolar__year=anio) \
                .order_by('-fecha_dolar').first()

            ventas = Movimiento.objects.filter(es_ov=True, proyecto=empresa).values('pk')
            # Nuevos filtros, por categoria y por usuario
            if categoriaP is not None: ventas = ventas.filter(categoria_id=categoriaP)
            if usuarioP is not None: ventas = ventas.filter(usuario_id=usuarioP)

            pagos_ventas = Movimiento.objects.filter(orden_id__in=ventas, anulado=False, fecha__month=mes,
                                                     fecha__year=anio)
            ventas_ateriores[str(mes)] = suma_con_moneda(pagos_ventas, moneda, ultimo_cambio)
            ventas_ateriores['total'] += suma_con_moneda(pagos_ventas, moneda, ultimo_cambio)

        # Recorre cada mes, de marzo a febrero del proximo anio
        for dt in rrule.rrule(rrule.MONTHLY, dtstart=fecha_inicial, until=anio_despues):
            mes = dt.month
            mes_sig = int(dt.month) + 1
            anio = dt.year
            _fecha_mes = "{}-{}-{}".format(str(anio), str(mes), str(1))
            fecha_mes = datetime.strptime(_fecha_mes, '%Y-%m-%d')
            mes_siguiente = fecha_mes + relativedelta(months=1)

            ultimo_cambio = CambioMoneda.objects.filter(fecha_dolar__month=mes, fecha_dolar__year=anio) \
                .order_by('-fecha_dolar').first()


            cierres = Cierre.objects.filter(
                cuenta__in=cuentas,
                mes=mes,
                anio=anio
            ).values_list('pk', flat=True)

            movimientos = Movimiento.objects.filter(afectados__cierre__in=cierres, proyecto=empresa)
            # Nuevos filtros, por categoria y por usuario
            if categoriaP is not None: movimientos = movimientos.filter(categoria_id=categoriaP)
            if usuarioP is not None: movimientos = movimientos.filter(usuario_id=usuarioP)

            movimientos_deuda = Movimiento.objects.filter(afectados__cierre__in=cierres_deuda,
                                                          fecha__month=mes, fecha__year=anio)

            # Recuperación
            # Se otienen las sub emrpesas (granjas) que tengan recuperacion
            cantidad_recuperacion_159 = 0
            cantidad_recuperacion_160 = 0
            cantidad_recuperacion_161 = 0
            sub_empresas = subEmpreas.filter(fecha_inicio_costo__lte=fecha_mes, fechaFinal__gte=mes_siguiente)
            for _sub in sub_empresas:
                if _sub.categoria_recuperacion == categorias.Depresiacion:  # Si es en la fila 159
                    cantidad_recuperacion_159 += (_sub.monto / _sub.plazo)
                if _sub.categoria_recuperacion == categorias.Depresiacion_sistemas:  # Si el gasto va en la fila 160
                    cantidad_recuperacion_160 += (_sub.monto / _sub.plazo)
                if _sub.categoria_recuperacion == categorias.Establecimiento_inversion:  # Si el gasto va en la fila 161
                    cantidad_recuperacion_161 += (_sub.monto / _sub.plazo)
            # Gastos que tengan fecha de recuperacion
            gastos = Movimiento.objects.filter(fecha_inicio_recuperacion__month__lte=mes,
                                               fecha_inicio_recuperacion__year__lte=anio,
                                               fecha_final_recuperacion__month__gte=mes_sig,
                                               fecha_final_recuperacion__year__gte=anio). \
                prefetch_related('categoria')
            # Nuevos filtros, por categoria y por usuario
            if categoriaP is not None: gastos = gastos.filter(categoria_id=categoriaP)
            if usuarioP is not None: gastos = gastos.filter(usuario_id=usuarioP)

            for gasto in gastos:
                if gasto.categoria.pl == categorias.Depresiacion:  # Si es en la fila 159
                    cantidad_recuperacion_159 += (gasto.monto / gasto.plazo)
                if gasto.categoria.pl == categorias.Depresiacion_sistemas:  # Si el gasto va en la fila 160
                    cantidad_recuperacion_160 += (gasto.monto / gasto.plazo)
                if gasto.categoria.pl == categorias.Establecimiento_inversion:  # Si el gasto va en la fila 161
                    cantidad_recuperacion_161 += (gasto.monto / gasto.plazo)
            recuperacion['159'][str(mes)] = cantidad_recuperacion_159
            recuperacion['160'][str(mes)] = cantidad_recuperacion_160
            recuperacion['161'][str(mes)] = cantidad_recuperacion_161


            # Total de ventas
            ventas = Movimiento.objects.filter(es_ov=True, proyecto=empresa).values('pk')
            # Nuevos filtros, por categoria y por usuario
            if categoriaP is not None: ventas = ventas.filter(categoria_id=categoriaP)
            if usuarioP is not None: ventas = ventas.filter(usuario_id=usuarioP)

            pagos_ventas = Movimiento.objects.filter(orden_id__in=ventas, anulado=False, fecha__month=mes,
                                                     fecha__year=anio)
            resultados_ventas[str(mes)] = suma_con_moneda(pagos_ventas, moneda, ultimo_cambio)
            resultados_ventas['total'] += suma_con_moneda(pagos_ventas, moneda, ultimo_cambio)

            # Ventas del mes (Sumando el monto total de la OV)
            ventas_mes = ventas.filter(fecha__month=mes, fecha__year=anio)
            ventas_totales[str(mes)] = suma_con_moneda(ventas_mes, moneda, ultimo_cambio)

            # Dinero recibido por un prestamo
            deudas_haber = movimientos.filter(afectados__tipo=Afectados.PAGODEUDA).distinct()
            deudas['haber'][str(mes)] = suma_con_moneda(deudas_haber, moneda, ultimo_cambio)
            deudas['haber']['total'] += suma_con_moneda(deudas_haber, moneda, ultimo_cambio)

            # Dinero que se pago por un prestamo
            deudas_debe = movimientos_deuda.filter(afectados__tipo=Afectados.GASTODEUDA).distinct()
            deudas['debe'][str(mes)] = suma_con_moneda(deudas_debe, moneda, ultimo_cambio)
            deudas['debe']['total'] += suma_con_moneda(deudas_debe, moneda, ultimo_cambio)

            # Dinero total de prestamos (-salientes + entrantes)
            deudas['sumatoria'][str(mes)] = -deudas['haber'][str(mes)] + deudas['debe'][str(mes)]

            # datos de CF
            _CF = movimientos.filter(categoria__cf__in=ARR_CF)
            for choice in TIPOS_CF:
                objecto = _CF.filter(categoria__cf=choice[0])
                if resultados_CF.get(choice[0], None) is not None:
                    resultados_CF[choice[0]]['total_mes'] += suma_con_moneda(objecto, moneda, ultimo_cambio)
                    resultados_CF[choice[0]]['meses'][mes] = {'total':  suma_con_moneda(objecto, moneda, ultimo_cambio)}
                else:
                    resultados_CF[choice[0]] = {'total_mes': suma_con_moneda(objecto, moneda, ultimo_cambio), 'es': CF[choice[0]]['es'],
                                                'jp': CF[choice[0]]['jp'],
                                                'meses': {mes: {'total': suma_con_moneda(objecto, moneda, ultimo_cambio)}
                                                          }}
            # No tomar en cuenta los movimientos que su categoria corresponde a los de plazo de recuperación
            _PL = movimientos.filter(categoria__pl__in=ARR_PL).\
                exclude(categoria__pl__in=ARR_RECUPERACION)
            for choice in TIPOS_PL:
                # Si las opciones son menores a 159, de 159 hacia arriba son plazo recuperacion
                if choice[0] < 159:
                    objecto = _PL.filter(categoria__pl=choice[0])
                    if resultados_PL.get(choice[0], None) is not None:
                        resultados_PL[choice[0]]['total_mes'] += suma_con_moneda(objecto, moneda, ultimo_cambio)
                        resultados_PL[choice[0]]['meses'][mes] = {'total': suma_con_moneda(objecto, moneda, ultimo_cambio)}
                    else:
                        resultados_PL[choice[0]] = {'total_mes': suma_con_moneda(objecto, moneda, ultimo_cambio),
                                                    'es': PL[choice[0]]['es'],
                                                    'jp': PL[choice[0]]['jp'],
                                                    'meses': {mes: {'total': suma_con_moneda(objecto, moneda, ultimo_cambio)}
                                                              }}

        resultados = {'CF': resultados_CF, 'PL': resultados_PL, 'deudas': deudas, 'ventas_ateriores': ventas_ateriores,
                      'ventas': resultados_ventas, 'moneda': moneda, 'recuperacion': recuperacion, 'ventas_totales':
                          ventas_totales}

        return resultados

    def datos_excel_detalle(self, args, usuario):
        queryset = self.get_queryset()
    
        mes = self.request.GET.get("mes")
        with different_locale('es_GT.utf8'):
            mes= month_name[int(mes)]
        anio = self.request.GET.get("anio")
        moneda = args.get("moneda", Cuenta.QUETZAL)
        tipo_moneda = args.get("tipo_moneda", Cuenta.QUETZAL)
        tipo = args.get("tipo", None)
        usuario = self.request.user
        empresa = self.request.GET.get("empresa", usuario.proyecto.id)
        empresa=Proyecto.objects.get(pk=empresa)
        queryset = self.filter_queryset(queryset)
        if moneda is not None:
            queryset = queryset.filter(moneda=moneda)

        #Se recupera el detalle del mes
        queryset = self.filter_queryset(queryset)
        serializerDetalle = MovimientoNormalSerializer(queryset, many=True)
        data = {
            'detalle': serializerDetalle.data,
            'anio': anio,
            'mes': mes,
            'empresa': empresa.nombre,
            'moneda': tipo_moneda,
            'tipo': tipo
        }

        return data
    @list_route(methods=['get'])
    def descarga(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        usuario = self.request.user
        query = request.query_params
        datos = self.datos_excel(query, usuario)
        excel = descargar_reporte(datos, query)
        return excel

    @list_route(methods=['get'])
    def descarga_detalle(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        usuario = self.request.user
        query = request.query_params
        datos = self.datos_excel_detalle(query, usuario)
        excel = descargar_reporte_detalle(datos, query)
        return excel
