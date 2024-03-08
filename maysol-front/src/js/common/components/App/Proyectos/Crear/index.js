import { connect } from 'react-redux';
import Crear from './ProyectoCreate'
import { create, update, getProyecto } from '../../../../../redux/modules/Proyectos/proyectos';
const mdtp = {create, update, getProyecto}
const mstp = state => state.proyectos

export default connect(mstp, mdtp)(Crear)
