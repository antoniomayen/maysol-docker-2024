import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'proveedor';

const LOADER_PROVEEDOR = 'LOADER_PROVEEDOR';
const SET_DATA_PROVEEDOR = 'SET_DATA_PROVEEDOR';
const SET_PAGE_PROVEEDOR = 'SET_PAGE_PROVEEDOR';
const SET_UPDATE_DATA_PROVEEDOR ='SET_UPDATE_DATA_PROVEEDOR';
const SET_BUSCADOR_PROVEEDOR = 'SET_BUSCADOR_PROVEEDOR';
const SET_PROYECTO_PROVEEDOR = 'SET_PROYECTO_PROVEEDOR';
const SET_FILTRO_PROVEEDOR = 'SET_FILTRO_PROVEEDOR';
const SET_EMPRESAS_PROVEEDOR = 'SET_EMPRESAS_PROVEEDOR';

// ------------------------------------
// Actions
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_PROVEEDOR, cargando: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.proveedores.buscador;
    const filtro = store.proveedores.filtro_proveedor;
    let params = {page, search};

    if(filtro){
        params['empresa'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}`, params).catch((error) => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_PROVEEDOR, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_PROVEEDOR, page});
            // dispatch(setPagePrestamos(page));
        }
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_PROVEEDOR, cargando: true});
    api.get(`${url}/${id}`).catch((error) => {
        if(error.statusCode  === 404){
            dispatch(push('/admin_proveedores'))
        }
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
    }).then((data) => {
        if(data){
            dispatch({type: SET_UPDATE_DATA_PROVEEDOR, updateData: data});
            dispatch(initializeForm('proveedor', data))
        }
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
    })
}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.proveedor.values;
    dispatch({type: LOADER_PROVEEDOR, cargando: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false})
        Swal('Éxito', 'Se ha creado el proveedor.', 'success')
        .then(() => {
            dispatch(push('/admin_proveedores'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false})
    });
}

const update = () => (dispatch, getStore) => {
    const formData = getStore().form.proveedor.values;
    const proveedor = getStore().proveedores.updateData;

    // genera arrays para borrar esos registros en el backend
    let cuentasBorradas = proveedor.cuentas.filter((el) => !formData.cuentas.includes(el));
    let contactosBorradas = proveedor.contactos.filter((el) => !formData.contactos.includes(el));

    formData.cuentasBorrados = cuentasBorradas;
    formData.contactosBorrados = contactosBorradas;

    dispatch({type: LOADER_PROVEEDOR, cargando: true});
    api.put(`${url}/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/admin_proveedores'));
            })
        }
    })
    .catch((error) =>{
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
        swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/admin_proveedores'));
        }
    })
}
const destroy = (id) => (dispatch, getStore) => {
    dispatch({type: LOADER_PROVEEDOR, cargando: true});
    // dispatch(cargandoPrestamos());
    api.eliminar(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
        // dispatch(cargandoPrestamos(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(listar(1));
            })
    }).then((data) => {
        dispatch({type: LOADER_PROVEEDOR, cargando: false});
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
            dispatch({type: SET_EMPRESAS_PROVEEDOR, empresasSelect: data});
        }
    })
}
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_PROVEEDOR, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if(filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_PROVEEDOR, filtro_proveedor: filtro});
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
    [LOADER_PROVEEDOR]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_PROVEEDOR]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_PROVEEDOR]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_PROVEEDOR]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_PROVEEDOR]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_PROVEEDOR]: (state, { filtro_proveedor }) => {
        return {...state, filtro_proveedor }
    },
    [SET_EMPRESAS_PROVEEDOR]: (state, { empresasSelect }) => {
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
    filtro_proveedor: null,
    updateData: {},
    empresasSelect:[]
};

export default handleActions(reducer, initialState)
