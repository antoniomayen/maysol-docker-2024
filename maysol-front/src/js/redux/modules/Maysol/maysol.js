import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'bodegas';

const LOADER_MAYSOL = 'LOADER_MAYSOL';
const SET_DATA_MAYSOL = 'SET_DATA_MAYSOL';
const SET_PAGE_MAYSOL = 'SET_PAGE_MAYSOL';
const SET_UPDATE_DATA_MAYSOL ='SET_UPDATE_DATA_MAYSOL';
const SET_BUSCADOR_MAYSOL = 'SET_BUSCADOR_MAYSOL';
const SET_PROYECTO_MAYSOL = 'SET_PROYECTO_MAYSOL';
const SET_FILTRO_MAYSOL = 'SET_FILTRO_MAYSOL';
const SET_EMPRESAS_MAYSOL = 'SET_EMPRESAS_MAYSOL';
const SET_TOGGLEMODAL_MAYSOL ='SET_TOGGLEMODAL_MAYSOL';
// ------------------------------------
// Actions
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_MAYSOL, cargando: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.maysol.buscador;
    const filtro = store.maysol.filtro_bodega;
    let params = {page, search};

    if(filtro){
        params['empresa__id'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`proyectos/getGallineros`, params).catch((error) => {
        // dispatch(cargandoPrestamos(false));
        dispatch({type: LOADER_MAYSOL, cargando: false});
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_MAYSOL, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_MAYSOL, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: LOADER_MAYSOL, cargando: false});
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_MAYSOL, cargando: true});
    api.get(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_MAYSOL, cargando: false});
        if(error.statusCode  === 404){
            dispatch(push('/bodegas'))
        }
    }).then((data) => {
        dispatch({type: LOADER_MAYSOL, cargando: false});
        if(data){
            dispatch({type: SET_UPDATE_DATA_MAYSOL, updateData: data});
            dispatch(initializeForm('bodega', data))
        }
    })
}



const updateTecnico = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.cambioTecnico.values);

    dispatch({type: LOADER_MAYSOL, cargando: true});
    api.put(`proyectos/asignarTecnico/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: LOADER_MAYSOL, cargando: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch({type: SET_TOGGLEMODAL_MAYSOL, toggleModal: false});
                dispatch(listar());
            })
        }
    })
    .catch((error) =>{
        dispatch({type: LOADER_MAYSOL, cargando: false});
        swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/bodegas'));
        }
    })
}
const destroy = (id) => (dispatch, getStore) => {
    dispatch({type: LOADER_MAYSOL, cargando: true});
    // dispatch(cargandoPrestamos());
    api.eliminar(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_MAYSOL, cargando: false});
        // dispatch(cargandoPrestamos(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(listar(1));
            })
    }).then((data) => {
        dispatch({type: LOADER_MAYSOL, cargando: false});
        // dispatch(cargandoPrestamos(false));
        swal('Éxito', 'Se ha eliminado correctamente.', 'success')
            .then(() => {
                dispatch(listar(1));
            })
    })
};

const getEmpresasSelect = () => (dispatch, getStore) => {
    let params = {principales:""}
    api.get(`proyectos/getEmpresasSelect`, params).catch((error) => {
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch({type: SET_EMPRESAS_MAYSOL, empresasSelect: data});
        }
    })
}
const setToggleModal = (estado) => (dispatch, getStore) => {
    dispatch({type: SET_TOGGLEMODAL_MAYSOL, toggleModal: estado})
}
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_MAYSOL, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_MAYSOL, filtro_bodega: filtro});
    dispatch(listar(1));
};

export const actions = {
    listar,
    detail,
    updateTecnico,
    destroy,
    search,
    getEmpresasSelect,
    filtro,
    setToggleModal

};

export const reducer = {
    [LOADER_MAYSOL]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_MAYSOL]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_MAYSOL]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_MAYSOL]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_MAYSOL]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_MAYSOL]: (state, { filtro_bodega }) => {
        return {...state, filtro_bodega }
    },
    [SET_EMPRESAS_MAYSOL]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    },
    [SET_TOGGLEMODAL_MAYSOL]: (state, { toggleModal }) => {
        return {...state, toggleModal }
    }
}

export const initialState = {
    cargando: false,
    page: 1,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscador: '',
    filtro_bodega: null,
    updateData: {},
    empresasSelect:[],
    toggleModal: false
};

export default handleActions(reducer, initialState)
