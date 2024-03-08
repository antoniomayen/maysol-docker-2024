from __future__ import unicode_literals
from django.db import models
from backend.models import Bodega, Fraccion, Lote, MovimientoBodega


class DetalleMovBodega(models.Model):

    lote = models.ForeignKey(Lote, related_name="lote_detalle", blank=True, null=True, on_delete=models.deletion.CASCADE)
    stock = models.ForeignKey(Fraccion, related_name="stock_bodega", on_delete=models.deletion.CASCADE)
    #Guarda el registro de cómo esta el estaba el stock antes del movimiento
    cantidadInicial = models.IntegerField()
    #Guarda en cuanto quedó el stock 
    cantidadFinal = models.IntegerField(blank=True, null=True)
    cantidadActual = models.IntegerField(blank=True, null=True)
    cantidad = models.IntegerField(blank=True, null=True)
    movimiento = models.ForeignKey(MovimientoBodega, related_name="detalle_movimiento", blank=True, null=True, on_delete=models.deletion.CASCADE)
    movimiento_original = models.ForeignKey(MovimientoBodega, related_name="detalle_presentacion", blank=True, null=True, on_delete=models.deletion.CASCADE)
    movimientoCosto = models.ForeignKey('backend.Movimiento', related_name="costos_detalle", blank=True, null=True, on_delete=models.deletion.CASCADE)
    #Guarda los costos del producto 
    costo_unitario = models.FloatField(default=0)
    costo_total = models.FloatField(default=0)
    activo = models.BooleanField(default= True, blank=True)


    def __str__(self):
        return "id: {} Fracción: {} Inicio: {} Actual: {}".format(
                self.id, 
                self.stock.id,
                self.cantidadInicial,
                self.cantidadFinal
            )

    def delete(self):
        self.activo = False
        self.save()
        return True