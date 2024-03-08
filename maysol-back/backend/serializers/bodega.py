from backend.models import Bodega
from rest_framework import serializers
from backend.serializers import ProyectoSerializer, UserSerializer


class BodegaSerializer(serializers.ModelSerializer):
    empresa = ProyectoSerializer()
    # encargado = UserSerializer()
    nombre_encargado = serializers.ReadOnlyField(source='encargado.first_name')
    class Meta:
        model = Bodega
        fields = [
            'id',
            'nombre',
            'direccion',
            'activa',
            'encargado',
            'nombre_encargado',
            'empresa'
        ]
