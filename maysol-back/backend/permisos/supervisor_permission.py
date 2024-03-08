from rest_framework import permissions
from backend.models import Usuario

class SupervisorPermission(permissions.BasePermission):
    """
        Permisos para todos los para el supervisor de proyecto, este tiene asignado el número
        10 al rol
    """
    message = 'El usuario no tiene los permisos adecuados.'
    
    def has_permission(self, request, view):
        try:
            usuario = request.user
            accesos = usuario.accesos
            if usuario.is_superuser is True:
                return True
            if accesos.administrador == True:
                return True
            if(accesos.supervisor == True):
                return True
            else:
                return False
        except Usuario.DoesNotExist:
            return False
        except Exception as e:
            return False