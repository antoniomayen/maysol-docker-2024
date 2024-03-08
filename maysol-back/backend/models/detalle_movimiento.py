# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models import Proyecto, Movimiento, Fraccion


class DetalleMovimiento(models.Model):
    orden_compra = models.ForeignKey(Movimiento, related_name="detalle_movimiento", on_delete=models.deletion.CASCADE)
    stock = models.ForeignKey(Fraccion, related_name="detalle_movimiento", on_delete=models.deletion.CASCADE)
    cantidad = models.IntegerField()
    cantidadActual = models.IntegerField()
    precio_costo = models.DecimalField(default=0, max_digits=18, decimal_places=7)
    precio_unitario = models.DecimalField(default=0, max_digits=18, decimal_places=2)
    subtotal = models.DecimalField(default=0, max_digits=18, decimal_places=2)

    def __str__(self):
        return str(self.orden_compra.id)
