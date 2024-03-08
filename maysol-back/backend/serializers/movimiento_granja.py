from backend.models import MovimientoGranja, DetalleMovGranja, MovimientoBodega
from rest_framework import serializers
from backend.serializers import SubEmpresaSerializer
from django.db.models.functions import Coalesce
from django.db.models import Sum, Q, F, Max, FloatField
import time
import datetime

class DetalleMovGranjaSerializer(serializers.ModelSerializer):
    fecha = serializers.SerializerMethodField("getFecha")

    class Meta:
        model = DetalleMovGranja
        fields = [
            'id',
            'peso',
            'fecha'
        ]

    def getFecha(self, obj):
        return obj.movimiento.fecha


class MovimientoGranjaSerializer(serializers.ModelSerializer):
    gallinero = SubEmpresaSerializer()
    pesos = serializers.SerializerMethodField("getPesos")
    responsable = serializers.SerializerMethodField("getResponsable")
    usuario = serializers.SerializerMethodField("getUsuario")
    posturaA = serializers.SerializerMethodField("getPosturaAnt")
    fInicio = serializers.SerializerMethodField("getFechaI")
    fFin = serializers.SerializerMethodField("getFechaF")
    semana = serializers.SerializerMethodField("getSemana")
    class Meta:
        model = MovimientoGranja
        fields = [
            'id',
            'cantidad_gallinas',
            'raza',
            'edad',
            'usuario',
            'peso_gallinas',
            'promedio',
            'hora',
            'responsable',
            'justificacion',
            'nota',
            'creado',
            'activo',
            'gallinero',
            'pesos',
            'semana',
            'porcion_alimento',
            'rentabilidad',
            'produccion',
            'venta',
            'salario',
            'porcion_agua',
            'precio_carton',
            'precio_concentrado',
            'medicina',
            'insumos',
            'postura',
            'posturaG',
            'posturaA',
            'fInicio',
            'fFin',
            'fecha_inicial',
            'edad_inicial',
            'fecha',
        ]
    def getSemana(self, obj):
        try:
            return int(obj.fecha.strftime("%V"))
        except:
            return None
    def getYear(self, obj):
        try:
            return int(obj.fecha.year)
        except:
            return None
    def getPosturaAnt(self, obj):
        gallinas_ant = MovimientoGranja.objects.filter(fecha__lt=obj.fecha).last()
        if gallinas_ant is not None:
            return gallinas_ant.postura
        else:
            return None
    def getFechaI(self, obj):
        try:
            d = f"{self.getYear(obj)}-W{self.getSemana(obj) - 1}"
            return datetime.datetime.strptime(d + '-1', "%Y-W%W-%w") + datetime.timedelta(days=-1)
        except:
            return None
    def getFechaF(self, obj):
        try:
            d = f"{self.getYear(obj)}-W{self.getSemana(obj) - 1}"
            return datetime.datetime.strptime(d + '-1', "%Y-W%W-%w") + datetime.timedelta(days=5)
        except:
            return None
    def getUsuario(self, obj):
        try:
            nombre = obj.usuario.first_name + " " + obj.usuario.last_name
            return nombre
        except:
            return ''
    def getResponsable(self, obj):
        try:
            nombre = obj.responsable.first_name + " " + obj.responsable.last_name
            return nombre
        except:
            return ''
    def getPesos(self, obj):
        pesos = DetalleMovGranja.objects.filter(movimiento=obj.id)
        serializer = DetalleMovGranjaSerializer(pesos, many=True)
        return serializer.data
