import { connect } from 'react-redux';
import EstadoCuentaGrid from './EstadoCuentaGrid';
import { initialize as initializeForm } from 'redux-form'
import { getCategorias, getProveedores } from "../Update/EditarGastoCuenta";
import { getCategorias as cateogiasDeposito } from  "../../Cuentas/Listar/DepositoForm";

import { listarEstado,
    setToggleModal,
    crearMovimiento,
    buscarEstado,
    cambiarFiltro,
    cambiarAnio,
    cambiarMes,
    getSaldoCuenta,
    cierreEstado,
    getCuenta,
    anular,
    getUsuario,
    editarMovimiento,
    verficarDatosComentario,
    cambiarActivo
} from '../../../../../redux/modules/Cuentas/estadocuentas';

const mstp = state =>{
    return {...state.estadocuentas, ...state.login}
}

const mdtp = {
    listarEstado,
    setToggleModal,
    crearMovimiento,
    buscarEstado,
    cambiarFiltro,
    cambiarAnio,
    cambiarMes,
    getSaldoCuenta,
    cierreEstado,
    getCuenta,
    getUsuario,
    anular,
    editarMovimiento,
    verficarDatosComentario,
    cambiarActivo,
    setFormulario:(data) => dispatch => dispatch(initializeForm('movimiento', data)),
    setFormGasto:(data) => dispatch => {
        getCategorias(data.categoria);
        cateogiasDeposito(data.categoria);
        getProveedores(data.proveedor);
        dispatch(initializeForm('movimiento', data))
    }
}

export default connect(mstp, mdtp)(EstadoCuentaGrid)
