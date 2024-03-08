import { connect } from 'react-redux';
import CostosContainer from './costosContainer';
import { actions } from '../../../../../redux/modules/Reportes/reportecostos';

const mstp = state => {
    return {...state.usuarios, ...state.reportecostos}
} 

const mdtp = { ...actions }

export default connect(mstp, mdtp)(CostosContainer)