import { connect } from 'react-redux'
import Crear from './CuentaCreate'
import { crearCuenta } from '../../../../../redux/modules/Cuentas/cuentas'

const mdtp = { crearCuenta }
const mstp = state => {
    return { ...state.cuentas}
}
export default connect(mstp, mdtp)(Crear)
