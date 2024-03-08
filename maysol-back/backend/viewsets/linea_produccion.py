# Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
from backend.models import LineaProduccion, Proyecto, Bodega
from backend.serializers import LineaProduccionSerializer, LineaProduccionReadSerializer
from django_filters.rest_framework import DjangoFilterBackend

# Importación de permisos
from backend.permisos import AdministradorPermission
from backend.utils.exceptions import ErrorDeUsuario
from rest_framework.permissions import IsAuthenticated


class LineaProduccionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = LineaProduccion.objects.filter(activo=True)
    serializer_class = LineaProduccionSerializer
    serializer_classes = {
        'GET': LineaProduccionReadSerializer
    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = (
        'id',
        'empresa__id',
    )
    search_fields = [
        'nombre'
    ]

    @list_route(methods=["get"])
    def get_queryset(self):
        usuario = self.request.user
        lineas = self.queryset.filter(activo=True).order_by("nombre")
        if usuario.accesos.administrador != True and usuario.accesos.supervisor == True:
            lineas = self.queryset.filter(activo=True, empresa__id=usuario.proyecto_id)
        self.filter_queryset(lineas)
        return lineas


    @list_route(methods=["get"])
    def getLineaEmpresa(self, request, *args, **kwargs):
        try:
            data = request.data
            query = request.query_params
            linea = query.get('linea', None)
            empresa = query.get('empresa', None)


            empresa = Proyecto.objects.get(id=empresa)
            linea = LineaProduccion.objects.get(id=linea)
            response = {
                'linea': linea.nombre,
                'empresa': empresa.nombre
            }
            return Response(response, status=status.HTTP_200_OK)
        except Proyecto.DoesNotExist:
            return Response({'detail': 'La empresa seleccionada no existe.'}, status=status.HTTP_400_BAD_REQUEST)
        except LineaProduccion.DoesNotExist:
            return Response({'detail': 'La línea de producción seleccionada no existe.'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"],  url_path="getLineaBodega/(?P<pk>[0-9]+)")
    def getLineaBodega(self, request, pk=None, *args, **kwargs):
        try:
            #bodega = Bodega.objects.get(id=pk)
            lineas = LineaProduccion.objects.filter(empresa_id=pk, activo=True)
            serializer = LineaProduccionSerializer(lineas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Bodega.DoesNotExist:
            return Response({'detail': 'La bodega no existe'}, status=status.HTTP_400_BAD_REQUEST)
