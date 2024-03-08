from backend.models import Movimiento


def calcularNumero(empresa):
    ordenes_compra = Movimiento.objects.filter(es_oc=True, proyecto=empresa).count()
    correlativo = str(ordenes_compra + 1)
    while len(correlativo) < 8:
        correlativo = "0" + correlativo
    numero = "OC" + "-" + str(empresa.id) + "-" + str(correlativo)
    return numero


def calcularNumeroVenta(empresa):
    ordenes_compra = Movimiento.objects.filter(es_ov=True, proyecto=empresa).count()
    correlativo = str(ordenes_compra + 1)
    while len(correlativo) < 8:
        correlativo = "0" + correlativo
    numero = "OV" + "-" + str(empresa.id) + "-" + str(correlativo)
    return numero