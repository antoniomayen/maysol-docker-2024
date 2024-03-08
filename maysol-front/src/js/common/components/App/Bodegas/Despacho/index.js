import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Bodegas/despacho';
import DespachoCreate from './DespachoCreate';
import { initialize as initializeForm } from 'redux-form'


const mstp = state => {
    return {...state.despacho, ...state.estadobodega, ...state.login}
};

const mdtp = {
    ...actions,
    setFormIngresoBodega:(data) => dispatch => dispatch(initializeForm('ingresobodega', data)),
    setFormularioCabezaLinea:(data) => dispatch => dispatch(initializeForm('ingresoDatosLinea', data)),
    setFormularioCabezaBodega:(data) => dispatch => dispatch(initializeForm('ingresoDatosBodega', data)),
    setFormDespachoVenta: (data) => dispatch => dispatch(initializeForm('despachobodega', data))
};

export default connect(mstp, mdtp)(DespachoCreate)
