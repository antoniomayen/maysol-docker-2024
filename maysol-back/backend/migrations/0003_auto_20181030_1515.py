# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-10-30 15:15
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0002_auto_20181029_0354'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cierre',
            name='origen',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='backend.Movimiento'),
        ),
    ]
