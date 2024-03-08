import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Productos/productos';
import Create from './ProductoCreate';

const mstp = state => {
    return {...state.productos, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(Create)
