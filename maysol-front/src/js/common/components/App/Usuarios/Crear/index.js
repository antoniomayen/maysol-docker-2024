import { connect } from 'react-redux'
import Crear from './UsuarioCrear'
import { crearUsuario, cambiarEstadoPass } from '../../../../../redux/modules/Usuarios/usuarios'

const mdtp = { crearUsuario, cambiarEstadoPass }
const mstp = state => state.usuarios

export default connect(mstp, mdtp)(Crear)
