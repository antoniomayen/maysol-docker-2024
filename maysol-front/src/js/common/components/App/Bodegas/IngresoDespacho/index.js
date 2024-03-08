import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Bodegas/ingreso';
import IngresoDespacho from './IngresoDespacho';

const mstp = state => {
    return {...state.ingreso, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(IngresoDespacho)
