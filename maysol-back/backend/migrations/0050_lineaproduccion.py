# -*- coding: utf-8 -*-
# Generated by Django 1.11.1 on 2018-12-15 18:28
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0049_merge_20181215_1615'),
    ]

    operations = [
        migrations.CreateModel(
            name='LineaProduccion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('activo', models.BooleanField(default=True)),
                ('empresa', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lineaproduccion', to='backend.Proyecto')),
            ],
        ),
    ]
