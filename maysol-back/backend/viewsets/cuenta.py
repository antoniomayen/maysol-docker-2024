#Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.db import transaction
from backend.viewsets.serializer_mixin import SwappableSerializerMixin

from backend.models import Cuenta, Cierre, Movimiento, Usuario
from backend.serializers.cuenta import CuentaSerializer, CuentaReadSerializer, CuentaPrestamoSerializer, CuentaVentaReadSerializer

from django_filters.rest_framework import DjangoFilterBackend

#Importación de permisos
from backend.permisos import AnyPermission, AdministradorPermission, SupervisorPermission, ActionBasedPermission, ComprasPermission
from rest_framework.permissions import IsAuthenticated


class CuentaViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = (ActionBasedPermission,)
    queryset = Cuenta.objects.filter(estado = True)
    serializer_class = CuentaSerializer
    serializer_classes = {
        'GET': CuentaReadSerializer
    }
    action_permissions = {
        IsAuthenticated: [
            'getMeCVenta','list',
            'getSelectCuenta',
        ],
        AdministradorPermission: ['update', 'partial_update', 'destroy', 'create'],
        SupervisorPermission: [
            'retrieve',
            'getInfoCuenta',
            'getCuentasProyectos'
            ],
        ComprasPermission: [
            'list'
        ]

    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = ('id', 'numero', 'banco', 'nombre')
    search_fields = ('numero', 'banco', 'nombre')
    def get_queryset(self):
        usuario = self.request.user
        if usuario.accesos.administrador==True:
            cuentas = Cuenta.objects.filter(estado=True, tipo=Cuenta.BANCO)
        else:
            cuentas = Cuenta.objects.filter(estado=True, tipo=Cuenta.BANCO, proyecto=usuario.proyecto)
        return cuentas

    @list_route(methods=["get"], permission_classes=[ SupervisorPermission],url_path='getInfoCuenta/(?P<id>[0-9]+)')
    def getInfoCuenta(self, request,id=None, *args, **kwargs):
        user = self.request.user
        if user.accesos.administrador == True:
            cuenta = Cuenta.objects.get(id=id)
        else:
            cuenta = Cuenta.objects.get(proyecto=user.proyecto, tipo=10)
        serializer = CuentaReadSerializer(cuenta)
        return Response(serializer.data, status=status.HTTP_200_OK)
    #Retorna todas las cuentas bancarias que se le puede asignar a un proyecto
    @list_route(methods=["get"])
    def getSelectCuenta(self, request, *args, **kwargs):
        cuentas = self.get_queryset()
        cuentas = self.filter_queryset(cuentas)
        serializer = CuentaReadSerializer(cuentas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getCuentasProyectos(self, request, *args, **kwargs):
        cuentas = Cuenta.objects.filter(tipo=10, proyecto__fase=20)
        serializer = CuentaReadSerializer(cuentas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["get"],permission_classes=[IsAuthenticated])
    def getEstadoCuenta(self, request, cuenta=None, *args, **kwargs):
        try:
            user = self.request.user
            if user.accesos.administrador == True:
                cuentas = Cuenta.objects.filter(estado=True).exclude(tipo=10)
            else:
                cuentas = Cuenta.objects.filter(cuentas__usuario = user, estado=True)
            serializer = CuentaReadSerializer(cuentas, many=True)
            return Response({'results': serializer.data}, status= status.HTTP_200_OK)
        except Cuenta.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status= status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getMeCVenta(self, request, *args, **kwargs):
        try:
            user = self.request.user

            query = request.query_params
            users = Usuario.objects.filter(id=query.get("id")).last()
            if user.accesos.administrador == False:
                serializer = CuentaVentaReadSerializer(user.caja_venta, context={"user": user, "cuenta": user.caja_venta})
            else:
                serializer = CuentaVentaReadSerializer(user.caja_venta, context={"user": users, "cuenta": users.caja_venta if users is not None else None})
            return Response(serializer.data)
        except Cuenta.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)
    #CAJACHICA = 30
    #BANCO = 10
    @list_route(methods=["get"], permission_classes=[IsAuthenticated])
    def getMeCChica(self, request, *args, **kwargs):
        try:
            user = self.request.user
            cuentas = Cuenta.objects.filter(estado=True, tipo=30, usuario=user)
            serializer = CuentaReadSerializer(cuentas, many=True)
            return Response({'results': serializer.data}, status= status.HTTP_200_OK)
        except expression as identifier:
            pass

    @list_route(methods=["get"], permission_classes=[IsAuthenticated])
    def getMeCuentasBancarias(self, request, cuenta=None, *args, **kwargs):
        try:
            user = self.request.user
            if user.accesos.administrador == True:
                cuentas = Cuenta.objects.filter(estado=True, tipo=10)
            else:
                cuentas = Cuenta.objects.filter(usuario = user, estado=True, tipo=10)
            serializer = CuentaReadSerializer(cuentas, many=True)
            return Response({'results': serializer.data}, status= status.HTTP_200_OK)
        except Cuenta.DoesNotExist:
            return Response({'detail': 'No existe la cuenta.'}, status= status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        model = self.get_object()
        cuenta = Cuenta.objects.get(pk=model.id)
        movimientos = 0
        try:
            cierre = Cierre.objects.get(cuenta=cuenta)
            movimientos = Movimiento.objects.filter(afectados__cierre=cierre).count()
        except:
            movimientos = 0

        if movimientos <= 0:
            cuenta.estado = False
            cuenta.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'No se puede borrar la cuenta porque tiene movimientos activos.'},
                            status=status.HTTP_400_BAD_REQUEST)

