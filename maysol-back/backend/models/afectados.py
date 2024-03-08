from __future__ import unicode_literals
from django.db import models
from backend.models import Cierre, Movimiento

class Afectados(models.Model):
    """MODELO DE REGISTRO PARA SABER QUÉ CIERRES ESTÁN AFECTADOS EN EL MOVIMIENTO"""
    DEPOSITO = 10 # (+)
    GASTO = 20 # (-)
    RETIRO = 30 # (-)
    GASTODEUDA = 40 #(-)
    PAGODEUDA = 50 #(+)
    RETIROPRESTAMO = 60 #(-)
    DEPOSITOPRESTAMO = 70 #(+)
    VENTA = 70

    TIPOMOVIMIENTO  = (
        (DEPOSITO, 'DEPOSITO'),
        (GASTO, 'GASTO'),
        (RETIRO, 'RETIRO'),
        (GASTODEUDA, 'GASTO DEUDA'),
        (PAGODEUDA, 'PAGO DEUDA'),
        (VENTA, 'Venta')
    )
    cierre = models.ForeignKey(Cierre, related_name="movimientos", on_delete=models.deletion.CASCADE)
    movimiento = models.ForeignKey(Movimiento, related_name="afectados", on_delete=models.deletion.CASCADE)
    tipo = models.IntegerField(choices=TIPOMOVIMIENTO, default=GASTO)

    def __str__(self):
        
        if self.tipo == Afectados.DEPOSITO:
            tipo='Deposito'
        elif self.tipo == Afectados.GASTO:
            tipo="Gasto"
        elif self.tipo == Afectados.RETIRO:
            tipo="Retiro"
        elif self.tipo == Afectados.GASTODEUDA:
            tipo="Gasto deuda"
        elif self.tipo == Afectados.PAGODEUDA:
            tipo="Pago deuda"
        elif self.tipo == Afectados.RETIROPRESTAMO:
            tipo="Retiro Prestamo"
        elif self.tipo == Afectados.DEPOSITOPRESTAMO:
            tipo="Deposito prestamo"
        return "id: {} ==tipo: {} ==cuenta:{}==movimiento: {}".format(self.id, tipo, self.cierre.cuenta, self.movimiento )