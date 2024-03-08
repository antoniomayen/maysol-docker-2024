# -*- coding: utf-8 -*-
from rest_framework import serializers
from backend.models import Proveedor
from backend.serializers import ContactosSerializer

class ClienteSerializer(serializers.ModelSerializer):
    contactos = serializers.SerializerMethodField()
    telefono = serializers.SerializerMethodField()
    contacto = serializers.SerializerMethodField()
    class Meta:
        model = Proveedor
        fields = [
            'id',
            'nombre',
            'nit',
            'codigo',
            'correo_caja',
            'empresa',
            'descripcion',
            'contactos',
            'contacto',
            'telefono',
            'direccion'
        ]
    def get_contactos(self, obj):
        serializer = ContactosSerializer(obj.contactos.filter(activo=True), many=True)
        return serializer.data
    
    def get_contacto(self, obj):
        nombre = '----'
        contactos = obj.contactos.filter(activo=True)
        if contactos.count() > 0:
            contacto = contactos.first()
            nombre  = contacto.nombre
        return nombre
    def get_telefono(self, obj):
        telefono = '----'
        contactos = obj.contactos.filter(activo=True)
        if contactos.count() > 0:
            contacto = contactos.first()
            telefono  = contacto.telefono
        return telefono