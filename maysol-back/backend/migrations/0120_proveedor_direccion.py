# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2019-03-20 18:21
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0119_auto_20190212_2048'),
    ]

    operations = [
        migrations.AddField(
            model_name='proveedor',
            name='direccion',
            field=models.TextField(blank=True, null=True),
        ),
    ]