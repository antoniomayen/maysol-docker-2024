# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-12-11 23:05
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0034_auto_20181211_2300'),
    ]

    operations = [
        migrations.AddField(
            model_name='permiso',
            name='usuario',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='usuario',
            name='rol',
            field=models.IntegerField(choices=[(100, 'Administrador'), (50, 'Backoffice'), (80, 'Colaborador')], default=80),
        ),
    ]
