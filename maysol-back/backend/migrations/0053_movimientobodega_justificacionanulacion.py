# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-12-18 21:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0052_auto_20181218_1832'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimientobodega',
            name='justificacionAnulacion',
            field=models.TextField(blank=True, null=True),
        ),
    ]