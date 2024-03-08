from __future__ import unicode_literals
from django.db import models
from backend.models import MovimientoBodega, MovimientoGranja


class DetalleMovGranja(models.Model):
    movimiento = models.ForeignKey(MovimientoGranja, related_name="detalle_movimiento", blank=True, null=True, on_delete=models.deletion.CASCADE)
    peso = models.FloatField()
    activo = models.BooleanField(default= True, blank=True)

    def __str__(self):
        return str(self.id)
