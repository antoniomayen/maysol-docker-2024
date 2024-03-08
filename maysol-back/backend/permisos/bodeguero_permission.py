from rest_framework import permissions
from backend.models import Usuario

class BodegueroPermission(permissions.BasePermission):
    """
        Permisos para un bodeguero
    """
    message = 'El usuario no tiene los permisos adecuados.'
    
    def has_permission(self, request, view):
        try:
            usuario = request.user
            acceso = usuario.accesos
            if usuario.is_superuser is True:
                return True
            if(accesos.administrador == True):
                return True
            if(acceso.bodeguero == True):
                return True
            else:
                return False
        except Usuario.DoesNotExist:
            return False
        except Exception as e:
            return False