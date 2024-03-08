import { connect } from 'react-redux';
import GastosContainer from './gastosContainer';
import { actions } from '../../../../../redux/modules/Reportes/reportecostos';
import { hacerBarrasGanancias} from 'Utils/Graficas/hacerGraficos';


const mstp = state => {
    const datos = state.reportecostos.grafica;
    const me = state.login.me;
    let costo = 0;
    let ganancia = 0;
    datos.forEach(x => {
        costo += x.costo;
        ganancia += x.ganancia
    });
    let datum_gastos = [];

    if (datos){
        datum_gastos = hacerBarrasGanancias(
          datos,
           [],
          'anual',
          'comparación'
        )
      }

    return {
        ...state.usuarios,
        ...state.reportecostos,
        datum_gastos,
        costo,
        ganancia,
        me
    }
}

const mdtp = {
    ...actions
}

export default connect(mstp, mdtp)(GastosContainer)
