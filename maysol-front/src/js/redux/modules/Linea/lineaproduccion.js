import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'lineaproduccion';

const LOADER_LINEAP = 'LOADER_LINEAP';
const SET_DATA_LINEAP = 'SET_DATA_LINEAP';
const SET_PAGE_LINEAP = 'SET_PAGE_LINEAP';
const SET_UPDATE_DATA_LINEAP ='SET_UPDATE_DATA_LINEAP';
const SET_BUSCADOR_LINEAP = 'SET_BUSCADOR_LINEAP';
const SET_PROYECTO_LINEAP = 'SET_PROYECTO_LINEAP';
const SET_FILTRO_LINEAP = 'SET_FILTRO_LINEAP';
const SET_EMPRESAS_LINEAP = 'SET_EMPRESAS_LINEAP';

// ------------------------------------
// Actions
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_LINEAP, cargando: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.lineaproduccion.buscador;
    const filtro = store.lineaproduccion.filtro_lineap;
    let params = {page, search};

    if(filtro){
        params['empresa__id'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}`, params).catch((error) => {
        dispatch({type: LOADER_LINEAP, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_LINEAP, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_LINEAP, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_LINEAP, page});
            // dispatch(setPagePrestamos(page));
        }
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_LINEAP, cargando: true});
    api.get(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_LINEAP, cargando: false});
        if(error.statusCode  === 404){
            dispatch(push('/admin_lineaproducciones'))
        }
    }).then((data) => {
        dispatch({type: LOADER_LINEAP, cargando: false});
        if(data){
            dispatch({type: SET_UPDATE_DATA_LINEAP, updateData: data});
            dispatch(initializeForm('lineaproduccion', data))
        }
    })
}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.lineaproduccion.values;
    dispatch({type: LOADER_LINEAP, cargando: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: LOADER_LINEAP, cargando: false})
        Swal('Éxito', 'Se ha creado la linea de producción.', 'success')
        .then(() => {
            dispatch(push('/admin_lineaproducciones'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_LINEAP, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_LINEAP, cargando: false})
    });
};

const update = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.lineaproduccion.values);

    dispatch({type: LOADER_LINEAP, cargando: true});
    api.put(`${url}/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: LOADER_LINEAP, cargando: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/admin_lineaproducciones'));
            })
        }
    })
    .catch((error) =>{
        dispatch({type: LOADER_LINEAP, cargando: false});
        swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/admin_lineaproducciones'));
        }
    })
}
const destroy = (id) => (dispatch, getStore) => {
    dispatch({type: LOADER_LINEAP, cargando: true});
    // dispatch(cargandoPrestamos());
    api.eliminar(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_LINEAP, cargando: false});
        // dispatch(cargandoPrestamos(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(listar(1));
            })
    }).then((data) => {
        dispatch({type: LOADER_LINEAP, cargando: false});
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
            dispatch({type: SET_EMPRESAS_LINEAP, empresasSelect: data});
        }
    })
}
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_LINEAP, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_LINEAP, filtro_lineap: filtro});
    dispatch(listar(1));
};

export const actions = {
    listar,
    detail,
    create,
    update,
    destroy,
    search,
    getEmpresasSelect,
    filtro

};

export const reducer = {
    [LOADER_LINEAP]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_LINEAP]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_LINEAP]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_LINEAP]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_LINEAP]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_LINEAP]: (state, { filtro_lineap }) => {
        return {...state, filtro_lineap }
    },
    [SET_EMPRESAS_LINEAP]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
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
    filtro_lineap: null,
    updateData: {},
    empresasSelect:[]
};

export default handleActions(reducer, initialState)
