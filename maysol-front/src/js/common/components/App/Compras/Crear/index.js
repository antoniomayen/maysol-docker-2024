import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Compras/compras';
import Create from './Crear';

const mstp = state => {
    return {...state.compras, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(Create)
