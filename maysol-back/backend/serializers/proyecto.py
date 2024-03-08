# -*- coding: utf-8 -*-
from backend.models import Proyecto, Cuenta, MovimientoGranja, DetalleMovGranja, Bodega
from rest_framework import serializers
from backend.serializers import CuentaReadSerializer


class ProyectoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            'id',
            'nombre',
            'fase',
            'representante',
            'subempresa',
            'es_gallinero'
        ]
        extra_kwargs = { 'subempresa' : {'read_only':True}}


class SubEmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            'id',
            'nombre',
            'representante',
            'empresa',
            'subempresa'
        ]
    # def get_fields(self):
    #     fields = super(SubEmpresaSerializer, self).get_fields()
    #     for field in fields.values():
    #         field.required = True
    #     return fields

class ProyectoReadSerializer(serializers.ModelSerializer):
    cuentas = serializers.SerializerMethodField('getCuentas')
    nombreFase = serializers.SerializerMethodField('getFase')
    empresas = serializers.SerializerMethodField('getEmpresas')
    idEmpresas = serializers.SerializerMethodField('getIdEmpresas')
    class Meta:
        model = Proyecto
        fields = [
            'id',
            'idEmpresas',
            'nombre',
            'fase',
            'representante',
            'cuentas',
            'nombreFase',
            'empresas',
            'es_gallinero'
        ]
    def getEmpresas(self, obj):
        empresas = Proyecto.objects.filter(empresa=obj, activo=True)
        serializer = ProyectoSerializer(empresas, many=True)
        return serializer.data
    def getIdEmpresas(self, obj):
        try:
            return obj.empresa.id
        except:
            return obj.id
    def getCuentas(self, obj):
        #Recupera la cuenta bancaria asignada al proyecto
        cuentas = Cuenta.objects.filter(proyecto=obj.id, tipo=Cuenta.BANCO)
        serializer = CuentaReadSerializer(cuentas, many=True)
        return serializer.data

    def getFase(self, obj):
        INVESTIGACION = 10
        EMPRESA = 20
        if obj.fase == 10:
            return 'Investigación'
        return 'Empresa'


class BodegaReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bodega
        fields = [
            'id',
            'nombre',
            'direccion',
            'activa',
        ]


class EmpresaBodegaSelectSerializer(serializers.ModelSerializer):
    bodegas = serializers.SerializerMethodField("getBodegas")

    class Meta:
        model = Proyecto
        fields = [
            'id',
            'nombre',
            'bodegas'
        ]
        depth=1

    def getBodegas(self, obj):
        bodegas = Bodega.objects.filter(empresa_id=obj.id, activa=True)
        serializer = BodegaReadSerializer(bodegas, many=True)
        return serializer.data

class EmpresaCuentasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            'id',
            'nombre',
            'cuentas'
        ]
        depth=1
class EmpresaLineaSubempresaSerializer(serializers.ModelSerializer):
    label = serializers.ReadOnlyField(source="nombre")
    value = serializers.ReadOnlyField(source="id")
    class Meta:
        model = Proyecto
        fields = [
            'value',
            'label',
            'lineaproduccion',
            'empresas'
        ]
        depth=1
########################################################
## Descripción: Para gallineros
########################################################
class GallinerosReadSerializer(serializers.ModelSerializer):
    gallinas = serializers.SerializerMethodField('getCantGallinas')
    tecnico = serializers.SerializerMethodField('getTecnico')
    class Meta:
        model = Proyecto
        fields = [
            'id',
            'nombre',
            'gallinas',
            'tecnico'
        ]
    def getCantGallinas(self, obj):
        movimientos = MovimientoGranja.objects.filter(id=obj.id).order_by('-id')[:5]
        ultimo = movimientos.first()
        cantidad = 0
        try:
            cantidad = ultimo.cantidad_gallinas
        except:
            cantidad = 0
        return cantidad

    def getTecnico(self, obj):

        return ''
