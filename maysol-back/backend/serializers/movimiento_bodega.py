from backend.models import MovimientoBodega, Lote, DetalleMovBodega
from rest_framework import serializers
from backend.serializers import ProyectoSerializer
from django.db.models import F, Sum
class DetalleLoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = DetalleMovBodega
        fields = [
            'stock',
            'cantidadInicial',
            'cantidadFinal'
        ]

class MovimientoBodegaSerializer(serializers.ModelSerializer):
    class Meta:
        model = MovimientoBodega
        fields = [
            'id',
            'no_movimiento',
            'bodega',
            'movimiento',
            'fecha',
            'tipo',
            'nota',
            'justificacion',
            'padre',
            'lotes'
        ]

########################################################
## Descripción: Serializers para la lectura
########################################################


class DetalleMovBodegaReadSerializer(serializers.ModelSerializer):
    producto = serializers.SerializerMethodField("getFraccion")
    nombreProducto = serializers.SerializerMethodField("getNombreProducto")
    tipo = serializers.SerializerMethodField("getTipo")
    cantidadIngreso = serializers.ReadOnlyField(source="cantidadActual")
    class Meta:
        model = DetalleMovBodega
        fields = [
            'id',
            'cantidadInicial',
            'cantidadFinal',
            'cantidadActual',
            'cantidadIngreso',
            'cantidad',
            'stock',
            'tipo',
            'nombreProducto',
            'producto',
            'lote'
        ]
        depth=1
    def getFraccion(self, obj):
        try:
            producto = obj.stock.producto.nombre + "-"+ obj.stock.presentacion
        except:
            producto = ""
        return producto
    def getNombreProducto(self, obj):
        try:
            producto = obj.stock.producto.nombre
        except:
            producto = ""
        return producto
    def getTipo(self, obj):
        try:
            tipo = obj.movimiento.get_tipo_display()
        except:
            tipo = '-'
        return tipo

class LoteReadSerializer(serializers.ModelSerializer):
    lote_detalle = DetalleMovBodegaReadSerializer(many=True)
    class Meta:
        model = Lote
        fields = [
            'id',
            'movimiento',
            'lote',
            'justificacionAnulacion',
            'lote_detalle'
        ]

class MovimientoBodegaReadSerializer(serializers.ModelSerializer):
    lotes = LoteReadSerializer(many=True)
    empresa = serializers.ReadOnlyField(source="bodega.empresa.nombre")
    nombreBodega = serializers.ReadOnlyField(source="bodega.nombre")
    tipoNombre = serializers.SerializerMethodField("getTipo")
    class Meta:
        model = MovimientoBodega
        fields = [
            'id',
            'no_movimiento',
            'bodega',
            'movimiento',
            'fecha',
            'tipo',
            'empresa',
            'justificacion',
            'nombreBodega',
            'padre',
            'nota',
            'tipoNombre',
            'lotes'
        ]
    def getTipo(self, obj):
        return obj.get_tipo_display()


########################################################
## Descripción: Serializers para ver los productos
## que se movieron en la transacción
########################################################

class MovBodegaReadSerializer(serializers.ModelSerializer):
    destino = serializers.ReadOnlyField(source="destino.nombre")
    tipoNombre = serializers.SerializerMethodField("getTipo")
    bodega = serializers.ReadOnlyField(source="bodega.nombre")
    detalle_movimiento = DetalleMovBodegaReadSerializer(many=True)
    detalle_presentacion = DetalleMovBodegaReadSerializer(many=True)
    usuario = serializers.SerializerMethodField("getNombreUsuario")
    justificacion = serializers.SerializerMethodField()

    class Meta:
        model = MovimientoBodega
        fields = [
            'id',
            'bodega',
            'no_movimiento',
            'destino',
            'movimiento',
            'fecha',
            'tipo',
            'justificacion',
            'padre',
            'nota',
            'tipoNombre',
            'detalle_movimiento',
            'detalle_presentacion',
            'usuario',
            'justificacionAnulacion',
            'activo'
        ]
    def getNombreUsuario(self, obj):
        try:
            nombre = obj.usuario.first_name + " " + obj.usuario.last_name
            return nombre
        except:
            return ''
    def getTipo(self, obj):
        return obj.get_tipo_display()

    def get_justificacion(self, obj):
        if obj.tipo == MovimientoBodega.DESPACHO:
            if obj.tipoDespacho == MovimientoBodega.DESPACHOLINEA:
                return "Despacho a linea de producción " + " - " + obj.linea.nombre
        return obj.justificacion
