# -*- coding: utf-8 -*-
# Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
from django.db import transaction
from django.db.models import Q, F, Sum

from backend.models import Proveedor, CuentaProveedor, ContactoProveedor
from backend.serializers import ProveedorSerializer
from django_filters.rest_framework import DjangoFilterBackend
# Importación de permisos
from backend.permisos import AdministradorPermission
from rest_framework.permissions import IsAuthenticated


class ProveedorViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProveedorSerializer
    serializer_classes = {
        'GET': ProveedorSerializer
    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = (
        'id',
        'empresa__id',
        'empresa'
    )
    search_fields = (
        'id',
        'nombre',
        'codigo',
        'nit'
    )

    def get_queryset(self):
        usuario = self.request.user
        proveedores = Proveedor.objects\
            .filter(activo=True)\
            .filter(es_cliente=False).filter(Q(empresa__id=usuario.proyecto_id) | Q(empresa=None)).order_by('-id')
        acceso = usuario.accesos
        if usuario.is_superuser == True or acceso.administrador == True:
            proveedores = Proveedor.objects\
                .filter(activo=True)\
                .filter(es_cliente=False).order_by('-id')
        if acceso.supervisor == True:
            proveedores = Proveedor.objects\
                .filter(activo=True)\
                .filter(es_cliente=False).filter( Q(empresa__id=usuario.proyecto_id) | Q(empresa=None)).order_by('-id')
        self.filter_queryset(proveedores)
        return proveedores

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        usuario = request.user
        nombre = data.get("nombre", None)
        nit = data.get("nit", None)
        codigo = data.get("codigo", None)
        correo_caja = data.get("correo_caja", None)
        contactos = data.get("contactos", None)
        cuentas = data.get("cuentas", None)
        empresa = data.get("empresa", usuario.proyecto_id)

        proveedor = Proveedor(nombre=nombre, nit=nit, codigo=codigo, correo_caja=correo_caja, empresa_id=empresa)
        proveedor.save()
        if cuentas is not None:
            for _cuenta in cuentas:
                cuenta = CuentaProveedor(proveedor=proveedor, banco=_cuenta["banco"], numero=_cuenta["numero"],
                                         tipo=_cuenta["tipo"])
                cuenta.save()
        if contactos is not None:
            for _contacto in contactos:
                contacto = ContactoProveedor(proveedor=proveedor, nombre=_contacto["nombre"], puesto=_contacto["puesto"],
                                             telefono=_contacto["telefono"], correo=_contacto["correo"])
                contacto.save()

        return Response(status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        query = request.query_params
        usuario = request.user
        data = request.data
        contactos_borrados = data.get("contactosBorrados", None)
        cuentas_borradas = data.get("cuentasBorrados", None)
        contactos = data.get("contactos", None)
        cuentas = data.get("cuentas", None)
        empresa = data.get("empresa", usuario.proyecto_id)
        empresa_id = empresa
        if type(empresa) is dict:
            empresa_id = empresa.get("id")
        try:
            proveedor = Proveedor.objects.get(pk=kwargs["pk"])
            proveedor.nit = data.get("nit", None)
            proveedor.codigo = data.get("codigo", None)
            proveedor.correo_caja = data.get("correo_caja", None)
            proveedor.nombre = data.get("nombre", None)
            proveedor.empresa_id = empresa_id
            proveedor.save()
            if cuentas is not None:
                for _cuenta in cuentas:
                    if _cuenta.get("id", False):
                        cuenta = CuentaProveedor.objects.get(pk=_cuenta["id"])
                        cuenta.banco = _cuenta["banco"]
                        cuenta.numero = _cuenta["numero"]
                        cuenta.tipo = _cuenta["tipo"]
                        cuenta.save()
                    else:
                        cuenta = CuentaProveedor(proveedor=proveedor, banco=_cuenta["banco"], numero=_cuenta["numero"],
                                                 tipo=_cuenta["tipo"])
                        cuenta.save()
            if contactos is not None:
                for _contacto in contactos:
                    if _contacto.get("id", False):
                        contacto = ContactoProveedor.objects.get(pk=_contacto["id"])
                        contacto.nombre = _contacto["nombre"]
                        contacto.puesto = _contacto["puesto"]
                        contacto.telefono = _contacto["puesto"]
                        contacto.correo = _contacto["correo"]
                        contacto.save()
                    else:
                        contacto = ContactoProveedor(proveedor=proveedor, nombre=_contacto["nombre"],
                                                     puesto=_contacto["puesto"],
                                                     telefono=_contacto["telefono"], correo=_contacto["correo"])
                        contacto.save()

            # Borrar cuentas
            for cuentas_b in cuentas_borradas:
                cuenta = CuentaProveedor.objects.get(pk=cuentas_b["id"])
                cuenta.activo = False
                cuenta.save()
            # Borrar contactos
            for contactos_b in contactos_borrados:
                contacto = ContactoProveedor.objects.get(pk=contactos_b["id"])
                contacto.activo = False
                contacto.save()
        except Proveedor.DoesNotExist:
            return Response({"message": "El proveedor que se quiere actualizar no existe"},
                            status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)


    @list_route(methods=["get"])
    def getTodo(self, request, *args, **kwargs):
        query = self.get_queryset()
        serializer = ProveedorSerializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
