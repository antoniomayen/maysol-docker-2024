from __future__ import unicode_literals
from django.db import models
from backend.models.proyecto import Proyecto


class Cuenta(models.Model):
    """Cuentas"""
    VENTA = 60
    SUBPROYECTO = 50
    DEUDA = 40
    CAJACHICA = 30
    BANCO = 10

    TIPO = (
        (SUBPROYECTO, 'SUBPROYECTO'),
        (DEUDA, 'DEUDA'),
        (CAJACHICA, 'CAJACHICA'),
        (BANCO, 'BANCO'),
        (VENTA, 'Venta')
    )

    DOLAR = 'USD'
    QUETZAL = 'GTQ'

    MONEDAS = (
        (DOLAR, 'USD'),
        (QUETZAL, 'GTQ')
    )

    numero = models.CharField(max_length = 70, blank=True, null=True)
    nombre = models.CharField(max_length = 130, blank=True, null=True)
    banco = models.CharField(max_length = 130, blank=True, null=True)
    proyecto = models.ForeignKey(Proyecto, related_name='cuentas', blank=True, null=True, on_delete=models.deletion.CASCADE)
    deudor = models.ForeignKey(Proyecto, related_name='deudas', blank=True, null=True, on_delete=models.deletion.CASCADE)
    cuentaAcreedor = models.ForeignKey("backend.cuenta", related_name="deudas_acreedor", blank=True, null=True, on_delete=models.deletion.CASCADE)
    cuentaDeudor = models.ForeignKey("backend.cuenta", related_name="deudas_deudor", blank=True, null=True, on_delete=models.deletion.CASCADE)
    saldo = models.FloatField(blank=True, null=True)
    moneda = models.CharField(choices=MONEDAS, max_length=10)
    movimientoPrestamo = models.ForeignKey('backend.movimiento', related_name="prestamos", blank=True, null=True, on_delete=models.deletion.CASCADE)
    # Si es caja chica el atributo es verdadero
    tipo = models.IntegerField(choices=TIPO, default=BANCO)
    estado = models.BooleanField(default = True)


    
    def __str__(self):
        tipo = 'caja chica'
        tipo = self.get_tipo_display()
        return "{}) NUMERO: {} NOMBRE: {}  TIPO: {}".format(self.id, self.numero, self.nombre, tipo)
    
    def delete(self):
        self.estado = False
        self.save()
        return True