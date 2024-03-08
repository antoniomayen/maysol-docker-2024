import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Clientes/clientes';
import Crear from './ClientesCreate';

const mstp = state => {
    return {...state.clientes, ...state.login}
}

const mdtp = {
    ...actions
}

export default connect(mstp, mdtp)(Crear)
