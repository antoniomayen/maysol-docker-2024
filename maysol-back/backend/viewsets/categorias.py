#Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.db import transaction
from backend.viewsets.serializer_mixin import SwappableSerializerMixin

from backend.models import Categorias
from backend.utils.exceptions import ErrorDeUsuario
from backend.serializers.categorias import CategoriasSerializer, CategoriaReadSerializer
from django_filters.rest_framework import DjangoFilterBackend

#Importación de permisos
from backend.permisos import AdministradorPermission, SupervisorPermission
from rest_framework.permissions import IsAuthenticated


class CategoriasViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Categorias.objects.filter(activo = True)
    serializer_class = CategoriasSerializer
    serializer_classes = {
        'GET': CategoriaReadSerializer
    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = (
        'nombre',
        'nombrejapones'
    )
    search_fields = (
        'nombre',
        'nombrejapones',
        'id'
    )
    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = CategoriasSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            data = request.data
            object = self.get_object()
            serializer = CategoriasSerializer(object, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"])
    def getTodasCategorias(self, request, *args, **kwargs):
        categorias = self.queryset.order_by("nombre")
        serializer = CategoriasSerializer(categorias, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
