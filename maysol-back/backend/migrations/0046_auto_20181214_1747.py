# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-12-14 17:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0045_movimientobodega_padre'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movimientobodega',
            name='tipo',
            field=models.IntegerField(choices=[(10, 'Ingreso'), (20, 'Salida'), (30, 'Despacho'), (40, 'Reajuste'), (50, 'Baja')]),
        ),
    ]
