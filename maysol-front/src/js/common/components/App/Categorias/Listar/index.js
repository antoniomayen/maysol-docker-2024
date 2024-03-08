import { connect } from 'react-redux';
import CategoriasGrid from './CategoriasGrid'
import { listarCategoria, searchCategoria, borrarCategorias } from '../../../../../redux/modules/Categorias/categorias';
const mdtp = {listarCategoria, borrarCategorias, searchCategoria}
const mstp = state => state.categorias

export default connect(mstp, mdtp)(CategoriasGrid)
