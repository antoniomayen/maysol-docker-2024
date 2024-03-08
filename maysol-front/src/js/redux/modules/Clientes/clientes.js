import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'cliente';

const LOADER_CLIENTE = 'LOADER_CLIENTE';
const SET_DATA_CLIENTE = 'SET_DATA_CLIENTE';
const SET_PAGE_CLIENTE = 'SET_PAGE_CLIENTE';
const SET_UPDATE_DATA_CLIENTE ='SET_UPDATE_DATA_CLIENTE';
const SET_BUSCADOR_CLIENTE = 'SET_BUSCADOR_CLIENTE';
const SET_FILTRO_CLIENTE = 'SET_FILTRO_CLIENTE';
const SET_EMPRESAS_CLIENTE = 'SET_EMPRESAS_CLIENTE';

// ------------------------------------
// Actions
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_CLIENTE, cargando: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.clientes.buscador;
    const filtro = store.clientes.filtro_empresa;
    let params = {page, search};

    if(filtro){
        params['empresa'] = filtro
    }
    api.get(`${url}`, params).catch((error) => {
        dispatch({type: LOADER_CLIENTE, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_CLIENTE, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_CLIENTE, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_CLIENTE, page});
            // dispatch(setPagePrestamos(page));
        }
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_CLIENTE, cargando: true});
    api.get(`${url}/${id}`).catch((error) => {
        if(error.statusCode  === 404){
            dispatch(push('/admin_clientes'))
        }
        dispatch({type: LOADER_CLIENTE, cargando: false});
    }).then((data) => {
        if(data){
            dispatch({type: SET_UPDATE_DATA_CLIENTE, updateData: data});
            dispatch(initializeForm('cliente', data))
        }
        dispatch({type: LOADER_CLIENTE, cargando: false});
    })
}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.cliente.values;
    dispatch({type: LOADER_CLIENTE, cargando: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: LOADER_CLIENTE, cargando: false})
        Swal('Éxito', 'Se ha creado el cliente.', 'success')
        .then(() => {
            dispatch(push('/admin_clientes'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_CLIENTE, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_CLIENTE, cargando: false})
    });
}

const update = () => (dispatch, getStore) => {
    const formData = getStore().form.cliente.values;
    const cliente = getStore().clientes.updateData;

    let cuentasBorradas = [];
    let contactosBorradas = [];

    // genera arrays para borrar esos registros en el backend
    try{
        cuentasBorradas = cliente.cuentas.filter((el) => !formData.cuentas.includes(el));
        contactosBorradas = cliente.contactos.filter((el) => !formData.contactos.includes(el));
    }catch(e) {}

    formData.cuentasBorrados = cuentasBorradas;
    formData.contactosBorrados = contactosBorradas;

    dispatch({type: LOADER_CLIENTE, cargando: true});
    api.put(`${url}/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: LOADER_CLIENTE, cargando: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/admin_clientes'));
            })
        }
    })
    .catch((error) =>{
        dispatch({type: LOADER_CLIENTE, cargando: false});
        swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/admin_clientes'));
        }
    })
}
const destroy = (id) => (dispatch, getStore) => {
    dispatch({type: LOADER_CLIENTE, cargando: true});
    // dispatch(cargandoPrestamos());
    api.eliminar(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_CLIENTE, cargando: false});
        // dispatch(cargandoPrestamos(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(listar(1));
            })
    }).then((data) => {
        dispatch({type: LOADER_CLIENTE, cargando: false});
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
            dispatch({type: SET_EMPRESAS_CLIENTE, empresasSelect: data});
        }
    })
}
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_CLIENTE, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if(filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_CLIENTE, filtro_empresa: filtro});
    dispatch(listar(1));
}

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
    [LOADER_CLIENTE]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_CLIENTE]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_CLIENTE]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_CLIENTE]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_CLIENTE]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_CLIENTE]: (state, { filtro_empresa }) => {
        return {...state, filtro_empresa }
    },
    [SET_EMPRESAS_CLIENTE]: (state, { empresasSelect }) => {
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
    filtro_empresa: null,
    updateData: {},
    empresasSelect:[]
};

export default handleActions(reducer, initialState)
