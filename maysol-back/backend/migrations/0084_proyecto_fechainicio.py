# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-22 16:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0083_movimientogranja_hora'),
    ]

    operations = [
        migrations.AddField(
            model_name='proyecto',
            name='fechaInicio',
            field=models.DateField(blank=True, null=True),
        ),
    ]
