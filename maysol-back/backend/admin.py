# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from backend.models import *

admin.site.register(Usuario)
admin.site.register(Movimiento)
admin.site.register(Cierre)
admin.site.register(Cuenta)
admin.site.register(Proyecto)
admin.site.register(Afectados)
admin.site.register(Categorias)
admin.site.register(Producto)
admin.site.register(Fraccion)
admin.site.register(Proveedor)
admin.site.register(Permiso)
admin.site.register(MovimientoBodega)
admin.site.register(DetalleMovBodega)
admin.site.register(DetalleMovimiento)
admin.site.register(LineaProduccion)
admin.site.register(Lote)
admin.site.register(Inventario)
admin.site.register(MovimientoGranja)
admin.site.register(DetalleMovGranja)
admin.site.register(Preciofraccion)
admin.site.register(Bodega)