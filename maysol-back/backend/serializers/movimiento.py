from backend.models import Movimiento, Afectados, Proveedor
from rest_framework import serializers
from rest_framework.serializers import ValidationError
from backend.serializers import UserMinReadSerializer, CuentaReadSerializer
import datetime
from backend.utils import mensajesDetalle

class MovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'usuario',
            'destino',
            'formaPago',
            'proveedor',
            'noDocumento',
            'noComprobante',
            'concepto',
            'depositante',
            'prestamo',
            'monto',
            'fecha',
            'vehiculo',
            'persona',
            'justificacion',
            'categoria',
            'comentario',
            'plazo',
            'fecha_inicio_recuperacion',
            'fecha_final_recuperacion',
            'categoria_recuperacion',
        ]
        extra_kwargs = {
            'fecha' : {'required':False}
        }
    # def get_fields(self):
    #     fields = super(MovimientoSerializer, self).get_fields()
    #     for field in fields.values():
    #         field.required = True
    #     return fields

class MovimientoUserlSerializer(serializers.ModelSerializer):
    usuario = serializers.SerializerMethodField("getName")
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'usuario',
            'destino',
            'formaPago',
            'proveedor',
            'noDocumento',
            'noComprobante',
            'concepto',
            'depositante',
            'prestamo',
            'monto',
            'fecha',
            'vehiculo',
            'persona',
            'justificacion',
            'categoria',
            'comentario',
            'plazo',
            'fecha_inicio_recuperacion',
            'fecha_final_recuperacion',
            'categoria_recuperacion',
        ]
        extra_kwargs = {
            'fecha' : {'required':False}
        }
    def getName(self, obj):
        if obj.orden is not None:
            cliente = Proveedor.objects.get(pk=obj.orden.proveedor_id)
            return cliente.nombre
        else:
            return ""
    # def get_fields(self):
    #     fields = super(MovimientoSerializer, self).get_fields()
    #     for field in fields.values():
    #         field.required = True
    #     return fields

class MovimientoSerializerDepositos(serializers.ModelSerializer):
    boleta = serializers.SerializerMethodField("getBoleta")
    cliente = serializers.SerializerMethodField("getPersona")
    empresa = serializers.SerializerMethodField("getEmpresa")
    usuario = serializers.SerializerMethodField("getUsuario")
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'destino',
            'formaPago',
            'noDocumento',
            'noComprobante',
            'boleta',
            'concepto',
            'depositante',
            'prestamo',
            'monto',
            'fecha',
            'vehiculo',
            'cliente',
            'empresa',
            'justificacion',
            'categoria',
            'comentario',
            'plazo',
            'fecha_inicio_recuperacion',
            'fecha_final_recuperacion',
            'categoria_recuperacion',
            'usuario',
        ]
        extra_kwargs = {
            'fecha' : {'required':False}
        }
    def getEmpresa(self, obj):
        if obj.proyecto.empresa:
            empresa = obj.proyecto.empresa.nombre
        else:
            empresa = obj.proyecto.nombre
        return empresa
    def getUsuario(self, obj):
        return obj.usuario.first_name + obj.usuario.last_name
    def getPersona(self, obj):
        return obj.orden.proveedor.nombre
    def getBoleta(self, obj):
        if obj.ventas_ids:
            boleta = obj.ventas_ids.noDocumento
        elif obj.noComprobante:
            boleta = obj.noComprobante
        else:
            boleta = None
        return boleta

class AnularMovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = [
            'justificacion'
        ]
    def get_fields(self):
        fields = super(AnularMovimientoSerializer, self).get_fields()
        for field in fields.values():
            field.required = True
        return fields

class MovimientoNormalSerializer(serializers.ModelSerializer):
    cf = serializers.ReadOnlyField(source="categoria.cf")
    pl = serializers.ReadOnlyField(source="categoria.pl")
    destino = serializers.SerializerMethodField("getDestino")
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'usuario',
            'proveedor',
            'noDocumento',
            'noComprobante',
            'depositante',
            'concepto',
            'justificacion',
            'anulado',
            'monto',
            'categoria',
            'comentario',
            'fecha',
            'destino',
            'cf',
            'pl',
            'moneda'
        ]

    def getDestino(self, obj):
        if obj.destino == Movimiento.CAJACHICA:
            try:
                mensaje = "Caja chica: {}".format(obj.cierre.cuenta.usuario.first_name)
            except Exception:
                mensaje = 'Caja chica'
            return mensaje
        elif obj.destino == Movimiento.PAGOPROVEEDOR:
            return "Proveedor: {}".format(obj.proveedor)
        elif obj.destino == Movimiento.PROYECTO:
            return "Proyecto: {}".format(obj.proyecto.nombre)
        elif obj.destino == Movimiento.REINTEGRO:
            return "Reintegro"
        return "--"
