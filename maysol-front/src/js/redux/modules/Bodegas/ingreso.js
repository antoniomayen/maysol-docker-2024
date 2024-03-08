import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'movBodegas';

const LOADER_INGRESO = 'LOADER_INGRESO';
const SET_DATA_INGRESO = 'SET_DATA_INGRESO';
const SET_PAGE_INGRESO = 'SET_PAGE_INGRESO';
const SET_PAGECOMPRAS_INGRESO = 'SET_PAGECOMPRAS_INGRESO';

const SET_UPDATE_DATA_INGRESO ='SET_UPDATE_DATA_INGRESO';
const SET_BUSCADOR_INGRESO = 'SET_BUSCADOR_INGRESO';
const SET_PROYECTO_INGRESO = 'SET_PROYECTO_INGRESO';
const SET_FILTRO_INGRESO = 'SET_FILTRO_INGRESO';
const SET_EMPRESAS_INGRESO = 'SET_EMPRESAS_INGRESO';
const SET_COMPRAS_INGRESO = 'SET_COMPRAS_INGRESO';
const SET_PAGE_COMPRA_INGRESO = 'SET_PAGE_COMPRA_INGRESO';
const SET_IDBODEGA_INGRESO = 'SET_IDBODEGA_INGRESO';
const SET_DATALINEAPRODUCCION_INGRESO = 'SET_DATALINEAPRODUCCION_INGRESO';
const SET_IDLINEAEMPRESA_INGRESO = 'SET_IDLINEAEMPRESA_INGRESO';
const SET_DESPACHOS_INGRESO = 'SET_DESPACHOS_INGRESO';
const SET_INGRESODETALLE_INGRESO = 'SET_INGRESODETALLE_INGRESO';

// ------------------------------------
// Actions
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_INGRESO, cargando: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.ingreso.buscador;
    const filtro = store.ingreso.filtro_ingreso;
    let params = {page, search};

    if(filtro){
        params['empresa__id'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}`, params).catch((error) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_INGRESO, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_INGRESO, page});
            // dispatch(setPagePrestamos(page));
        }
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_INGRESO, data: true});

}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.ingreso.values;
    dispatch({type: LOADER_INGRESO, cargando: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false})
        Swal('Éxito', 'Se ha creado un ingreso.', 'success')
        .then(() => {
            dispatch(push('/ingresos'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_INGRESO, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_INGRESO, cargando: false})
    });
};

const update = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.ingreso.values);
    const ingreso = getStore().ingresos.updateData;
    try {
        if (formData.empresa.id){
            formData.empresa = formData.empresa.id
        }
    }catch (e) {}
    dispatch({type: LOADER_INGRESO, cargando: true});
    api.put(`${url}/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/ingresos'));
            })
        }
    })
    .catch((error) =>{
        dispatch({type: LOADER_INGRESO, cargando: false});
        swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/ingresos'));
        }
    })
}
const destroy = (id) => (dispatch, getStore) => {
    dispatch({type: LOADER_INGRESO, cargando: true});
    // dispatch(cargandoPrestamos());
    api.eliminar(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(listar(1));
            })
    }).then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
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
            dispatch({type: SET_EMPRESAS_INGRESO, empresasSelect: data});
        }
    })
}

const getCompras = (page=1, bodega) => (dispatch, getStore) => {
    let ingresado = false;
    dispatch({type:SET_IDBODEGA_INGRESO, bodega:bodega});
    dispatch({type: LOADER_INGRESO, cargando: true});
    let params = {page, ingresado};
    api.get(`compras`, params).catch((error) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_COMPRAS_INGRESO, compras:data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_COMPRA_INGRESO, page});
            // dispatch(setPagePrestamos(page));
        }
    })

}
const getDespachosIngreso = (bodega) => (dispatch, getStore) => {
    let ingresado = false;
    dispatch({type: LOADER_INGRESO, cargando: true});
    api.get(`movBodegas/getDespachosBodega/${bodega}`).catch((error) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DESPACHOS_INGRESO, despachosBodega:data});
            // dispatch(setDataPrestamos(data));
            // dispatch(setPagePrestamos(page));
        }
    })

}
const resetLineaEmpresa = () => (dispatch, getStore) => {
    let dataLinea={
        linea: '',
        emprea:''
    }
    let idLineaEmpresa= {
        linea: null,
        emprea: null,
        fecha: null
    }
    dispatch({type: SET_IDLINEAEMPRESA_INGRESO, idLineaEmpresa: idLineaEmpresa});
    dispatch({type: SET_DATALINEAPRODUCCION_INGRESO, dataLinea: dataLinea});
}
const getDataLineaEmpresa = () => (dispatch, getStore) => {
    const data = _.cloneDeep(getStore().form.ingresoDatos.values);
    try {
        data.fecha = data.fecha.format("YYYY-MM-D")
    } catch (error) {
        data.fecha = data.fecha
    }

    dispatch({type: SET_IDLINEAEMPRESA_INGRESO, idLineaEmpresa: data});
    dispatch(initializeForm('ingresobodega', data))
    let params = {linea: data.linea, empresa: data.empresa}
    dispatch({type: LOADER_INGRESO, cargando: true});
    api.get(`lineaproduccion/getLineaEmpresa`, params).catch((error) => {
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
        dispatch({type: LOADER_INGRESO, cargando: false});
    }).then((data) => {
        if(data){
            dispatch({type: SET_DATALINEAPRODUCCION_INGRESO, dataLinea: data});
        }
        dispatch({type: LOADER_INGRESO, cargando: false});
    })
}

