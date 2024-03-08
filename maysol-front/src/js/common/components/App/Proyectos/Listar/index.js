import { connect } from 'react-redux';
import { listar, destroy, search } from '../../../../../redux/modules/Proyectos/proyectos';
import ProyectosGrid from './ProyectosGrid';

const mstp = state => state.proyectos;

const mdtp = {listar, destroy, search}

export default connect(mstp, mdtp)(ProyectosGrid)
