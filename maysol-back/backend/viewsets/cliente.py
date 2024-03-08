# -*- coding: utf-8 -*-
# Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.db import transaction
from backend.models import Proveedor, CuentaProveedor, ContactoProveedor
from backend.serializers import ClienteSerializer
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
# Importación de permisos
from backend.permisos import AdministradorPermission
from backend.utils.exceptions import ErrorDeUsuario
from rest_framework.permissions import IsAuthenticated


class ClientesViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ClienteSerializer
    serializer_classes = {
        'GET': ClienteSerializer
    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = (
        'id',
        'empresa'
    )
    search_fields = (
        'nombre',
        'nit'
    )
    def get_queryset(self):
        usuario = self.request.user
        clientes = Proveedor.objects\
            .filter(activo=True)\
            .filter(es_cliente=True)\
            .filter(Q(empresa__id=usuario.proyecto_id) | Q(empresa=None))\
            .order_by('-id')
        acceso = usuario.accesos
        if acceso.administrador == True:
            clientes = Proveedor.objects\
                .filter(activo=True)\
                .filter(es_cliente=True).order_by('-id')
        if acceso.supervisor == True:
            clientes = Proveedor.objects\
                .filter(activo=True)\
                .filter(es_cliente=True).filter( Q(empresa__id=usuario.proyecto_id) | Q(empresa=None)).order_by('-id')
        self.filter_queryset(clientes)
        return clientes

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
        descripcion = data.get("descripcion", None)
        direccion = data.get("direccion", None)
        
        try:
            with transaction.atomic():
                if contactos is not None:
                    for _contacto in contactos:
                        if _contacto.get('nombre', None) is None:
                            raise ErrorDeUsuario('Debe de ingresar el nombre del contacto')
                        if _contacto.get('telefono', None) is None:
                            raise ErrorDeUsuario('Debe de ingresar el teléfono del contacto')

                cliente = Proveedor(
                    nombre=nombre, 
                    nit=nit, 
                    codigo=codigo, 
                    correo_caja=correo_caja, 
                    empresa_id=empresa, 
                    es_cliente=True,
                    descripcion=descripcion,
                    direccion=direccion
                    )
                cliente.save()
                if cuentas is not None:
                    for _cuenta in cuentas:
                        cuenta = CuentaProveedor(proveedor=cliente, banco=_cuenta["banco"], numero=_cuenta["numero"],
                                                tipo=_cuenta["tipo"])
                        cuenta.save()
                if contactos is not None:
                    for _contacto in contactos:
                        contacto = ContactoProveedor(
                            proveedor=cliente, 
                            nombre=_contacto.get("nombre", None), 
                            puesto=_contacto.get("puesto", None),
                            telefono=_contacto.get("telefono", None), 
                            correo=_contacto.get("correo", None))
                        contacto.save()
            return Response(status=status.HTTP_201_CREATED)
        except ErrorDeUsuario as e:
            return  Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
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
        descripcion = data.get("descripcion", None)
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
            proveedor.descripcion = descripcion
            proveedor.direccion = data.get('direccion', None)
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
                        contacto.nombre = _contacto.get("nombre")
                        contacto.puesto = _contacto.get("puesto")
                        contacto.telefono = _contacto.get("telefono")
                        contacto.correo = _contacto.get("correo")
                        contacto.save()
                    else:
                        contacto = ContactoProveedor(proveedor=proveedor, 
                            nombre=_contacto.get("nombre", None), 
                            puesto=_contacto.get("puesto", None),
                            telefono=_contacto.get("telefono", None), 
                            correo=_contacto.get("correo", None))
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
        serializer = ClienteSerializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)