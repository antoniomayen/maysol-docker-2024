from __future__ import unicode_literals

from django.db import models

from backend.models import Bodega, MovimientoBodega, Proyecto, LineaProduccion


class Lote(models.Model):
    #Padre: sirve para hacer seguimiento de las salidas, despachos
    padre = models.ForeignKey("self", related_name="lotes", blank=True, null=True, on_delete=models.deletion.CASCADE)
    bodega = models.ForeignKey(Bodega, related_name="lotes", on_delete=models.deletion.CASCADE)
    movimiento = models.ManyToManyField(MovimientoBodega, related_name="lotes")
    
    lote = models.DateField()
    justificacionAnulacion = models.TextField(blank=True, null=True)
    
    linea = models.ForeignKey(LineaProduccion, related_name="lotes", blank=True, null=True, on_delete=models.deletion.CASCADE)
    empresa = models.ForeignKey(Proyecto, related_name="lotes", blank=True, null=True, on_delete=models.deletion.CASCADE)

    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default= True, blank=True)


    def __str__(self):
        return "id: {} Bodega: {} Lote: {}".format(
            self.id,
            self.bodega.nombre,
            self.lote
        )

    def delete(self):
        self.activo = False
        self.save()
        return True
