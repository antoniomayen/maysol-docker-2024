# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models import Proyecto


class Proveedor(models.Model):
    empresa = models.ForeignKey(Proyecto, null=True, blank=True, related_name="proveedor",on_delete=models.deletion.CASCADE)
    nombre = models.CharField(max_length=250)
    nit = models.CharField(max_length=50, blank=True, null=True)
    codigo = models.CharField(max_length=100, blank=True, null=True)
    correo_caja = models.CharField(max_length=150, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    descripcion = models.TextField(blank=True, null=True)
    es_cliente = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

    def delete(self):
        self.activo = False
        self.save()
        return True
