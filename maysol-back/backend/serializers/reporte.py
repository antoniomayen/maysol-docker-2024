from backend.models import Movimiento
from rest_framework import serializers
from rest_framework.serializers import ValidationError
from backend.serializers import UserMinReadSerializer, CuentaReadSerializer
import datetime
from backend.utils import mensajesDetalle
from django.db.models import Q, Sum, F
from backend.models import MovimientoBodega, DetalleMovBodega


class GraficasSerializer(serializers.Serializer):
    tipo = serializers.IntegerField()
    cantidad = serializers.FloatField()
    fecha = serializers.DateField( required=False)
    semana = serializers.IntegerField( required=False)
    
  
class GraficaBodegaDespachoSerializer(serializers.Serializer):
    cantidad = serializers.IntegerField(required=False)
    tipoDespacho = serializers.IntegerField(required=False)
    nombre = serializers.SerializerMethodField('getNombre')

    def getNombre(self, obj):
        valores = MovimientoBodega.TIPODESPACHO
        nombre = ''
        for _row in valores:
            if _row[0] == obj["tipoDespacho"]:
                nombre = _row[1]
        return nombre

class GraficaBodegaIngresoSerializer(serializers.Serializer):
    cantidad = serializers.IntegerField(required=False)
    tipoIngreso = serializers.IntegerField(required=False)
    nombre = serializers.SerializerMethodField('getNombre')

    def getNombre(self, obj):
        valores = MovimientoBodega.TIPOINGRESO
        nombre = ''
        for _row in valores:
            if _row[0] == obj["tipoIngreso"]:
                nombre = _row[1]
        return nombre

class GraficaBodegaReajusteSerializer(serializers.Serializer):
    cantidad = serializers.IntegerField(required=False)
    stock__producto__nombre = serializers.CharField(max_length=200)
    nombre = serializers.SerializerMethodField('getNombre')
    def getNombre(self, obj):
        return obj["stock__producto__nombre"]

class GraficasLinealSerializer(serializers.Serializer):
    cantidad = serializers.IntegerField()
    nombre = serializers.CharField(max_length=200)
    fecha = serializers.SerializerMethodField('getFecha')
    def getFecha(self, obj):
        return obj["movimiento__fecha"]


class GraficaSimpleSerializer(serializers.Serializer):
    cantidad = serializers.IntegerField()
    nombre = serializers.CharField(max_length=200)

class DetalleProduccionSerializer(serializers.ModelSerializer):
    fecha = serializers.ReadOnlyField(source='lote.lote')
    linea = serializers.ReadOnlyField(source='movimiento.linea.nombre')
    producto = serializers.ReadOnlyField(source='stock.producto.nombre')
    class Meta:
        model = DetalleMovBodega
        fields = [
            'id',
            'fecha',
            'linea',
            'producto',
            'cantidad'
        ]

class GananciasSerializers(serializers.Serializer):
    orden = serializers.IntegerField()
    cantidad = serializers.FloatField()
    moneda = serializers.CharField(max_length=200)
    data = serializers.SerializerMethodField("getData")
    descripcion = serializers.CharField(required=False, max_length=200)

    # subempresa = self.context[]

    def getData(self, obj):
        detalle = DetalleMovBodega.objects.filter(movimiento__movimiento=obj['orden'])
        empresa = self.context['empresa']
        subempresa = self.context['subempresa']
        linea = self.context['linea']

        primero = None
        if empresa is not None:
            query = detalle
            if subempresa is not None:
                query = query.filter(lote__empresa=subempresa)
            else:
                query = query.filter(Q(lote__empresa=empresa) | Q(lote__empresa__empresa=empresa))
            if linea is not None:
                query = query.filter(lote__linea=linea)
            primero = query.first()
            
        fecha = None
        subempresa = None
        detalle = None
        if primero is not None:
            fecha = primero.movimiento.fecha
            subempresa = primero.lote.empresa.nombre
            detalle = 'hlaasdf'
        return {
            'fecha':fecha,
            'subempresa': subempresa,
            'descripcion': detalle
        }

class GastosSerializer(serializers.Serializer):
    fecha = serializers.DateField()
    id = serializers.IntegerField()
    cantidad = serializers.FloatField()
    empresa = serializers.CharField(max_length=200)
    moneda = serializers.CharField(max_length=200)
    linea = serializers.CharField(max_length=200)