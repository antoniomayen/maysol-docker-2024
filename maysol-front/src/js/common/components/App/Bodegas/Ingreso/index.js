import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Bodegas/ingreso';
import IngresoCreate from './IngresoCreate';
import { initialize as initializeForm } from 'redux-form'


const mstp = state => {
    return {...state.ingreso, ...state.estadobodega, ...state.login}
};

const mdtp = {
    ...actions,
    setFormIngresoBodega:(data) => dispatch => dispatch(initializeForm('ingresobodega', data)),
    setFormularioCabeza:(data) => dispatch => dispatch(initializeForm('ingresoDatos', data))
};

export default connect(mstp, mdtp)(IngresoCreate)
