from datetime import datetime, timedelta, timezone, date

from backend.models import Cuenta, Movimiento, Cierre
from django.db.models.functions import Coalesce
from django.db.models import Sum, Q
from rest_framework import serializers
from backend.utils import tiposcuentas, calcularSaldo
from backend.utils.monedas import MONEDAS
from backend.models import Usuario

class CuentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuenta
        fields = [
            'id',
            'numero',
            'nombre',
            'banco',
            'tipo',
            'moneda'
        ]

class CuentaPrestamoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuenta
        fields = [
            'deudor',
            'saldo'
        ]
    def get_fields(self):
        fields = super(CuentaPrestamoSerializer, self).get_fields()
        for field in fields.values():
            field.required = True
        return fields


class CuentaReadSerializer(serializers.ModelSerializer):
    tipo = serializers.SerializerMethodField("getTipo")
    simbolo = serializers.SerializerMethodField("getSimbolo")
    saldo = serializers.SerializerMethodField("getSaldo")
    inicio = serializers.SerializerMethodField("getInicio")
    fecha = serializers.SerializerMethodField("getFecha")
    class Meta:
        model = Cuenta
        fields = [
            'id',
            'numero',
            'nombre',
            'banco',
            'tipo',
            'moneda',
            'simbolo',
            'saldo',
            'inicio',
            'fecha',
            'estado'
        ]
    def getSaldo(self, obj):
        cierre = Cierre.objects.filter(cuenta=obj, anulado=False).order_by('-fechaInicio').first()
        saldo = 0
        if cierre is not None:
            saldo = calcularSaldo.calcularSaldo(cierre)
        saldo = round(saldo, 2) if saldo else 0
        return saldo
    def getInicio(self, obj):
        cierre = Cierre.objects.filter(cuenta=obj, anulado=False).order_by('-id').first()
        saldo = 0
        if cierre is not None:
            saldo = cierre.inicio
        saldo = round(saldo, 2) if saldo else 0
        return saldo
    def getFecha(self, obj):
        cierre = Cierre.objects.filter(cuenta=obj, anulado=False).order_by('-id').first()
        fecha = None
        if cierre is not None:
            fecha = cierre.fechaInicio
        return fecha
    def getSimbolo(self, obj):
        simbolo = MONEDAS['GTQ']['signo']
        try:
            simbolo = MONEDAS[obj.moneda]["signo"]
        except:
            pass
        return simbolo

    def getTipo(self, obj):
        tipo = 'Caja chica'
        if obj.tipo == tiposcuentas.BANCO:
            tipo = 'Banco'
        elif obj.tipo == tiposcuentas.DEUDA:
            tipo = 'Deuda'
        elif obj.tipo == tiposcuentas.SUBPROYECTO:
            tipo = "Sub proyecto"
        return tipo



