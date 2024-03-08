import Swal from 'sweetalert2';
import { api } from 'api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'reportes';

const SET_CARGANDO_REPORTEGASTO = 'SET_CARGANDO_REPORTEGASTO';


const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(loadingPrestamos());


    // // parametros de búsqueda
    // const store = getStore();
    // const search = store.estadobodega.buscador;
    // const filtro = store.estadobodega.filtro_estadobodega;
    // const bodega = store.estadobodega.idBodega;
    // let params = {page, search, bodega};

    // // if(filtro){
    //     //     params['tipo'] = filtro
    //     // }

    // dispatch({type: CARGANDO_ESTADOBODEGA, loading: true});
    // api.get(`inventario/getInventario/${bodega}`, params).catch((error) => {
    //     // dispatch(loadingPrestamos(false));
    //     Swal(
    //         'Error',
    //         error.detail || 'Ha ocurrido un error, por favor vuelva a intentar.',
    //         'error'
    //         );
    //         dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    // }).then((data) => {
    //     // dispatch(loadingPrestamos(false));
    //     if(data){
    //         dispatch({type: SET_DATA_ESTADOBODEGA, data});
    //         // dispatch(setDataPrestamos(data));
    //         dispatch({type: SET_PAGE_ESTADOBODEGA, page});
    //         // dispatch(setPagePrestamos(page));
    //     }
    //     dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    // })
};
export const actions = {
    listar,
};

export const reducer = {
    [SET_CARGANDO_REPORTEGASTO]: (state, { loading }) => {
        return {...state, loading }
    }
}
export const initialState = {
    loading: true,
    page: 1,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    }
};

export default handleActions(reducer, initialState)