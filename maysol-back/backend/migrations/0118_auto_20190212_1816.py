# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-02-12 18:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0117_auto_20190212_1742'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movimiento',
            name='categoria_recuperacion',
            field=models.IntegerField(blank=True, choices=[(159, 'Depreciación'), (160, 'Depreciación sistemas')], null=True),
        ),
    ]
