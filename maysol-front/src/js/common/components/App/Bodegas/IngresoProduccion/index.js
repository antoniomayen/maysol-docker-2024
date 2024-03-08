import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Bodegas/ingreso';
import IngresoLineaProdCreate from './IngresoProdCreate';
import { initialize as initializeForm } from 'redux-form';

const mstp = state => {
    return {...state.ingreso, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(IngresoLineaProdCreate)
