# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-08 23:25
from __future__ import unicode_literals

from django.db import migrations


def _method(apps, schema_editor):
    "Migrar los datos de la empresa"
    Movimiento = apps.get_model("backend", "Movimiento")
    Cierre = apps.get_model("backend", "Cierre")

    movimientos = Movimiento.objects.filter(moneda__isnull=True)
    for movimiento in movimientos:
        try:
            cierre = Cierre.objects.get(movimientos__movimiento=movimiento.id)
            cuenta = cierre.cuenta
            movimiento.moneda = cuenta.moneda
        except:
            movimiento.moneda = "GTQ"
        movimiento.save()


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0064_merge_20190107_1904'),
    ]

    operations = [
        migrations.RunPython(_method, reverse_code=migrations.RunPython.noop),
    ]
