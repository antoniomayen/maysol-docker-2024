# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models
from backend.models import  Fraccion

class Preciofraccion(models.Model):
    DOLAR = 'USD'
    QUETZAL = 'GTQ'

    MONEDAS = (
        (DOLAR, 'USD'),
        (QUETZAL, 'GTQ')
    )
    moneda = models.CharField(choices=MONEDAS, max_length=10)
    precio = models.FloatField(null=False, blank=False)
    stock = models.ForeignKey(Fraccion, related_name="precios", null=False, blank=False, on_delete=models.deletion.CASCADE)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return "Precio: {} stock:{}".format(self.precio, self.stock)
