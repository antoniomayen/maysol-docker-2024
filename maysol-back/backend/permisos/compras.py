from rest_framework import permissions
from backend.models import Usuario

class ComprasPermission(permissions.BasePermission):
    """
        Permisos para las compras
    """
    message = 'El usuario no tiene los permisos adecuados.'

    def has_permission(self, request, view):
        try:
            usuario = request.user
            acceso = usuario.accesos
            if usuario.is_superuser is True:
                return True
            if acceso.administrador:
                return True
            if acceso.supervisor:
                return True
            if view.action == 'list':
                return (acceso.compras or acceso.bodeguero)
            if(acceso.compras):
                return True
            else:
                return False
        except Usuario.DoesNotExist:
            return False
        except Exception as e:
            return False
