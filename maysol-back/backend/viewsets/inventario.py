from django.db.models import Q, F, Sum
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from backend.models import Inventario, Fraccion
from backend.serializers import InventarioReadSerializer, InventarioSerializer, ProductosSelectSerializer, InventarioListarSerializer, \
    ProductosVentaSerializer
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
from rest_framework.permissions import IsAuthenticated


class InventarioViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Inventario.objects.all()

    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = [
        "bodega",
        "lote",
        "stock__id"
    ]
    search_fields = (

        "stock__presentacion",
        "stock__producto__nombre"
    )

    def get_queryset(self):
        inventario = Inventario.objects.filter(activo=True).order_by("-lote__lote", "pk")
        self.filter_queryset(inventario)
        return inventario

    def get_serializer_class(self):
        """Define serializer for API"""

        if self.action == "list" or self.action == "retrieve":
            return InventarioReadSerializer
        else:
            return InventarioSerializer


    @list_route(methods=["get"], url_path="getInventario/(?P<pk>[0-9]+)")
    def getInventario(self, request, pk=None, *args, **kwargs):
        try:
            inventario = Inventario.objects.filter(activo=True, bodega=pk, cantidad__gt=0)
            inventario = self.filter_queryset(inventario)
            productos = inventario.values('stock').\
                annotate(cantidad=Sum('cantidad'), nombre=F("stock__producto__nombre")).order_by('stock')
            page = self.paginate_queryset(productos)
            if page is not None:
                serializer = InventarioListarSerializer(page, many=True,context={'inventario': inventario})
                return self.get_paginated_response(serializer.data)
            serializer = InventarioListarSerializer(productos, many=True, context={'inventario': inventario})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Inventario.DoesNotExist:
            return Response({'detail': 'No existe inventario para esta bodega.'}, status=status.HTTP_400_BAD_REQUEST)
    @list_route(methods=["get"], url_path="getProductos/(?P<pk>[0-9]+)")
    def getProductos(self, request,pk=None, *args, **kwargs):
        try:
            inventario = Inventario.objects.filter(activo=True, bodega=pk, cantidad__gt=0)
            inventario = self.filter_queryset(inventario)
            productos = inventario.values("stock").annotate(cantidad=Sum('cantidad'), value=F('stock'), label=F('stock__producto__nombre'))
            serializer = ProductosSelectSerializer(productos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Inventario.DoesNotExist:
            return Response({'detail': 'No existe inventario para esta bodega'}, status=status.HTTP_400_BAD_REQUEST)
    @list_route(methods=["get"], url_path="getProductosDespacho/(?P<pk>[0-9]+)")
    def getProductosDespacho(self, request, pk=None, *args, **kwargs):
        try:
            inventario = Inventario.objects.filter(activo=True, bodega=pk, cantidad__gt=0)
            inventario = self.filter_queryset(inventario)
            productos = inventario.values("stock__producto")\
                .annotate(cantidad=Sum('cantidad'), value=F('stock__producto'), label=F('stock__producto__nombre'))\
                .values_list('stock__producto', flat=True)
            fraccionesVendibles = Fraccion.objects.filter(producto__in=productos)
            serializer = ProductosVentaSerializer(fraccionesVendibles, many=True, context={"inventario": inventario})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Inventario.DoesNotExist:
            return Response({'detail': 'No existe inventario para esta bodega'}, status=status.HTTP_400_BAD_REQUEST)


    @list_route(methods=["get"],  url_path="getProductosVenta/(?P<pk>[0-9]+)")
    def getProductosVenta(self, request, pk=None, *args, **kwargs):
        try:
            usuario = self.request.user
            bodega_id = request.GET.get('id', None)
            inventario = Inventario.objects.filter(activo=True, cantidad__gt=0)
            if bodega_id is not None:
                inventario = inventario.filter(bodega_id=bodega_id)
            else:
                if usuario.is_superuser is False:
                    inventario = inventario.filter(bodega__empresa_id=pk)
            productos = inventario.values("stock__producto")\
                .annotate(cantidad=Sum('cantidad'), value=F('stock__producto'), label=F('stock__producto__nombre'))\
                .values_list('stock__producto', flat=True)
            fraccionesVendibles = Fraccion.objects.filter(producto__in=productos, vendible=True)
            serializer = ProductosVentaSerializer(fraccionesVendibles, many=True, context={"inventario": inventario})
            return Response(serializer.data)
        except Inventario.DoesNotExist:
            return Response({'detail': 'No existe inventario para esta bodega.'})
