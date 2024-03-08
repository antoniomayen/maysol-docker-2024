from __future__ import unicode_literals
from django.db import models
from backend.models import Usuario, Proyecto


class MovimientoGranja(models.Model):
    usuario = models.ForeignKey(Usuario, related_name="movimiento_granja", blank=True, null=True, on_delete=models.deletion.CASCADE)
    gallinero = models.ForeignKey(Proyecto, related_name="movimiento_granja", on_delete=models.deletion.CASCADE)
    # Datos para conteo de gallinas
    cantidad_gallinas = models.IntegerField(null=True, blank=True)
    raza = models.CharField(max_length=200, null=True, blank=True)
    edad = models.IntegerField(null=True, blank=True)
    # Datos para los pesos
    # True si es para el control de peso, de lo contrario es para conteo de gallinas
    peso_gallinas = models.BooleanField(default=False)
    promedio = models.FloatField(null=True, blank=True)
    # Datos compartidos
    responsable = models.ForeignKey(Usuario, related_name="movimiento_gallinero", blank=True, null=True, on_delete=models.deletion.CASCADE)
    hora = models.TimeField(blank=True, null=True)
    fecha = models.DateField(null=True, blank=True)
    justificacion = models.TextField(blank=True, null=True)
    nota = models.TextField(blank=True, null=True)

    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    # Datos para el nuevo reporte
    edad_inicial = models.IntegerField(null=True, blank=True)
    fecha_inicial = models.DateField(null=True, blank=True)
    salario = models.FloatField(null=True, blank=True)
    porcion_alimento = models.FloatField(null=True, blank=True)
    porcion_agua = models.FloatField(null=True, blank=True)
    precio_carton = models.FloatField(null=True, blank=True)
    precio_concentrado = models.FloatField(null=True, blank=True)
    medicina = models.FloatField(null=True, blank=True)
    insumos = models.FloatField(null=True, blank=True)

    posturaG = models.FloatField(null=True, blank=True)

    rentabilidad = models.FloatField(null=True, blank=True)
    produccion = models.FloatField(null=True, blank=True)
    venta = models.FloatField(null=True, blank=True)
    postura = models.FloatField(null=True, blank=True)

    def __unicode__(self):
        return self.id
