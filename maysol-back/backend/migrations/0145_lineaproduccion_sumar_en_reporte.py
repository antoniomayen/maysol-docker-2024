# Generated by Django 2.2 on 2020-07-15 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0144_movimientogranja_postura'),
    ]

    operations = [
        migrations.AddField(
            model_name='lineaproduccion',
            name='sumar_en_reporte',
            field=models.BooleanField(default=False),
        ),
    ]
