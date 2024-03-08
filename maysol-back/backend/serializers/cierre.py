from backend.models import Cierre, Cuenta
from rest_framework import serializers
from backend.utils import calcularSaldo
from backend.models.afectados import Afectados
from backend.models.movimiento import Movimiento
from backend.serializers.movimiento import MovimientoReadSerializer, MovimientoSerializer, MovimientoSerializerDepositos
from django.db.models import Q
from maysol import settings
from backend.utils.monedas import MONEDAS


class CierreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cierre
        fields = [
            'id',
            'inicio',
            'fin',
            'mes',
            'anio',
            'cerrado',
            'archivo',
            'usuarioCierre'
        ]

class PrestamoReadSerializer(serializers.ModelSerializer):
    acreedor = serializers.ReadOnlyField(source="cuenta.proyecto.nombre")
    deudor = serializers.ReadOnlyField(source="cuenta.deudor.nombre")
    saldo = serializers.SerializerMethodField("getSaldo")
    class Meta:
        model = Cierre
        fields = [
            'id',
            'inicio',
            'fin',
            'mes',
            'anio',
            'cerrado',
            'acreedor',
            'deudor',
            'cuenta',
            'fechaInicio',
            'descripcion',
            'saldo'
        ]

    def getSaldo(self, obj):
        saldo = calcularSaldo.calcularSaldo(obj)
        return saldo

class CierreResumenSerializer(serializers.ModelSerializer):
    saldo = serializers.SerializerMethodField("getSaldo")
    ingresos = serializers.SerializerMethodField("getIngresos")
    egresos = serializers.SerializerMethodField("getEgresos")
    nombre = serializers.ReadOnlyField(source="cuenta.nombre")
    documento = serializers.SerializerMethodField('getDocumento')
    duenio = serializers.SerializerMethodField('getDuenio')
    usuarioCierre = serializers.SerializerMethodField("getUsuarioCierre")
    simbolo = serializers.SerializerMethodField("getSimbolo")
    class Meta:
        model = Cierre
        fields = [
            'id',
            'inicio',
            'fin',
            'mes',
            'anio',
            'cerrado',
            'cuenta',
            'fechaInicio',
            'descripcion',
            'saldo',
            'ingresos',
            'egresos',
            'nombre',
            'archivo',
            'documento',
            'ext',
            'duenio',
            'simbolo',
            'usuarioCierre',
            'fechaCierre'
        ]
    def getSimbolo(self, obj):
        simbolo = MONEDAS[obj.cuenta.moneda]["signo"]
        return simbolo

    def getUsuarioCierre(self, obj):
        try:
            usuario = obj.usuarioCierre
            if usuario is not None:
                nombre = usuario.first_name
                apellido = usuario.last_name
                return "{} {}".format(nombre, apellido)
        except:
            return ''
    def getSaldo(self, obj):
        saldo = calcularSaldo.calcularSaldo(obj)
        return saldo
    def getIngresos(self, obj):
        return self.context['ingresos']
    def getEgresos(self, obj):
        return self.context['egresos']
    def getDocumento(self, obj):
        return  '%s%s' % (settings.MEDIA_URL, obj.archivo)
    def getDuenio(self, obj):
        try:
            usuario = obj.cuenta.usuario
            if usuario is not None:
                nombre = usuario.first_name
                apellido = usuario.last_name
                return "{} ".format(nombre)
        except:
            return ''

