
from backend.models import Producto, Fraccion, Preciofraccion
from rest_framework import serializers
from rest_framework.serializers import ValidationError
from backend.serializers import UserMinReadSerializer, CuentaReadSerializer
import datetime
from backend.utils import mensajesDetalle
from backend.utils.exceptions import ErrorDeUsuario
from backend.utils.monedas import MONEDAS


class FraccionSerializer(serializers.ModelSerializer):
    precios = serializers.SerializerMethodField("getPrecios")
    class Meta:
        model = Fraccion
        fields = [
            'id',
            'parent',
            'producto',
            'minimo_existencias',
            'presentacion',
            'capacidad_maxima',
            'precios',
            'vendible',
            'costo',
            'fecha_ultima_compra',
            'activo'
        ]
    def getPrecios(self, obj):

        monedasD = obj.precios.filter(moneda=Preciofraccion.DOLAR)
        precioD = []
        for monedas in monedasD:
            precioD.append({"precio": monedas.precio})
        monedasQ = obj.precios.filter(moneda=Preciofraccion.QUETZAL)
        precioQ = []
        for monedas in monedasQ:
            precioQ.append({"precio": monedas.precio})

        precios = []

        if len(precioQ) > 0:
            precios.append({'moneda': Preciofraccion.QUETZAL, "precioD": precioQ})
        if len(precioD) > 0:
            precios.append({'moneda': Preciofraccion.DOLAR, "precioD": precioD})
        """
        if obj.precio and obj.precio > 0:
            obj_precio = {
                'moneda':Preciofraccion.QUETZAL,
                'precio': obj.precio,
                'precio2': obj.precio2,
                'precio3': obj.precio3
            }

            precios.append(obj_precio)
        if obj.precioUSD and obj.precioUSD > 0:
            obj_precio = {
                'moneda':Preciofraccion.DOLAR,
                'precio': obj.precioUSD,
                'precio2': obj.precioUSD2,
                'precio3': obj.precioUSD3
            }
            precios.append(obj_precio)
        """
        return precios
    def validate(self, attrs):

        try:
            llave = self.context['request']
        except:
            llave = None
        presentacion = attrs.get('presentacion')
        capacidad_maxima = attrs.get('capacidad_maxima')
        precio = attrs.get('precio')
        costo = attrs.get('costo')
        producto = attrs.get('producto')
        vendible = attrs.get('vendible')

        #Si la fracción es vendible debe de tener un precio mayor a 0
        if vendible == True:
            if precio <= 0:
                raise ErrorDeUsuario('La presentación {} es vendible por lo tanto debe de tener un precio mayor a 0.'.format(presentacion))

        #Se verifica que el precio no sea negativo.
        if precio < 0:
            raise ErrorDeUsuario('No se puede especificar el precio del múltiplo {} menor a cero.'.format(presentacion))

        #verificar la existencia de otra presentación
        if llave is not None:
            duplicados = Fraccion.objects.filter(
                activo=True,
                producto=producto,
                presentacion__iexact=str(presentacion).strip()
            ).exclude(pk=llave)
        else:
            duplicados = Fraccion.objects.filter(
                activo=True,
                producto=producto,
                presentacion__iexact=str(presentacion).strip()
            )
        if duplicados.count():
            raise ErrorDeUsuario('No es posible ingresar la presentación {} por que ya existía anteriormente.'.format(presentacion))

        if capacidad_maxima <= 0:
            raise ErrorDeUsuario('La capacidad máxima de la presentación {} no puede ser menor o igual a cero.'.format(presentacion))

        return attrs


class ProductoSerializer(serializers.ModelSerializer):
    fracciones = serializers.SerializerMethodField('getFracciones')
    nombreEmpresa = serializers.ReadOnlyField(source="empresa.nombre")
    simbolo = serializers.SerializerMethodField('getSimbolo')
    class Meta:
        model = Producto
        fields = [
            'id',
            'empresa',
            'nombre',
            'descripcion',
            'vendible',
            'multiplos',
            'nombreEmpresa',
            'fracciones',
            'moneda',
            'porcentaje',
            'simbolo'
        ]
        extra_kwargs = {
            'nombreEmpresa' : {'read_only':True},
            'simbolo' : {'read_only':True}
            }

    def getFracciones(self, obj):
        fracciones = obj.fracciones.filter(activo=True)
        serializer = FraccionSerializer(fracciones, many=True)
        return serializer.data

    def getSimbolo(self, obj):
        simbolo = MONEDAS[obj.moneda]["signo"]
        return simbolo
