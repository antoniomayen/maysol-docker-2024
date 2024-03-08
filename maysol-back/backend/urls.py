from backend import viewsets
from rest_framework import routers
from django.urls import path, re_path
from django.conf.urls import include
from rest_framework.authtoken.views import obtain_auth_token
router = routers.DefaultRouter()

router.register(r"bodegas", viewsets.BodegasViewSet, 'Bodegas')
router.register(r"categorias", viewsets.CategoriasViewSet, "Categorías")
router.register(r"cierre", viewsets.CierreViewSet, "Controla los cortes de caja")
router.register(r"cliente", viewsets.ClientesViewSet, "Controla los clientes")
router.register(r"compras", viewsets.ComprasViewSet, "Compras")
router.register(r"cuentas",viewsets.CuentaViewSet, "Cuentas")
router.register(r"inventario",viewsets.InventarioViewSet, "Inventario")
router.register(r"lineaproduccion",viewsets.LineaProduccionViewSet, "Linea de producción")
router.register(r"movBodegas", viewsets.MovimientoBodegaViewSet, "Movimientos de Bodegas")
router.register(r"movGranja", viewsets.MovimientoGranjaViewSet, "Movimientos de Granjas")
router.register(r"movimientos", viewsets.MovimientoViewSet, "Movimientos")
router.register(r"proyectos", viewsets.ProyectoViewSet, "Proyectos")
router.register(r"productos", viewsets.ProductosViewSet, 'Productos')
router.register(r"proveedor", viewsets.ProveedorViewSet, "Proveedor")
router.register(r"reportecf", viewsets.ReporteCfViewSet, "Reporte Cf")
router.register(r"reportes", viewsets.ReporteBodegaViewSet, "Reporte de bodega")
router.register(r"users", viewsets.UserViewSet, "users")
router.register(r"ventas", viewsets.VentasViewSet, "manejo de ventas")
urlpatterns = [
    re_path(r"^api/", include(router.urls)),
    # url(r"^api/token", obtain_auth_token, name="api-token"),
    re_path(r"^api-auth/", include("rest_framework.urls", namespace="rest_framework")),
]
