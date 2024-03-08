import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Ventas/ventas';
import { editarMovimiento } from '../../../../../redux/modules/Cuentas/estadocuentas';
import VentasGrid from './VentaContainer';
import { initialize as initializeForm } from 'redux-form'

const mstp = state => {
    return {...state.ventas, ...state.login}
};

const mdtp = {
    ...actions,
    editarMovimiento,
    setFormCierreVenta: (data) => dispatch => dispatch(initializeForm('cierreVenta', data)),
};

export default connect(mstp, mdtp)(VentasGrid)
