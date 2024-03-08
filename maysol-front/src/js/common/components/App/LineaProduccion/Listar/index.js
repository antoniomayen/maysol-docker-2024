import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Linea/lineaproduccion';
import LineaProduccionGrid from './LProduccionGrid';

const mstp = state => {

    return {...state.lineaproduccion, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(LineaProduccionGrid)
