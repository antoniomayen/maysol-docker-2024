# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-31 18:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0102_movimiento_preciounitario'),
    ]

    operations = [
        migrations.AddField(
            model_name='detallemovbodega',
            name='movimientoCosto',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='costos_detalle', to='backend.Movimiento'),
        ),
    ]