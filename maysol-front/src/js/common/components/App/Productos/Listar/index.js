import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Productos/productos';
import ProductosGrid from './productosGrid';

const mstp = state => {
    return {...state.productos, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(ProductosGrid)
