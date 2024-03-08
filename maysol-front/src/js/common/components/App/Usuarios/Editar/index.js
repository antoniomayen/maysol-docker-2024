import { connect } from 'react-redux';
import Update from './UsuarioUpdate';
import { getUsuario, editarUsuario, cambiarEstadoPass } from '../../../../../redux/modules/Usuarios/usuarios';

const mdtp = { getUsuario, editarUsuario, cambiarEstadoPass }
const mstp = state => state.usuarios

export default connect(mstp, mdtp)(Update);
