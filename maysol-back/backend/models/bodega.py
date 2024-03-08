# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models import Proyecto, Usuario


class Bodega(models.Model):

    empresa = models.ForeignKey(Proyecto, related_name='bodegas', on_delete=models.deletion.CASCADE)
    nombre = models.CharField(max_length=140)
    direccion = models.CharField(max_length=250)
    encargado = models.OneToOneField(Usuario, related_name="bodega", blank=True, null=True, on_delete=models.deletion.CASCADE)
    creado_por = models.ForeignKey(Usuario, related_name="bodegas", on_delete=models.deletion.CASCADE)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    activa = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

    def delete(self):
        self.activa = False
        self.save()
        return True
