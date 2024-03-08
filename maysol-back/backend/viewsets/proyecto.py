from django.conf import settings
from django.db import transaction
from django.db.models import Q

from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.core.exceptions import ValidationError

from backend.models import Proyecto, Cuenta, Bodega, MovimientoGranja
from backend.utils import tiposcuentas, permisos
# from backend.serializers import ProyectoSerializer, ProyectoReadSerializer, SubEmpresaSerializer, EmpresaBodegaSelectSerializer, \
#     GallinerosReadSerializer, GallineroSerializer
from backend.serializers import ProyectoSerializer, ProyectoReadSerializer, SubEmpresaSerializer, \
    EmpresaBodegaSelectSerializer, GallineroSerializer, GallineroUpdateSerializer, EmpresaCuentasSerializer, \
    EmpresaLineaSubempresaSerializer, GallineroCostosSerializer, MovimientoGranjaSerializer
from backend.viewsets.serializer_mixin import SwappableSerializerMixin

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from django.core.exceptions import ValidationError
from backend.utils.exceptions import ErrorDeUsuario

from datetime import datetime, date
from dateutil.relativedelta import relativedelta


class ProyectoViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Proyecto.objects.filter(activo=True, empresa=None)
    serializer_class = ProyectoSerializer
    serializer_classes = {
        'GET': ProyectoReadSerializer
    }
    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    )

    filter_fields = (
        'nombre',
        'representante'
    )
    search_fields = (
        'nombre',
        'representante'
    )

    def create(self, request, *args, **kwargs):
        try:
            data = request.data
            serializer = ProyectoSerializer(data=data)
            if serializer.is_valid():
                with transaction.atomic():
                    proyecto = Proyecto.objects.create(
                        fase=data.get('fase'),
                        representante=data.get('representante'),
                        nombre=data.get('nombre'),
                        es_gallinero=data.get('es_gallinero', False)
                    )
                    if data.get('fase') == '20':

                        if len(data.get('cuentas', [])) == 0:
                            raise ErrorDeUsuario('Debe de seleccionar al menos una cuenta.')

                        #En esta parte se agregan sub empresas
                        if "empresas" in data:
                            empresas = data["empresas"]

                            for empresa in empresas:
                                empresa["empresa"] = proyecto.id
                                empresa["subempresa"] = True
                                subSerializer = SubEmpresaSerializer(data=empresa)
                                subSerializer.is_valid(raise_exception=True)
                                nuevo = subSerializer.save()
                                self.crearCuentaSubEmpresa(nuevo)
                        #En esta parte se agregan las relaciones de
                        #Cuentas con proyectos
                        cuentas = Cuenta.objects.filter(id__in=data.get('cuentas', []))

                        for _cuenta in cuentas:
                            if _cuenta.proyecto is not None:
                                raise ErrorDeUsuario('La cuenta {} ya está siendo utilizada en la empresa {}'.format(_cuenta.nombre, _cuenta.proyecto.nombre))
                            _cuenta.proyecto = proyecto
                            _cuenta.save()

                        return Response({'detail': 'Se ha creado correctamente'}, status=status.HTTP_201_CREATED)
                    else:
                        return Response({'detail': 'Se ha creado correctamente.'}, status=status.HTTP_201_CREATED)
            else:
                raise ErrorDeUsuario(serializer.errors)

        except Cuenta.DoesNotExist:
            return Response({'detail': 'No exite la cuenta seleccionada.'}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({'detail': e}, status= status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:

            return Response( {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)



    def update(self, request, *args, **kwargs):
        try:
            data = request.data
            model = self.get_object()
            empresa = Proyecto.objects.get(pk = model.id)
            with transaction.atomic():
                if int(data.get('fase', 0)) == 20:
                    if len(data.get('cuentas', []))  == 0:
                        raise ErrorDeUsuario('Debe de seleccionar al menos una cuenta.')

                    #Eliminar subempresa de la empresalñkmn b
                    if "borrados" in data:
                        arrSubEmpresas = self.ObtenerArrayConIdSubEmpresas(data["borrados"])

                        subEmpresas = Proyecto.objects.filter(id__in=arrSubEmpresas)
                        for subEmpresa in subEmpresas:
                            subEmpresa.activo = False
                            subEmpresa.save()

                    #se desvincula una cuenta con el proyecto
                    if "cuentasBorradas" in data:
                        cuentasBorradas = Cuenta.objects.filter(id__in=data.get("cuentasBorradas",[]))
                        for _cuentaBorrar in cuentasBorradas:
                            _cuentaBorrar.proyecto = None
                            _cuentaBorrar.save()


                    #Ingreso y actualización de subempresas
                    if "empresas" in data:
                        subEmpresas = data.get("empresas")

                        for subEmpresa in subEmpresas:
                            if subEmpresa.get("id", None) is None:
                                subEmpresa["empresa"] = empresa.id
                                subEmpresa["subempresa"] = True
                                subSerializer = SubEmpresaSerializer(data=subEmpresa)
                                subSerializer.is_valid(raise_exception=True)
                                nuevaEmpresa = subSerializer.save()
                                self.crearCuentaSubEmpresa(nuevaEmpresa)

                            else:
                                objEmpresa = Proyecto.objects.get(id=subEmpresa.get("id"))
                                subSerializer = SubEmpresaSerializer(objEmpresa, data=subEmpresa, partial=True)
                                subSerializer.is_valid(raise_exception=True)
                                subSerializer.save()



                    cuentas = Cuenta.objects.filter(id__in=data.get('cuentas', []))

                    for _cuenta in cuentas:
                        if _cuenta.proyecto is not None and _cuenta.proyecto != empresa:
                            raise ErrorDeUsuario('La cuenta {} ya está siendo utilizada en la empresa {}'.format(_cuenta.nombre, _cuenta.proyecto.nombre))
                        _cuenta.proyecto = empresa
                        _cuenta.save()

                serializer = ProyectoSerializer(empresa, data=data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response({'detail': 'Se ha editado correctamente.'}, status=status.HTTP_200_OK)
        except Proyecto.DoesNotExist:
            return Response({'detail': e}, status=status.HTTP_400_BAD_REQUEST)
        except Cuenta.DoesNotExist:
            return Response({'detail':'Debe de seleccionar una cuenta.'}, status=status.HTTP_400_BAD_REQUEST)

        except ValidationError as e:
            return Response( {'detail':e}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:

            return Response( {'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def ObtenerArrayConIdSubEmpresas(self, empresas):
        resultado = []
        for empresa in empresas:
            resultado.append(empresa["id"])

        return resultado

    def crearCuentaSubEmpresa(self, empresa):
        cuenta = Cuenta.objects.create(
            numero= empresa.nombre,
            nombre=empresa.nombre,
            banco=empresa.nombre,
            proyecto=empresa,
            tipo= tiposcuentas.SUBPROYECTO
        )
        cuenta.save()



    @list_route(methods=["get"])
    def getEstables(self, request, *args, **kwargs):
        proyectos = Proyecto.objects.filter(fase=20, subempresa=False)
        serializer = ProyectoSerializer(proyectos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getEmpresasSelect(self, request, *args, **kwargs):
        query = request.query_params
        principales = query.get('principales', None)

        proyectos = Proyecto.objects.filter(fase=20, empresa=None)
        serializer = ProyectoSerializer(proyectos, many=True)
        data = serializer.data
        data.insert(0, {'id':0, 'nombre':'todos'})
        return Response(data, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getEmpresaCuentasSelect(self, request, *args, **kwargs):
        proyectos = Proyecto.objects.filter(fase=20, empresa=None)
        serializer = ProyectoReadSerializer(proyectos, many=True)
        data = serializer.data
        return Response(data, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getEmpresas(self, request, *args, **kwargs):
        proyectos = self.get_queryset()
        usuario = self.request.user
        if usuario.accesos.administrador != True:
            proyectos = proyectos.filter(id= usuario.proyecto.id)
        serializer = ProyectoReadSerializer(proyectos, many=True)
        data = serializer.data
        return Response(data, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getSubEmpresas(self, request, *args, **kwargs):
        empresa = request.GET.get('empresa', None)
        usuario = self.request.user
        if empresa is None:
            subempresas = Proyecto.objects.filter(activo=True, subempresa=True, empresa=usuario.proyecto)
        else:
            subempresas = Proyecto.objects.filter(activo=True, subempresa=True, empresa_id=empresa)

        serializer = SubEmpresaSerializer(subempresas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def getEmpresasBodega(self, request, *args, **kwargs):
        proyectos = self.get_queryset()
        usuario = self.request.user
        if usuario.accesos.administrador != True:
            proyectos = proyectos.filter(id= usuario.proyecto.id)
        self.filter_queryset(proyectos)
        serializer = EmpresaBodegaSelectSerializer(proyectos, many=True)
        data = serializer.data
        return Response(data, status=status.HTTP_200_OK)

    @list_route(methods=["get"],  url_path='getEmpresaPorIdBodega/(?P<pk>[0-9]+)')
    def getEmpresaPorIdBodega(self, request, pk=None, *args, **kwargs):
        try:
            bodega = Bodega.objects.get(id=pk)
            empresas = Proyecto.objects.filter(activo=True)
            serializer = ProyectoReadSerializer(empresas, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Bodega.DoesNotExist:
            return Response({'detail': 'No existe la bodega'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"], url_path='getProyectoFiltrosGallinero')
    def getProyectoFiltrosGallinero(self, request, *args, **kwargs):
        empresas = Proyecto.objects.filter(empresa=None, es_gallinero=True)
        serialiezer = EmpresaLineaSubempresaSerializer(empresas, many=True)
        return Response(serialiezer.data)

    @list_route(methods=["get"], url_path='getProyectoFiltros')
    def getProyectoFiltros(self, request, *args, **kwargs):
        empresas = Proyecto.objects.filter(empresa=None)
        serialiezer = EmpresaLineaSubempresaSerializer(empresas, many=True)
        return Response(serialiezer.data)

    # @list_route(methods=["get"], url_path='getGallineros/(?P<pk>[0-9]+)')
    # def getGallineros(self, request, pk=None, *args, **kwargs):
    #     try:
    #         gallineros = Proyecto.objects.filter(empresa = pk)
    #         gallineros = self.filter_queryset(gallineros)
    #         page = self.paginate_queryset(gallineros)
    #         if page is not None:
    #             serializer = GallinerosReadSerializer(page, many=True)
    #             return self.get_paginated_response(serializer.data)
    #         return Response({'detail': 'ndada'}, status=status.HTTP_200_OK)
    #     except Proyecto.DoesNotExist:
    #         return Response({'detail': 'Error al listar los gallineros'}, status=status.HTTP_400_BAD_REQUEST)

    ########################################################
    ## Descripción: Asignar costo de granaja
    ########################################################
    @list_route(methods=["put"], url_path="asignarrecuperacion/(?P<pk>[0-9]+)")
    def asignarRecuperacion(self, request, pk=None, *args, **kwargs):
        try:
            data = request.data
            plazo = int(data.get('plazo', 0))
            proyecto = Proyecto.objects.get(id=pk)
            data = request.data
            serializer = GallineroCostosSerializer(proyecto, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            proyectoUpdate = serializer.save()
            inicio = proyectoUpdate.fecha_inicio_costo
            final = inicio + relativedelta(months=plazo)
            proyectoUpdate.fechaFinal = final
            proyectoUpdate.save()

            serializer = GallineroCostosSerializer(proyectoUpdate)
            return Response(serializer.data)
        except Proyecto.DoesNotExist:
            return Response({'detail': 'No existe el proyecto a modificar'}, status=status.HTTP_400_BAD_REQUEST)

    ########################################################
    ## Descripción: manejo de gallinas
    ########################################################
    @list_route(methods=["put"], url_path='asignarTecnico/(?P<pk>[0-9]+)')
    def asignarTecnico(self, request, pk=None, *args, **kwargs):
        try:
            proyecto = Proyecto.objects.get(id=pk)
            data = request.data
            serializer = GallineroUpdateSerializer(proyecto, data=data, partial=True)
            serializer.is_valid()
            serializer.save()
            return Response({'detail': 'Se ha asignado el técnico correctamente.'})
        except Proyecto.DoesNotExist:
            return Response({'detail': 'No existe el proyecto a modificar'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"], url_path='getInfoGallinero/(?P<pk>[0-9]+)')
    def getInfoGallinero(self, request, pk=None, *args, **kwargs):
        try:
            gallinero = Proyecto.objects.get(id=pk)
            serializer = GallineroSerializer(gallinero)
            return Response(serializer.data)
        except Proyecto.DoesNotExist:
            return Response({'detail': 'El gallinero no existe'}, status=status.HTTP_400_BAD_REQUEST)

    @list_route(methods=["get"], url_path='getGallineroForm/(?P<pk>[0-9]+)')
    def getGallineroForm(self, request, pk=None, *args, **kwargs):
        try:
            gallinero_semana = MovimientoGranja.objects.get(id=pk)
            serializer = MovimientoGranjaSerializer(gallinero_semana)
            return Response(serializer.data)
        except Proyecto.DoesNotExist:
            return Response({'detail': 'La semana no existe'}, status=status.HTTP_400_BAD_REQUEST)


    @list_route(methods=["get"])
    def getGallineros(self, request, *args, **kwargs):
        subempresas = Proyecto.objects.filter(activo=True, subempresa=True, empresa__es_gallinero=True)
        subempresas = self.filter_queryset(subempresas)
        page = self.paginate_queryset(subempresas)
        if page is not None:
            serializer = GallineroSerializer(subempresas, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = GallineroSerializer(subempresas, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
