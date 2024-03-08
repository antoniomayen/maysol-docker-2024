import { connect } from 'react-redux';
import CobrosVentasContainer from './cobrosVentasContainer';
import { actions } from '../../../../../redux/modules/Reportes/reporteCobrosVentas';

const mstp = (state) => {
    return { ...state.usuarios, ...state.reporteCobrosVentas };
};

const mdtp = { ...actions };

export default connect(mstp, mdtp)(CobrosVentasContainer);
