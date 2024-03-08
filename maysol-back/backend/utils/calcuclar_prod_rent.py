import datetime
from backend.models import MovimientoBodega, MovimientoGranja, DetalleMovBodega, Fraccion, Inventario
from django.db.models.functions import Coalesce
from django.db.models import Sum, Q, F, Max, FloatField


class CalProduccionGallinero:

    def __init__(self, mov_granja, fecha):
        self.mov_granja = mov_granja
        self.fecha = fecha
        self.semana = self.getSemana()
        self.year = self.getYear()
        self.fecha_i = self.getFechaI()
        self.fecha_f = self.getFechaF()
        prod_venta = self.getProduccionVenta()
        self.produccion = float(prod_venta.get("produccion"))
        self.ventas = float(prod_venta.get("ventas"))
        self.postura = float(self.getPostura())
        self.rentabilidad = self.getRentabilidad()

    def getSemana(self):
        try:
            return int(self.fecha.strftime("%V"))
        except:
            return None

    def getYear(self):
        try:
            return int(self.fecha.year)
        except:
            return None

    def getPostura(self):
        return ((self.produccion / int(self.mov_granja.cantidad_gallinas)) / 7) * 100

    def getFechaI(self):
        try:
            d = f"{self.year}-W{self.semana - 1}"
            return datetime.datetime.strptime(d + '-1', "%Y-W%W-%w") + datetime.timedelta(days=-1)
        except:
            return None

    def getFechaF(self):
        try:
            d = f"{self.year}-W{self.semana - 1}"
            return datetime.datetime.strptime(d + '-1', "%Y-W%W-%w") + datetime.timedelta(days=5)
        except:
            return None

    def getProduccionVenta(self):

        fracciones_vendibles = Fraccion.objects.filter(vendible=True)
        fracciones_vendibles = fracciones_vendibles.values_list("producto", flat=True).distinct()

        inventario = Inventario.objects.filter(activo=True, cantidad__gt=0)

        movimientos = DetalleMovBodega.objects.filter(
            activo=True,
            stock__producto__in=fracciones_vendibles,
            movimiento__fecha__range=[self.fecha_i, self.fecha_f],
            movimiento__empresa=self.mov_granja.gallinero.id,
            movimiento__linea__sumar_en_reporte=True,
        ).order_by("movimiento__fecha")

        #movimientos = MovimientoBodega.objects.filter(
            #empresa=self.mov_granja.gallinero.id,
            #fecha__range=[self.fecha_i, self.fecha_f],
        #)

        movimientos = movimientos.annotate(
            sumaCantidad=Coalesce(Sum('cantidad'), 0),
            sumaCosto=Coalesce(
                Sum(
                    F('cantidad') * F('stock__precio'),
                    output_field=FloatField()
                ), 0
            ),
        ).aggregate(
            monto=Sum('sumaCantidad'),
            costo=Sum('sumaCosto')
        )
        result = {
            "produccion": movimientos.get('monto') if movimientos.get('monto') is not None else 0,
            "ventas": movimientos.get('costo') if movimientos.get('costo') is not None else 0
        }
        return result

    def getRentabilidad(self):
        try:
            cartones = (self.produccion / 30) * self.mov_granja.precio_carton
            dia_salario = (((self.mov_granja.salario if self.mov_granja.salario is not None else 0) / 30) * 7)
            porcion_alimento = self.mov_granja.porcion_alimento if self.mov_granja.porcion_alimento is not None else 0
            cantidad_gallinas = self.mov_granja.cantidad_gallinas if self.mov_granja.cantidad_gallinas is not None else 0
            concentrado = ((((porcion_alimento * cantidad_gallinas) * 7) / 450) / 100) * self.mov_granja.precio_concentrado
            medicina = self.mov_granja.medicina if self.mov_granja.medicina is not None else 0
            insumos = self.mov_granja.insumos if self.mov_granja.insumos is not None else 0
            precio_gallina = (cantidad_gallinas * 0.95)
            gallinas_ant = MovimientoGranja.objects.filter(fecha__lt=self.mov_granja.fecha).last()
            cantidad_gallinasAnt = gallinas_ant.cantidad_gallinas if gallinas_ant is not None else 0
            mortalidadCant = cantidad_gallinasAnt - cantidad_gallinas
            mortalidad = ((90 - self.mov_granja.edad if self.mov_granja.edad is not None else 0) * 0.72) * mortalidadCant

            costo = cartones + dia_salario + concentrado + medicina + precio_gallina + mortalidad + insumos
            ventas_total = self.ventas
            rentabilidad = ventas_total - costo

            return rentabilidad
        except:
            return 0


class CalcFechas:
    def __init__(self, fecha):
        self.fecha = fecha
        self.semana = self.getSemana()
        self.year = self.getYear()
        self.fecha_i = self.getFechaI()
        self.fecha_f = self.getFechaF()

    def getSemana(self):
        try:
            return int(self.fecha.strftime("%V"))
        except:
            return None

    def getYear(self):
        try:
            return int(self.fecha.year)
        except:
            return None

    def getFechaI(self):
        try:
            d = f"{self.year}-W{self.semana - 1}"
            return datetime.datetime.strptime(d + '-1', "%Y-W%W-%w") + datetime.timedelta(days=-1)
        except:
            return None

    def getFechaF(self):
        try:
            d = f"{self.year}-W{self.semana - 1}"
            return datetime.datetime.strptime(d + '-1', "%Y-W%W-%w") + datetime.timedelta(days=5)
        except:
            return None
