from backend.models import MovimientoGranja, DetalleMovGranja, Proyecto
from rest_framework import serializers
from backend.serializers import SubEmpresaSerializer, MovimientoGranjaSerializer
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

class CantidadesSerializer(serializers.ModelSerializer):

    class Meta:
        model = MovimientoGranja
        fields = [
            'edad',
            'raza',
            'cantidad_gallinas',
            'responsable',
            'justificacion',
            'fecha',
            'nota'
        ]


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


class MedicionesSerializer(serializers.ModelSerializer):
    pesos = serializers.SerializerMethodField("getPesos")

    class Meta:
        model = MovimientoGranja
        fields = [
            'edad',
            'peso_gallinas',
            'promedio',
            'responsable',
            'fecha',
            'nota',
            'pesos'
        ]

    def getPesos(self, obj):
        pesos = DetalleMovGranja.objects.filter(movimiento=obj.id)
        serializer = DetalleMovGranjaSerializer(pesos, many=True)
        return serializer.data

class GallineroUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            'tecnico',
            'cantidad_alimento',
            'cantidad_agua',
            'telefono',
            'direccion'
        ]

class GallineroCostosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proyecto
        fields = [
            'plazo',
            'fecha_inicio_costo',
            'monto',
            'categoria_recuperacion'
        ]
    def get_fields(self):
        fields = super(GallineroCostosSerializer, self).get_fields()
        for field in fields.values():
            field.required = True
        return fields

class GallineroSerializer(serializers.ModelSerializer):
    no_gallinas = serializers.SerializerMethodField("getNoGallinas")
    peso_promedio = serializers.SerializerMethodField("getPesoPromedio")
    mediciones = serializers.SerializerMethodField("getMediciones")
    cantidades = serializers.SerializerMethodField("getCantidades")
    raza = serializers.SerializerMethodField("getRaza")
    nombreTecnico = serializers.SerializerMethodField('getNombreTecnico')
    fecha = serializers.SerializerMethodField("getFecha")
    edad = serializers.SerializerMethodField("getEdad")
    empresa = serializers.SerializerMethodField("getNombreEmpresa")
    fechaInicioCosto = serializers.SerializerMethodField("getFechaInicioCosto")
    gramos = serializers.SerializerMethodField("getGramos")
    salario = serializers.SerializerMethodField("getSalario")
    medicina = serializers.SerializerMethodField("getMedicina")
    cartonP = serializers.SerializerMethodField("getCarton")
    concentradoP = serializers.SerializerMethodField("getConcentrado")
    insumos = serializers.SerializerMethodField("getInsumos")
    semana = serializers.SerializerMethodField("getSemana")
    ultimoRegistro = serializers.SerializerMethodField("getRegLast")

    class Meta:
        model = Proyecto
        fields = [
            'id',
            'nombre',
            'representante',
            'empresa',
            'telefono',
            'direccion',
            'tecnico',
            'nombreTecnico',
            'subempresa',
            'no_gallinas',
            'peso_promedio',
            'fechaInicio',
            'fecha',
            'raza',
            'mediciones',
            'cantidades',
            'cantidad_alimento',
            'cantidad_agua',
            'edad',
            'mediciones',
            'plazo',
            'fechaInicioCosto',
            'fechaFinal',
            'monto',
            'categoria_recuperacion',
            'gramos',
            'salario',
            'medicina',
            'cartonP',
            'concentradoP',
            'insumos',
            'semana',
            'ultimoRegistro',
        ]

    def getRegLast(self, obj):
        try:
            gallinero_semana = MovimientoGranja.objects.filter(gallinero=obj).last()
            serializer = MovimientoGranjaSerializer(gallinero_semana)
            return serializer.data
        except:
            return None

    def getSemanaAc(self, obj):
        try:
            return int(obj.fecha.strftime("%V"))
        except:
            return None

    def getSemana(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.edad
            # return self.getSemanaAc(ultimo_movimiento)
        return 0
    def getGramos(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.porcion_alimento
        return 0
    def getSalario(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.salario
        return 0
    def getMedicina(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.medicina
        return 0
    def getCarton(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.precio_carton
        return 0
    def getConcentrado(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.precio_concentrado
        return 0
    def getInsumos(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False) \
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.insumos
        return 0

    def getFechaInicioCosto(self, obj):
        try:
            nombre = obj.fecha_inicio_costo
            return nombre
        except:
            return ''
    def getNombreEmpresa(self, obj):
        try:
            nombre = obj.empresa.nombre
            return nombre
        except:
            return ''
    def getNombreTecnico(self, obj):
        try:
            nombre = obj.tecnico.first_name + ' ' + obj.tecnico.last_name
            return nombre
        except:
            return ''
    def getMediciones(self, obj):
        mediciones = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=True)
        serializer = MedicionesSerializer(mediciones, many=True)
        return serializer.data

    def getCantidades(self, obj):
        cantidades = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)
        serializer = CantidadesSerializer(cantidades, many=True)
        return serializer.data

    def getNoGallinas(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.cantidad_gallinas
        return 0

    def getRaza(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.raza
        return ""
    def getFecha(self, obj):
        ultimo_movimiento = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultimo_movimiento is not None:
            return ultimo_movimiento.fecha
        return ""
    def getEdad(self, obj):
        try:
            hoy = datetime.now()
            diferencia = hoy.date() - obj.fechaInicio
            diferencia = int(diferencia.days / 7)
            return diferencia
        except:
            pass

        return ""
    def getPesoPromedio(self, obj):
        ultima_medicion = MovimientoGranja.objects.filter(activo=True, gallinero=obj, peso_gallinas=False)\
            .order_by('-fecha').first()
        if ultima_medicion is not None:
            return ultima_medicion.promedio
        return 0
