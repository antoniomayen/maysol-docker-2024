# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-11-23 15:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0019_auto_20181122_1827'),
    ]

    operations = [
        migrations.AddField(
            model_name='cierre',
            name='fechaCierre',
            field=models.DateField(blank=True, null=True),
        ),
    ]
