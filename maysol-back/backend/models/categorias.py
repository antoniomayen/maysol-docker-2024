# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.utils.categorias import TIPOS_CF, TIPOS_PL
class Categorias(models.Model):

    TIPOS_CF = TIPOS_CF
    TIPOS_PL = TIPOS_PL

    nombre = models.CharField(max_length=240)
    nombrejapones = models.CharField(max_length=240)
    #False: Variable   True: Fijo
    cf = models.IntegerField(choices=TIPOS_CF, blank=True, null=True)
    pl = models.IntegerField(choices=TIPOS_PL, blank=True, null=True)
    activo = models.BooleanField(default=True)

    def __str__(self):
        return "{} {}".format(self.id, self.nombre)

    def delete(self):
        self.activo = False
        self.save()
        return True