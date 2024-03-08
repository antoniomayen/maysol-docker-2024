# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from backend.models.cuenta  import Cuenta
from backend.models.proyecto import Proyecto
from django.contrib.auth.models import AbstractUser
from .permisos import Permiso
##Permisos MaySol



class Usuario(AbstractUser):
    """Perfil"""
    ##Permisos MaySol
    ADMINISTRADOR = 100 #SuperAdministrador
    """ Constante para un superadministrador"""
    BACKOFFICE = 50 #Supervisor de proyecto
    COLABORADOR = 80 #Usuario de backoffice

    PUESTOS = (
        (ADMINISTRADOR, 'Administrador'), 
        (BACKOFFICE, 'Backoffice'), 
        (COLABORADOR, 'Colaborador'),
    )
    telefono = models.CharField(max_length = 120, null= True, blank = True)
    accesos = models.OneToOneField(Permiso, on_delete=models.CASCADE, blank=True, null=True)

    puestos = models.IntegerField(choices=PUESTOS, default=COLABORADOR)
    descripcion = models.CharField(max_length = 240,  null = True, blank = True)
    proyecto = models.ForeignKey(Proyecto, related_name="proyectos", on_delete=models.deletion.CASCADE)
    cajachica = models.OneToOneField(Cuenta, on_delete=models.CASCADE)
    caja_venta = models.OneToOneField(Cuenta, related_name="caja_venta", on_delete=models.CASCADE)
    
    def __str__(self):
        return self.username

    def delete(self):
        self.is_active = False
        self.save()
        return True