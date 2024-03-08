import { connect } from 'react-redux';
import ProduccionContainer from './produccionContainer';
import { actions } from '../../../../../redux/modules/Reportes/reporteproduccion';

const mstp = state => {
    return {...state.usuarios, ...state.reporteproduccion}
}

const mdtp = { ...actions }

export default connect(mstp, mdtp)(ProduccionContainer)

