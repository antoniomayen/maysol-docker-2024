# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models import  Proyecto

class Producto(models.Model):
    """Modelo de productos"""
    FRACCION = 20
    GRANEL = 30


    TIPO = (
        (FRACCION, "Fracción"),
        (GRANEL, "A granel")
    )

    DOLAR = 'USD'
    QUETZAL = 'GTQ'

    MONEDAS = (
        (DOLAR, 'USD'),
        (QUETZAL, 'GTQ')
    )

    empresa = models.ForeignKey(Proyecto, related_name="productos", on_delete=models.deletion.CASCADE)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    porcentaje = models.IntegerField(blank=True, null=True)

    #Banderas de control
    vendible = models.BooleanField(default=False)
    multiplos = models.BooleanField(default=True)
    moneda = models.CharField(choices=MONEDAS, default=QUETZAL, max_length=10, blank=True, null=True)


    activo = models.BooleanField(default=True)


    #Campos de control de modificación
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return self.pk

    def delete(self):
        self.activo = False
        self.save()
        return True
