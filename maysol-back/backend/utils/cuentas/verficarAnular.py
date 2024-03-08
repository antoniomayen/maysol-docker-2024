from backend.models import Cierre, Movimiento, Cuenta, Afectados
from backend.utils.exceptions import ErrorDeUsuario


def verficarAnulado(movimiento):
    afectados = movimiento.afectados.all()
    for afectado in afectados:
        if afectado.cierre.cerrado == True:
            raise ErrorDeUsuario('Este movimiento no se puede anular.')