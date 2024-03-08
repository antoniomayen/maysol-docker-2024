from backend.models import Afectados, Movimiento
from backend.utils import tiposcuentas

def getMensajeDeposito(movimiento, afectado):
    mensaje = ""
    usuario = movimiento.usuario.first_name + " " + movimiento.usuario.last_name
    comprobante = movimiento.noComprobante
    documento = movimiento.noDocumento
    formaPago = movimiento.get_formaPago_display()
    descripcion = movimiento.concepto
    if movimiento.destino == Movimiento.REINTEGRO:
        mensaje = "La persona {} ha hecho un reintegro Motivo: {}".format(usuario, descripcion)
    elif movimiento.destino == Movimiento.CAJACHICA:
        mensaje = "La persona {} ha retirado dinero para caja chica con {} con el comprobante {} Motivo: {}".format(usuario, formaPago, documento, descripcion)
    elif afectado.tipo == Afectados.DEPOSITOPRESTAMO:
        proyecto = movimiento.afectados.get(tipo=Afectados.RETIROPRESTAMO)
        proyecto = proyecto.cierre.cuenta.proyecto.nombre
        mensaje = "Se ha realizado un préstamo de {} Motivo: {}".format( proyecto ,descripcion)
    else:
        mensaje = "La persona {} ha depositado a la cuenta con {} con el comprobante {} Motivo: {}".format(usuario, formaPago, documento, descripcion)
    return mensaje


def getMsjRetiro(movimiento, afectado):
    mensaje = ""
    usuario = movimiento.usuario.first_name + " " + movimiento.usuario.last_name
    comprobante = movimiento.noComprobante
    documento = movimiento.noDocumento
    formaPago = movimiento.get_formaPago_display()
    descripcion = movimiento.concepto
    
    if movimiento.destino == Movimiento.CAJACHICA:
        usuarioDestino = movimiento.cierre.cuenta.usuario.first_name
        mensaje = "La persona {} ha depositado a caja chica de {} con {} con el comprobante {} Motivo:  {}".format(usuario, usuarioDestino, formaPago, documento, descripcion)
    elif afectado.tipo == Afectados.RETIROPRESTAMO:
        proyecto = movimiento.afectados.get(tipo=Afectados.DEPOSITOPRESTAMO)
        proyecto = proyecto.cierre.cuenta.proyecto.nombre
        mensaje = "Se ha realizado a un préstamo ha {} Motivo: {}".format( proyecto ,descripcion)
    return mensaje
def getMsjGasto(movimiento, afectao):
    mensaje = ""
    usuario = movimiento.usuario.first_name + " " + movimiento.usuario.last_name
    comprobante = movimiento.noComprobante
    documento = movimiento.noDocumento
    formaPago = movimiento.get_formaPago_display()
    descripcion = movimiento.concepto
    proyecto = movimiento.proyecto.nombre
    proveedor = movimiento.proveedor
    
    if movimiento.formaPago == Movimiento.EFECTIVO:
        mensaje = "El proyecto {} ha pagado al proveedor {} quien dio un factura/recibo {}, el pago se realizó en efectivo motivo: {}".format(proyecto, proveedor, comprobante, descripcion )
    else:
        mensaje = "El proyecto {} ha pagado al proveedor {} quien dio un factura/recibo {}, el pago se realizó con {} con el número {} motivo: {}".format(proyecto, proveedor, comprobante, formaPago, documento, descripcion )
    return mensaje

def getMsjGastoDeuda(movimiento, afectado):
    mensaje = ""
    usuario = movimiento.usuario.first_name + " " + movimiento.usuario.last_name
    comprobante = movimiento.noComprobante
    documento = movimiento.noDocumento
    formaPago = movimiento.get_formaPago_display()
    descripcion = movimiento.concepto
    proyecto = movimiento.proyecto.nombre
    mensaje = "Se ha pagado por deuda a {}".format(proyecto)
    return mensaje

def getMsjPagoDeuda(movimiento, afectado):
    mensaje = ""
    usuario = movimiento.usuario.first_name + " " + movimiento.usuario.last_name
    comprobante = movimiento.noComprobante
    documento = movimiento.noDocumento
    formaPago = movimiento.get_formaPago_display()
    descripcion = movimiento.concepto
    proyecto = movimiento.proyecto.nombre
    proyecto1 = afectado.cierre.cuenta.proyecto.nombre
    mensaje = "Se ha depositado por deuda de {}".format(proyecto)
    return mensaje

def getDescripcion(movimiento, afectado):
    descripcion = 'Hola descripción'
    if afectado.tipo == Afectados.DEPOSITO:
        descripcion = getMensajeDeposito(movimiento, afectado)
    elif afectado.tipo == Afectados.GASTO:
        descripcion = getMsjGasto(movimiento, afectado)
    elif afectado.tipo == Afectados.RETIRO:
        descripcion = getMsjRetiro(movimiento, afectado)
    elif afectado.tipo == Afectados.GASTODEUDA:
        descripcion = getMsjGastoDeuda(movimiento, afectado)
    elif afectado.tipo == Afectados.PAGODEUDA:
        descripcion = getMsjPagoDeuda(movimiento, afectado)
    elif afectado.tipo == Afectados.RETIROPRESTAMO:
        descripcion = getMsjRetiro(movimiento, afectado)
    elif afectado.tipo == Afectados.DEPOSITOPRESTAMO:
        descripcion = getMensajeDeposito(movimiento, afectado)

    return descripcion

