# Generated by Django 2.2 on 2020-06-24 22:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0131_auto_20200624_1542'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movimiento',
            name='deposito',
            field=models.BooleanField(default=False),
        ),
    ]