from __future__ import unicode_literals
from django.db import models
from backend.models import Bodega, Fraccion, Lote, MovimientoBodega, Movimiento


class Inventario(models.Model):
    lote = models.ForeignKey(Lote, related_name="inventario", on_delete=models.deletion.CASCADE)
    bodega = models.ForeignKey(Bodega, related_name="inventario", on_delete=models.deletion.CASCADE)
    stock = models.ForeignKey(Fraccion, related_name="inventario", on_delete=models.deletion.CASCADE)
    movimiento = models.ForeignKey(Movimiento, related_name="costos", blank=True, null=True, on_delete=models.deletion.CASCADE)
    cantidad = models.IntegerField()
    costo_unitario = models.FloatField(default=0)
    costo_total = models.FloatField(default=0)

    activo = models.BooleanField(default=True)

    def __str__(self):
        return "Bodega: {} Producto: {}-{} Lote: {}, Cantidad: {}".format(
            self.bodega.nombre,
            self.stock.producto.nombre,
            self.stock.presentacion,
            self.lote.lote,
            self.cantidad
        )
    
    def delete(self):
        self.activo = True
        self.save()
        return True