# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-12-10 23:50
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0031_auto_20181210_1736'),
    ]

    operations = [
        migrations.AddField(
            model_name='cuenta',
            name='moneda',
            field=models.CharField(choices=[('USD', 'USD'), ('GTQ', 'GTQ')], default='GTQ', max_length=10),
        ),
    ]