from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from django.db.models import Sum, Q, Prefetch
from django.core.files import File
from backend.utils.exceptions import ErrorDeUsuario
from backend.utils.cuentas.getcierre import obtenerCierre


from backend.viewsets.serializer_mixin import SwappableSerializerMixin

from backend.models import Cierre, Movimiento, Cuenta, Afectados, Usuario, Categorias
from backend.serializers.cierre import CierreSerializer, HistoricoVentaSerializer
from backend.serializers.cierre import PrestamoReadSerializer, CierreResumenSerializer, HistoricoSerializer
from backend.serializers.cuenta import CuentaReadSerializer
from backend.serializers.user import UserReadSerializer
from backend.utils import calcularSaldo, tiposcuentas, permisos
from datetime import datetime, date

from dateutil.relativedelta import relativedelta
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ValidationError
import json


from django.utils import timezone

class CierreViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Cierre.objects.all()
    serializer_class = CierreSerializer
    serializer_classes = {
        'GET': CierreSerializer
    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = ('id', 'inicio', 'fin', 'mes',
                'cuenta__proyecto_id',
                'cuenta__deudor_id',
                'cuenta__caja_venta__id',
                'anio')
    search_fields = ('id', 'inicio', 'fin', 'mes','anio', 'cuenta__proyecto__nombre',
                    'cuenta__caja_venta__first_name',
                    'cuenta__usuario__first_name',
                    'cuenta__usuario__last_name', 'cuenta__deudor__nombre','movimiento_cierre__movimiento_hijo__orden__numero_oc')

    #Función para listar los usuarios que tienen cajas activas
    @list_route(methods=["get"])
    def getCajasUsuarios(self, request, *args, **kwargs):
        try:
            query = request.query_params
            filtro = query.get('filtro', None)
            search = query.get('search', None)
            user = self.request.user
            if user.is_superuser is True:
                if filtro is not None:
                    filtro = int(filtro)
                    if filtro == 0:
                        cierres = Cierre.objects.filter(cuenta__tipo= Cuenta.CAJACHICA)
                    else:
                        cierres = Cierre.objects.filter(cuenta__tipo= Cuenta.CAJACHICA, cuenta__proyecto=filtro)
                else:
                    cierres = Cierre.objects.filter(cuenta__tipo=Cuenta.CAJACHICA)
            else:
                cierres = Cierre.objects.filter(cuenta__tipo=30, cerrado=False, cuenta__proyecto=user.proyecto)
            if search is not None and len(search) > 0:
                cierres = cierres.filter(
                    Q(cuenta__usuario__first_name__icontains= search) | Q(cuenta__usuario__last_name__icontains= search) | Q(cuenta__deudor__nombre__icontains=search)
                )
            lista = cierres.values('cuenta__usuario').annotate(Sum('cuenta')).values_list('cuenta__usuario', flat=True)
            usuarios = Usuario.objects.filter(id__in=lista).exclude(puestos__gt=user.puestos)
            page = self.paginate_queryset(usuarios)
            if page is not None:
                serializer = UserReadSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = UserReadSerializer(usuarios, many=True)
            return Response({'count': len(serializer.data), 'results':serializer.data}, status= status.HTTP_200_OK)
        except ValidationError as e:
            return Response({'detail': 'Ha ocurrido un error.'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getHistoricoCajas(self, request, *args, **kwargs):
        try:
            query = request.query_params
            caja = query.get('caja', None)
            user = self.request.user
            usuario = user
            if caja is not None:
                usuario = Usuario.objects.get(id=caja)
            cierres = Cierre.objects.filter(
                cuenta=usuario.cajachica,
                cerrado=True,
                origen__anulado=False
            ).order_by('-fechaInicio','-id')
            cierres = self.filter_queryset(cierres)


            page = self.paginate_queryset(cierres)
            if page is not None:
                serializer = HistoricoSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = HistoricoSerializer(cierres, many=True)
            return Response(serializer.data, status= status.HTTP_200_OK)
        except Cierre.DoesNotExist:
            return Response({'detail':'No hay cajas asignadas'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getDuenioCaja(self, request, *args, **kwargs):
        try:
            query = request.query_params
            caja = query.get('caja', None)
            user = self.request.user
            usuario = user
            if caja is not None:
                usuario = Usuario.objects.get(id=caja)
            nombre = usuario.first_name + " "+usuario.last_name
            return Response({'nombre': nombre}, status= status.HTTP_200_OK)
        except Cierre.DoesNotExist:
            return Response({'detail':'No hay cajas asignadas'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getPrestamos(self, request, *args, **kwargs):
        #recupera todos los prestamos
        #el tipo de cuenta para prestamos es 40
        usuario = self.request.user
        query = request.query_params
        historia = query.get('historia', None)
        search = request.GET.get('search', None)

        if usuario.accesos.administrador == True:
            cierres = Cierre.objects.filter(cuenta__tipo=40)
        else:
            cuentas = Cuenta.objects.filter(tipo=tiposcuentas.DEUDA).filter(
                Q(proyecto=usuario.proyecto) | Q(deudor=usuario.proyecto)
            ).values_list('pk', flat=True)
            cuentas = list(cuentas)
            cierres = Cierre.objects.filter(cuenta__in=cuentas)

        #Se verifica si se filtran los activos o los pagados
        if historia is None:
            cierres = cierres.filter(cerrado=False)
        else:
            cierres = cierres.filter(cerrado=True)
        cierres = self.filter_queryset(cierres)
        cierres = cierres.order_by('-fechaInicio')
        page = self.paginate_queryset(cierres)
        if page is not None:
            if historia is None:
                serializer = PrestamoReadSerializer(page, many=True)
            else:
                serializer = HistoricoSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({'results': [], 'count': 0}, status=status.HTTP_200_OK)
    @list_route(methods=["get"])
    def total_prestamos(self, request, *args, **kwargs):
        #recupera todos los prestamos
        #el tipo de cuenta para prestamos es 40
        usuario = self.request.user
        query = request.query_params
        historia = query.get('historia', None)
        search = request.GET.get('search', None)

        if usuario.accesos.administrador == True:
            cierres = Cierre.objects.filter(cuenta__tipo=40, cuenta__estado=True)
        else:
            cuentas = Cuenta.objects.filter(tipo=tiposcuentas.DEUDA, estado=True).filter(
                Q(proyecto=usuario.proyecto) | Q(deudor=usuario.proyecto)
            ).values_list('pk', flat=True)
            cuentas = list(cuentas)
            cierres = Cierre.objects.filter(cuenta__in=cuentas)

        #Se verifica si se filtran los activos o los pagados
        if historia is None:
            cierres = cierres.filter(cerrado=False)
        else:
            cierres = cierres.filter(cerrado=True)
        cierres = self.filter_queryset(cierres)

        cierres_dolares = cierres.filter(cuenta__moneda = Cuenta.DOLAR)
        cierres_quezales = cierres.filter(cuenta__moneda = Cuenta.QUETZAL)
        total_dolares = 0
        total_quetzales = 0

        for _cierre in cierres_dolares:
            total_dolares += calcularSaldo.calcularSaldo(_cierre)
        for _cierre in cierres_quezales:
            total_quetzales += calcularSaldo.calcularSaldo(_cierre)
        return Response({'total_dolares': total_dolares, 'total_quetzales': total_quetzales}, status=status.HTTP_200_OK)

    @list_route(methods=["get"], url_path='getprestamo/(?P<prestamo>[0-9]+)')
    def getPrestamo(self, request, prestamo=None, *args, **kwargs):
        try:
            cierre = Cierre.objects.get(id=prestamo)
            serializer = PrestamoReadSerializer(cierre)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cierre.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)


    @list_route(methods=["get"], url_path='getCierre/(?P<cuenta>[0-9]+)')
    def getCierre(self, request, cuenta=None, *args, **kwargs):
        DEPOSITO = 10 # (+)
        GASTO = 20 # (-)
        RETIRO = 30 # (-)
        query = request.query_params
        user = self.request.user
        mes = str(query.get('mes'))
        anio = str(query.get('anio'))
        caja = query.get('caja', None)
        try:
            if  int(cuenta) == 0:

                cuenta = Cuenta.objects.get(proyecto=user.proyecto, tipo=tiposcuentas.BANCO)
                cierre = Cierre.objects.get(
                    cuenta__proyecto=user.proyecto,
                    cuenta__tipo=tiposcuentas.BANCO,
                    anio=int(anio),
                    mes=int(mes)
                )
            elif caja is None:
                cuenta = Cuenta.objects.get(id=cuenta)

                cierre = Cierre.objects.get(
                    cuenta=cuenta,
                    anio=int(anio),
                    mes=int(mes)
                )
            else:

                cierre = Cierre.objects.get(id=cuenta)

            afectados = Afectados.objects.filter(cierre=cierre)
            ingresos = afectados.filter(tipo=DEPOSITO).count()
            egresos = afectados.filter(Q(tipo=GASTO) | Q(tipo=RETIRO)).count()
            serializer = CierreResumenSerializer(cierre, context={"ingresos":ingresos, "egresos":egresos})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Cierre.DoesNotExist:
            # No existe el Cierre del mes consultado entonces se calcula en base al anterior
            fechaNuevo = date(int(anio), int(mes), 1)
            cierreAnterior = Cierre.objects.filter(cuenta=cuenta, fechaInicio__lt=fechaNuevo).order_by('-fechaInicio')[:2]
            cierreAnterior = cierreAnterior.first()
            if cierreAnterior is not None:
                anterior = 0
                inicio = 0
                if cierreAnterior.cuenta.tipo == tiposcuentas.BANCO:
                    inicio = calcularSaldo.calcularSaldo(cierreAnterior)

                if cierreAnterior.cuenta.tipo == tiposcuentas.CAJACHICA:
                    anterior = calcularSaldo.calcularSaldo(cierreAnterior)
                else:
                    anterior = 0
                if cierreAnterior.cerrado == True:
                    inicio = round(inicio, 2) if inicio else 0
                    fin = round(inicio, 2) if inicio else 0
                    anterior = round(anterior, 2) if anterior else 0
                    serializer = CuentaReadSerializer(cuenta)
                    data = serializer.data
                    data['saldo'] = inicio
                    data['inicio'] = inicio
                    data['fin'] = fin
                    return Response(data, status=status.HTTP_200_OK)
                saldo = calcularSaldo.calcularSaldo(cierreAnterior)
                inicio = round(inicio, 2) if inicio else 0
                saldo = round(saldo, 2) if saldo else 0
                anterior = round(anterior, 2) if anterior else 0
                return Response({'inicio': inicio, 'saldo': saldo, 'anterior': anterior}, status=status.HTTP_200_OK)
            else:
                serializer = CuentaReadSerializer(cuenta)
                return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getMisCajas(self, request, *args, **kwargs):
        query = request.query_params
        caja = query.get('caja', None)
        user = self.request.user
        usuario = user
        if caja is not None:
            usuario = Usuario.objects.get(id=caja)
        cierres = Cierre.objects.filter(
            cuenta=usuario.cajachica,
            cerrado=False,
            origen__anulado=False
        ).order_by('fechaInicio')
        serializer = PrestamoReadSerializer(cierres, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["post"], url_path='cierreCuenta/(?P<cierre>[0-9]+)')
    def cierreCuenta(self, request, cierre=None, *args, **kwargs):
        try:

            user = self.request.user
            query = request.query_params
            caja = query.get('caja', None)

            #Accesos del usuario
            accesos = user.accesos
            if accesos.administrador == True or accesos.supervisor  == True:
                if caja is None:
                    data = request.data['data']

                    try:
                        data = json.loads(data)
                    except TypeError:
                        pass
                    documento = data["documentos"]
                    doc = request.data.get(str(documento))

                with transaction.atomic():
                    cierre = Cierre.objects.get(id=cierre)
                    if cierre.cerrado == True:
                        raise ErrorDeUsuario('Este periodo ya ha sido cerrado.')

                    #Se recupera el cierre anterior para verifica si ya está cerrado
                    cierreAnterior = cierre.get_prev()
                    if cierreAnterior is not None:
                        if cierreAnterior.cerrado == False:
                            mensaje = 'Debe de cerrar el mes anterior para cerrar este periodo.'
                            if caja is not None:
                                mensaje = 'Debe de cerrar la caja anterior para cerrar esta caja.'
                            raise ErrorDeUsuario(mensaje)
                    if caja is None:
                        cierre.archivo = File(doc)
                        cierre.ext = data["ext"]
                    cierre.usuarioCierre = user
                    cierre.cerrado = True
                    cierre.fechaCierre = datetime.now()
                    cierre.fin = round(calcularSaldo.calcularSaldo(cierre), 2)

                    cierre.save()
                    #Se recupera el cierre siguiente para asignarle el nuevo saldo inicial
                    cierreSiguiente = cierre.get_next()
                    if cierreSiguiente is not None:
                        if caja is  None:
                            cierreSiguiente.inicio = round(calcularSaldo.calcularSaldo(cierre), 2)
                        cierreSiguiente.save()
                    # raise ValidationError('Errror fake')
                return Response({'detail': 'Se ha cerrado correctamente el periodo.'}, status=status.HTTP_200_OK)
            else:
                raise ErrorDeUsuario('El usuario debe ser Adminisitrador o Supervisor')

        except Cierre.DoesNotExist:
            return Response({'detail': 'No existe un periódo válido.'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response( {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    @list_route(methods=["post"])
    def cierreCajaVenta(self, request, *args, **kwargs):
        try:
            data = request.data
            anio = datetime.now().year
            mes = datetime.now().month
            usuario = self.request.user
            caja_venta = usuario.caja_venta
            fecha = timezone.datetime.strptime(data.get('fecha'), '%Y-%m-%d')
            anio = fecha.year
            mes = fecha.month
            monto = float(data.get('monto', 0))
            categoria = None
            if data.get('categoria', None) is not None:
                categoria = Categorias.objects.get(id=data.get('categoria'))
                data.pop('categoria')
            if monto <= 0:
                raise ErrorDeUsuario('Debe de ser un valor mayor a 0.')
            with transaction.atomic():
                #######################  Se hace el depósito al banco ############################
                cuenta = Cuenta.objects.get(id=data.get('cuenta'))

                cierre = obtenerCierre(cuenta,anio,mes)
                if cierre.cerrado:
                    raise ErrorDeUsuario('El mes ya está cerrado')
                _nombre = usuario.first_name + usuario.last_name
                _mensaje = "Por depósito de caja de venta de {}".format(_nombre)
                movimiento = Movimiento.objects.create(
                    usuario=usuario,
                    proyecto=usuario.proyecto,
                    fecha=data.get('fecha'),
                    monto=data.get('monto'),
                    concepto=_mensaje,
                    noDocumento=data.get('noDocumento'),
                    formaPago=Movimiento.DEPOSITO,
                    categoria=categoria,
                    cierre_ventas=True
                )
                afectado = Afectados.objects.create(
                    cierre=cierre,
                    movimiento=movimiento,
                    tipo=Afectados.DEPOSITO
                )
                afectado.save()

                #######################  Se cierra el periodo de la caja de venta ############################
                cierreVenta = Cierre.objects.filter(cuenta=caja_venta, cerrado=False).last()
                movimientos = data.get('movimientos')
                movimeintos_id_pendientes = []
                for mov in movimientos:
                    item = Movimiento.objects.get(id=mov.get("id"))
                    item.ventas_ids = movimiento
                    item.deposito = True
                    item.save()
                    movimeintos_id_pendientes.append(mov.get("id"))

                afectados_array = Afectados.objects.filter(
                    cierre=cierreVenta,
                    movimiento__anulado=False,
                    tipo=Afectados.VENTA
                ).exclude(movimiento__in=movimeintos_id_pendientes)

                movimeintos_pendientes = []

                for item_afectado in afectados_array:
                    movimeintos_pendientes.append(item_afectado.movimiento)
                    item_afectado.delete()

                saldo =  round(calcularSaldo.calcularSaldo(cierreVenta),2)

                final = round(saldo - float(data.get('monto')),2)

                cierreVenta.usuarioCierre = usuario
                cierreVenta.fechaCierre = datetime.now()
                cierreVenta.fin = final
                cierreVenta.cerrado = True
                cierreVenta.movimiento_cierre = movimiento
                cierreVenta.save()

                anio = datetime.now().year
                mes = datetime.now().month
                cierre = Cierre(
                    cuenta=caja_venta,
                    inicio=final,
                    mes=mes,
                    anio=anio,
                    fechaInicio=datetime.now()
                )
                cierre.save()
                for afectados_nuevo in movimeintos_pendientes:
                    afectado = Afectados(cierre=cierre, movimiento=afectados_nuevo, tipo=Afectados.VENTA)
                    afectado.save()
                return Response({'detail': 'se ha cerrado la caja de venta correctamente'})
            return Response({'detail': 'No se ha logrado realizar el cierre'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Cuenta.DoesNotExist:
            return Response({'detail': 'No existe la cuenta bancaria'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"], url_path='obtenerSaldo/(?P<cuenta>[0-9]+)')
    def obtenerSaldo(self, request,cuenta=None, *args, **kwargs):
        query = request.query_params
        mes =  str(query.get('mes'))
        anio =  str(query.get('anio'))
        escaja = query.get('escaja', None)

        user = self.request.user

        try:
            user = self.request.user

            if escaja is not None:
                cierre = Cierre.objects.get(id=cuenta)

            else:
                if user.accesos.administrador == True:
                    cuenta = cuenta
                else:
                    cuenta = Cuenta.objects.get(proyecto=user.proyecto, tipo=10)

                cierre = Cierre.objects.get(
                    cuenta=cuenta,
                    anio=int(anio),
                    mes=int(mes)
                )
            anterior = 0
            anterior = cierre.get_prev()

            inicio = cierre.inicio

            if anterior is not None:
                if anterior.fin is not None:
                    anterior = anterior.fin

                else:
                    if cierre.cuenta.tipo == tiposcuentas.BANCO:
                        inicio = calcularSaldo.calcularSaldo(anterior)
                    if cierre.cuenta.tipo == tiposcuentas.CAJACHICA:
                        anterior = calcularSaldo.calcularSaldo(anterior)
                    else:
                        anterior = 0

            if cierre.cerrado == True:
                inicio = round(inicio,2) if inicio else 0
                fin = round(cierre.fin,2) if cierre.fin else 0
                anterior = round(anterior,2) if anterior else 0
                return Response({'inicio': inicio, 'cierre': fin, 'anterior': anterior}, status= status.HTTP_200_OK)

            saldo = calcularSaldo.calcularSaldo(cierre)

            inicio = round(inicio,2) if inicio else 0
            saldo = round(saldo,2) if saldo else 0
            anterior = round(anterior,2) if anterior else 0
            return Response({'inicio': inicio, 'saldo': saldo, 'anterior': anterior}, status=status.HTTP_200_OK)
        except Cierre.DoesNotExist:
            fechaNuevo = date(int(anio), int(mes), 1)
            cierreAnterior =  Cierre.objects.filter(cuenta=cuenta, fechaInicio__lt=fechaNuevo).order_by('-fechaInicio')[:2]
            cierreAnterior = cierreAnterior.first()
            if cierreAnterior is not None:
                anterior = 0
                inicio = 0
                if cierreAnterior.cuenta.tipo == tiposcuentas.BANCO:
                    inicio = calcularSaldo.calcularSaldo(cierreAnterior)
                if cierreAnterior.cuenta.tipo == tiposcuentas.CAJACHICA:
                    anterior = calcularSaldo.calcularSaldo(cierreAnterior)
                else:
                    anterior = 0
                if cierreAnterior.cerrado == True:
                    inicio = round(inicio,2) if inicio else 0
                    fin = 0
                    anterior = round(anterior,2) if anterior else 0
                    return Response({'inicio': inicio, 'cierre': fin, 'anterior': anterior, 'saldo': inicio}, status= status.HTTP_200_OK)
                saldo = calcularSaldo.calcularSaldo(cierreAnterior)
                inicio = round(inicio,2) if inicio else 0
                saldo = round(saldo,2) if saldo else 0
                anterior = round(anterior,2) if anterior else 0
                return Response({'inicio': inicio, 'saldo': saldo, 'anterior': anterior}, status=status.HTTP_200_OK)

            else:
                return Response({'inicio': 0, 'saldo': 0, 'anterior': 0}, status= status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getHistoricoVentas(self, request, *args, **kwargs):
        cierres = Cierre.objects.filter(
            cuenta__tipo=Cuenta.VENTA,
            cerrado=True,
            anulado=False
        ).prefetch_related(
            Prefetch(
                'movimientos',
                queryset=Afectados.objects.all().order_by('-movimiento__creado')
            )
        )
        usuario = self.request.user
        if not usuario.accesos.administrador:
            cierres = cierres.filter(
                cuenta__caja_venta=usuario
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
            cierres = cierres.filter(
                fechaCierre__gte=fecha_inicial,
                fechaCierre__lt=fecha_final
            )
        # Filtrar por cuentas
        _cuenta = self.request.GET.get('cuenta_id', None)
        if _cuenta is not None:
            cierres = cierres.filter(movimiento_cierre__afectados__cierre__cuenta__id=int(_cuenta))

        cierres = self.filter_queryset(cierres)
        cierres = cierres.order_by('-fechaCierre')
        page = self.paginate_queryset(cierres)
        if page is not None:
            serializer = HistoricoVentaSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response({})
