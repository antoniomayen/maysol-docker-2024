# Importaciones de Rest Framework
from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
from backend.models import Bodega, Proyecto, Usuario
from backend.serializers import BodegaSerializer
from django_filters.rest_framework import DjangoFilterBackend

# Importación de permisos
from backend.permisos import AdministradorPermission
from backend.utils.exceptions import ErrorDeUsuario
from rest_framework.permissions import IsAuthenticated


class BodegasViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Bodega.objects.filter(activa=True)
    serializer_class = BodegaSerializer
    serializer_classes = {
        'GET': BodegaSerializer
    }
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    filter_fields = (
        'id',
        'empresa__id',
    )
    search_fields = (
        'nombre',
        'direccion'
    )

    @list_route(methods=["get"])
    def get_queryset(self):
        usuario = self.request.user
        bodegas = self.queryset.filter(activa=True).order_by("nombre")
        if usuario.accesos.administrador != True:
            if usuario.accesos.supervisor:
                bodegas = self.queryset.filter(activa=True, empresa__id=usuario.proyecto_id)
            else:
                if usuario.accesos.bodeguero and self.action != 'retrieve':
                    try:
                        bodegas = self.queryset.filter(id=usuario.bodega.id)
                    except:
                        bodegas = Bodega.objects.filter(id=None)
                else:
                    bodegas = self.queryset.filter(activa=True, empresa__id=usuario.proyecto_id)
        self.filter_queryset(bodegas)
        return bodegas

    @list_route(methods=["get"])
    def get_bodegas_proyecto(self, request):
        usuario = self.request.user
        bodegas = self.get_queryset()
        serializer = BodegaSerializer(bodegas, many=True)
        return Response( serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        empresa_id = data.get("empresa", None)
        nombre = data.get("nombre", None)
        direccion = data.get("direccion", None)
        try:

            empresa = Proyecto.objects.get(pk=empresa_id)
            repetido = Bodega.objects.filter(empresa=empresa, nombre__iexact=str(nombre).strip())
            if repetido.count():
                raise ErrorDeUsuario('El nombre de bodega ya existe.')
            if data.get('encargado', None) is not None:
                encargado = Usuario.objects.filter(id=data.get('encargado'), bodega__isnull=False).first()
                if encargado:
                    raise ErrorDeUsuario('El encargado ya tiene una bodega asignada, cambie de encargado..')
                
            usuario = request.user
            bodega = Bodega(
                empresa=empresa, 
                nombre=nombre, 
                direccion=direccion, 
                encargado_id=data.get('encargado', None),
                creado_por=usuario)
            bodega.save()
        except ErrorDeUsuario as e:
            return Response( {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        data = request.data
        empresa_id = data.get("empresa", None)
        nombre = data.get("nombre", None)
        direccion = data.get("direccion", None)
        try:
            if data.get('encargado', None) is not None:
                encargado = Usuario.objects.filter(id=data.get('encargado'), bodega__isnull=False).first()
                if encargado:
                    raise ErrorDeUsuario('El encargado ya tiene una bodega asignada, cambie de encargado..')
            empresa = Proyecto.objects.get(pk=empresa_id)
            bodega = Bodega.objects.get(pk=kwargs["pk"])
            bodega.nombre = nombre
            bodega.direccion = direccion
            bodega.empresa_id = empresa_id
            bodega.encargado_id = data.get('encargado')
            bodega.save()
        except ErrorDeUsuario as e:
            return Response( {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Bodega.DoesNotExist:
            return Response({"message": "La bodega que se quiere actualizar no existe"},
                            status=status.HTTP_400_BAD_REQUEST)
        serializer = BodegaSerializer(bodega)
        return Response(serializer.data,status=status.HTTP_200_OK)
