
from django.core.management.base import BaseCommand
from backend.models import Movimiento


class Command(BaseCommand):

    def cambiar_movimientos(self):
        try:
            movimiento1=Movimiento.objects.filter(pk=15802).update(ventas_ids_id=15838)
            movimiento2=Movimiento.objects.filter(pk=15804).update(ventas_ids_id=15838)
            movimiento3=Movimiento.objects.filter(pk=16174).update(monto=18910)
            movimiento4=Movimiento.objects.filter(pk=16193).update(monto=4800)
        except Exception as e:
            pass
    def handle(self, *args, **options):
        self.cambiar_movimientos()