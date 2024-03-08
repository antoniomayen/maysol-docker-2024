from __future__ import unicode_literals
from django.db import models
from backend.models import Categorias, Proyecto, Usuario, Cuenta, Bodega, Proveedor


class Movimiento(models.Model):
    """Modelo para el control de movimientos"""


    ##Formas de transacción
    EFECTIVO = 10
    TARJETA = 20
    TRANSACCION = 30
    CHEQUE = 40
    DEPOSITO = 50
    GUATEACH = 60

    FORMAPAGOS = (
        (EFECTIVO, 'EFECTIVO'),
        (TARJETA, 'TARJETA'),
        (TRANSACCION, 'TRANSACCION'),
        (CHEQUE, 'CHEQUE'),
        (DEPOSITO, 'DEPOSITO'),
        (GUATEACH, 'Guate ACH')
    )
    ## Destino
    CAJACHICA = 10
    PAGOPROVEEDOR = 20
    PROYECTO = 30
    REINTEGRO = 40
    BANCO = 50

    DESTINOS = (
        (CAJACHICA, 'CAJA CHICA'),
        (PAGOPROVEEDOR, 'PROVEEDOR'),
        (PROYECTO, 'PROYECTO'),
        (REINTEGRO, 'REINTEGRO'),
        (BANCO, 'BANCO')
    )

    # Moneda
    USD = 'USD'
    GTQ = 'GTQ'
    MONEDAS = (
        (USD, 'USD'),
        (GTQ, 'GTQ')
    )

    # Categoria de recuperación (Linea 159 y 160)
    DEPRESIACION = 159
    DEPRESIACION_SISTEMA = 160
    ESTABLECIMIENTO_INVERSION = 161
    RECUPERACIONES = (
        (DEPRESIACION, 'Depreciación'),
        (DEPRESIACION_SISTEMA, 'Depreciación sistemas'),
        (ESTABLECIMIENTO_INVERSION, 'Establecimiento de inversión')
    )

    # Registro de llaves foráneas
    usuario = models.ForeignKey(Usuario, related_name="movimiento", on_delete=models.deletion.CASCADE)
    proyecto = models.ForeignKey(Proyecto, related_name="movimientos", blank=True, null=True, on_delete=models.deletion.CASCADE)
    ventas_ids = models.ForeignKey('self', related_name="movimiento_hijo", on_delete=models.SET_NULL, blank=True, null=True)
    # Registro para validar si ya se registro como deposito
    deposito = models.BooleanField(default=False)
    # Registro para validar si es un cierre de de caja de venta
    cierre_ventas = models.BooleanField(default=False)

    # Persona quien realizó el gasto
    persona = models.ForeignKey(Usuario, related_name="gastos", blank=True, null=True, on_delete=models.deletion.CASCADE)
    vehiculo = models.CharField(max_length=140, blank=True, null=True)

    destino = models.IntegerField(choices=DESTINOS, blank=True, null=True)
    formaPago = models.IntegerField(choices=FORMAPAGOS, blank=True, null=True)
    proveedor = models.ForeignKey(Proveedor, related_name="movimientos", blank=True, null=True, on_delete=models.deletion.CASCADE)
    #NoDocumento sirve para guardar, no de cheque, boleta de depósito, no transacción
    noDocumento = models.CharField(max_length=140, blank=True, null=True)
    #No comprobante: sirve para guardar factura o recibo que nos da un proveedor
    noComprobante = models.CharField(max_length=140, blank=True, null=True)
    concepto = models.TextField(blank=True, null=True)
    depositante = models.CharField(max_length=240, blank=True, null=True)
    # Este campo funciona para saber si el movimiento es para un préstamo
    prestamo = models.BooleanField(default=False)

    ##REGISTROS DE MONTOS
    descuento = models.FloatField(default=0)
    monto = models.FloatField()
    saldo = models.FloatField(default=0)

    fecha = models.DateField()

    # Atributos para la anulación
    justificacion = models.TextField(blank=True, null=True)
    anulado = models.BooleanField(default=False)

    # Atributos japonés
    categoria = models.ForeignKey(Categorias, related_name="movimientos", blank=True, null=True, on_delete=models.deletion.CASCADE)
    comentario = models.TextField(blank=True, null=True)

    # plazo de recuperación de un gasto
    # el gasto se ingresa por mes
    plazo = models.IntegerField(blank=True, null=True)
    fecha_inicio_recuperacion = models.DateField(blank=True, null=True)
    fecha_final_recuperacion = models.DateField(blank=True, null=True)
    categoria_recuperacion = models.IntegerField(choices=RECUPERACIONES, blank=True, null=True)  # Se dejo de usar

    # Datos para que el movimiento sea una Orden de compra
    numero_oc = models.CharField(max_length=250, null=True, blank=True)
    es_oc = models.BooleanField(default=False)
    es_ov = models.BooleanField(default=False)
    bodega_entrega = models.ForeignKey(Bodega, related_name="movimientos", null=True, blank=True, on_delete=models.deletion.CASCADE)
    fecha_entrega = models.DateField(null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    ingresado = models.BooleanField(default=False)
    moneda = models.CharField(max_length=15, choices=MONEDAS, default=GTQ)
    pendiente_pago = models.BooleanField(default=False)
    # Se marca si se completo el monto total de la O/C o O/V
    pago_completo = models.BooleanField(default=False)
    # Indica si los productos se despacharon o estan pendientes de despacho
    despacho_inmediato = models.BooleanField(default=False)
    # Si esta marcado entonces se registra el pago automaticamente con una cuenta o caja chica que seleccione
    pago_automatico = models.BooleanField(default=False)
    caja_chica = models.BooleanField(default=False)  # Registra si el pago fue realizado con una caja chica

    # Registra uno  o más movimientos que representan los registros de gastos de una O/C o O/V
    orden = models.ForeignKey("self", related_name="movimiento", null=True, blank=True, on_delete=models.deletion.CASCADE)
    # Total de la OC es el de campo monto

    #Campos para hacer tracking de división de costos
    #ej Empresa compra 100 láminas con un total de 100
    #le da a la subempresa 20 y se carga un gasto a la subempresa de 20
    es_costo = models.BooleanField(default=False)
    linea = models.ForeignKey("backend.LineaProduccion", related_name="costos_linea", blank=True, null=True, on_delete=models.deletion.CASCADE)
    precioUnitario = models.FloatField(default=0)
    padreCosto = models.ForeignKey("self", related_name="costos_hijo", null=True, blank=True, on_delete=models.deletion.CASCADE)
    tiene_compra = models.BooleanField(default=False)
    #Registro de orden de venta
    # Fechas de creación y modificación
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    activo = models.BooleanField(default= True, blank=True)

    def __str__(self):
        return "Movimiento No. {} monto: {}  ".format(self.id, self.monto)

    def delete(self):
        self.anulado = True
        self.save()
        return True

