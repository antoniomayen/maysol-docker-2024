import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Linea/lineaproduccion';
import Create from './LProduccionCreate';

const mstp = state => {

    return {...state.lineaproduccion, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(Create)
