from __future__ import unicode_literals
from django.db import models
from backend.models import Bodega, Fraccion, Movimiento, LineaProduccion, Usuario, Proyecto


class MovimientoBodega(models.Model):
    INGRESO = 10 #(+)
    DESPACHO = 30 #(-)
    REAJUSTE = 40 #(-)
    BAJA = 50 #(-)

    TIPO = (
        (INGRESO, "Ingreso"),
        (DESPACHO, "Despacho"),
        (REAJUSTE, "Reajuste"),
        (BAJA, "Baja")
    )
    INGRESOLINEA = 10
    INGRESOBODEGA = 20
    INGRESOCOMPRA = 30

    DESPACHOLINEA = 10
    DESPACHOVENTA = 20
    DESPACHOBODEGA = 30
    TIPODESPACHO = (
        (DESPACHOLINEA, 'Despacho a línea'),
        (DESPACHOVENTA, 'Despacho a venta'),
        (DESPACHOBODEGA, 'Despacho a bodega'),
    )
    TIPOINGRESO = (
        (INGRESOLINEA, 'Ingreso desde línea'),
        (INGRESOCOMPRA, 'Ingreso desde compra'),
        (INGRESOBODEGA, 'Ingreso desde bodega'),
    )
    #Padre: sirve para hacer seguimiento de las salidas, despachos
    no_movimiento = models.CharField(max_length=250, null=True, blank=True)
    usuario = models.ForeignKey(Usuario, related_name="movimiento_bodega", blank=True, null=True, on_delete=models.deletion.CASCADE)
    padre = models.ForeignKey("self", related_name="salidas", blank=True, null=True, on_delete=models.deletion.CASCADE)
    lote = models.ForeignKey("backend.Lote", related_name="ajustes", blank=True, null=True, on_delete=models.deletion.CASCADE)
    bodega = models.ForeignKey(Bodega, related_name="movimiento_bodega", on_delete=models.deletion.CASCADE)
    destino = models.ForeignKey(Bodega, related_name="despachos", blank=True, null=True, on_delete=models.deletion.CASCADE)
    movimiento = models.ForeignKey(Movimiento, related_name="movimiento_bodega", blank=True, null=True, on_delete=models.deletion.CASCADE)
    fecha = models.DateField()
    justificacion = models.TextField(blank=True, null=True)
    nota = models.TextField(blank=True, null=True)
    linea = models.ForeignKey(LineaProduccion, related_name="movimiento_bodega", blank=True, null=True, on_delete=models.deletion.CASCADE)
    empresa = models.ForeignKey(Proyecto, related_name="costos_bodega", blank=True, null=True, on_delete=models.deletion.CASCADE)
    entregado = models.BooleanField(default=False)

    tipo = models.IntegerField(choices=TIPO)
    tipoDespacho = models.IntegerField(choices=TIPODESPACHO, blank=True, null=True)
    tipoIngreso = models.IntegerField(choices=TIPOINGRESO, blank=True, null=True)

    justificacionAnulacion = models.TextField(blank=True, null=True)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default= True, blank=True)


    def __str__(self):
        return "id: {} Bodega: {} fecha: {} Tipo{} ".format(
            self.id,
            self.bodega.nombre,
            self.fecha,
            self.get_tipo_display()
        )

    def delete(self):
        self.activo = False
        self.save()
        return True