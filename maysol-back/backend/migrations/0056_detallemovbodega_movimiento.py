# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-12-19 16:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0055_movimientobodega_entregado'),
    ]

    operations = [
        migrations.AddField(
            model_name='detallemovbodega',
            name='movimiento',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='detalle_movimiento', to='backend.MovimientoBodega'),
        ),
    ]
