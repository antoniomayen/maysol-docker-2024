# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-21 22:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0081_movimiento_cliente'),
    ]

    operations = [
        migrations.AddField(
            model_name='proyecto',
            name='direccion',
            field=models.CharField(blank=True, max_length=140, null=True),
        ),
        migrations.AddField(
            model_name='proyecto',
            name='telefono',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]