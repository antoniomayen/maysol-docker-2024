
from django.core.management.base import BaseCommand
from backend.models import Movimiento


class Command(BaseCommand):

    def cambiar_deposito(self):
        try:
            movimiento1=Movimiento.objects.filter(pk=1465).update(deposito=1)
            movimiento2=Movimiento.objects.filter(pk=1479).update(deposito=1)
            movimiento3=Movimiento.objects.filter(pk=1475).update(deposito=1)
            movimiento4=Movimiento.objects.filter(pk=1477).update(deposito=1)
            movimiento5=Movimiento.objects.filter(pk=1473).update(deposito=1)
            movimiento6=Movimiento.objects.filter(pk=1471).update(deposito=1)
            movimiento7=Movimiento.objects.filter(pk=1467).update(deposito=1)
            movimiento8=Movimiento.objects.filter(pk=1469).update(deposito=1)
        except Exception as e:
            pass

    def handle(self, *args, **options):
        self.cambiar_deposito()