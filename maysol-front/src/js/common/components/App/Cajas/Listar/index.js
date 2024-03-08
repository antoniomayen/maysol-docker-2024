import { connect } from 'react-redux';
import { listar, destroy, search, getEmpresasSelect,cambiarFiltro } from '../../../../../redux/modules/cajas/cajas';
import CajasGrid from './CajasGrid';

const mstp = state =>  {
    return{...state.cajas, ...state.login}
}

const mdtp = {listar, destroy, search, getEmpresasSelect, cambiarFiltro}

export default connect(mstp, mdtp)(CajasGrid)
