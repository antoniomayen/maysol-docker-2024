from backend.models import Inventario, Fraccion, Preciofraccion
from rest_framework import serializers
from django.db.models import Sum


class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventario
        fields = [
            'id',
            'lote',
            'bodega',
            'stock',
            'cantidad'
        ]


class InventarioReadSerializer(serializers.ModelSerializer):
    producto = serializers.SerializerMethodField("getProducto")
    # total = serializers.SerializerMethodField("getTotal")
    total_costo_unitario = serializers.SerializerMethodField()
    class Meta:
        model = Inventario
        fields = [
            'id',
            'lote',
            'bodega',
            'stock',
            'producto',
            'cantidad',
            'costo_unitario',      
            'total_costo_unitario'
        ]
        depth=1

    def getProducto(self, obj):
        try:
            fraccion = obj.stock
            return fraccion.producto.nombre
        except:
            return ""

    def getTotal(self, obj):
        total = Inventario.objects.filter(bodega=obj.bodega, stock=obj.stock).aggregate(Sum('cantidad'))['cantidad__sum']
        return float(total if total else 0)
    def get_total_costo_unitario(self, obj):
        # Calcula el total de costo unitario
        return obj.cantidad * obj.costo_unitario

class ProductosSelectSerializer(serializers.Serializer):
    stock = serializers.IntegerField(required=False)
    stock__producto = serializers.IntegerField(required=False)
    cantidad = serializers.IntegerField()
    value = serializers.IntegerField()
    label = serializers.CharField(max_length=200)


class ProductosVentaSerializer(serializers.ModelSerializer):
    nombre = serializers.SerializerMethodField('getNombre')
    cantidad = serializers.SerializerMethodField("getCantidad")
    cantidadUnidad = serializers.SerializerMethodField('getCantidadUnidad')
    GTQ = serializers.SerializerMethodField("getPreciosQ")
    USD = serializers.SerializerMethodField("getPreciosU")
    class Meta:
        model = Fraccion
        fields = [
            'id',
            'nombre',
            'cantidad',
            'cantidadUnidad',
            'GTQ',
            'USD'
        ]
    def getPreciosQ(self, obj):
        monedasQ = obj.precios.filter(moneda=Preciofraccion.QUETZAL)
        precioQ = []
        for monedas in monedasQ:
            precioQ.append({"precio": monedas.precio})

        precios = []
        if len(precioQ) > 0:
            precios.append({'moneda': Preciofraccion.QUETZAL, "precioD": precioQ})
        """
        if obj.precio and obj.precio > 0 :
            precios.append(obj.precio)
        if obj.precio2 and obj.precio2 > 0 :
            precios.append(obj.precio2)
        if obj.precio3 and obj.precio3 > 0 :
            precios.append(obj.precio3)
        """
        return precios
    def getPreciosU(self, obj):
        monedasD = obj.precios.filter(moneda=Preciofraccion.DOLAR)
        precioD = []
        for monedas in monedasD:
            precioD.append({"precio": monedas.precio})

        precios = []
        if len(precioD) > 0:
            precios.append({'moneda': Preciofraccion.DOLAR, "precioD": precioD})

        """
        if obj.precioUSD and obj.precioUSD > 0:
            precios.append(obj.precioUSD)
        if obj.precioUSD2 and obj.precioUSD2 > 0:
            precios.append(obj.precioUSD2)
        if obj.precioUSD3 and obj.precioUSD3 > 0:
            precios.append(obj.precioUSD3)
        """
        return precios

    def getNombre(self, obj):
        try:
            nombre = obj.producto.nombre +"-"+ obj.presentacion
            return nombre
        except:
            return ''
    def getCantidadUnidad(self, obj):
        inventario = self.context['inventario']
        cantidadInventario = inventario.filter(stock__producto=obj.producto).aggregate(Sum("cantidad"))["cantidad__sum"]
        return cantidadInventario

    def getCantidad(self, obj):
        inventario = self.context['inventario']
        cantidadInventario = inventario.filter(stock__producto=obj.producto).aggregate(Sum("cantidad"))["cantidad__sum"]
        cantidad = cantidadInventario / obj.capacidad_maxima
        return int(cantidad)

class InventarioReadPorLotesSerializer(serializers.ModelSerializer):
    producto = serializers.SerializerMethodField("getProducto")
    fecha = serializers.SerializerMethodField("getFechaLote")
    # total = serializers.SerializerMethodField("getTotal")
    class Meta:
        model = Inventario
        fields = [
            'id',
            'lote',
            'bodega',
            'stock',
            'producto',
            'fecha',
            'cantidad'
        ]
    def getFechaLote(self, obj):
        try:
            return obj.lote.lote
        except:
            return ""
    def getProducto(self, obj):
        try:
            fraccion = obj.stock
            return fraccion.producto.nombre
        except:
            return ""
class InventarioListarSerializer(serializers.Serializer):
    stock = serializers.IntegerField()
    cantidad = serializers.IntegerField()
    nombre = serializers.CharField(max_length=200)
    lotes = serializers.SerializerMethodField('getLotes')
    fracciones = serializers.SerializerMethodField('getFracciones')
    fraccionesPrecentacion = serializers.SerializerMethodField('getFraccionesPrece')

    def getLotes(self, obj):
        inventario = self.context['inventario']
        inventarioProducto = inventario.filter(stock=obj.get('stock')).order_by('-lote__lote')
        serializer = InventarioReadPorLotesSerializer(inventarioProducto, many=True)
        return serializer.data

    def getFracciones(self, obj):
        cantidadInventario = obj.get('cantidad')
        results = dict()
        producto = Fraccion.objects.get(id=obj.get('stock')).producto.id
        fracciones = Fraccion.objects.filter(producto=producto, vendible=True).order_by('capacidad_maxima')
        for fraccion in fracciones:
            results[fraccion.id] = {'presentacion': fraccion.presentacion,
                                    'existencias': int(cantidadInventario / fraccion.capacidad_maxima)}
        return results
    def getFraccionesPrece(self, obj):
        results = []
        producto = Fraccion.objects.get(id=obj.get('stock')).producto.id
        fracciones = Fraccion.objects.filter(producto=producto, vendible=True).order_by('-capacidad_maxima')
        for fraccion in fracciones:
            results.append({
                'presentacion': fraccion.presentacion,
                'existencias': int(fraccion.capacidad_maxima)
            })
        return results
