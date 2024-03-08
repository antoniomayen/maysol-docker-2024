import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Bodegas/bodegas';
import Crear from './BodegasCreate';

const mstp = state => {
    return {...state.bodegas, ...state.login}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(Crear)
