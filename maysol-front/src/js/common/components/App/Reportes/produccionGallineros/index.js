/*
import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Maysol/estadogallinero';
import EstadoGallineroContainer from './EstadoGallineroContainer';
import { initialize as initializeForm } from 'redux-form'


const mstp = state => {
    return {...state.estadogallinero,  ...state.login}
};

const mdtp = {
    ...actions,
    setFormAlimentos:(data) => dispatch => dispatch(initializeForm('movimiento', data)),
    setFormCantidad:(data) => dispatch => dispatch(initializeForm('movimiento', data)),
    setFormCostos:(data) => dispatch => dispatch(initializeForm('costogranja', data)),
};

export default connect(mstp, mdtp)(EstadoGallineroContainer)

*/

import { connect } from 'react-redux';
import EstadoGallineroContainer from './EstadoGallineroContainer';
import { actions } from '../../../../../redux/modules/Reportes/reporteproduccion';

const mstp = state => {
    return {...state.usuarios, ...state.reporteproduccion}
}

const mdtp = { ...actions }

export default connect(mstp, mdtp)(EstadoGallineroContainer)
