from backend.models import LineaProduccion
from rest_framework import serializers
from backend.utils.exceptions import ErrorDeUsuario
from rest_framework.response import Response
from rest_framework import viewsets, filters, status


class LineaProduccionSerializer(serializers.ModelSerializer):
    nombreEmpresa = serializers.ReadOnlyField(source="empresa.nombre")
    class Meta:
        model = LineaProduccion
        fields = [
            'id',
            'nombre',
            'empresa',
            'nombreEmpresa',
            'sumar_en_reporte'
        ]
        extra_kwargs = { 'nombreEmpresa' : {'read_only':True}}
    def validate(self, attrs):
        # if self.context.get('is_create'):
        # qs = LineaProduccion.objects.filter(empresa= attrs.get('empresa'), activo=True, nombre__iexact=attrs.get('nombre'))
        # if self.instance:
        #     qs.exclude(pk=self.instance.pk)
        # if qs.exists():
        #     raise ErrorDeUsuario('Esta línea de producción ya existe.')
        return attrs
class LineaProduccionReadSerializer(serializers.ModelSerializer):
    nombreEmpresa = serializers.SerializerMethodField("getNombreEmpresa")
    class Meta:
        model = LineaProduccion
        fileds = [
            'id',
            'nombre',
            'empresa',
            'nombreEmpresa',
            'sumar_en_reporte'
        ]
    def getNombreEmpresa(self, obj):
        try:
            nombre = obj.empresa.nombre
        except:
            nombre = ''
        return nombre


