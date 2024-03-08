import { connect } from 'react-redux';
import UsuarioGrid from './UsuarioGrid';
import { listarUsuarios, borrarUsuario, buscarUsuarios } from '../../../../../redux/modules/Usuarios/usuarios';

const mstp = state => state.usuarios

const mdtp = { listarUsuarios, borrarUsuario, buscarUsuarios }

export default connect(mstp, mdtp)(UsuarioGrid)
