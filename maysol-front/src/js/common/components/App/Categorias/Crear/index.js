import { connect } from 'react-redux';
import Crear from './Crear'
import { crearCategoria, actualizarCategoria, getCategoria } from '../../../../../redux/modules/Categorias/categorias';
const mdtp = {crearCategoria, actualizarCategoria, getCategoria}
const mstp = state => state.categorias

export default connect(mstp, mdtp)(Crear)
