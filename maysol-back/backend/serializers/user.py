from backend.models import Usuario, Permiso
from rest_framework import serializers

class PermisosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permiso
        fields = (
            'administrador',
            'backoffice',
            'supervisor',
            'vendedor',
            'bodeguero',
            'compras',
            'sin_acceso'
        )

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = (
            'id',
            'username',
            'first_name',
            'last_name',
            'telefono',
            'puestos',
            'proyecto'
        )
    
class UserMinReadSerializer(serializers.ModelSerializer):
    nombreCompleto = serializers.SerializerMethodField("getNombreCompleto")
    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'nombreCompleto'
        ]
    def getNombreCompleto(self, obj):
        return obj.first_name + " " + obj.last_name

        
class UserReadSerializer(serializers.ModelSerializer):
    nombreCompleto = serializers.SerializerMethodField("getNombreCompleto")
    proyecto = serializers.ReadOnlyField(source="proyecto.nombre")
    idProyecto = serializers.ReadOnlyField(source="proyecto.id")
    cargo = serializers.SerializerMethodField("getCargoUsuario")
    accesos = PermisosSerializer()
    es_granja = serializers.ReadOnlyField(source="proyecto.es_gallinero")
    class Meta:
        model = Usuario
        fields = [
            'id',
            'username',
            'is_active',
            'is_superuser',
            'first_name',
            'last_name',
            'email',
            'telefono',
            'puestos',
            'nombreCompleto',
            'proyecto',
            'idProyecto',
            'cargo',
            'accesos',
            'es_granja'        
        ]
  
    
    
    def getNombreCompleto(self, obj):
        return obj.first_name + " " + obj.last_name

    def getCargoUsuario(self, obj):
        cargo = obj.get_puestos_display()
        return cargo