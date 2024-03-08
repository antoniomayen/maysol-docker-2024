from django.conf import settings
from django.db import transaction, DatabaseError
from django.db.models import Q, F, Sum
from django.db import transaction


from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from backend.utils.exceptions import ErrorDeUsuario

from datetime import datetime

from backend.models import Producto, Fraccion, Usuario, Proyecto, Preciofraccion, Bodega
from backend.serializers import ProductoSerializer, FraccionSerializer
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
import pytz

from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers


class ProductosViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    serializer_classes = {
        'GET': ProductoSerializer
    }
    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = [
        'empresa',
    ]
    search_fields = (
        'nombre',
    )

    def get_queryset(self):
        productos = Producto.objects.filter(activo=True).order_by("-id")
        self.filter_queryset(productos)
        return productos

    @list_route(methods=["get"])
    def get_fracciones(self, request):
        usuario = self.request.user
        vendibles = request.GET.get('vendible', False)
        productos = Producto.objects.filter(activo=True)
        if not usuario.accesos.administrador:
            productos = productos.filter(empresa=usuario.proyecto)
        products = []
        for producto in productos:
            fracciones = Fraccion.objects.filter(producto=producto)
            for fraccion in fracciones:
                products.append({"id": fraccion.id, "nombre": producto.nombre + " - " + fraccion.presentacion})
        return Response(products, status=status.HTTP_200_OK)

    @list_route(methods=["get"])
    def get_fraccionesUnidad(self, request):
        products = []
        fracciones = Fraccion.objects.filter(capacidad_maxima=1, parent__isnull=True, activo=True, producto__activo=True)
        empresa = request.GET.get('empresa', None)
        try:
            if empresa is not None:
                fracciones = fracciones.filter(producto__empresa_id=empresa)
        except:
            pass
        for fraccion in fracciones:
            products.append({"id": fraccion.id, "nombre": fraccion.producto.nombre})
        return Response(products, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        """
            Creación de un producto:
            Cuerpo:
            {
                "nombre":"Prueba",
                "presentacion":"sfsdg",
                "empresa":1,
                "porcentaje":"23",
                "multiplos":true,
                "vendible":true,
                "precios":[
                    {
                        "moneda":"GTQ",
                        "precio":"34",
                        "precio2":"34",
                        "precio3":"34"
                    },
                    {
                        "moneda":"USD",
                        "precio":"54",
                        "precio2":"32",
                        "precio3":"34"
                    }
                ],
                "fracciones":[
                    {
                        "presentacion":"12",
                        "capacidad_maxima":"24",
                        "precios":[
                            {
                            "moneda":"USD",
                            "precio":"12",
                            "precio2":"12",
                            "precio3":"12"
                            },
                            {
                            "moneda":"GTQ",
                            "precio":"23",
                            "precio2":"34",
                            "precio3":"59"
                            }
                        ]
                    }
                ]
                }
        """
        try:
            usuario = request.user
            data = request.data
            with transaction.atomic():
                if usuario.accesos.administrador == True:
                    empresa = Proyecto.objects.get(pk=data.get('empresa'))
                    data.pop('empresa')
                else:
                    empresa = usuario.proyecto

                fracciones = data.get('fracciones', [])

                #######################  Se verifica la existencia del producto ############################
                producto = Producto.objects.filter(
                    empresa=empresa,
                    nombre__iexact=str(data.get('nombre')).strip()
                ).count()

                if producto > 0:
                    raise ErrorDeUsuario('Este producto ya existe.')

                #######################  Validaciones de campos principales ############################

                if data.get('presentacion', None) is None:
                    raise ErrorDeUsuario('Debe de agregar una presentación al producto.')


                if data.get('vendible', False) is True:
                    precios = data.get('precios', [])
                    if len(precios) == 0:
                        raise ErrorDeUsuario('Debe agregar un precio.')
                    for _precio in precios:
                        if _precio.get('moneda', None) is None:
                            raise ErrorDeUsuario('Se debe de seleccionar una moneda.')
                        if len(_precio.get('precioD', [])) <= 0:
                            raise ErrorDeUsuario('Se debe de asignar un valor de precio')

                    if data.get('multiplos', None) is not None:
                        multiplos = data.get('multiplos')
                        if multiplos == True:
                            if len(fracciones) == 0:
                                raise ErrorDeUsuario('Cuando selecciona múltiplos debe de ingresar al menos un múltiplo.')
                        else:
                            if len(fracciones) > 0:
                                raise ErrorDeUsuario('No se puede agregar múltplos porque no se ha habilitado esa opción.')

                ########################################################
                ## Descripción: Creación del producto
                ########################################################
                producto = Producto.objects.create(
                    nombre=data.get('nombre'),
                    empresa=empresa,
                    descripcion=data.get('descripcion'),
                    vendible=data.get('vendible', False),
                    multiplos=data.get('multiplos', False),
                    porcentaje=data.get('porcentaje', None)
                )

                ########################################################
                ## Descripción: Creación del múltplo padre
                ## Ej: (padre)Huevos, hijos: caja, cartón
                ########################################################
                # Guardar la nueva fracción después de haberse comprobado todas las validaciones

                padre = Fraccion.objects.create(
                    producto=producto,
                    minimo_existencias=data.get('minimo_existencias', None),
                    presentacion=data.get('presentacion'),
                    capacidad_maxima=1,
                    vendible=data.get('vendible', False)
                )
                for _precioUnidad in data.get('precios',[]):
                    moneda = _precioUnidad.get('moneda')
                    if data.get('vendible', False) is True:
                        # obtener_precios = lambda _precio: float(_precio if _precio else 0)

                        for _precioD in _precioUnidad.get("precioD", []):
                            Preciofraccion.objects.create(
                                moneda=_precioUnidad.get('moneda'),
                                precio=_precioD.get("precio"),
                                stock=padre,
                                activo=True,
                            )

                        """
                        precio = obtener_precios(_precioUnidad.get("precio"))
                        precio2 = obtener_precios(_precioUnidad.get("precio2"))
                        precio3 = obtener_precios(_precioUnidad.get("precio3"))

                        if _precioUnidad.get('moneda') == Preciofraccion.QUETZAL:
                            padre.precio = precio
                            padre.precio2 = precio2
                            padre.precio3 = precio3
                            padre.save()
                        if _precioUnidad.get('moneda') == Preciofraccion.DOLAR:
                            padre.precioUSD = precio
                            padre.precioUSD2 = precio2
                            padre.precioUSD3 = precio3
                            padre.save()
                        """
                    # precio_instance = Preciofraccion(
                    #     moneda=moneda,
                    #     precio=precio,
                    #     stock=padre,
                    # )
                    # precio_instance.save()
                if data.get('multiplos', None) is not None:
                    multiplos = data.get('multiplos')
                    if multiplos == True:
                        for _fraccion in fracciones:
                            # Guardar la nueva fracción después de haberse comprobado todas las validaciones
                            fraccion = Fraccion.objects.create(
                                    producto=producto,
                                    minimo_existencias=data.get('minimo_existencias', None),
                                    presentacion=_fraccion.get('presentacion'),
                                    capacidad_maxima=_fraccion.get('capacidad_maxima'),
                                    vendible=True
                                )
                            if len(_fraccion.get('precios', [])) == 0:
                                raise ErrorDeUsuario('El múltiplo debe de tener al menos un precio.')
                            for _precioD in _precioUnidad.get("precioD", []):
                                Preciofraccion.objects.create(
                                    moneda=_precioUnidad.get('moneda'),
                                    precio=_precioD.get("precio"),
                                    stock=fraccion,
                                    activo=True,
                                )
                            """
                            for _precioUnidad in _fraccion.get('precios',[]):
                                moneda = _precioUnidad.get('moneda')
                                obtener_precios = lambda _precio: float(_precio if _precio else 0)
                                precio = obtener_precios(_precioUnidad.get("precio"))
                                precio2 = obtener_precios(_precioUnidad.get("precio2"))
                                precio3 = obtener_precios(_precioUnidad.get("precio3"))
                                if _precioUnidad.get('moneda') == Preciofraccion.QUETZAL:
                                    fraccion.precio = precio
                                    fraccion.precio2 = precio2
                                    fraccion.precio3 = precio3
                                    fraccion.save()
                                if _precioUnidad.get('moneda') == Preciofraccion.DOLAR:
                                    fraccion.precioUSD = precio
                                    fraccion.precioUSD2 = precio2
                                    fraccion.precioUSD3 = precio3
                                    fraccion.save()
                            """
                    #######################  La validación de las fracciones se hacen en serializer ############################

                # serializer = ProductoSerializer(producto)
                return Response({'detail': 'Se ha creado correctamente'}, status=status.HTTP_200_OK)
            return Response({'detail': 'No se a logrado crear el producto.'})
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        try:
            usuario = request.user
            data = request.data
            model = producto = self.get_object()

            with transaction.atomic():
                if usuario.accesos.administrador == True:
                    empresa = Proyecto.objects.get(pk=data.get('empresa'))
                else:
                    empresa = usuario.proyecto
                fracciones = data.get('fracciones', [])

                #######################  Se verifica la existencia del producto ############################
                producto_repetido = Producto.objects.filter(
                    empresa=empresa,
                    nombre__iexact=str(data.get('nombre')).strip()
                ).exclude(pk=producto.pk).count()

                if producto_repetido > 0:
                    raise ErrorDeUsuario('Este producto ya existe.')

                #######################  Validaciones de campos principales ############################
                if data.get('vendible', False) is True:
                    if len(data.get('precios', [])) == 0:
                        raise ErrorDeUsuario('Debe agregar un precio.')
                        for _precio in precios:
                            if _precio.get('moneda', None) is None:
                                raise ErrorDeUsuario('Se debe de seleccionar una moneda.')
                            if int(_precio.get('precio', 0)) <= 0:
                                raise ErrorDeUsuario('Se debe de asignar un valor de precio')

                if data.get('presentacion', None) is None:
                    raise ErrorDeUsuario('Debe de agregar una presentación al producto.')

                if data.get('multiplos', None) is not None:
                    multiplos = data.get('multiplos')
                    if multiplos == True:
                        if len(fracciones) == 0:
                            raise ErrorDeUsuario('Cuando selecciona múltiplos debe de ingresar al menos un múltiplo.')
                    else:
                        if len(fracciones) > 0:
                            raise ErrorDeUsuario('No se puede agregar múltiplos porque no se ha habilitado esa opción.')

                ########################################################
                ## Descripción: Borrar fracciones
                ########################################################
                borrados = data.get('borrados', [])
                for borrado in borrados:
                    fraccionBorrada = Fraccion.objects.get(id=borrado.get('id'))
                    fraccionBorrada.delete()


                ########################################################
                ## Descripción: Edición de los campos de producto
                ##
                ########################################################
                producto.nombre = data.get('nombre')

                producto.empresa = empresa
                producto.descripcion = data.get('descripcion')
                producto.vendible = data.get('vendible', False)
                producto.multiplos = data.get('multiplos')
                producto.moneda = data.get('moneda')
                producto.porcentaje = data.get('porcentaje', None)
                producto.save()

                primerMultiplo = producto.fracciones.first()

                ########################################################
                ## Descripción: Edición del múltiplo principal
                ########################################################
                # Guardar la nueva fracción después de haberse comprobado todas las validaciones


                primerMultiplo.producto = producto
                primerMultiplo.minimo_existencias = data.get('minimo_existencias', None)
                primerMultiplo.presentacion = data.get('presentacion')
                primerMultiplo.capacidad_maxima = 1
                primerMultiplo.vendible = data.get('vendible', False)
                primerMultiplo.save()

                Preciofraccion.objects.filter(stock=primerMultiplo).delete()
                for _precioUnidad in data.get('precios',[]):
                    for _precioD in _precioUnidad.get("precioD", []):
                        Preciofraccion.objects.create(
                            moneda=_precioUnidad.get('moneda'),
                            precio=_precioD.get("precio"),
                            stock=primerMultiplo,
                            activo=True
                        )
                    """                
                    moneda = _precioUnidad.get('moneda')
                    obtener_precios = lambda _precio: float(_precio if _precio else 0)
                    precio = obtener_precios(_precioUnidad.get("precio"))
                    precio2 = obtener_precios(_precioUnidad.get("precio2"))
                    precio3 = obtener_precios(_precioUnidad.get("precio3"))

                    if _precioUnidad.get('moneda') == Preciofraccion.QUETZAL:
                        primerMultiplo.precio = precio
                        primerMultiplo.precio2 = precio2
                        primerMultiplo.precio3 = precio3
                        primerMultiplo.save()
                    if _precioUnidad.get('moneda') == Preciofraccion.DOLAR:
                        primerMultiplo.precioUSD = precio
                        primerMultiplo.precioUSD2 = precio2
                        primerMultiplo.precioUSD3 = precio3
                        primerMultiplo.save()
                    """
                self.borrarPrecios(primerMultiplo, data)

                for _fraccion in fracciones:
                    if _fraccion.get('id', None) is None:
                        # Guardar la nueva fracción después de haberse comprobado todas las validaciones
                        fraccion = Fraccion.objects.create(
                            producto=producto,
                            minimo_existencias=_fraccion.get('minimo_existencias', None),
                            presentacion=_fraccion.get('presentacion'),
                            capacidad_maxima=_fraccion.get('capacidad_maxima'),
                            vendible=True
                        )
                        if len(_fraccion.get('precios', [])) == 0:
                            raise ErrorDeUsuario('El múltiplo debe de tener al menos un precio.')

                        Preciofraccion.objects.filter(stock=fraccion).delete()
                        for _precioUnidad in _fraccion.get('precios',[]):
                            for _precioD in _precioUnidad.get("precioD", []):
                                Preciofraccion.objects.create(
                                    moneda=_precioUnidad.get('moneda'),
                                    precio=_precioD.get("precio"),
                                    stock=fraccion,
                                    activo=True
                                )
                            """
                            moneda = _precioUnidad.get('moneda')
                            obtener_precios = lambda _precio: float(_precio if _precio else 0)
                            precio = obtener_precios(_precioUnidad.get("precio"))
                            precio2 = obtener_precios(_precioUnidad.get("precio2"))
                            precio3 = obtener_precios(_precioUnidad.get("precio3"))
                            if _precioUnidad.get('moneda') == Preciofraccion.QUETZAL:
                                fraccion.precio = precio
                                fraccion.precio2 = precio2
                                fraccion.precio3 = precio3
                                fraccion.save()
                            if _precioUnidad.get('moneda') == Preciofraccion.DOLAR:
                                fraccion.precioUSD = precio
                                fraccion.precioUSD2 = precio2
                                fraccion.precioUSD3 = precio3
                                fraccion.save()
                            """
                        objFraccion = fraccion

                    else:
                        objFraccion  = Fraccion.objects.get(id=_fraccion.get('id'))
                        # Guardar la nueva fracción después de haberse comprobado todas las validaciones
                        objFraccion.presentacion = _fraccion.get('presentacion')
                        objFraccion.capacidad_maxima = _fraccion.get('capacidad_maxima')
                        objFraccion.save()
                        Preciofraccion.objects.filter(stock=objFraccion).delete()
                        for _precioUnidad in _fraccion.get('precios',[]):
                            for _precioD in _precioUnidad.get("precioD", []):
                                Preciofraccion.objects.create(
                                    moneda=_precioUnidad.get('moneda'),
                                    precio=_precioD.get("precio"),
                                    stock=objFraccion,
                                    activo=True
                                )
                            """
                            moneda = _precioUnidad.get('moneda')
                            obtener_precios = lambda _precio: float(_precio if _precio else 0)
                            precio = obtener_precios(_precioUnidad.get("precio"))
                            precio2 = obtener_precios(_precioUnidad.get("precio2"))
                            precio3 = obtener_precios(_precioUnidad.get("precio3"))
                            if _precioUnidad.get('moneda') == Preciofraccion.QUETZAL:
                                objFraccion.precio = precio
                                objFraccion.precio2 = precio2
                                objFraccion.precio3 = precio3
                                objFraccion.save()
                            if _precioUnidad.get('moneda') == Preciofraccion.DOLAR:
                                objFraccion.precioUSD = precio
                                objFraccion.precioUSD2 = precio2
                                objFraccion.precioUSD3 = precio3
                                objFraccion.save()
                            """
                    self.borrarPrecios(objFraccion, _fraccion)

                serializer = ProductoSerializer(producto)
                return Response(serializer.data, status=status.HTTP_200_OK)

            return Response({'detail': 'Error al momento de editar el producto.'}, status=status.HTTP_400_BAD_REQUEST)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def borrarPrecios(self, obj, data):
        for _precioUnidad in data.get('preciosBorrados',[]):
            moneda = _precioUnidad.get('moneda')
            obtener_precios = lambda _precio: float(_precio if _precio else 0)
            precio = obtener_precios(_precioUnidad.get("precio"))
            precio2 = obtener_precios(_precioUnidad.get("precio2"))
            precio3 = obtener_precios(_precioUnidad.get("precio3"))

            if _precioUnidad.get('moneda') == Preciofraccion.QUETZAL:
                obj.precio = 0
                obj.precio2 = 0
                obj.precio3 = 0
                obj.save()
            if _precioUnidad.get('moneda') == Preciofraccion.DOLAR:
                obj.precioUSD = 0
                obj.precioUSD2 = 0
                obj.precioUSD3 = 0
                obj.save()
