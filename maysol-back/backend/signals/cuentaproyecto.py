from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.models import Proyecto, Cuenta

@receiver(post_save, sender=Proyecto)
def cuentaproyecto(sender, instance, **kwargs):
    if kwargs['created']:
        #Crea una cuenta con los datos del proyecto
        #Y el tipo de la cuenta es 20 que equivale a
        #una cuenta para proyecto
        cuenta = Cuenta.objects.create(
            numero=instance.nombre,
            nombre=instance.nombre,
            banco=instance.nombre,
            proyecto=instance,
            tipo=20
        )