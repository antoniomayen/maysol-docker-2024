# Generated by Django 2.2 on 2020-08-04 20:26

from django.db import migrations

from backend.models import Cierre
from backend.utils import calcularSaldo


def registroo(apps, schema_editor):

    try:
        cierre = Cierre.objects.get(id=728)
        cierre.fin = round(calcularSaldo.calcularSaldo(cierre), 2)
        cierre.save()

        cierre2 = Cierre.objects.get(id=754)
        cierre2.fin = round(calcularSaldo.calcularSaldo(cierre2), 2)
        cierre2.save()

        cierre3 = Cierre.objects.get(id=775)
        cierre3.fin = round(calcularSaldo.calcularSaldo(cierre3), 2)
        cierre3.save()

        cierre4 = Cierre.objects.get(id=780)
        cierre4.fin = round(calcularSaldo.calcularSaldo(cierre4), 2)
        cierre4.save()

        cierre5 = Cierre.objects.get(id=787)
        cierre5.fin = round(calcularSaldo.calcularSaldo(cierre5), 2)
        cierre5.save()
    except:
        pass

class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0145_lineaproduccion_sumar_en_reporte'),
    ]

    operations = [
        migrations.RunPython(registroo)
    ]