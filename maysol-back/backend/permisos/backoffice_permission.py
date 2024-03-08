from rest_framework import permissions
from backend.models import Usuario

class BackofficePermission(permissions.BasePermission):
    """
        Permiso para un backoffice
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
            if accesos.backoffice == True:
                return True
            else:
                return False
        except Usuario.DoesNotExist:
            return False
        except Exception as e:
            return False