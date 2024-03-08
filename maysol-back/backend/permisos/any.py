from rest_framework import permissions
from django.contrib.auth.models import User


class AnyPermission(permissions.BasePermission):
    """
    Autorizar pagos Permission
    """
    message = 'El usuario no tiene los permisos adecuados.'

    def has_permission(self, request, view):
        return True