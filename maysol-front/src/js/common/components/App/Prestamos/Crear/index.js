import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Prestamos/prestamos';
import PrestamoCreate from './PrestamoCreate';

const mstp = state => {
    return {...state.prestamos, ...state.login}
}

const mdtp = {
    ...actions
}

export default connect(mstp, mdtp)(PrestamoCreate)
