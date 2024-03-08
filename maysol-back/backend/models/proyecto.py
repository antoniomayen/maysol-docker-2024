# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
class Proyecto(models.Model):
    INVESTIGACION = 10
    EMPRESA = 20

    FASE  = (
        (INVESTIGACION, 'INVESTIGACIÓN'),
        (EMPRESA, 'EMPRESA')
    )

    # Categoria de recuperación (Linea 159 y 160)
    DEPRESIACION = 159
    DEPRESIACION_SISTEMA = 160
    RECUPERACIONES = (
        (DEPRESIACION, 'Depreciación'),
        (DEPRESIACION_SISTEMA, 'Depreciación sistemas')
    )

    empresa = models.ForeignKey('self', related_name="empresas", blank=True, null=True, on_delete=models.deletion.CASCADE)
    nombre = models.CharField(max_length=140)
    representante = models.CharField(max_length=140)
    direccion = models.CharField(max_length=140, blank=True, null=True)
    telefono = models.CharField(max_length=10, blank=True, null=True)
    tecnico = models.ForeignKey('backend.usuario',related_name="granjas", blank=True, null=True, on_delete=models.deletion.CASCADE)
    fase = models.IntegerField(choices=FASE, default=20)
    subempresa = models.BooleanField(default=False)

    #Campos para el manejo de de la granja
    fechaInicio = models.DateField(blank=True, null=True)
    es_gallinero = models.BooleanField(default=False)
    cantidad_alimento = models.FloatField(blank=True, null=True)
    cantidad_agua = models.FloatField(blank=True, null=True)

    #Campos para el manejo de costos de recuperación
    plazo = models.IntegerField(blank=True, null=True)
    fecha_inicio_costo = models.DateField(blank=True, null=True)
    fechaFinal = models.DateField(blank=True, null=True)
    monto = models.FloatField(blank=True, null=True)
    categoria_recuperacion = models.IntegerField(choices=RECUPERACIONES, default=DEPRESIACION)


    activo = models.BooleanField(default=True)


    def __str__(self):
        return "Proyecto: {} {}  Representante: {}".format(self.id, self.nombre, self.representante)

    def delete(self):
        self.activo = False
        self.save()
        return True
