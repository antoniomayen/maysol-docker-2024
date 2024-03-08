import requests
import datetime
from django.core.management.base import BaseCommand
from xml.etree import ElementTree
from backend.models import CambioMoneda


class Command(BaseCommand):

    def xml_string(self, moneda):
        return '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' \
              'xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>' \
              '<Variables xmlns="http://www.banguat.gob.gt/variables/ws/"><variable>'+str(moneda)+'</variable></Variables>' \
                                                                                                  '</soap:Body></soap:Envelope>'

    def cambio_dia(self):
        DOLARES = 0o2
        YENES = 0o3

        headers = {'Content-Type': 'text/xml'}
        url = 'http://www.banguat.gob.gt/variables/ws/TipoCambio.asmx?op=Variables'
        try:
            respuesta_dolar = requests.post(url, data=self.xml_string(DOLARES), headers=headers).text
            respuesta_yen = requests.post(url, data=self.xml_string(YENES), headers=headers).text

            parse_dolar = ElementTree.fromstring(respuesta_dolar)
            parse_yen = ElementTree.fromstring(respuesta_yen)

            fecha_dolar = parse_dolar.find('.//{http://www.banguat.gob.gt/variables/ws/}fecha').text
            fecha_dolar_obj = datetime.datetime.strptime(fecha_dolar, '%d/%m/%Y')
            cambio_dolar = parse_dolar.find('.//{http://www.banguat.gob.gt/variables/ws/}referencia').text

            fecha_yen = parse_yen.find('.//{http://www.banguat.gob.gt/variables/ws/}fecha').text
            fecha_yen_obj = datetime.datetime.strptime(fecha_yen, '%d/%m/%Y')
            # El cambio de yenes viene con respecto al dolar
            cambio_yen_dolar = parse_yen.find('.//{http://www.banguat.gob.gt/variables/ws/}compra').text
            # Cambio de yen respecto a quetzales
            cambio_yen = float(cambio_yen_dolar)/float(cambio_dolar)

            cambio_moneda = CambioMoneda(fecha_dolar=fecha_dolar_obj.strftime("%Y-%m-%d"), cambio_dolar=cambio_dolar,
                                         fecha_yen=fecha_yen_obj.strftime("%Y-%m-%d"), cambio_yen_dolar=cambio_yen_dolar,
                                         cambio_yen=cambio_yen)
            cambio_moneda.save()

        except Exception as e:
            pass

    def handle(self, *args, **options):
        self.cambio_dia()
