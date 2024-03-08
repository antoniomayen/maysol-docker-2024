import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Proveedores/proveedores';
import ProveedoresGrid from './ProveedoresGrid';

const mstp = state => {
    return {...state.proveedores, ...state.login}
}

const mdtp = {
    ...actions
}

export default connect(mstp, mdtp)(ProveedoresGrid)
