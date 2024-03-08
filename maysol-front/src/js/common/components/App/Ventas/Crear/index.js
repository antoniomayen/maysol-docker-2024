import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Ventas/ventas';
import Create from './Crear';

const mstp = state => {
    return {...state.ventas, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(Create)
