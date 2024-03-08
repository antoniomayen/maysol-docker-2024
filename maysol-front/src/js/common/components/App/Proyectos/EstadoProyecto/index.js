import { connect } from 'react-redux';
import {
    listar,
    destroy,
    search,
    cambiarFiltro,
    movimiento,
    crearPago,
    anular,
    getProyecto,
    setToggleModal
} from '../../../../../redux/modules/Proyectos/estadoproyecto';
import EstadoProyectoGrid from './EstadoProyectoGrid';

const mstp = state => state.estadoproyectos

const mdtp = {
    listar,
    destroy,
    search,
    anular,
    crearPago,
    getProyecto,
    cambiarFiltro,
    movimiento,
    setToggleModal
}

export default connect(mstp, mdtp)(EstadoProyectoGrid)
