from django.conf import settings
from django.db import transaction, DatabaseError
from django.db.models import Q, F, Sum

from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from backend.utils.exceptions import ErrorDeUsuario

from datetime import datetime

from backend.models import Movimiento, Cuenta, Cierre, Afectados, Usuario, Proyecto, Categorias, Proveedor
from backend.serializers import MovimientoReadSerializer, MovimientoComentarioSerializer, MovimientoNormalSerializer, \
    MovimientoSerializer, AnularMovimientoSerializer, CuentaPrestamoSerializer, MovimientoReadCuentaSerializer, \
    MovimientoUserlSerializer
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
import pytz

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from django.core.exceptions import ValidationError
from backend.utils import tiposcuentas, calcularSaldo, permisos
from backend.utils.cuentas.getcierre import obtenerCierre
from datetime import datetime, date
from dateutil.relativedelta import relativedelta


utc = pytz.UTC

DEPOSITO = 10 # (+)
GASTO = 20 # (-)
RETIRO = 30 # (-)
GASTODEUDA = 40 #(-)
PAGODEUDA = 50 #(+)
RETIROPRESTAMO = 60 #(-)
DEPOSITOPRESTAMO = 70 #(+)

ACTIVOS = [ DEPOSITO, PAGODEUDA, DEPOSITOPRESTAMO]
PASIVOS = [GASTO, RETIRO, GASTODEUDA, RETIROPRESTAMO]

class MovimientoViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Movimiento.objects.all().order_by('fecha')
    serializer_class = MovimientoSerializer
    serializer_classes = {
        'GET': MovimientoNormalSerializer
    }
    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = [
        'afectados__tipo',
        'categoria',
        'anulado'
    ]
    search_fields = (
        'proveedor__nombre',
        'concepto',
        'noComprobante',
        'noDocumento'
    )

    def get_queryset(self):
        user = self.request.user
        return Movimiento.objects.all().order_by('fecha')

    @list_route(methods=["get"])
    def get_ventas(self, request, *args, **kwargs):
        user = self.request.user
        data = Movimiento.objects.filter(Q(formaPago=Movimiento.EFECTIVO) | Q(formaPago=Movimiento.CHEQUE),
                                         usuario=user, deposito=False, anulado=False, orden__es_ov=True,
                                         ).exclude(orden__isnull=True).all().order_by('-fecha')
        serializer = MovimientoUserlSerializer(data, many=True)
        count = data.count()
        return Response({'results': serializer.data, 'count': count}, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        try:        
            data = request.data
            #se verifica si está editando una cuenta, si edita una caja no es necesario cambiar de cierre
            if data.get('es_cuenta'):
                if data.get('destino') is None: 
                    id_mov=data['id']
                    fecha=datetime.strptime(data['fecha'], '%Y-%m-%d')
                    afectados=Afectados.objects.get(movimiento=id_mov)
                    cierre=Cierre.objects.get(Q(mes=fecha.month) & Q(anio=fecha.year), cuenta=afectados.cierre.cuenta)
                    afectados.cierre=cierre
                    afectados.save()
            model = self.get_object()
            movimiento = Movimiento.objects.get(pk=model.id)
            data.pop('monto')
            afectados = Afectados.objects.filter(movimiento=movimiento)
            for afectado in afectados:
                if afectado.cierre.cerrado == True:
                    editados = { 'comentario': data.get('comentario', None), 'plazo': data.get('plazo', None) }
                    serializer = MovimientoSerializer(movimiento, data=data, partial=True)
                    break
            else:
                serializer = MovimientoSerializer(movimiento, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            update = serializer.save()
            try:
                inicio = data.get('fecha_inicio_recuperacion')
                inicio = datetime.strptime(inicio, '%Y-%m-%d')
                plazo = int(data.get('plazo'))
                final = inicio + relativedelta(months=plazo)
                update.fecha_final_recuperacion = final.date()
                update.save()
            except:
                pass
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Movimiento.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)


    def create(self, request, *args, **kwargs):
        DEPOSITO = 10
        GASTO = 20
        RETIRO = 30
        GASTODEUDA = 40
        PAGODEUDA = 50
        try:
            data = request.data
            usuario = request.user
            try:
                data['fecha'] = data['fecha'].split('T')[0]
            except:
                pass

            # Recuperación de parámetros
            query = request.query_params
            mes = str(query.get('mes'))
            idCierre = query.get('idCierre', None)
            anio = str(query.get('anio'))
            proyecto = query.get('proyecto', None)
            destino = query.get('destino', None)
            prestamo = query.get('prestamo', None)
            gastoProyecto = query.get('gastoProyecto', None)
            idCierreCaja = query.get('cierrecaja', None)

            serializer = MovimientoSerializer(data=data)
            with transaction.atomic():
                # Se verifica que se si ese movimiento es para una caja chica
                if idCierre is not None:
                    #Para guardar un depósito
                    self.pagoPrestamo(data, usuario, anio, mes, idCierre)

                    return Response({'detail':'Se ha hecho el deposito correctamente.'}, status=status.HTTP_200_OK)

                elif destino is None and prestamo is  None:
                    if usuario.accesos.administrador==True or usuario.accesos.supervisor==True:
                        #Para guardar un depósito
                        cuentaBancaria = self.getCuentaBancoUsuario(usuario, data)
                        data = { **data, 'destino': Movimiento.BANCO}
                        self.realizarMovNormal(usuario, cuentaBancaria, mes, anio, data, DEPOSITO, True)
                        return Response({'detail':'Se ha hecho el deposito correctamente.'}, status=status.HTTP_200_OK)
                    else:
                        raise ErrorDeUsuario('No puede realizar un depósito de banco.')
                    return Response({'detail': 'Todo correcto.'}, status=status.HTTP_201_CREATED)
                elif destino is not None and prestamo is None:
                    # Condición para hacer depósito a caja o depositar a proveedor

                    if int(destino) == 10:
                        #SE guarda un gasto desde caja chica.
                        if data.get('tipo') == GASTO:
                            self.realizarMovNormal(usuario, usuario.cajachica, mes, anio, data, GASTO, False, idCierreCaja)
                            return Response({'detail': 'Todo correcto.'}, status=status.HTTP_201_CREATED)
                        elif data.get('tipo')== RETIRO:
                            #Se hace un depósto a caja chica

                            #Deposito a mi propia caja chica
                            if data.get('empleado', None) is None:
                                self.depositoCaja(data, usuario, anio, mes, True)
                            #deposito a otra caja
                            else:
                                self.depositoCaja(data, usuario, anio, mes, False)
                            return Response({'detail': 'Todo correcto.'}, status=status.HTTP_201_CREATED)
                    # Quiere decir que es pago a proveedor
                    # se paga desde banco
                    elif int(destino) == 20:
                        if proyecto is not None:
                            cuentaBancaria = Cuenta.objects.get(id=proyecto)
                        else:
                            cuentaBancaria = Cuenta.objects.get(tipo=10, proyecto=usuario.proyecto)
                        self.realizarMovNormal(usuario, cuentaBancaria, mes, anio, data, GASTO, True)
                        return Response({'detail': 'Todo correcto.'}, status=status.HTTP_201_CREATED)
                    #se realiza un gasto de otro proyecto
                    elif int(destino) == 30:
                        cuentaBancaria = self.getCuentaBancoUsuario(usuario, data, proyecto)
                        self.gastoProyecto(usuario, cuentaBancaria, mes, anio, data)
                        return Response({'detail': 'Gasto de proyecto realizado.'}, status=status.HTTP_200_OK)
                #Se realiza un prestamo entre proyectos
                elif prestamo is not None:
                    #Se realiza un prestamo
                    if usuario.accesos.administrador == True or usuario.accesos.supervisor == True:
                        self.prestamoProyecto(data, usuario, anio, mes)
                    else:
                        raise ErrorDeUsuario('Solo un superadministrador puede realizar un prestamo.')
                    return Response({'detail':'Prestamo realizado.'}, status=status.HTTP_200_OK)

            return Response({'detail': 'No se logró realizar el movimiento.'}, status=status.HTTP_400_BAD_REQUEST)
        except Cuenta.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)
        except Cierre.DoesNotExist:
            return Response({'detail': 'No Existe un periodo'}, status= status.HTTP_400_BAD_REQUEST)
        except serializers.ValidationError as e:
            #{'saldo': ['Este campo es requerido.']}
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:

            return Response( {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    #======= FUNCIONES AUXILIARES PARA LOS MOVIMIENTOS =====
    #get cuenta de usuario
    def getCuentaBancoUsuario(self, usuario, data, proyecto=None):

        cuentaBancaria = Cuenta.objects.get(id=data.get('cuenta'))
        if usuario.accesos.administrador != True:
            if cuentaBancaria.proyecto != usuario.proyecto:
                raise ErrorDeUsuario('No puede realizar un Gasto ya que esta cuenta no le pertenece')
        return cuentaBancaria
    #Gasto de proyecto que está en fase 1
    def gastoProyecto(self,usuario, cuenta, mes, anio, data):
        GASTO = 20
        if data.get('cuenta', None) is not None:
            data.pop('cuenta')

        cierre = self.getCierreBanco(cuenta,anio,mes)
        #se verifica que el no se haga un pago mayor al saldo
        saldo = calcularSaldo.calcularSaldo(cierre)
        saldo = round(saldo, 2)
        if saldo < float(data.get('monto')):
            raise ErrorDeUsuario('No tiene saldo suficiente para realizar el movimiento.')

        if data.get('tipo', None) is not None:
            data.pop('tipo')

        if data.get('proyecto') is not None:
            proyecto = Proyecto.objects.get(id=data.get('proyecto'))
            data.pop('proyecto')

        categoria = None
        if data.get('categoria', None) is not None:
            categoria = Categorias.objects.get(id=data.get('categoria'))
            data.pop('categoria')
        if data.get('destino', None) is not None:
            data.pop('destino')

        persona = None
        if data.get('persona', None) is not None:
            persona = Usuario.objects.get(pk=data.get('persona'))
            data.pop('persona')

        proveedor = None
        if data.get('proveedor', None) is not None:
            proveedor = Proveedor.objects.get(pk=data.get('proveedor'))
            data.pop('proveedor')

        movimiento = Movimiento.objects.create(
            usuario=usuario,
            proyecto=proyecto,
            persona=persona,
            destino=Movimiento.PAGOPROVEEDOR,
            **data,
            categoria=categoria,
            proveedor=proveedor,
            moneda=cierre.cuenta.moneda
        )

        cierres = [cierre]
        tipos = [GASTO]
        self.guardarAfectados(cierres, tipos, movimiento)
    #Realizar pago deuda
    def pagoPrestamo(self, data, usuario, anio, mes, id):
        cierre = Cierre.objects.get(id=id)
        proyectoAcreedor = cierre.cuenta.proyecto
        proyectoDeudor = cierre.cuenta.deudor
        if proyectoAcreedor is None or proyectoDeudor is None:
            raise ErrorDeUsuario('No es una cuenta de prestamo.')
        if cierre.cerrado == True:
            raise ErrorDeUsuario('El prestamo ya ha sido pagado.')
        #se verifica que el no se haga un pago mayor al saldo
        saldo = calcularSaldo.calcularSaldo(cierre)
        if saldo < float(data.get('monto')):
            raise ErrorDeUsuario('No puede pagar más que el valor de la deuda.')

        #Si con el pago que se está haciendo se ha llegado cero
        #entonces se debe cerrar la cuenta por pagar
        falta = saldo - float(data.get('monto'))
        if falta == 0:
            cierre.fechaCierre = datetime.now()
            cierre.cerrado = True
            cierre.fin = 0
            cierre.save()
        #Recuperación de cuentas
        # cuentaAcreedor = Cuenta.objects.get(proyecto=proyectoAcreedor, tipo=10)
        # cuentaDeudor = Cuenta.objects.get(proyecto=proyectoDeudor, tipo=10)
        cuentaAcreedor = cierre.cuenta.cuentaAcreedor
        cuentaDeudor = cierre.cuenta.cuentaDeudor

        #recuperación de cierres
        cierreAcreedor = self.getCierreBanco(cuentaAcreedor, anio, mes)
        cierreDeudor = self.getCierreBanco(cuentaDeudor, anio, mes)

        serializer = MovimientoSerializer(data=data)
        serializer.is_valid()
        movimiento = Movimiento.objects.create(
            usuario=usuario,
            moneda=cierre.cuenta.moneda,
            proyecto=proyectoAcreedor,
            **serializer.data)

        cierres = [cierre, cierreAcreedor, cierreDeudor]
        tipos = [ 40, 50, 40]


        self.guardarAfectados(cierres, tipos, movimiento)

    #REalizar prestamo a  un proyecto
    def prestamoProyecto(self, data, usuario, anio, mes):
        serializerCuenta = CuentaPrestamoSerializer(data=data)
        if data.get('descripcion', None) is  None:
            raise ErrorDeUsuario('Debe de escribir una descripción.')

        # serializerCuenta.is_valid(raise_exception=True)
        if data.get('deudor', None) is None or data.get('acreedor', None) is None or data.get('saldo', None) is None:
            raise ErrorDeUsuario('No están los datos completos.')
        #Se recuperan los proyectos
         #Recupera las cuentas involucradas
        cuentaAcreedor = Cuenta.objects.get(id=data.get("acreedor"))
        cuentaDeudor = Cuenta.objects.get(id=data.get("deudor"))

        proyectoAcreedor = cuentaAcreedor.proyecto
        proyectoDeudor = cuentaDeudor.proyecto

        if cuentaAcreedor.moneda != cuentaDeudor.moneda:
            raise ErrorDeUsuario("Las cuentas tienen deferentes monedas.")

        if proyectoAcreedor.fase != 20 or proyectoDeudor.fase !=20:
            raise ErrorDeUsuario('No debe ser una empresa en fase de investigación.')




        #Recuperar los cierres actuales de las cuentas
        cierreAcreedor = self.getCierreBanco(cuentaAcreedor, anio, mes)
        cierreDeudor = self.getCierreBanco(cuentaDeudor, anio, mes)



        movimiento = Movimiento.objects.create(
            destino=30,
            usuario=usuario,
            proyecto=proyectoDeudor,
            concepto=data.get('descripcion'),
            formaPago=data.get('formaPago'),
            noDocumento=data.get('noDocumento'),
            prestamo=True,
            monto=data.get('saldo'),
            fecha=data.get('fecha'),
            moneda=cierreAcreedor.cuenta.moneda
        )


        #Se crea una cuenta para prestamo
        cuenta = Cuenta.objects.create(
            proyecto=proyectoAcreedor,
            deudor=proyectoDeudor,
            cuentaAcreedor=cuentaAcreedor,
            cuentaDeudor=cuentaDeudor,
            saldo=data.get('saldo'),
            moneda=cuentaAcreedor.moneda,
            tipo=40,
            movimientoPrestamo=movimiento
        )

        saldo = calcularSaldo.calcularSaldo(cierreAcreedor)
        if float(saldo) < float(movimiento.monto):
            raise ErrorDeUsuario('No tiene suficientes fondos para realizar el movimiento.')
        cierres = [cierreAcreedor, cierreDeudor]
        #Retiro prestamo=60  deposito prestamo=70
        tipos = [Afectados.RETIROPRESTAMO, Afectados.DEPOSITOPRESTAMO]

        #Se crea un cierre para la cuenta por cobrar
        #esta se debe cerra cuando se termina de pagar
        cierre = Cierre.objects.create(
            cuenta=cuenta,
            origen=movimiento,
            inicio= data.get('saldo'),
            descripcion=data.get('descripcion')
        )
        self.guardarAfectados(cierres, tipos, movimiento)

    #Realizar deposito a caja chica
    def depositoCaja(self, data, usuario, anio, mes, micaja= True):
        DEPOSITO = 10
        GASTO = 20
        RETIRO = 30

        #######################  Se recupera la cuenta de banco de retiro para caja ############################
        cuentaBancaria = Cuenta.objects.get(id=data.get('cuenta'))
        #Verificación de super usuario o supervisor
        if usuario.accesos.supervisor == True:
            if cuentaBancaria.proyecto != usuario.proyecto:
                raise ErrorDeUsuario('No tiene acceso a esta cuenta porque pertenece a otra empresa.')

        if cuentaBancaria.moneda != Cuenta.QUETZAL:
            raise ErrorDeUsuario('La cuenta está en dólares, debe de ser una cuenta en Quetzales para poder asignar saldo a caja chica.')
        _fecha = data.get('fecha')
        _hora = data.get('hora')
        _fecha = _fecha.split('-')
        _hora = _hora.split(':')
        nueva_fecha = datetime(
            int(_fecha[0]),
            int(_fecha[1]),
            int(_fecha[2]),
            int(_hora[0]),
            int(_hora[1]),
        )
        cierreBanco = obtenerCierre(cuentaBancaria, anio, mes, 0, nueva_fecha)
        if data['fecha']:
            data.pop('fecha')

        serializer = MovimientoSerializer(data=data)
        serializer.is_valid()
        ## VAlidación de cantidad de cajas chicas
        cantidad = Cierre.objects.filter(cuenta= usuario.cajachica, anulado=False, cerrado=False).count()
        if  1 < cantidad:
            raise ErrorDeUsuario("El usuario no puede tener más de dos cajas chicas abiertas.")

        ##Fin de la validación de cajas chicas
        movimiento = Movimiento.objects.create(
            moneda=cierreBanco.cuenta.moneda,
            usuario=usuario,
            proyecto=usuario.proyecto,
            fecha=nueva_fecha,
            **serializer.data)
        #Realiza un depósito a mi caja chica
        if micaja == True:
            cierreCaja = self.getCierreCChica(usuario.cajachica, anio, mes, True, movimiento, nueva_fecha)
        #REaliza un deposito
        else:
            usuarioAsignado = Usuario.objects.get(id=data.get('empleado'))
            cierreCaja = self.getCierreCChica(usuarioAsignado.cajachica, anio, mes, True, movimiento, nueva_fecha)
        tipos = [RETIRO, DEPOSITO]
        self.realizarMovDoble(usuario, usuario.cajachica.proyecto, cierreBanco, cierreCaja, data, tipos, movimiento)

    def getProyecto(self, usuario, data):
        if usuario.accesos.administrador==True or usuario.accesos.supervisor==True:
            if data.get('proyecto', None) is not None:
                proyecto = Proyecto.objects.get(id=data.get('proyecto'))
            else:
                proyecto = usuario.proyecto
        else:
            proyecto = usuario.proyecto
        return proyecto
    #Realiza un movimiento normal
    def realizarMovNormal(self,usuario, cuenta, mes, anio, data, tipo, banco=True, cierreCaja=0):
        if data.get('cuenta', None) is not None:
            data.pop('cuenta')
        if banco == True:
            cierre = self.getCierreBanco(cuenta,anio,mes)
        else:
            cierre = Cierre.objects.get(id=cierreCaja)
        if data.get('tipo', None) is not None:
            data.pop('tipo')
        serializer = MovimientoSerializer(data=data)
        serializer.is_valid()
        categoria = None
        if data.get('categoria', None) is not None:
            categoria = Categorias.objects.get(id=data.get('categoria'))
            data.pop('categoria')

        proyecto = self.getProyecto(usuario, data)
        if data.get('proyecto', None) is not None:
            data.pop('proyecto')

        persona = None
        if data.get('persona', None) is not None:
            persona = Usuario.objects.get(pk=data.get('persona'))
            data.pop('persona')
        proveedor = None
        if data.get('proveedor', None) is not None:
            proveedor = Proveedor.objects.get(pk=data.get('proveedor'))
            data.pop('proveedor')
        movimiento = Movimiento.objects.create(
            usuario=usuario,
            proyecto=proyecto,
            persona = persona,
            **serializer.data,
            categoria=categoria,
            proveedor=proveedor,
            moneda=cierre.cuenta.moneda
        )
        cierres = [cierre]
        if tipo in PASIVOS:
            saldo = calcularSaldo.calcularSaldo(cierre)
            if float(saldo) < float(movimiento.monto):
                raise ErrorDeUsuario('No tiene suficientes fondos para realizar el movimiento.')
        tipos = [tipo]
        self.guardarAfectados(cierres, tipos, movimiento)

    #Realiza un movimiento doble
    def realizarMovDoble(self, usuario, proyecto, cierre1, cierre2, data, tipos, movimiento=None):
        if data.get('tipo', None) is not None:
            data.pop('tipo')
        if movimiento is None:
            movimiento = Movimiento.objects.create(usuario=usuario, proyecto=proyecto, **data)
        movimiento.moneda = cierre1.cuenta.moneda
        movimiento.save()
        saldo = calcularSaldo.calcularSaldo(cierre1)
        if float(saldo) < float(movimiento.monto):
            raise ErrorDeUsuario('No tiene suficientes fondos para realizar el movimiento')
        #el cierre numero 1 es de donde se saca el dinero
        cierres = [cierre1, cierre2]
        self.guardarAfectados(cierres, tipos, movimiento)

    # REaliza los registros de afetados
    def guardarAfectados(self, cierres, tipos, movimiento):
        for x in range(0,len(cierres)):
            afectado = Afectados.objects.create(
                cierre=cierres[x],
                movimiento=movimiento,
                tipo=tipos[x]
            )
            afectado.save()


    #Crea o recupera un cierre de banco.
    def getCierreBanco(self, cuenta, anio, mes):
        cierreBanco = obtenerCierre(cuenta, anio, mes)
        return cierreBanco

    #Crea o recuepera un cierre para una cuenta de caja chica
    #Se define si se crea o se recupera por la variable depósito
    #Cuando se hace un depósito se crea un nuevo cierre

    def getCierreCChica(self, cuenta, anio, mes, deposito=False, movimiento=None, fecha_hora=None):
        #Si es un depósito solo crea el cierre
        if  deposito == True:
            #Verificación  que no exista una caja con la misma fecha y hora
            if fecha_hora is None:
                raise ErrorDeUsuario('Debe de selecionar una fecha y hora para depositar en caja.')
            _caja_verificada = Cierre.objects.filter(cuenta=cuenta, anulado=False, fechaInicio=fecha_hora).count()
            if _caja_verificada > 0:
                raise ErrorDeUsuario('La fecha de apertura de caja coincide con otra, por favor cambie la hora o la fecha.')
            cierreCChica = Cierre.objects.create(
                cuenta=cuenta,
                origen=movimiento
            )
            return cierreCChica
        #De lo contrario recupera el último cierre de caja
        cierreCChica = Cierre.objects.filter(
            cuenta=cuenta
        ).last()
        #Se verifica que exista un último elemento
        if cierreCChica is None:
            raise ErrorDeUsuario(
                'No se ha depositado dinero a la caja chica.')
        if cierreCChica.cerrado == True:
            raise ErrorDeUsuario('Se debe de realizar un nuevo depósito para registrar un gasto.')
        return cierreCChica

    # crea un cierre para un prestamo
    def getCierrePrestamo(self, cuenta, monto, descripcion):
        cierrePrestamo = Cierre.objects.create(
            cuenta=cuenta,
            inicio=monto,
            descripcion=descripcion
        )
        return cierrePrestamo


    #======= FIN DE LAS FUNCIONES AUXILIARES PARA CREAR MOVIMIENTOS===========



    @list_route(methods=["get"], url_path='listarGastos/(?P<cierre>[0-9]+)')
    def listarGastos(self, request, cierre=None, *args, **kwargs):
        try:
            DEPOSITO = 10
            GASTO = 20

            query = request.query_params
            mes = str(query.get('mes'))
            anio = str(query.get('anio'))
            user = self.request.user


            # Recupera los cierres seleccionados con las cuentas asignadas
            cierre = Cierre.objects.get(
                id=cierre,
            )

            # Recupera los movimientos que están dentro de las
            # cuentas asignadas al usuario que están dentro del
            # rango de cierre de caja
            movimientos = Movimiento.objects.filter(
                activo=True,
                afectados__cierre=cierre
            ).filter(
                Q(afectados__tipo=10) | Q(afectados__tipo=20)
            ).order_by('fecha').distinct()


            movimientos = self.filter_queryset(movimientos)


            # page = self.paginate_queryset(movimientos)
            # if page is not None:
            #     serializer = MovimientoReadSerializer(page, many=True, context={"request":cierre})
            #     return self.get_paginated_response(serializer.data)

            serializer = MovimientoReadSerializer(movimientos, many=True,context={"request":cierre})
            count = movimientos.count()
            data = serializer.data
            anterior = 0
            anterior = cierre.get_prev()

            if anterior is not None:
                if anterior.fin is not None:
                    anterior = anterior.fin
                else:
                    anterior =  calcularSaldo.calcularSaldo(anterior)
            data.insert(0, {'id':0, 'concepto':'Saldo de caja anterior', 'debe': anterior, 'haber':0, 'saldo':0})
            return Response({'results': data, 'count': count}, status=status.HTTP_200_OK)
        except Movimiento.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"], url_path='estadocuenta/(?P<id>[0-9]+)')
    def getEstadoCuenta(self, request, id=None, *args, **kwargs):
        try:
            query = request.query_params
            mes = str(query.get('mes'))
            anio = str(query.get('anio'))
            user = self.request.user

            if user.accesos.administrador == True:
                cuenta = id

            else:
                cuenta = Cuenta.objects.get(proyecto=user.proyecto, tipo=10)
            # Recupera los cierres seleccionados con las cuentas asignadas
            cierre = Cierre.objects.get(
                cuenta=cuenta,
                mes=mes,
                anio=anio
            )
            movimientos = Movimiento.objects.filter(
                afectados__cierre=cierre
            ).order_by("fecha")
            # Filtro para sin categorias
            if query.get('categoria') == '-1':
                movimientos = movimientos.filter(categoria__isnull=True)
            else:
                movimientos = self.filter_queryset(movimientos)

            serializer = MovimientoReadSerializer(movimientos, many=True, context={"request":cierre})

            #Verificación del saldo anterior para colocarlo en la primera fila de la tabla
            anterior = cierre.get_prev()

            inicio = cierre.inicio

            if anterior is not None:
                if cierre.cuenta.tipo == tiposcuentas.BANCO:
                    inicio = calcularSaldo.calcularSaldo(anterior)

            #Fin de la verificación de saldo anterior


            data = serializer.data
            data.insert(0, {'id':0, 'concepto':'Saldo anterior', 'debe': inicio, 'haber':0, 'saldo':0})
            count = movimientos.count()
            return Response({'results': data, 'count': count}, status=status.HTTP_200_OK)
        except Movimiento.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)
        except Cierre.DoesNotExist:
            data = []
            fechaNuevo = date(int(anio), int(mes), 1)
            cierreAnterior =  Cierre.objects.filter(cuenta=cuenta, anulado=False, fechaInicio__lt=fechaNuevo).order_by('-fechaInicio')[:2]
            cierreAnterior = cierreAnterior.first()

            inicio = 0
            if cierreAnterior is not None:
                if cierreAnterior.cuenta.tipo == tiposcuentas.BANCO:
                    inicio = calcularSaldo.calcularSaldo(cierreAnterior)

            data.insert(0, {'id':0, 'concepto':'Saldo anterior', 'debe': inicio, 'haber':0, 'saldo':0})
            return Response({'results': data, 'count': 0}, status=status.HTTP_200_OK)


    @list_route(methods=["get"], url_path='estadoprestamo/(?P<id>[0-9]+)')
    def getEstadoPrestamo(self, request, id=None, *args, **kwargs):
        try:
            query = request.query_params

            cuenta = id
            # Recupera los cierres seleccionados con las cuentas asignadas
            cierre = Cierre.objects.get(
                id=cuenta
            )
            movimientos = Movimiento.objects.filter(
                afectados__cierre=cierre
            ).order_by("fecha")
            movimientos = self.filter_queryset(movimientos)

            serializer = MovimientoReadSerializer(movimientos, many=True,context={"request":cierre})
            count = movimientos.count()
            return Response({'results': serializer.data, 'count': count}, status=status.HTTP_200_OK)
        except Movimiento.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)
        except Cierre.DoesNotExist:
            return Response({'results': [], 'count': 0}, status=status.HTTP_200_OK)

    @list_route(methods=["put"], url_path="reintegro/(?P<id>[0-9]+)")
    def reintegro(self, request, id=None, *args, **kwargs):
        data = request.data
        usuario = self.request.user
        try:
            with transaction.atomic():
                cierre = Cierre.objects.get(id=id)
                if cierre.cuenta.tipo != tiposcuentas.CAJACHICA:
                    raise ErrorDeUsuario("La cuenta debe ser de caja chica.")
                afectado = Afectados.objects.get(movimiento=cierre.origen, cierre__cuenta__tipo=10)
                cuentaBanco = afectado.cierre.cuenta

                #Recuperando fecha de cierr
                fecha = datetime.strptime(data.get('fecha'), '%Y-%m-%d')
                mes = fecha.month
                anio = fecha.year

                cierreBanco = self.getCierreBanco(cuentaBanco, anio, mes)

                movimiento = Movimiento.objects.create(
                    usuario=usuario,
                    proyecto=cuentaBanco.proyecto,
                    formaPago=DEPOSITO,
                    destino=Movimiento.REINTEGRO,
                    concepto=data.get('concepto'),
                    monto=data.get('monto'),
                    fecha=data.get('fecha'),
                    moneda=cierreBanco.cuenta.moneda
                )
                saldo = round(calcularSaldo.calcularSaldo(cierre),2)
                if float(saldo) < float(movimiento.monto):
                    raise ErrorDeUsuario('No se puede hacer un reintegro mayor al saldo de la caja.')
                if float(saldo) == float(movimiento.monto):
                    cierre.usuarioCierre = usuario
                    cierre.cerrado = True
                    cierre.fin = 0
                    cierre.save()
                cierres = [cierre, cierreBanco]
                tipos = [GASTO,DEPOSITO]
                self.guardarAfectados(cierres, tipos, movimiento)
                return Response({'detail':'Se ha hecho el reintegro.'}, status=status.HTTP_200_OK)
        except Cierre.DoesNotExist:
            return Response({'detail':'No existe el cierre'}, status=status.HTTP_400_BAD_REQUEST)
        except Afectados.DoesNotExist:
            return Response({'detail':'No hay una cuenta de banco a depositar.'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response( {'detail':str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["put"])
    def comentar(self,request, *args, **kwargs):
        data = request.data

        try:
            for comentario in data.get('comentarios'):
                if(comentario.get('id', 0) != 0):
                    movimiento = Movimiento.objects.get(pk=comentario.get('id'))
                    serializer = MovimientoComentarioSerializer(movimiento, data=comentario, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

            return Response({'detail': 'Se ha agregado correctamente.'}, status=status.HTTP_200_OK)
        except serializers.ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response( {'detail':str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Movimiento.DoesNotExist:
            return Response({'detail': 'El movimiento a anular no existe.'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["put"], url_path="anularmovimiento/(?P<id>[0-9]+)")
    def anularMovimiento(self, request, id=None, *args, **kwargs):
        data = request.data
        query = request.query_params
        caja = query.get('caja', None)
        usuario = request.user
        try:
            movimiento = Movimiento.objects.get(id=id)
            with transaction.atomic():
                serializer = AnularMovimientoSerializer(data=data)
                if (serializer.is_valid()):
                    afectados = movimiento.afectados.all()
                    for afectado in afectados:
                        if afectado.cierre.cerrado == True:
                            raise ErrorDeUsuario('Este movimiento no se puede anular.')
                        #se verifica si la cuenta del cierre es de caja chica
                        if caja is None and afectado.cierre.cuenta.tipo == Cuenta.CAJACHICA:
                            movimientosCaja = Afectados.objects.filter(
                                cierre=afectado.cierre,
                                cierre__cuenta__tipo=Cuenta.CAJACHICA,
                                tipo=20, movimiento__anulado=False).count()
                            if 0 < movimientosCaja:
                                raise ErrorDeUsuario('No se puede anular porque la caja ya tiene gastos registrados.')
                            cierre = afectado.cierre
                            cierre.usuarioCierre = usuario
                            cierre.justificacion = data.get('justificacion')
                            cierre.cerrado = True
                            cierre.anulado = True
                            cierre.save()
                        #Verificación de una cuenta de deuda

                    try:
                        cierre_prestamo = movimiento.cierre_prestamo
                        movimientos_cierre = Afectados.objects.filter(
                            cierre=cierre_prestamo,
                            cierre__cuenta__tipo=Cuenta.DEUDA,
                            movimiento__anulado=False).count()
                        if 0 < movimientos_cierre:
                            raise ErrorDeUsuario('No se puede anular, el prestamo ya tiene pagos.')
                            # return Response({'detail': 'No se puede anular, el prestamo ya tiene pagos.'}, status=status.HTTP_400_BAD_REQUEST)
                        if movimiento.cierre_prestamo.cuenta.tipo == Cuenta.DEUDA:
                            cierre_prestamo.justificacion = data.get('justificacion')
                            cierre_prestamo.anulado = True
                            cierre_prestamo.cerrado = True
                            cierre_prestamo.save()
                    except Cierre.DoesNotExist:
                        pass
                    #se cambia el estado de pago completo si tuvo una anulación de un pago
                    orden=movimiento.orden
                    if orden:
                        if orden.es_oc==True or orden.es_ov==True: 
                            orden.pago_completo=False
                            orden.save()

                    if movimiento.cierre_ventas:
                        fecha = str(movimiento.fecha)
                        anio = fecha[0: 4]
                        mes = fecha[5: 7]
                        #pago = Movimiento(
                            #monto=movimiento.monto,
                            #usuario=movimiento.usuario,
                            #proyecto=movimiento.usuario.proyecto,
                            #formaPago=movimiento.formaPago,
                            #fecha=fecha,
                            #concepto="Anulacion de cierre",
                            #moneda=movimiento.moneda)
                        #pago.save()
                        #self.registrarAfectado(movimiento.usuario.caja_venta, anio, mes, pago, pago.monto)

                        movimeintos_pagos = Movimiento.objects.filter(ventas_ids=movimiento)
                        for ventas_pago in movimeintos_pagos:
                            ventas_pago.ventas_ids = None
                            ventas_pago.deposito = False
                            ventas_pago.save()

                        cierreeee = Cierre.objects.get(movimiento_cierre=movimiento)
                        cierreeee.anulado = True
                        cierreeee.save()

                        afectados_array = Afectados.objects.filter(
                            cierre=cierreeee,
                            movimiento__anulado=False,
                            tipo=Afectados.VENTA
                        )

                        movimeintos_pendientes = []

                        for item_afectado in afectados_array:
                            movimeintos_pendientes.append(item_afectado.movimiento)
                            item_afectado.delete()
                            self.registrarAfectado(
                                movimiento.usuario.caja_venta,
                                anio,
                                mes,
                                item_afectado.movimiento,
                                item_afectado.movimiento.monto
                            )

                    movimiento.justificacion = data.get('justificacion')
                    movimiento.delete()
                    return Response({'detail': 'El movimiento se ha anulado.'}, status=status.HTTP_200_OK)
                else:
                    raise ErrorDeUsuario(serializer.errors)
        except serializers.ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response( {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Movimiento.DoesNotExist:
            return Response({'detail': 'El movimiento a anular no existe.'}, status=status.HTTP_400_BAD_REQUEST)

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
            afectado = Afectados(cierre=cierre, movimiento=pago, tipo=Afectados.DEPOSITO)
            afectado.save()
            return True



    @list_route(methods=["put"], url_path="anularPrestamo/(?P<id>[0-9]+)")
    def anularPrestamo(self, request, id=None, *args, **kwargs):
        cuenta = id
        data = request.data
        # Recupera los cierres seleccionados con las cuentas asignadas

        try:
            if data.get('justificacion', None) is None:
                raise ErrorDeUsuario('Debe de ingresar una justificación de anulación.')
            with transaction.atomic():
                cierre = Cierre.objects.get(
                    id=cuenta
                )
                movimientoPrestamo = cierre.cuenta.movimientoPrestamo
                afectados = movimientoPrestamo.afectados.all()
                for afectado in afectados:
                    if afectado.cierre.cerrado == True:
                        raise ErrorDeUsuario('Este movimiento no se puede anular, el periodo {}-{} de la cuenta {} ha sido cerrado .'.format(
                            afectado.cierre.mes,
                            afectado.cierre.anio,
                            afectado.cierre.cuenta.nombre
                        ))

                cierre.justificacion = data.get('justificacion')
                cierre.anulado= True
                cierre.cerrado=True
                cierre.save()
                movimientos = Movimiento.objects.filter(
                    afectados__cierre=cierre
                )

                if movimientos.count():
                    raise ErrorDeUsuario("Ya existen abonos al préstamo, no se puede anular.")
                movimiento = cierre.cuenta.movimientoPrestamo
                movimiento.anulado = True
                movimiento.justificacion = data.get('justificacion')
                movimiento.save()

                cuenta = cierre.cuenta
                cuenta.estado = False
                cuenta.save()
                return Response({'detail': 'Se ha anulado el prestamo'})
            return Response({'detail': 'No se logró anular el prestamo.'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

