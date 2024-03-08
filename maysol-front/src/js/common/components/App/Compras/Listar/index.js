import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Compras/compras';
import ComprasGrid from './ComprasGrid';

const mstp = state => {
    return {...state.compras, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(ComprasGrid)
