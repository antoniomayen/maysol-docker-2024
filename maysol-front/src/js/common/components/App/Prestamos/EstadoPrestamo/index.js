import { connect } from 'react-redux';
import EstadoPrestamo from './EstadoPrestamo';
import {
    listar,
    search,
    getPrestamo,
    crearMovimiento,
    setToggleModal,
    anular
} from '../../../../../redux/modules/Prestamos/estadoprestamo';

const mstp = state => {
  return { ...state.estadoprestamos, ...state.login}
}
const mdtp = {
    listar,
    search,
    getPrestamo,
    crearMovimiento,
    setToggleModal,
    anular
}

export default connect(mstp, mdtp)(EstadoPrestamo)
