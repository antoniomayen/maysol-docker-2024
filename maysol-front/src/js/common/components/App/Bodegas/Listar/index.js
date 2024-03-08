import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Bodegas/bodegas';
import BodegasGrid from './BodegasGrid';

const mstp = state => {
    let agregar_bodega = false;
    let me = state.login.me;
    if (state.login.me){
        if (state.login.me.accesos.administrador){
            agregar_bodega = true;
        }
    }
    return {...state.bodegas, ...state.login, agregar_bodega, me}
};

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(BodegasGrid)
