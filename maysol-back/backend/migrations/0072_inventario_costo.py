# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-15 17:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0071_movimientobodega_no_movimiento'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventario',
            name='costo',
            field=models.FloatField(default=0),
        ),
    ]
