from backend.models import Movimiento, CuentaProveedor, DetalleMovimiento, Fraccion, Cierre, Cuenta
from rest_framework import serializers
from backend.serializers import CategoriaReadSerializer, BodegaSerializer, ProveedorSerializer, FraccionSerializer
from backend.utils.monedas import MONEDAS


class PagosSerializer(serializers.ModelSerializer):
    cuenta = serializers.SerializerMethodField("getCuenta")
    simbolo = serializers.SerializerMethodField("getSimbolo")
    caja = serializers.SerializerMethodField("getCaja")
    caja_nombre = serializers.SerializerMethodField("getCajaNombre")
    cuenta_nombre = serializers.SerializerMethodField("getCuentaNombre")
    formaPago_nombre = serializers.SerializerMethodField("getPagoNombre")

    class Meta:
        model = Movimiento
        fields = [
            'id',
            'caja_chica',
            'monto',
            'formaPago',
            'noDocumento',
            'noComprobante',
            'concepto',
            'fecha',
            'moneda',
            'cuenta',
            'simbolo',
            'anulado',
            'caja',
            'cuenta_nombre',
            'caja_nombre',
            'formaPago_nombre',
            'categoria',
        ]

    def getCuenta(self, obj):
        try:
            cierre = Cierre.objects.get(movimientos__movimiento=obj.id)
            return cierre.cuenta_id
        except:
            return 0

    def getCuentaNombre(self, obj):
        try:
            cierre = Cierre.objects.get(movimientos__movimiento=obj.id)
            cuenta = cierre.cuenta
            return cuenta.nombre
        except:
            return ''

    def getSimbolo(self, obj):
        try:
            return MONEDAS[obj.moneda]["signo"]
        except:
            return Cuenta.QUETZAL

    def getCaja(self, obj):
        try:
            cierre = Cierre.objects.get(movimientos__movimiento=obj.id)
            return cierre.id
        except:
            return 0

    def getCajaNombre(self, obj):
        try:
            cierre = Cierre.objects.get(movimientos__movimiento=obj.id)
            return cierre.fechaInicio
        except:
            return ''

    def getPagoNombre(self, obj):
        return obj.get_formaPago_display()


class DetalleSerializer(serializers.ModelSerializer):
    stock = FraccionSerializer()
    producto = serializers.SerializerMethodField("getProducto")
    producto_nombre = serializers.SerializerMethodField("getProductoNombre")
    cantidadIngreso = serializers.SerializerMethodField("getCantidadIngreso")
    simbolo = serializers.SerializerMethodField("getSimbolo")

    class Meta:
        model = DetalleMovimiento
        fields = [
            'id',
            'stock',
            'cantidad',
            'cantidadActual',
            'cantidadIngreso',
            'precio_costo',
            'subtotal',
            'producto',
            'producto_nombre',
            'simbolo'
        ]
        extra_kwargs = { 'nombreEmpresa' : {'read_only':True}}

    def getSimbolo(self, obj):
        movimiento = obj.orden_compra
        try:
            return MONEDAS[movimiento.moneda]["signo"]
        except:
            return MONEDAS["GTQ"]["signo"]

    def getCantidadIngreso(self, obj):
        return obj.cantidadActual

    def getProducto(self, obj):
        producto = Fraccion.objects.get(pk=obj.stock_id)
        return producto.id

    def getProductoNombre(self, obj):
        try:
            fraccion = Fraccion.objects.get(pk=obj.stock_id)
            return fraccion.producto.nombre
        except:
            return ""


class CompraSerializer(serializers.ModelSerializer):
    proveedor = ProveedorSerializer()
    detalle_movimiento = DetalleSerializer(many=True)
    simbolo = serializers.SerializerMethodField("getSimbolo")
    pagos = serializers.SerializerMethodField("getPagos")
    productos = serializers.SerializerMethodField("getProductos")
    usuario = serializers.SerializerMethodField("getUsuario")
    total = serializers.SerializerMethodField("getTotal")
    ingresados = serializers.SerializerMethodField("getIngresados")
    categoria = CategoriaReadSerializer()

    class Meta:
        model = Movimiento
        fields = [
            'id',
            'monto',
            'usuario',
            'proveedor',
            'descripcion',
            'fecha',
            'moneda',
            'detalle_movimiento',
            'monto',
            'simbolo',
            'pago_automatico',
            'pago_completo',
            'pagos',
            'ingresado',
            'productos',
            'total',
            'ingresados',
            'numero_oc',
            'categoria',
            'justificacion',
            'anulado'
        ]
        extra_kwargs = { 'usuario' : {'read_only':True}}

    def getUsuario(self, obj):
        return obj.usuario.first_name + " " + obj.usuario.last_name
    def getSimbolo(self, obj):
        try:
            simbolo = MONEDAS[obj.moneda]["signo"]
        except:
            simbolo=""
        return simbolo

    def getProductos(self, obj):
        productos = DetalleMovimiento.objects.filter(orden_compra=obj.id)
        serializer = DetalleSerializer(productos, many=True)
        return serializer.data

    def getPagos(self, obj):
        pagos = Movimiento.objects.filter(orden=obj.id, activo=True)
        serializer = PagosSerializer(pagos, many=True)
        return serializer.data
    def getTotal(self, obj):
        return obj.detalle_movimiento.count()
    def getIngresados(self, obj):
        return obj.detalle_movimiento.filter(cantidadActual=0).count()
class CompraHeaderSerializer(serializers.ModelSerializer):
    proveedor = serializers.SerializerMethodField("getProveedor")
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'monto',
            'proveedor',
            'descripcion',
            'fecha',
            'moneda',
            'monto',
            'pago_automatico',
            'pago_completo',
            'ingresado',
        ]
    def getProveedor(self, obj):
        return obj.proveedor.id
class DetalleUpdateSerializer(serializers.ModelSerializer):


    class Meta:
        model = DetalleMovimiento
        fields = [
            'id',
            'stock',
            'cantidad',
            'precio_costo',
            'subtotal'
        ]
