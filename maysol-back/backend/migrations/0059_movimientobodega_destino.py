# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-12-20 18:35
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0058_auto_20181220_1532'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimientobodega',
            name='destino',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='despachos', to='backend.Bodega'),
        ),
    ]