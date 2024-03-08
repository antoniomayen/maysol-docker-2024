from backend.models import Categorias
from backend.utils.exceptions import ErrorDeUsuario
from rest_framework import serializers

class CategoriasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categorias
        fields = [
            'id',
            'nombre',
            'nombrejapones',
            'cf',
            'pl'
        ]
    def validate(self, attrs):
        cf = attrs.get('cf', None)
        pl = attrs.get('pl', None)
        if cf is None and pl is None:
            raise ErrorDeUsuario("Se debe selecionar al menos una categoría cf o pl")
        return attrs


class CategoriaReadSerializer(serializers.ModelSerializer):
    categoria_recuperacion = serializers.SerializerMethodField("getRecuperacion")
    class Meta:
        model = Categorias
        fields = [
            'id',
            'nombre',
            'nombrejapones',
            'cf',
            'pl',
            'categoria_recuperacion'
        ]

    def getRecuperacion(self, obj):
        try:
            if obj.pl >= 159:
                return obj.pl
        except:
            return None
