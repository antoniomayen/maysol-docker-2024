# -*- coding: utf-8 -*-
from backend.models import Proveedor, ContactoProveedor, CuentaProveedor
from rest_framework import serializers
from backend.serializers import ProyectoSerializer

class ContactosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactoProveedor
        fields = [
            'id',
            'nombre',
            'puesto',
            'telefono',
            'correo'
        ]


class CuentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentaProveedor
        fields = [
            'id',
            'banco',
            'numero',
            'tipo'
        ]


class ProveedorSerializer(serializers.ModelSerializer):
    cuentas = serializers.SerializerMethodField()
    contactos = serializers.SerializerMethodField()
    empresa = ProyectoSerializer()

    class Meta:
        model = Proveedor
        fields = [
            'id',
            'nombre',
            'nit',
            'codigo',
            'correo_caja',
            'activo',
            'cuentas',
            'contactos',
            'empresa'
        ]

    def get_cuentas(self, obj):
        serializer = CuentasSerializer(obj.cuentas.filter(activo=True), many=True)
        return serializer.data

    def get_contactos(self, obj):
        serializer = ContactosSerializer(obj.contactos.filter(activo=True), many=True)
        return serializer.data
