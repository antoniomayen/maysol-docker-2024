from __future__ import unicode_literals

from django.db import models
from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from backend.models.cuenta import Cuenta
from django.core.exceptions import ValidationError
from backend.models.usuario import Usuario
from backend.utils.exceptions import ErrorDeUsuario
from backend.models import Movimiento

DEUDA = 40
CAJACHICA = 30
BANCO = 10
class Cierre(models.Model):
    IMG = 'img'
    PDF = 'pdf'
    DOC = 'doc'
    EXTENSIONES = (
        (IMG, 'img'),
        (PDF, 'pdf'),
        (DOC, 'doc'),
    )
    origen = models.OneToOneField('backend.Movimiento', related_name='cierre_prestamo', on_delete=models.CASCADE, blank=True, null=True)
    inicio = models.FloatField()
    fin = models.FloatField(blank=True, null=True)
    mes = models.IntegerField(blank=True, null=True)
    anio = models.IntegerField(blank=True, null=True)
    movimiento_cierre = models.ForeignKey(Movimiento, related_name='cierre_venta', on_delete=models.CASCADE, blank=True, null=True)

    cerrado = models.BooleanField(default=False)


    cuenta = models.ForeignKey(Cuenta, related_name="cierres", blank=True, null=True, on_delete=models.deletion.CASCADE)
    creado = models.DateTimeField(auto_now_add=True)
    modificado = models.DateTimeField(auto_now=True)
    fechaInicio = models.DateTimeField(blank=True, null=True)
    descripcion = models.CharField(max_length = 240, blank=True, null=True)

    #Atributos utiliazdo para el cierre de un periodo
    archivo = models.FileField(upload_to='cierrescuentas/%Y/%m/%d', blank=True, null=True)
    ext = models.CharField(choices=EXTENSIONES, max_length=12, null=True)
    usuarioCierre = models.ForeignKey(Usuario, blank=True, null=True, on_delete=models.deletion.CASCADE)
    fechaCierre = models.DateField(blank=True, null=True)
    justificacion = models.TextField(blank=True, null=True)
    anulado = models.BooleanField(default=False)

    def __str__(self):
        return "{}) {} {}".format(
            self.pk,
            self.fechaInicio,
            self.cuenta.get_tipo_display()
        )
        return str(self.pk) + " " + str(self.mes) + " " + str(self.anio)



    def save(self, *args, **kwargs):
        #Si es un cierre del para una cuenta
        #de prestamo no verifica saldos anteriores
        if self.pk is None:
            if self.cuenta.tipo == BANCO:
                fechaNuevo = datetime(int(self.anio), int(self.mes), 1)
                cierreAnterior =  Cierre.objects.filter(cuenta=self.cuenta, anulado=False, fechaInicio__lt=fechaNuevo).order_by('-fechaInicio')[:2]
                cierreAnterior = cierreAnterior.first()
                ultimoCerrado = Cierre.objects.filter(cuenta=self.cuenta, anulado=False, cerrado=True)
                ultimoCerrado = ultimoCerrado.last()
                if cierreAnterior is not None:
                    if fechaNuevo.date() < cierreAnterior.fechaInicio.date():
                        raise ErrorDeUsuario('No se puede crear movimientos antes del último cierre.')
                if ultimoCerrado is not None:
                    if fechaNuevo.date() < ultimoCerrado.fechaInicio.date():
                        raise ErrorDeUsuario("No se puede crear movimientos antes del último cierre")
                if cierreAnterior is not None:
                    if cierreAnterior.cerrado == True:
                        self.inicio = cierreAnterior.fin
                    else:
                        self.inicio = 0.00
                else:
                    self.inicio = 0.00
                self.fechaInicio = datetime(int(self.anio), int(self.mes), 1)

            elif self.cuenta.tipo == CAJACHICA:
                cierreAnterior = Cierre.objects.filter(cuenta=self.cuenta, anulado=False, cerrado=True).order_by('-fechaInicio')[:2].first()
                if self.origen is None:
                    raise ErrorDeUsuario('No se puede realizar el depósito a caja chica.')
                if cierreAnterior is not None:
                    fechaAnterior = self.origen.fecha.date()
                    if fechaAnterior < cierreAnterior.fechaInicio.date():
                        raise ErrorDeUsuario('No se puede crear una caja chica porque ya hay cajas cerradas en esta fecha.')
                cierreAnterior = Cierre.objects.filter(cuenta=self.cuenta, anulado=False).last()
                anio = datetime.now().year
                mes = datetime.now().month
                if cierreAnterior is not None:
                    if cierreAnterior.cerrado == True:
                        self.inicio = float(self.origen.monto)

                    else:
                        self.inicio = self.origen.monto
                    self.fechaInicio=self.origen.fecha
                    fecha_caja = self.fechaInicio.date()
                    self.mes= fecha_caja.month
                    self.anio= fecha_caja.year
                else:

                    self.inicio = self.origen.monto
                    self.fechaInicio = self.origen.fecha
                    fecha_caja = self.fechaInicio.date()
                    self.mes= fecha_caja.month
                    self.anio= fecha_caja.year

            elif self.cuenta.tipo == Cuenta.VENTA:
                pass
            else:
                anio = datetime.now().year
                mes = datetime.now().month
                self.inicio = self.origen.monto
                self.mes = mes
                self.anio = anio
                self.fechaInicio = self.origen.fecha
        super(Cierre, self).save(*args, **kwargs)
    def guardar(self, *args, **kwargs):
        super(Cierre, self).save(*args, **kwargs)
    #funciones para verificar el registro siguiente y el anterior
    def get_next(self):
        if self.cuenta.tipo == 30:
            next = Cierre.objects.filter(
                cuenta=self.cuenta,
                fechaInicio__gt=self.fechaInicio,
                anulado=False,
                origen__anulado=False).order_by('fechaInicio')[:2]
        else:
            next = Cierre.objects.filter(cuenta=self.cuenta, anulado=False, fechaInicio__gt=self.fechaInicio).order_by('fechaInicio')[:2]
        if next:
            return next.first()
        return None

    def get_prev(self):
        if self.cuenta.tipo == 30:
            prev = Cierre.objects.filter(
                cuenta=self.cuenta,
                fechaInicio__lte=self.fechaInicio,
                origen__anulado=False,
                anulado=False,
                ).order_by('-fechaInicio','-id').exclude(pk=self.id)[:2]
        else:
            prev = Cierre.objects.filter(
                cuenta=self.cuenta,
                fechaInicio__lte=self.fechaInicio,
                anulado=False
                ).order_by('-fechaInicio','-id').exclude(pk=self.id)[:2]

        if prev:
            return prev.first()
        return None

