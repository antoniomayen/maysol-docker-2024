from django.db import transaction


from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from django_filters.rest_framework import DjangoFilterBackend
from backend.serializers import MovimientoGranjaSerializer
from backend.models import MovimientoGranja, DetalleMovGranja, Proyecto
from backend.utils.calcuclar_prod_rent import CalProduccionGallinero, CalcFechas
from backend.utils.guia_postura import posturas
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
import pytz

from rest_framework.permissions import IsAuthenticated
from datetime import datetime, date
from dateutil.relativedelta import relativedelta

class MovimientoGranjaViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = MovimientoGranja.objects.all().order_by('-fecha')
    serializer_class = MovimientoGranjaSerializer
    serializer_classes = {
        'GET': MovimientoGranjaSerializer
    }
    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = [
        'id'
    ]
    search_fields = (
        'id'
    )

    def get_queryset(self):
        usuario = self.request.user
        conteo = MovimientoGranja.objects.filter(activo=True).order_by("fecha")
        self.filter_queryset(conteo)
        return conteo

    @list_route(methods=["get"], url_path='getHistoriaMediciones/(?P<pk>[0-9]+)')
    def getHistoriaMediciones(self, request, pk=None, *args, **kwargs):
        movimientos = MovimientoGranja.objects.filter(gallinero_id=pk, peso_gallinas=True).\
            order_by('-creado')

        movimientos = self.filter_queryset(movimientos)
        page = self.paginate_queryset(movimientos)
        if page is not None:
            serializer = MovimientoGranjaSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = MovimientoGranjaSerializer(movimientos, many=True)
        return Response(serializer.data)


    @list_route(methods=["get"], url_path='getHistoriaAjustes/(?P<pk>[0-9]+)')
    def getHistoriaAjustes(self, request, pk=None, *args, **kwargs):
        movimientos = MovimientoGranja.objects.filter(gallinero_id=pk, peso_gallinas=False).\
            order_by('-creado')

        movimientos = self.filter_queryset(movimientos)
        page = self.paginate_queryset(movimientos)
        if page is not None:
            serializer = MovimientoGranjaSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = MovimientoGranjaSerializer(movimientos, many=True)
        return Response(serializer.data)


    @transaction.atomic
    @list_route(methods=["post"])
    def registrar_peso(self, request):
        usuario = self.request.user
        data = request.data

        fecha_reg = datetime.strptime(data.get("fecha"), "%Y-%m-%d")
        fechas = CalcFechas(fecha_reg)
        movimientoValidacion = MovimientoGranja.objects.filter(
            gallinero_id=data.get("gallinero", None),
            fecha__range=[fechas.fecha_i, fechas.fecha_f]
        ).last()

        # Calcular la edad de las gallinas
        granja = Proyecto.objects.get(id=data.get("gallinero"))
        fecha_actual = datetime.strptime(data.get('fecha'), "%Y-%m-%d")
        fecha_inicial = datetime.strptime(data.get('fecha_inicial'), "%Y-%m-%d")
        if fecha_inicial.date() < fecha_actual.date():
            diferencia = fecha_actual.date() - fecha_inicial.date()
            diferencia = int(diferencia.days / 7) + int(data.get("edad_inicial"))
            edad = diferencia
        else:
            return Response({'detail': 'La fecha inicial debe ser mayor a la fecha del registros'}, status=status.HTTP_400_BAD_REQUEST)

        if movimientoValidacion is None:
            raza = posturas[int(data.get("raza"))]
            postura = None
            for x in raza.get("postura"):
                if int(x.get("edad")) == int(edad):
                    postura = x
            if postura is None: postura = raza[len(raza)-1]
            posturaG = postura.get("postura")

            movimiento_peso = MovimientoGranja.objects.create(
                # peso_gallinas=True,
                usuario=usuario,
                gallinero_id=data.get("gallinero", None),
                promedio=data.get("promedio"),
                fecha_inicial=data.get("fecha_inicial"),
                edad_inicial=data.get("edad_inicial"),
                raza=raza.get("nombre"),
                edad=edad,
                fecha=data.get("fecha"),
                cantidad_gallinas=data.get("cantidad_gallinas"),
                salario=data.get("salario"),
                porcion_alimento=data.get("porcion_alimento"),
                porcion_agua=data.get("porcion_agua"),
                precio_carton=data.get("precio_carton"),
                precio_concentrado=data.get("precio_concentrado"),
                medicina=data.get("medicina"),
                insumos=data.get("insumos"),
                nota=data.get("nota", None),
                posturaG=posturaG,
            )
            movimiento_peso.save()

            calculo = CalProduccionGallinero(movimiento_peso, fecha_reg)
            movimiento_peso.rentabilidad = calculo.rentabilidad
            movimiento_peso.produccion = calculo.produccion
            movimiento_peso.venta = calculo.ventas
            movimiento_peso.postura = calculo.postura
            movimiento_peso.save()

            pesos = data.get("pesos", None)
            if pesos is not None:
                for peso in pesos:
                    detalle = DetalleMovGranja.objects.create(
                        movimiento=movimiento_peso,
                        peso=peso.get("peso", 0)
                    )
                    detalle.save()

            return Response({'detail': 'Se ha registrado correctamente'})
        return Response({'detail': 'Ya existe un registro en esta semana'}, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    @list_route(methods=["post"])
    def reajustar_gallinas(self, request):
        usuario = self.request.user
        data = request.data
        promedio = None

        ultimoRegistro = MovimientoGranja.objects.filter(gallinero_id=data.get("gallinero")).order_by("creado").last()
        if ultimoRegistro:
            promedio = ultimoRegistro.promedio
        edad =  int(data.get("edad", 0))
        gallinero = Proyecto.objects.get(id = data.get('gallinero'))
        if gallinero.fechaInicio is  None:
            fecha_actual= data.get('fecha')
            fecha_actual = datetime.strptime(fecha_actual, "%Y-%m-%d")
            dias_restar = edad * 7
            inicio = fecha_actual - relativedelta(days=dias_restar)

            gallinero.fechaInicio = inicio
            gallinero.save()
        if ultimoRegistro is not None and ultimoRegistro.edad is not None and  edad < ultimoRegistro.edad:

            fecha_actual= data.get('fecha')
            fecha_actual = datetime.strptime(fecha_actual, "%Y-%m-%d")
            dias_restar = edad * 7
            inicio = fecha_actual - relativedelta(days=dias_restar)

            gallinero.fechaInicio = inicio
            gallinero.save()
        if ultimoRegistro is None:
            fecha_actual= data.get('fecha')
            fecha_actual = datetime.strptime(fecha_actual, "%Y-%m-%d")
            dias_restar = edad * 7
            inicio = fecha_actual - relativedelta(days=dias_restar)


            gallinero.fechaInicio = inicio
            gallinero.save()
        if gallinero.fechaInicio is not None:
            try:
                fecha_actual= data.get('fecha')
                fecha_actual = datetime.strptime(fecha_actual, "%Y-%m-%d")
                diferencia = fecha_actual.date() - gallinero.fechaInicio
                diferencia = int(diferencia.days / 7)
                edad = diferencia
            except:
                pass

        movimiento_peso = MovimientoGranja.objects.create(
            usuario=usuario,
            gallinero_id=data.get("gallinero", None),
            justificacion=data.get("justificacion", None),
            fecha=data.get("fecha"),
            hora=data.get("hora"),
            cantidad_gallinas=data.get("noGallinas"),
            raza=data.get("raza"),
            edad=edad,
            promedio=promedio,
        )
        movimiento_peso.save()

        return Response({'detail': 'Se ha registrado correctamente'})

    @list_route(methods=["put"], url_path="semanas/(?P<pk>[0-9]+)")
    def semanas(self, request, pk=None, *args, **kwargs):
        """
            Actualizar semana
        """
        data = request.data
        fecha_reg = datetime.strptime(data.get("fecha"), "%Y-%m-%d")
        fechas = CalcFechas(fecha_reg)
        movimientoValidacion = MovimientoGranja.objects.filter(
            gallinero_id=data.get("gallinero", None),
            fecha__range=[fechas.fecha_i, fechas.fecha_f]
        ).exclude(id=pk).last()

        # Calcular la edad de las gallinas
        granja = Proyecto.objects.get(id=data.get("gallinero"))
        fecha_actual = datetime.strptime(data.get('fecha'), "%Y-%m-%d")
        fecha_inicial = datetime.strptime(data.get('fecha_inicial'), "%Y-%m-%d")
        if fecha_inicial.date() < fecha_actual.date():
            diferencia = fecha_actual.date() - fecha_inicial.date()
            diferencia = int(diferencia.days / 7) + int(data.get("edad_inicial"))
            edad = diferencia
        else:
            return Response({'detail': 'La fecha inicial debe ser mayor a la fecha del registros'}, status=status.HTTP_400_BAD_REQUEST)

        if movimientoValidacion is None:
            try:
                MovimientoGranja.objects.filter(id=pk).update(fecha=data.get("fecha"))
                movimiento = MovimientoGranja.objects.get(id=pk)
                usuario = self.request.user

                raza = posturas[int(data.get("raza"))]
                postura = None
                for x in raza.get("postura"):
                    if int(x.get("edad")) == int(edad):
                        postura = x
                if postura is None: postura = raza[len(raza) - 1]
                posturaG = postura.get("postura")

                movimiento.usuario = usuario
                movimiento.gallinero_id = data.get("gallinero", None)
                movimiento.promedio = data.get("promedio")
                # movimiento.fecha = data.get("fecha"),
                movimiento.fecha_inicial = data.get("fecha_inicial")
                movimiento.edad_inicial = data.get("edad_inicial")
                movimiento.raza = raza.get("nombre")
                movimiento.edad = edad
                movimiento.cantidad_gallinas = data.get("cantidad_gallinas")
                movimiento.salario = data.get("salario")
                movimiento.porcion_alimento = data.get("porcion_alimento")
                movimiento.porcion_agua = data.get("porcion_agua")
                movimiento.precio_carton = data.get("precio_carton")
                movimiento.precio_concentrado = data.get("precio_concentrado")
                movimiento.medicina = data.get("medicina")
                movimiento.insumos = data.get("insumos")
                movimiento.nota = data.get("nota", None)
                movimiento.posturaG = posturaG

                calculo = CalProduccionGallinero(movimiento, fecha_reg)
                movimiento.rentabilidad = calculo.rentabilidad
                movimiento.produccion = calculo.produccion
                movimiento.venta = calculo.ventas
                movimiento.postura = calculo.postura

                movimiento.save()

                DetalleMovGranja.objects.filter(movimiento=movimiento).delete()

                pesos = data.get("pesos", None)
                if pesos is not None:
                    for peso in pesos:
                        detalle = DetalleMovGranja.objects.create(
                            movimiento=movimiento,
                            peso=peso.get("peso", 0)
                        )
                        detalle.save()

                return Response({'detail': 'Registro Actualizado'}, status=status.HTTP_200_OK)
            except MovimientoGranja.DoesNotExist:
                return Response({'detail': 'No existe el registros en bodega'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Ya existe un registro en esta semana'}, status=status.HTTP_400_BAD_REQUEST)
