# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-02-01 14:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0104_movimiento_padrecosto'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimiento',
            name='tiene_compra',
            field=models.BooleanField(default=False),
        ),
    ]
