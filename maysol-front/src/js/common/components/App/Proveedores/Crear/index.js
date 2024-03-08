import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Proveedores/proveedores';
import Crear from './ProveedoresCreate';

const mstp = state => {
    return {...state.proveedores, ...state.login}
}

const mdtp = {
    ...actions
}

export default connect(mstp, mdtp)(Crear)
