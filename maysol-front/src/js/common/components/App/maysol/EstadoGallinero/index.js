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
