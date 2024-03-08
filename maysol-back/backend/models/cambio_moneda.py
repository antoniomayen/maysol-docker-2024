from __future__ import unicode_literals

from django.db import models


class CambioMoneda(models.Model):
    fecha_dolar = models.DateField()
    cambio_dolar = models.FloatField()
    fecha_yen = models.DateField()
    cambio_yen_dolar = models.FloatField()
    cambio_yen = models.FloatField()
    creado = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "dolar: {} yen: {} fecha: {}".format(
            self.cambio_dolar,
            self.cambio_yen,
            self.creado
        )
