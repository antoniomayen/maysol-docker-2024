import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'bodegas';

const LOADER_BODEGA = 'LOADER_BODEGA';
const SET_DATA_BODEGA = 'SET_DATA_BODEGA';
const SET_PAGE_BODEGA = 'SET_PAGE_BODEGA';
const SET_UPDATE_DATA_BODEGA ='SET_UPDATE_DATA_BODEGA';
const SET_BUSCADOR_BODEGA = 'SET_BUSCADOR_BODEGA';
const SET_PROYECTO_BODEGA = 'SET_PROYECTO_BODEGA';
const SET_FILTRO_BODEGA = 'SET_FILTRO_BODEGA';
const SET_EMPRESAS_BODEGA = 'SET_EMPRESAS_BODEGA';
const SET_INGRESODETALLE_BODEGA = 'SET_INGRESODETALLE_BODEGA';

// ------------------------------------
// Actiones
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_BODEGA, cargando: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.bodegas.buscador;
    const filtro = store.bodegas.filtro_bodega;
    let params = {page, search};

    if(filtro){
        params['empresa__id'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}`, params).catch((error) => {
        // dispatch(cargandoPrestamos(false));
        dispatch({type: LOADER_BODEGA, cargando: false});
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_BODEGA, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_BODEGA, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: LOADER_BODEGA, cargando: false});
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_BODEGA, cargando: true});
    api.get(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_BODEGA, cargando: false});
        if(error.statusCode  === 404){
            dispatch(push('/bodegas'))
        }
    }).then((data) => {
        dispatch({type: LOADER_BODEGA, cargando: false});
        if(data){

            dispatch({type: SET_UPDATE_DATA_BODEGA, updateData: data});
            dispatch(initializeForm('bodega', data))
        }
    })
}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.bodega.values;
    dispatch({type: LOADER_BODEGA, cargando: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: LOADER_BODEGA, cargando: false})
        Swal('Éxito', 'Se ha creado la bodega.', 'success')
        .then(() => {
            dispatch(push('/bodegas'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_BODEGA, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_BODEGA, cargando: false})
    });
};

const update = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.bodega.values);
    const bodega = getStore().bodegas.updateData;
    try {
        if (formData.empresa.id){
            formData.empresa = formData.empresa.id
        }
    }catch (e) {}
    dispatch({type: LOADER_BODEGA, cargando: true});
    api.put(`${url}/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: LOADER_BODEGA, cargando: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/bodegas'));
            })
        }
    })
    .catch((error) =>{
        dispatch({type: LOADER_BODEGA, cargando: false});
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
    dispatch({type: LOADER_BODEGA, cargando: true});
    // dispatch(cargandoPrestamos());
    api.eliminar(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_BODEGA, cargando: false});
        // dispatch(cargandoPrestamos(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(listar(1));
            })
    }).then((data) => {
        dispatch({type: LOADER_BODEGA, cargando: false});
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
            dispatch({type: SET_EMPRESAS_BODEGA, empresasSelect: data});
        }
    })
}
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_BODEGA, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_BODEGA, filtro_bodega: filtro});
    dispatch(listar(1));
};
const set_ingresoDetalle = (ingreso) => (dispatch, getStore) => {
    dispatch({
        type: SET_INGRESODETALLE_BODEGA,
        ingreso_detalle: ingreso
    })
}

export const actions = {
    listar,
    detail,
    create,
    update,
    destroy,
    search,
    getEmpresasSelect,
    filtro,
    set_ingresoDetalle
};

export const reducer = {
    [LOADER_BODEGA]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_BODEGA]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_BODEGA]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_BODEGA]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_BODEGA]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_BODEGA]: (state, { filtro_bodega }) => {
        return {...state, filtro_bodega }
    },
    [SET_EMPRESAS_BODEGA]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    },
    [SET_INGRESODETALLE_BODEGA]: (state, { ingreso_detalle }) => {
        return {...state, ingreso_detalle }
    }
}

export const initialState = {
    cargando: true,
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
    ingreso_detalle: null
};

export default handleActions(reducer, initialState)