/***Ingreso de productos desde compra */
const ingresoCompra = (ingreso=1) => (dispatch, getStore) => {
    const formData = getStore().form.ingresobodega.values;
    const store = getStore();
    const bodega = store.ingreso.bodega;
    dispatch({type: LOADER_INGRESO, cargando: true})
    let ruta = 'movBodegas';
    if(ingreso === 2){
        ruta = 'movBodegas/ingresoLineaProduccion'
    } else if(ingreso === 3){
        ruta = 'movBodegas/ingresodespacho'
    }

    api.post(`${ruta}`, formData).then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false})
        Swal('Éxito', 'Se ha creado un ingreso.', 'success')
        .then(() => {
            dispatch(push(`/bodega_estado/${bodega}`))
        })
    }).catch((error) => {
        dispatch({type: LOADER_INGRESO, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_INGRESO, cargando: false})
    });
};
const ingreso = (bodega, ingreso=2, empresa) => (dispatch, getStore) => {
    const formData = getStore().form.ingresobodega.values;
    const store = getStore();
    formData.bodega = bodega;
    console.log("empresa", empresa)
    let ruta = 'movBodegas/ingresoLineaProduccion';
    dispatch({type: LOADER_INGRESO, cargando: true})
    if(ingreso === 2){
        ruta = 'movBodegas/ingresoLineaProduccion'
    } else if(ingreso === 3){
        ruta = `movBodegas/ingresodespacho`
    }

    api.post(`${ruta}`, formData).then((data) => {
        dispatch({type: LOADER_INGRESO, cargando: false})
        Swal('Éxito', 'Se ha creado un ingreso.', 'success')
        .then(() => {
            dispatch(push(`/bodega_estado/${bodega}`))
        })
    }).catch((error) => {
        dispatch({type: LOADER_INGRESO, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_INGRESO, cargando: false})
    });
};

const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_INGRESO, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_INGRESO, filtro_ingreso: filtro});
    dispatch(listar(1));
};
const set_detalleIngreso = (detalle) =>  (dispatch, getStore) => {
    dispatch({
        type: SET_INGRESODETALLE_INGRESO,
        detalle_ingreso: detalle
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
    getCompras,
    getDataLineaEmpresa,
    resetLineaEmpresa,
    ingreso,
    ingresoCompra,
    getDespachosIngreso,
    set_detalleIngreso,
};

export const reducer = {
    [LOADER_INGRESO]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_INGRESO]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_INGRESO]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_INGRESO]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_INGRESO]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_INGRESO]: (state, { filtro_ingreso }) => {
        return {...state, filtro_ingreso }
    },
    [SET_EMPRESAS_INGRESO]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    },
    [SET_COMPRAS_INGRESO]: (state, { compras }) => {
        return {...state, compras }
    },
    [SET_PAGE_COMPRA_INGRESO]: (state, { pageCompra }) => {
        return {...state, pageCompra }
    },
    [SET_IDBODEGA_INGRESO]: (state, { bodega }) => {
        return {...state, bodega }
    },
    [SET_DATALINEAPRODUCCION_INGRESO]: (state, { dataLinea }) => {
        return {...state, dataLinea }
    },
    [SET_IDLINEAEMPRESA_INGRESO]: (state, { idLineaEmpresa }) => {
        return {...state, idLineaEmpresa }
    },
    [SET_DESPACHOS_INGRESO]: (state, { despachosBodega }) => {
        return {...state, despachosBodega }
    },
    [SET_INGRESODETALLE_INGRESO]: (state, { detalle_ingreso }) => {
        return {...state, detalle_ingreso }
    }
}

export const initialState = {
    cargando: false,
    page: 1,
    pageCompra: 1,
    bodega: 0,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    despachosBodega: [],
    buscador: '',
    filtro_ingreso: null,
    updateData: {},
    empresasSelect:[],
    dataLinea:{
        linea: '',
        emprea:''
    },
    idLineaEmpresa: {
        linea: null,
        emprea: null,
        fecha: null
    },
    compras:{
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    detalle_ingreso: null,
};

export default handleActions(reducer, initialState)
