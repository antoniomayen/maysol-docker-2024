# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-23 22:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0091_auto_20190122_2216'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimiento',
            name='despacho_inmediato',
            field=models.BooleanField(default=False),
        ),
    ]
