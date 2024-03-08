# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models import Proveedor


class CuentaProveedor(models.Model):
    MONETARIA = 'MONETARIA'
    AHORRO = 'AHORRO'

    TIPO = (
        (MONETARIA, 'Monetaria'),
        (AHORRO, 'Ahorro')
    )

    proveedor = models.ForeignKey(Proveedor, related_name="cuentas", on_delete=models.deletion.CASCADE)
    banco = models.CharField(max_length=150)
    numero = models.CharField(max_length=250)
    tipo = models.CharField(choices=TIPO, max_length=15)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.numero

    def delete(self):
        self.activo = False
        self.save()
        return True
