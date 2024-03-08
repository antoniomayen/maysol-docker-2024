from django.conf import settings
from backend.models import Usuario

from django.db.models import Q


from rest_framework import viewsets, filters, status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from backend.models.cuenta import Cuenta
from backend.models.proyecto import Proyecto
from backend.models.permisos import Permiso
from backend.permisos import AnyPermission, AdministradorPermission, SupervisorPermission, ActionBasedPermission
from rest_framework.permissions import IsAuthenticated



from backend.serializers import UserSerializer, UserReadSerializer, PermisosSerializer
from backend.viewsets.serializer_mixin import SwappableSerializerMixin
from backend.utils.exceptions import ErrorDeUsuario



class UserViewSet(SwappableSerializerMixin, viewsets.ModelViewSet):
    permission_classes = (ActionBasedPermission,)
    queryset = Usuario.objects.filter(is_active=True)
    serializer_class = UserSerializer
    serializer_classes = {
        'GET': UserReadSerializer
    }
    action_permissions = {
        AdministradorPermission: ['update', 'partial_update', 'destroy', 'create', 'retrieve'],
        SupervisorPermission: ['list', 'getUsuariosProyecto','getTodosUsuarios']
    }
    filter_backends = (DjangoFilterBackend,
                       filters.SearchFilter, filters.OrderingFilter)
    filter_fields = ('id', 'proyecto', 'accesos__bodeguero')
    search_fields = ('username', 'id', 'first_name', 'last_name', 'puestos')
    # ordering_fields = ('id', 'username', 'last_name')

    def get_queryset(self):
        user = self.request.user
        usuarios = Usuario.objects.filter(is_active=True)
        if not user.accesos.administrador and not user.is_superuser:
            usuarios = usuarios.filter(proyecto=user.proyecto)
        self.filter_queryset(usuarios)
        return usuarios



    def create(self, request, *args, **kwargs):
        data = request.data

        try:
            serializer = UserSerializer(data=data)
            if data.get("password", None) is None:
                return Response({'detail': 'Debe escribir una contraseña.'}, status=status.HTTP_400_BAD_REQUEST)
            usuario_repetido = Usuario.objects.filter(
                    username__iexact=str(data.get('username')).strip()
                ).count()

            if usuario_repetido > 0:
                raise ErrorDeUsuario('Este usuario ya existe.')
            if(serializer.is_valid()):
                proyecto = Proyecto.objects.get(id=data["proyecto"])
                accesoPermiso = data.get('accesos', None)
                if accesoPermiso is not None:
                    data.pop('accesos')

                puesto = int(data.get('puestos',0))

                if accesoPermiso is not None:
                    supervisor = accesoPermiso.get('supervisor', False)
                    vendedor = accesoPermiso.get('vendedor', False)
                    bodeguero = accesoPermiso.get('bodeguero', False)
                    compras = accesoPermiso.get('compras', False)
                    sin_acceso = accesoPermiso.get('sin_acceso', False)
                    accesos = Permiso(**accesoPermiso )

                if puesto == Usuario.ADMINISTRADOR:
                    accesos = Permiso(administrador=True)
                if puesto == Usuario.BACKOFFICE:
                    accesos = Permiso(backoffice=True)
                if puesto == Usuario.COLABORADOR:
                    accesos.supervisor = supervisor
                    accesos.vendedor = vendedor
                    accesos.bodeguero = bodeguero
                    accesos.compras = compras
                    accesos.sin_acceso = sin_acceso

                #Creación de la cuenta de caja chica
                nombre = "CChica {}".format(data.get("first_name", ""))
                banco= "{}-CCH-{}".format(proyecto.nombre, data.get("first_name", ""))
                cuenta = Cuenta.objects.create(
                    numero=nombre,
                    nombre=nombre,
                    banco="Caja chica",
                    proyecto=proyecto,
                    moneda=Cuenta.QUETZAL,
                    tipo=30
                )
                #######################  Caja de venta ############################
                nombre = "CVenta {}".format(data.get("first_name", ""))
                banco = "{}-CV-{}".format(proyecto.nombre, data.get("first_name", ""))
                cuentaVenta = Cuenta.objects.create(
                    numero=nombre,
                    nombre=nombre,
                    banco="Caja de Venta",
                    proyecto=proyecto,
                    moneda=Cuenta.QUETZAL,
                    tipo=Cuenta.VENTA
                )
                #Se crea el usuario
                data.pop("proyecto")
                user = Usuario.objects.create(
                    proyecto= proyecto,
                    cajachica=cuenta,
                    caja_venta=cuentaVenta,
                    **data
                )
                # Si es superadmin se marca el usuario como is_superuser
                if puesto == Usuario.ADMINISTRADOR:
                    user.is_superuser = True
                    user.save()

                password = data["password"]
                user.set_password(password)

                user.email = data.get("email", "")
                accesos.save()
                user.accesos = accesos
                user.save()
                return Response({"mensaje": "Se ha creado correctamente."}, status=status.HTTP_201_CREATED)
        except ErrorDeUsuario as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


    def update(self, request, *args, **kwargs):
        try:
            data = request.data
            # if data.get('proyecto', None) is not None:
            #     return Response({"detail": "No se puede cambiar de proyecto."}, status=status.HTTP_400_BAD_REQUEST)

            usuario = self.get_object()
            accesoPermiso = data.get('accesos', None)
            if accesoPermiso is not None:
                data.pop('accesos')
            puesto = int(data.get('puestos',0))

            if accesoPermiso is not None:
                supervisor = accesoPermiso.get('supervisor', False)
                vendedor = accesoPermiso.get('vendedor', False)
                bodeguero = accesoPermiso.get('bodeguero', False)
                compras = accesoPermiso.get('compras', False)
                sin_acceso = accesoPermiso.get('sin_acceso', False)

            if usuario.accesos is not None:
                accesos = usuario.accesos
            else:
                accesos = Permiso(backoffice=True)
                usuario.accesos = accesos

            if puesto == Usuario.ADMINISTRADOR:
                accesos.administrador = True

            if puesto == Usuario.BACKOFFICE:
                accesos.administrador = False
                accesos.backoffice = True
                accesos.supervisor = False
                accesos.vendedor = False
                accesos.bodeguero = False
                accesos.compras = False
                accesos.sin_acceso = False

            if puesto == Usuario.COLABORADOR:
                accesos.administrador = False
                accesos.backoffice = False
                accesos.supervisor = supervisor
                accesos.vendedor = vendedor
                accesos.bodeguero = bodeguero
                accesos.compras = compras
                accesos.sin_acceso = sin_acceso

            if "password" in data:
                usuario.set_password(data["password"])
            usuario.username = data["username"]
            usuario.first_name = data["first_name"]
            usuario.last_name = data["last_name"]
            usuario.telefono = data["telefono"]
            usuario.email = data.get("email", "")
            usuario.puestos = data.get('puestos')
            accesos.save()
            usuario.accesos = accesos
            usuario.save()

            serializer = UserSerializer(usuario)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def ObtenerArrayConIdAsignaciones(self, cuentas):
        resultado = []
        for cuenta in cuentas:
            if "creado" in cuenta:
                resultado.append(cuenta["id"])

        return resultado

    @list_route(methods=["get"], permission_classes=[SupervisorPermission])
    def getUsuariosProyecto(self, request, *args, **kwargs):
        user = self.request.user
        usuarios = Usuario.objects.filter(Q(accesos__supervisor=True) | Q(accesos__administrador=True))
        if user.accesos.supervisor:
            usuarios = usuarios.filter(proyecto=user.proyecto).exclude(accesos_administrador=True)
        serializer = UserReadSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @list_route(methods=["get"])
    def getTodosUsuarios(self, request, *args, **kwargs):
        user = self.request.user
        usuarios = self.queryset
        usuarios = self.filter_queryset(usuarios)
        serializer = UserReadSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    @list_route(methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        usuario = self.request.user
        serializer = UserReadSerializer(usuario)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["get"], permission_classes=[IsAuthenticated])
    def getVendedores(self, request, *args, **kwargs):
        usuario = self.request.user
        usuarios = Usuario.objects.filter(is_active=True)#self.queryset
        #usuarios = usuarios.filter(is_active=True).filter(
            #Q(accesos__vendedor=True) | Q(accesos__supervisor=True)
        #)
        # if usuario.accesos.supervisor:
            # usuarios = usuarios.filter(accesos__supervisor=True)
        serializer = UserReadSerializer(usuarios, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(methods=["post"], permission_classes=[AnyPermission])
    def token(self, request, *args, **kwargs):
        """
        Endpoint para obtener el token
        Se busca primero por username
        :param request:
        :param args:
        :param kwargs:
        :return: json con el token para usar el api
        """
        data = request.data


        try:
            usuario = Usuario.objects.get(
                username=data.get("username"), is_active=True)
            if usuario.is_superuser == True:
                if usuario.check_password(data.get("password")):
                    token, created = Token.objects.get_or_create(user=usuario)
                    serializer = UserReadSerializer(usuario)
                    return Response({'token': token.key, "me": serializer.data})
                else:
                    return Response({"detail": "Usuario o contraseña incorrectos."}, status=status.HTTP_400_BAD_REQUEST)

            if usuario.accesos.sin_acceso == True:
                return Response({"detail": "No tiene acceso al sistema."}, status=status.HTTP_400_BAD_REQUEST)
            if usuario.check_password(data.get("password")):
                token, created = Token.objects.get_or_create(user=usuario)
                serializer = UserReadSerializer(usuario)

                return Response({'token': token.key, "me": serializer.data})
            else:
                return Response({"detail": "Usuario o contraseña incorrectos."}, status=status.HTTP_400_BAD_REQUEST)
        except Usuario.DoesNotExist:
            return Response({"detail": "Usuario inexistente"}, status=status.HTTP_400_BAD_REQUEST)
