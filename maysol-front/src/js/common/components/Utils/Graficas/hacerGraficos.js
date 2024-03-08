import { colores, grises }  from './opciones';
import moment from "moment";
import  { dateFormatter } from '../renderField/renderReadField';

function numero_a_fecha(numero) {
  switch (numero) {
    case 1:
      return "Enero";
    case 2:
      return "Febrero";
    case 3:
      return "Marzo";
    case 4:
      return "Abril";
    case 5:
      return "Mayo";
    case 6:
      return "Junio";
    case 7:
      return "Julio";
    case 8:
      return "Agosto";
    case 9:
      return "Septiembre";
    case 10:
      return "Octubre";
    case 11:
      return "Noviembre";
    case 12:
      return "Diciembre";
  }
}


function hacerBarrasColocaciones(datos, datosComparacion, inicial, comparacion) {
  const datum = [];
  if (datos.length > 0){
    ['creditos', 'nuevos'].forEach((segmento, index) => {
      [inicial, comparacion].forEach((periodo) => {
        const titulo = datos[0].mes !== undefined ? periodo : numero_a_fecha(periodo);
        const barra = {
          key: segmento === 'creditos' ? `Colocaciones o Crédito ${titulo}` : `Nuevos ${titulo}`,
          values: [],
        };
        if (periodo === inicial) {
          datos.forEach((dato, indice) => {
            try {
              barra.values.push({
                label: dato.mes !== undefined ? dato.mes : dato.semana,
                value: dato[segmento],
                color: colores[index]
              });
            } catch (err) {
            }
          });
          datum.push(barra);
        } else if (datos[0].mes !== undefined) {
          datosComparacion.forEach((dato, indice) => {
            try {
              barra.values.push({
                label: dato.mes !== undefined ? dato.mes : dato.semana,
                value: dato[segmento],
                color: grises[index]
              });
            } catch (err) {
            }
          });
          datum.push(barra);
        }
      });
    });
    return datum;
  }
  return datum
}

function hacerBarrasGanancias(datos, datosComparacion, inicial, comparacion) {
  const datum = [];
  if (datos.length > 0) {
    ['ganancia', 'costo'].forEach((segmento, index) => {
        const titulo = "Fecha";
        const barra = {
          key: segmento === 'costo' ? `Costo Total ` : `Ganancia `,
          values: [],
        };
        datos.forEach((dato, indice) => {
            let valueS = segmento === 'costo' ? -1* dato[segmento] : dato[segmento];
            try {
              barra.values.push({
                label: dato.mes !== undefined ? dato.mes : dateFormatter(dato.fecha),
                value: valueS,
                color: colores[index]
              });
            } catch (err) {
            }
        });
        datum.push(barra);
    });
    return datum;
  }
  return datum
}

function hacerBarrasSaldos(datos, datosComparacion, inicial, comparacion) {
  const datum = [];
  if (datos.length > 0) {
    ['mora', 'vencidos', 'clientes_nuevos'].forEach((segmento, index) => {
      [inicial, comparacion].forEach((periodo) => {
        const titulo = datos[0].mes !== undefined ? periodo : "";
        const barra = {
          key: segmento === 'clientes_nuevos' ? `Clientes Nuevos ${titulo}` : `${segmento} ${titulo}`,
          values: [],
          color: periodo === inicial ? colores[index] : grises[index],
        };
        if (periodo === inicial) {
          datos.forEach((dato, indice) => {
            try {
              barra.values.push({
                x: indice,
                label: dato.mes !== undefined ? dato.mes : dato.semana,
                y: dato[segmento],
              });
            } catch (err) {
            }
          });
          datum.push(barra);
        } else if (datos[0].mes !== undefined) {
          datosComparacion.forEach((dato, indice) => {
            try {
              barra.values.push({
                x: indice,
                label: dato.mes !== undefined ? dato.mes : dato.semana,
                y: dato[segmento],
              });
            } catch (err) {
            }
          });
          datum.push(barra);
        }
      });
    });
    return datum;
  }
  return datum
}

function hacerGraficaTendencia(datos) {
  const datum = [];
  if (datos.length > 0) {
    ['saldo', 'mora', 'vencido'].forEach((segmento, index) => {
      const barra = {
        key: segmento,
        values: [],
        color: colores[index],
      };
      if (datos.length > 0) {
        datos.forEach((dato, indice) => {
          const fecha = moment(dato.fecha).format("YYYYMMDD");
          try {
            barra.values.push({
              x: indice,
              label: moment(dato.fecha).format("DD-MM-YYYY"),
              y: dato[segmento],
            });
          } catch (err) {
          }
        });
        datum.push(barra);
      }
    });
    return datum;
  }
  return datum
}
export {
  hacerBarrasColocaciones,
  hacerBarrasGanancias,
  hacerBarrasSaldos,
  hacerGraficaTendencia,
  colores,
}
