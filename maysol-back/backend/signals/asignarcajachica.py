from django.db.models.signals import post_save
from django.dispatch import receiver
from backend.models import Usuario, AsignacionCuenta, Cuenta, Proyecto

@receiver(post_save, sender=Usuario)
def asignarcajachica(sender, instance, **kwargs):
    if kwargs['created']:
        #Si el usuario es supervisor se crea una nueva cuenta 
        #del tipo caja chica, entonces esta caja se le asigna al usuario
        #CAJACHICA = 30
        # BANCO = 10
        

        #Si el usuario es un supervisor
        #se le asigna una cuenta de proyecto
        if instance.permisos == 10:
            nombreUsuario = instance.last_name + instance.first_name
            cuenta = Cuenta.objects.create(
                numero="Caja chica",
                nombre=nombreUsuario,
                banco=nombreUsuario,
                proyecto=instance.proyecto,
                tipo=30
            )
            ## Luego de crear la caja chica se asigna 
            asignacion = AsignacionCuenta.objects.create(
                usuario=instance,
                cuenta=cuenta
            )
            cuentaProyecto = instance.proyecto.cuentas.get(tipo=10)
            AsignacionCuenta.objects.create(
                usuario=instance,
                cuenta=cuentaProyecto
            )
        elif instance.permisos == 20:
            cuentasProyectos = Cuenta.objects.filter(tipo=10, proyecto__isnull=False)
            for cuenta in cuentasProyectos:
                nombre = "CChica {}".format(cuenta.nombre)
                banco= "{}-CCH-{}".format(cuenta.nombre, instance.first_name)
                nuevo = Cuenta.objects.create(
                    numero=nombre,
                    nombre=nombre,
                    banco=cuenta.nombre,
                    proyecto=cuenta.proyecto,
                    tipo=30
                )
                AsignacionCuenta.objects.create(
                    usuario=instance,
                    cuenta=nuevo
                )

            



