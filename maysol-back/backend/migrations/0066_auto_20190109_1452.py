# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-09 14:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0065_auto_20190108_2325'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movimiento',
            name='moneda',
            field=models.CharField(choices=[('USD', 'USD'), ('GTQ', 'GTQ')], default='GTQ', max_length=15),
        ),
    ]
