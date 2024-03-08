import { connect } from 'react-redux'
import Update from './CuentaUpdate'
import { getCuenta, editarCuenta } from '../../../../../redux/modules/Cuentas/cuentas'

const mdtp = { getCuenta, editarCuenta }
const mstp = state => {
    return { ...state.cuentas}
}
export default connect(mstp, mdtp)(Update)