class MovimientoReadSerializer(serializers.ModelSerializer):
    nombrePago = serializers.SerializerMethodField("getformaPago")
    descDestino = serializers.SerializerMethodField("getDestino")
    debe = serializers.SerializerMethodField("getDebe")
    haber = serializers.SerializerMethodField("getHaber")
    nombreCategoria = serializers.ReadOnlyField(source="categoria.nombre")
    idcategoria = serializers.ReadOnlyField(source="categoria.id")
    proyectoAfectado = serializers.ReadOnlyField(source="proyecto.nombre")
    proyectoDuenio = serializers.SerializerMethodField("getProyectoDuenio")
    usuarioDuenio = serializers.SerializerMethodField("getNombreDuenio")
    cf = serializers.ReadOnlyField(source="categoria__cf")
    pl = serializers.ReadOnlyField(source="categoria__pl")
    categoria_recuperacion = serializers.SerializerMethodField("getRecuperacion")
    cliente = serializers.SerializerMethodField()
    monto = serializers.SerializerMethodField()
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'cliente',
            'usuario',
            'formaPago',
            'proveedor',
            'noDocumento',
            'noComprobante',
            'depositante',
            'concepto',
            'nombrePago',
            'justificacion',
            'destino',
            'descDestino',
            'anulado',
            'monto',
            'fecha',
            'categoria',
            'comentario',
            'vehiculo',
            'persona',
            'proyecto',
            'plazo',
            'debe',
            'haber',
            'idcategoria',
            'proyectoAfectado',
            'proyectoDuenio',
            'usuarioDuenio',
            'cf',
            'pl',
            'nombreCategoria',
            'fecha_inicio_recuperacion',
            'fecha_final_recuperacion',
            'categoria_recuperacion'
        ]
    def get_monto(self, obj):
        return round(obj.monto, 2)
    def getRecuperacion(self, obj):
        try:
            if obj.categoria.pl >= 159:
                return obj.categoria.pl
        except:
            return None
    def get_cliente(self, obj):
        cliente = ''
        if obj.orden:
            if obj.orden.proveedor:
                cliente = obj.orden.proveedor.nombre
        return cliente
    def  getProyectoDuenio(self, obj):
        cierre = self.context['request']
        afectado = obj.afectados.get(cierre=self.context['request'])
        try:
            proyecto = cierre.cuenta.proyecto.nombre
        except:
            proyecto = ''
        return proyecto

    def getNombreDuenio(self, obj):
        try:
            nombre = obj.usuario.first_name
            apellido = obj.usuario.last_name
            return "{} {}".format(nombre, apellido)
        except:
            return "--"

        return 0.0
    def getDebe(self, obj):
        DEPOSITO = 10 # (+)
        PAGODEUDA = 50 #(+)
        DEPOSITOPRESTAMO = 70 #(+)
        afectado = obj.afectados.get(cierre=self.context['request'])
        if afectado.tipo ==  DEPOSITO or afectado.tipo == PAGODEUDA or afectado.tipo == DEPOSITOPRESTAMO or afectado.tipo == Afectados.VENTA:
            return round(obj.monto,2) if obj.monto else 0
        return 0.00
    def getHaber(self, obj):

        GASTO = 20 # (-)
        RETIRO = 30 # (-)
        GASTODEUDA = 40 #(-)
        RETIROPRESTAMO = 60 #(-)
        afectado = obj.afectados.get(cierre=self.context['request'])
        if afectado.tipo ==  GASTO or afectado.tipo == RETIRO or afectado.tipo == GASTODEUDA or afectado.tipo == RETIROPRESTAMO:
            return round(obj.monto,2) if obj.monto else 0
        return 0.00

    def getDestino(self, obj):
        if obj.destino == Movimiento.CAJACHICA:
            try:
                mensaje = "Caja chica: {}".format(obj.cierre.cuenta.usuario.first_name)
            except Exception:
                mensaje = 'Caja chica'
            return mensaje
        elif obj.destino == Movimiento.PAGOPROVEEDOR:
            return "Proveedor: {}".format(obj.proveedor)
        elif obj.destino == Movimiento.PROYECTO:
            return "Proyecto: {}".format(obj.proyecto.nombre)
        elif obj.destino == Movimiento.REINTEGRO:
            return "Reintegro"
        return "--"

    def getformaPago(self,obj):
        mensaje = ''
        try:
            mensaje = str(obj.get_formaPago_display()).lower()
        except:
            mensaje = '--'
        return mensaje

class AnularMovimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = [
            'justificacion'
        ]
    def get_fields(self):
        fields = super(AnularMovimientoSerializer, self).get_fields()
        for field in fields.values():
            field.required = True
        return fields

class MovimientoComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = [
            'categoria',
            'comentario',
            'plazo'
        ]
class MovimientoReadCuentaSerializer(serializers.ModelSerializer):
    formaPago = serializers.SerializerMethodField("getformaPago")
    destino = serializers.SerializerMethodField("getDestino")
    descripcion = serializers.SerializerMethodField("getDescripcion")
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'usuario',
            'formaPago',
            'proveedor',
            'noDocumento',
            'noComprobante',
            'depositante',
            'concepto',
            'justificacion',
            'destino',
            'anulado',
            'monto',
            'fecha',
            'descripcion'
        ]

    def  getDescripcion(self, obj):
        cierre = self.context['request']
        afectado = obj.afectados.get(cierre=self.context['request'])
        mensaje = mensajesDetalle.getDescipcion(obj, afectado)
        return mensaje

    def getDestino(self, obj):
        CAJACHICA = 10
        PAGOPROVEEDOR = 20
        if obj.destino == CAJACHICA:
            return "Caja chica"
        if obj.destino == PAGOPROVEEDOR:
            return "Proveedor"
        return "--"

    def getformaPago(self,obj):
        EFECTIVO = 10
        TARJETA = 20
        TRANSACCION = 30
        CHEQUE = 40
        if obj.formaPago == EFECTIVO:
            return "Efectivo"
        elif obj.formaPago == TARJETA:
            return "Tarjeta"
        elif obj.formaPago == TRANSACCION:
            return "Transacción"
        return "Cheque"
