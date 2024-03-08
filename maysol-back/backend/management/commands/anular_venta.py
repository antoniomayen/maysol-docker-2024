from django.core.management.base import BaseCommand
from backend.models import Inventario, Movimiento, MovimientoBodega
from django.db import transaction
class Command(BaseCommand):

    def add_arguments(self, parser):
        parser.add_argument('codigo', type=str, nargs='?', default=None)

    def anular(self, codigo):
        venta = movimiento = Movimiento.objects.get(pk=codigo)
        try:
            detalle_pagos = movimiento.movimiento.all()
            print("Anulando venta", codigo)
            with transaction.atomic():
                ##Anulacion de pagos realizados
                for _pago in detalle_pagos:
                    _pago.justificacion = "Se volvió a realizar la venta"
                    _pago.delete()
                ## Fin de anulación de pagos
                ## anulación de despachos
                movimientosBodega = MovimientoBodega.objects.filter(
                    movimiento=venta
                )
                for _movBodega in movimientosBodega:
                    detalleMov = _movBodega.detalle_movimiento.all()
                    for _row in detalleMov:
                        inventario = Inventario.objects.get(lote=_row.lote, stock=_row.stock, bodega=_movBodega.bodega)
                        inventario.cantidad += _row.cantidad
                        inventario.save()
                    _movBodega.activo = False
                    _movBodega.justificacionAnulacion = "Se volvió a realizar la venta"
                    _movBodega.save()
                ## Anulación de compra
                venta.justificacion = "Se volvió a realizar la venta"
                venta.save()
                venta.delete()
        except Exception as e:
            pass

    def handle(self, *args, **options):
        self.anular(options["codigo"])
