
# -*- coding: utf-8 -*-

from __future__ import unicode_literals
from django.db import models
from backend.models import  Producto


class Fraccion(models.Model):
    """Modelo para las fracciones de los productos"""
    producto = models.ForeignKey(Producto, related_name="fracciones", on_delete=models.deletion.CASCADE)
    # unidad medida?

    #Relación protegida, si se borra una fracción se debe eliminar la relación con sus hijos
    parent = models.ForeignKey("self", null=True, blank=True, related_name="hijos", on_delete=models.deletion.PROTECT)
    minimo_existencias = models.FloatField(null=True, blank=True)


    #Nombre específico de la medida: Caja, cartón, huevo
    presentacion = models.CharField( max_length=150)

    capacidad_maxima = models.FloatField(default=1)


    #Manejo de precios
    precio = models.FloatField(null=True, blank=True)
    precio2 = models.FloatField(null=True, blank=True)
    precio3 = models.FloatField(null=True, blank=True)

    precioUSD = models.FloatField(null=True, blank=True)
    precioUSD2 = models.FloatField(null=True, blank=True)
    precioUSD3 = models.FloatField(null=True, blank=True)

    vendible = models.BooleanField(default=True)
    costo = models.FloatField(null=True, blank=True)
    
    #Para el control de movimientos
    fecha_ultima_compra = models.DateTimeField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    #Campos de control de modificación
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)


    def __str__(self):
        return "{}) Producto: {} Fracción: {} Costo: {}".format(self.id, self.producto.nombre, self.presentacion, self.costo)
    
    def delete(self):
        self.activo = False
        self.save()
        return True