# Generated by Django 2.2 on 2020-07-06 16:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0136_auto_20200706_1047'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movimientogranja',
            name='produccion',
        ),
        migrations.RemoveField(
            model_name='movimientogranja',
            name='ventas',
        ),
    ]