class HistoricoSerializer(serializers.ModelSerializer):
    usuario = serializers.SerializerMethodField("getUsuarioCierre")
    movimientos = serializers.SerializerMethodField("getMovimientos")
    deposita = serializers.SerializerMethodField("getDeposita")
    anterior = serializers.SerializerMethodField("getAnterior")
    deudor = serializers.ReadOnlyField(source="cuenta.deudor.nombre")
    acreedor = serializers.ReadOnlyField(source="cuenta.proyecto.nombre")
    noDocumento = serializers.SerializerMethodField()
    fin = serializers.SerializerMethodField()
    class Meta:
        model = Cierre
        fields = [
            'id',
            'inicio',
            'fin',
            'mes',
            'anterior',
            'anio',
            'cerrado',
            'cuenta',
            'fechaInicio',
            'descripcion',
            'fechaCierre',
            'usuario',
            'movimientos',
            'deposita',
            'deudor',
            'acreedor',
            'fechaCierre',
            'justificacion',
            'anulado',
            'noDocumento'
        ]
    def get_noDocumento(self, obj):
        documento = ''
        try:
            documento = '{} - {}'.format(
                obj.origen.get_formaPago_display(),
                obj.origen.noDocumento
            )
        except:
            pass
        return documento
    def get_fin(self, obj):
        if obj.fin:
            return round(obj.fin, 2)
        return 0
    def getAnterior(self,obj):
        anterior = obj.get_prev()
        if anterior is not None:
            if anterior.fin is not None:
                return round(anterior.fin,2)
            return 0
        return 0
    def getUsuarioCierre(self, obj):
        try:
            nombre = obj.usuarioCierre.first_name + " " + obj.usuarioCierre.last_name
        except:
            nombre = ''
        return nombre
    def getMovimientos(self, obj):
        movimientos = Movimiento.objects.filter(
            activo=True,
            afectados__cierre=obj
        ).filter(
            Q(afectados__tipo=10) | Q(afectados__tipo=20) |
            Q(afectados__tipo=Afectados.GASTODEUDA) |
            Q(afectados__tipo=Afectados.PAGODEUDA) |
            Q(afectados__tipo=Afectados.RETIROPRESTAMO) |
            Q(afectados__tipo=Afectados.DEPOSITOPRESTAMO)
        ).order_by('fecha').distinct()

        serializer = MovimientoReadSerializer(movimientos, many=True,context={"request":obj})
        anterior = 0
        anterior = obj.get_prev()

        if anterior is not None:
            if anterior.fin is not None:
                anterior = anterior.fin
            else:
                anterior = 0
        data = serializer.data
        data.insert(0, {'id':0, 'concepto':'Saldo de caja anterior', 'debe': anterior, 'haber':0, 'saldo':0})
        return data

    def getDeposita(self, obj):
        nombre = obj.origen.usuario.first_name
        apellido = obj.origen.usuario.last_name
        return "{} {}".format(nombre, apellido)

########################################################
## Descripción: SErializer para histórico de venta
########################################################

class HistoricoVentaSerializer(serializers.ModelSerializer):
    movimientos = serializers.SerializerMethodField()
    usuario_cuenta = serializers.SerializerMethodField()
    cobrado = serializers.SerializerMethodField()
    edit = serializers.SerializerMethodField()
    banco = serializers.SerializerMethodField()
    class Meta:
        model = Cierre
        fields = [
            'id',
            'inicio',
            'fin',
            'mes',
            'anio',
            'usuario_cuenta',
            'cerrado',
            'cuenta',
            'creado',
            'modificado',
            'fechaInicio',
            'descripcion',
            'usuarioCierre',
            'fechaCierre',
            'cobrado',
            'movimientos',
            'edit',
            'banco',
        ]

    def get_banco(self, cierre):
        return cierre.movimiento_cierre.afectados.all()[0].cierre.cuenta.nombre
    def get_cobrado(self, cierre):
        afectados = cierre.movimiento_cierre.movimiento_hijo.all()
        if afectados is not None:
            saldo = cierre.movimiento_cierre.monto
        else:
            saldo = calcularSaldo.calcularSaldoVenta(cierre)
        return saldo
    def get_usuario_cuenta(self, cierre):
        return cierre.cuenta.caja_venta.first_name
    def get_edit(self, cierreobj):
        movimientos = cierreobj.movimiento_cierre
        serializer = MovimientoSerializer(movimientos)
        return serializer.data
    def get_movimientos(self, cierre):
        afectados = cierre.movimiento_cierre.movimiento_hijo.all()
        data = []
        if afectados is not None and len(afectados) > 0:
            for _afectado in afectados:
                serializer = MovimientoSerializerDepositos(_afectado, context={"request":cierre})
                data.append(serializer.data)
        else:
            afectados = cierre.movimientos.all()
            for _afectado in afectados:
                serializer = MovimientoReadSerializer(_afectado.movimiento, context={"request": cierre})
                data.append(serializer.data)
        return data
