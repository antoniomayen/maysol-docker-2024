# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-31 15:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0100_auto_20190130_2156'),
    ]

    operations = [
        migrations.AddField(
            model_name='inventario',
            name='movimiento',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='costos', to='backend.Movimiento'),
        ),
        migrations.AddField(
            model_name='movimiento',
            name='es_costo',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='movimiento',
            name='linea',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='costos_linea', to='backend.LineaProduccion'),
        ),
    ]