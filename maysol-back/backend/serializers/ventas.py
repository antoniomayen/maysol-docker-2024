from backend.models import Movimiento, Proveedor, DetalleMovimiento, Fraccion, Cierre, Cuenta, Inventario
from rest_framework import serializers
from backend.serializers import ProductoSerializer, BodegaSerializer, ClienteSerializer, FraccionSerializer
from backend.utils.monedas import MONEDAS
from django.db.models import Sum


class PagosVentaSerializer(serializers.ModelSerializer):
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
            'formaPago_nombre'
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
            return MONEDAS[Cuenta.QUETZAL]["signo"]

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


class DetalleVentaSerializer(serializers.ModelSerializer):
    stock = FraccionSerializer()
    producto = serializers.SerializerMethodField("getProducto")
    producto_nombre = serializers.SerializerMethodField("getProductoNombre")
    cantidadIngreso = serializers.SerializerMethodField("getCantidadIngreso")
    simbolo = serializers.SerializerMethodField("getSimbolo")
    inventario = serializers.SerializerMethodField("getInventario")
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
            'simbolo',
            'inventario'
        ]
        extra_kwargs = { 'nombreEmpresa' : {'read_only':True}}
    def getInventario(self, obj):

        try:
            bodega = int(self.context['bodega'])
            cantidadInventario = Inventario.objects.filter(bodega=bodega,stock__producto=obj.stock.producto)\
                .aggregate(Sum("cantidad"))["cantidad__sum"]
            cantidad = cantidadInventario / obj.stock.capacidad_maxima
            return int(cantidad)
        except:
            return 0

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


class VentaSerializer(serializers.ModelSerializer):

    detalle_movimiento =  serializers.SerializerMethodField('getDetalle')
    simbolo = serializers.SerializerMethodField("getSimbolo")
    pagos = serializers.SerializerMethodField("getPagos")
    productos = serializers.SerializerMethodField("getProductos")
    usuario = serializers.SerializerMethodField("getUsuario")
    total = serializers.SerializerMethodField("getTotal")
    ingresados = serializers.SerializerMethodField("getIngresados")
    cliente = serializers.SerializerMethodField("getCliente")
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'monto',
            'usuario',
            'cliente',
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
            'despacho_inmediato',
            'bodega_entrega',
            'descuento',
            'anulado',
            'justificacion'
        ]
        extra_kwargs = { 'usuario' : {'read_only':True}}

    def getDetalle(self, obj):
        bodega = None
        try:
            request = self.context['request']
            bodega = request.query_params['idbodega']
        except:
            pass

        detalle = obj.detalle_movimiento.all()
        serializer = DetalleVentaSerializer(detalle,many=True, context={'bodega':bodega})
        return serializer.data

    def getUsuario(self, obj):
        return obj.usuario.first_name + " " + obj.usuario.last_name
    def getCliente(self, obj):
        cliente = Proveedor.objects.get(pk=obj.proveedor_id)
        return ClienteSerializer(cliente).data
    def getSimbolo(self, obj):
        try:
            simbolo = MONEDAS[obj.moneda]["signo"]
        except:
            simbolo=""
        return simbolo

    def getProductos(self, obj):
        productos = DetalleMovimiento.objects.filter(orden_compra=obj.id)
        serializer = DetalleVentaSerializer(productos, many=True)
        return serializer.data

    def getPagos(self, obj):
        pagos = Movimiento.objects.filter(orden=obj.id, activo=True)
        serializer = PagosVentaSerializer(pagos, many=True)
        return serializer.data
    def getTotal(self, obj):
        return obj.detalle_movimiento.count()
    def getIngresados(self, obj):
        return obj.detalle_movimiento.filter(cantidadActual=0).count()
class VentaHeaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movimiento
        fields = [
            'id',
            'monto',
            'cliente',
            'descripcion',
            'fecha',
            'moneda',
            'monto',
            'pago_automatico',
            'pago_completo',
            'ingresado',
        ]
class DetalleVentaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleMovimiento
        fields = [
            'id',
            'stock',
            'cantidad',
            'precio_costo',
            'subtotal'
        ]
