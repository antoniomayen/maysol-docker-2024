from backend.models.afectados import Afectados
from backend.models import Cuenta
from django.db.models import Q, Sum
from backend.utils import tiposcuentas


def calcularSaldo(cierre):
    DEPOSITO = 10  # (+)
    GASTO = 20  # (-)
    RETIRO = 30  # (-)
    GASTODEUDA = 40  # (-)
    PAGODEUDA = 50  # (+)
    RETIROPRESTAMO = 60  # (-)
    DEPOSITOPRESTAMO = 70  # (+)

    afectados = Afectados.objects.filter(
        cierre=cierre, movimiento__anulado=False)

    saldo = 0
    activo = afectados.filter(Q(tipo=10) | Q(tipo=50) | Q(
        tipo=DEPOSITOPRESTAMO) | Q(tipo=Afectados.VENTA)).aggregate(Sum("movimiento__monto"))

    pasivo = afectados.exclude(Q(tipo=DEPOSITO) | Q(tipo=PAGODEUDA) | Q(
        tipo=DEPOSITOPRESTAMO) | Q(tipo=Afectados.VENTA)).aggregate(Sum('movimiento__monto'))

    activo = activo['movimiento__monto__sum']
    pasivo = pasivo['movimiento__monto__sum']


    cierreAnterior = cierre.get_prev()

    saldo = float(activo or 0) - float(pasivo or 0)
    if cierre.cuenta.tipo == tiposcuentas.DEUDA or cierre.cuenta.tipo == Cuenta.VENTA:
        saldo += cierre.inicio
    if cierreAnterior is not None:
        if cierre.cuenta.tipo == tiposcuentas.BANCO:
            if cierreAnterior.cerrado == True:
                saldo += cierre.inicio
            else:
                saldo += calcularSaldo(cierreAnterior)
        elif cierre.cuenta.tipo == tiposcuentas.CAJACHICA:
            if cierreAnterior.fin is not None:
                saldo += cierreAnterior.fin
            else:
                saldo += calcularSaldo(cierreAnterior)
    return saldo


def calcularSaldoVenta(cierre):
    DEPOSITO = 10  # (+)
    GASTO = 20  # (-)
    RETIRO = 30  # (-)
    GASTODEUDA = 40  # (-)
    PAGODEUDA = 50  # (+)
    RETIROPRESTAMO = 60  # (-)
    DEPOSITOPRESTAMO = 70  # (+)

    afectados = Afectados.objects.filter(
        cierre=cierre, movimiento__anulado=False)

    saldo = 0
    activo = afectados.filter(Q(tipo=10) | Q(tipo=50) | Q(
        tipo=DEPOSITOPRESTAMO) | Q(tipo=Afectados.VENTA)).aggregate(Sum("movimiento__monto"))

    pasivo = afectados.exclude(Q(tipo=DEPOSITO) | Q(tipo=PAGODEUDA) | Q(
        tipo=DEPOSITOPRESTAMO) | Q(tipo=Afectados.VENTA)).aggregate(Sum('movimiento__monto'))

    activo = activo['movimiento__monto__sum']
    pasivo = pasivo['movimiento__monto__sum']

    cierreAnterior = cierre.get_prev()
    saldo = float(activo or 0) - float(pasivo or 0)
    print(f"\n\n\n\n{saldo}\n\n\n\n\n")

    if cierreAnterior is not None:
        if cierre.cuenta.tipo == tiposcuentas.BANCO:
            if cierreAnterior.cerrado == True:
                saldo += cierre.inicio

        elif cierre.cuenta.tipo == tiposcuentas.CAJACHICA:
            if cierreAnterior.fin is not None:
                saldo += cierreAnterior.fin

    return saldo
