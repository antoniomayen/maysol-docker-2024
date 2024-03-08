# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

class Permiso(models.Model):
    """Modelo: para permisos"""
    administrador = models.BooleanField(default=False)
    backoffice = models.BooleanField(default=False)
    supervisor = models.BooleanField(default=False)
    vendedor = models.BooleanField(default=False)
    bodeguero = models.BooleanField(default=False)
    compras = models.BooleanField(default=False)
    sin_acceso = models.BooleanField(default=False)


    def __str__(self):
        try:
            usuario = "Usuario: {}".format(self.usuario.first_name)
        except:
            usuario = ""
        return usuario