import { connect } from 'react-redux';
import CuentaGrid from './CuentaGrid';
import {
    listarCuenta,
    borrarCuenta,
    crearDeposito,
    buscarCuenta,
    setToggleModal } from '../../../../../redux/modules/Cuentas/cuentas';


const mstp = state => state.cuentas

const mdtp = {
    listarCuenta,
    borrarCuenta,
    crearDeposito,
    setToggleModal,
    buscarCuenta
}

export default connect(mstp, mdtp)(CuentaGrid)
