# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models import  Proyecto

class LineaProduccion(models.Model):
    nombre = models.CharField(max_length=200)
    empresa = models.ForeignKey(Proyecto, related_name="lineaproduccion", on_delete=models.deletion.CASCADE)
    sumar_en_reporte = models.BooleanField(default=False)

    activo = models.BooleanField(default=True)


    def __str__(self):
        return "Empresa:{}  Nombre: {}".format(self.empresa.nombre, self.nombre)

    def delete(self):
        self.activo = False
        self.save()
        return True