class CuentaVentaReadSerializer(serializers.ModelSerializer):
    simbolo = serializers.SerializerMethodField("getSimbolo")
    saldo = serializers.SerializerMethodField("getSaldo")
    saldoUser = serializers.SerializerMethodField("getSaldoUser")
    inicio = serializers.SerializerMethodField("getInicio")
    dias7 = serializers.SerializerMethodField("get7Dias")
    dias15 = serializers.SerializerMethodField("get15Dias")
    mes = serializers.SerializerMethodField("getMes")
    class Meta:
        model = Cuenta
        fields = [
            'id',
            'numero',
            'nombre',
            'banco',
            'tipo',
            'moneda',
            'simbolo',
            'saldo',
            'inicio',
            'estado',
            'dias7',
            'dias15',
            'mes',
            'saldoUser'
        ]
    def getSaldoUser(self, obj):
        #cierre = Cierre.objects.filter(cuenta_id=self.context.get("cuenta")).order_by('-id').first()
        saldo=0
        if self.context.get("cuenta") is not None:
            cuenta=self.context.get("cuenta")
        else:
            cuenta=obj.id
        user=Usuario.objects.get(caja_venta=cuenta)
        data = Movimiento.objects.filter(Q(formaPago=Movimiento.EFECTIVO) | Q(formaPago=Movimiento.CHEQUE),
                                         usuario=user, deposito=False, anulado=False, orden__es_ov=True,
                                         ).exclude(orden__isnull=True).all().order_by('-fecha').aggregate(Sum("monto"))
        saldo=data['monto__sum']
        return saldo

    def getSaldo(self, obj):
        saldo=0
        user=Usuario.objects.get(caja_venta=obj.id)
        data = Movimiento.objects.filter(Q(formaPago=Movimiento.EFECTIVO) | Q(formaPago=Movimiento.CHEQUE),
                                         usuario=user, deposito=False, anulado=False, orden__es_ov=True,
                                         ).exclude(orden__isnull=True).all().order_by('-fecha').aggregate(Sum("monto"))
        saldo=data['monto__sum']
        return saldo
    def get7Dias(self, obj):
        fecha_inicial = datetime.today()
        fecha_final = fecha_inicial - timedelta(days=7)
        fecha_inicial = fecha_inicial.replace(hour=23, minute=59, second=59, microsecond=999999)
        fecha_final = fecha_final.replace(hour=00, minute=00, second=00, microsecond=000000)
        saldo = 0.0
        if self.context.get("user")is not None:
            cuenta=self.context.get("user")
        else:
            cuenta=Usuario.objects.get(caja_venta=obj.id)
        try:
            cierre = Movimiento.objects.filter(
                creado__lte=fecha_inicial,
                creado__gte=fecha_final,
                usuario_id=cuenta,
                pago_completo=False,
                es_ov=True,
                anulado=False,
                activo=True
            ).annotate(
                sumaPagos=Coalesce(Sum('movimiento__monto', filter=Q(movimiento__anulado=False)), 0)
            ).aggregate(
                Sum('monto'),
                Sum('sumaPagos')
            )
            saldo = cierre.get("monto__sum") - cierre.get("sumaPagos__sum")
        except Exception as e:
            print(f"\n\n\n\n\n\n\n\n{e}\n\n\n\n\n\n\n\n\n")
            saldo = 0
        return saldo
    def get15Dias(self, obj):
        fecha_inicial = datetime.today() - timedelta(days=8)
        fecha_final = fecha_inicial - timedelta(days=7)
        fecha_inicial = fecha_inicial.replace(hour=23, minute=59, second=59, microsecond=999999)
        fecha_final = fecha_final.replace(hour=00, minute=00, second=00, microsecond=000000)
        saldo = 0.0
        if self.context.get("user")is not None:
            cuenta=self.context.get("user")
        else:
            cuenta=Usuario.objects.get(caja_venta=obj.id)
        try:
            cierre = Movimiento.objects.filter(
                creado__lte=fecha_inicial,
                creado__gte=fecha_final,
                usuario=cuenta,
                pago_completo=False,
                es_ov=True,
                anulado=False,
                activo=True
            ).annotate(
                sumaPagos=Coalesce(Sum('movimiento__monto', filter=Q(movimiento__anulado=False)), 0)
            ).aggregate(
                Sum('monto'),
                Sum('sumaPagos')
            )
            saldo = cierre.get("monto__sum") - cierre.get("sumaPagos__sum")
        except:
            saldo = 0
        return saldo
    def getMes(self, obj):
        fecha_inicial = datetime.today() - timedelta(days=16)
        fecha_inicial = fecha_inicial.replace(hour=23, minute=59, second=59, microsecond=999999)
        saldo = 0.0
        if self.context.get("user")is not None:
            cuenta=self.context.get("user")
        else:
            cuenta=Usuario.objects.get(caja_venta=obj.id)
        try:
            cierre = Movimiento.objects.filter(
                creado__lte=fecha_inicial,
                usuario=cuenta,
                pago_completo=False,
                es_ov=True,
                anulado=False,
                activo=True
            ).annotate(
                sumaPagos=Coalesce(Sum('movimiento__monto', filter=Q(movimiento__anulado=False)), 0)
            ).aggregate(
                Sum('monto'),
                Sum('sumaPagos')
            )
            saldo = cierre.get("monto__sum") - cierre.get("sumaPagos__sum")
        except:
            saldo = 0
        return saldo
    def getInicio(self, obj):
        cierre = Cierre.objects.filter(cuenta=obj).order_by('-id').first()
        saldo = 0
        if cierre is not None:
            saldo = cierre.inicio
        return saldo
    def getSimbolo(self, obj):
        simbolo = MONEDAS['GTQ']['signo']
        try:
            simbolo = MONEDAS[obj.moneda]["signo"]
        except:
            pass
        return simbolo
