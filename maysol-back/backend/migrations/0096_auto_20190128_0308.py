# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-01-28 03:08
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0095_preciofraccion'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='moneda',
            field=models.CharField(blank=True, choices=[('USD', 'USD'), ('GTQ', 'GTQ')], default='GTQ', max_length=10, null=True),
        ),
    ]
