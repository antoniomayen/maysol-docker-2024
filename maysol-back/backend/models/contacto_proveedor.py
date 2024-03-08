# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models import Proveedor


class ContactoProveedor(models.Model):
    proveedor = models.ForeignKey(Proveedor, related_name="contactos", on_delete=models.deletion.CASCADE)
    nombre = models.CharField(max_length=150)
    puesto = models.CharField(max_length=150, blank=True, null=True)
    telefono = models.CharField(max_length=25)
    correo = models.CharField(max_length=100, blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

    def delete(self):
        self.activo = False
        self.save()
        return True
