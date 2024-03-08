from backend.models.cierre import Cierre, Cuenta
from backend.utils.exceptions import ErrorDeUsuario
from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta
from dateutil import rrule

def obtenerCierre(cuenta, anio, mes, inicio=0, fecha_hora=None):
        """
        Recupera un periodo de una cuenta
        :instancia Cuenta: Se manda una cuenta
        :int anio: El año del movimiento
        :int mes: el mes del movimiento
        """
        mesHoy = datetime.now().month
        anioHoy = datetime.now().year

        fechaLimite = datetime(int(anioHoy), int(mesHoy), 1)
        fechaMovimiento = datetime(int(anio), int(mes), 1)
        fechaLimite = fechaLimite + relativedelta(months=1)

        if fechaMovimiento >= fechaLimite:
            raise ErrorDeUsuario('No se puede hacer movimientos futuros.')

        ultimoCerrado = Cierre.objects.filter(cuenta=cuenta, anulado=False, cerrado=True).order_by('-fechaInicio')[:2]
        ultimoCerrado = ultimoCerrado.first()
        if ultimoCerrado is not None:
            if fechaMovimiento.date() < ultimoCerrado.fechaInicio.date():
                raise ErrorDeUsuario("No se puede crear movimientos antes del último cierre")
        cierreBanco, created = Cierre.objects.get_or_create(
            cuenta=cuenta,
            mes=mes,
            anio=anio
        )

        #Capturar error porque cuando se crea una cuenta y no tiene movimientos da error al obtener el ultimo cierre
        try:
            # Ultimo cierre antes de la fecha no importa si esta cerrado o no(solo tiene movimientos)
            ultimoCierre = Cierre.objects.filter(cuenta=cuenta, anulado=False, fechaInicio__lt=cierreBanco.fechaInicio).first()
            _inicio = datetime(int(ultimoCierre.fechaInicio.year), int(ultimoCierre.fechaInicio.month), 1)
            _fin = datetime(int(cierreBanco.fechaInicio.year), int(cierreBanco.fechaInicio.month), 1)
            # Fecha inicio = fechainicio del ultimo cierre encontrado anterior al reciente
            # Fecha fin = fechainicio del cierre creado
            for dt in rrule.rrule(rrule.MONTHLY, dtstart=_inicio, until=_fin):
                # Por cada mes que haya entre esas fechas se crea o se obtienen los cierres
                nuevoCierre, created = Cierre.objects.get_or_create(
                    cuenta=cuenta,
                    mes=dt.month,
                    anio=dt.year
                )
                # Si es un mes nuevo se imprime un mensaje solo para tener información si es necesario
                if created:
                    print("Nuevo cierre creado--------->", nuevoCierre)
        except Exception as e:
            print("Error al crear los cierres: ", e)
        if cierreBanco.cerrado == True:
            raise ErrorDeUsuario( 'Este periodo ya ha sido cerrado.')
        return cierreBanco

