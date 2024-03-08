import { connect } from 'react-redux';
import GastoGrid from './GastoGrid';
import GastoContainer from './GastosContainer'
import { initialize as initializeForm } from 'redux-form'
import { getCategorias, getProveedores } from "../Update/EditarGastoCaja";

import {
    listarGastos,
    cambiarFiltroCategoria,
    crearGasto,
    setToggleModal,
    setToggleModalHistoria,
    buscarEstado,
    cambiarFiltro,
    borrarGasto,
    cambiarAnio,
    cambiarMes,
    getMisCajas,
    agregarSaldoCajaChica,
    cierreCajaChica,
    getCuenta,
    getHistorico,
    buscarHistoria,
    anular,
    reintegro,
    editarMovimiento,
    setFormReintegro,
    verficarDatosComentarioGasto,
    getDuenioCaja
} from '../../../../../redux/modules/Cuentas/gastos';

const mstp = state => {
    return{...state.gastos, ...state.login}
}

const mdtp = {
    listarGastos,
    crearGasto,
    setToggleModal,
    borrarGasto,
    buscarEstado,
    cambiarFiltro,
    cambiarAnio,
    cambiarMes,
    getMisCajas,
    agregarSaldoCajaChica,
    cierreCajaChica,
    getCuenta,
    getHistorico,
    buscarHistoria,
    anular,
    reintegro,
    editarMovimiento,
    setToggleModalHistoria,
    setFormReintegro,
    cambiarFiltroCategoria,
    verficarDatosComentarioGasto,
    getDuenioCaja,
    setFormulario:(data) => dispatch => dispatch(initializeForm('movimiento', data)),
    setFormGasto:(data) => dispatch => {
        getCategorias(data.categoria);
        getProveedores(data.proveedor);
        dispatch(initializeForm('movimiento', data))
    }
}

export default connect(mstp, mdtp)(GastoContainer)
