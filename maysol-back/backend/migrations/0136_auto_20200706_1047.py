# Generated by Django 2.2 on 2020-07-06 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0135_auto_20200704_1626'),
    ]

    operations = [
        migrations.AddField(
            model_name='movimientogranja',
            name='produccion',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='movimientogranja',
            name='ventas',
            field=models.FloatField(blank=True, null=True),
        ),
    ]