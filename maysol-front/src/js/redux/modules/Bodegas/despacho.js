import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import moment from 'moment';

const url = 'movBodegas';

const LOADER_DESPACHO = 'LOADER_DESPACHO';
const SET_DATA_DESPACHO = 'SET_DATA_DESPACHO';
const SET_PAGE_DESPACHO = 'SET_PAGE_DESPACHO';

const SET_PAGEPENDIENTES_DESPACHO = 'SET_PAGEPENDIENTES_DESPACHO';
const SET_SEARCHPENDIENTES_DESPACHO = 'SET_SEARCHPENDIENTES_DESPACHO';

const SET_PAGEVENTA_DESPACHO = 'SET_PAGEVENTA_DESPACHO';


const SET_UPDATE_DATA_DESPACHO ='SET_UPDATE_DATA_DESPACHO';
const SET_BUSCADOR_DESPACHO = 'SET_BUSCADOR_DESPACHO';
const SET_PRODUCTOS_DESPACHO = 'SET_PRODUCTOS_DESPACHO';
const SET_FILTRO_DESPACHO = 'SET_FILTRO_DESPACHO';
const SET_EMPRESAS_DESPACHO = 'SET_EMPRESAS_DESPACHO';
const SET_COMPRAS_DESPACHO = 'SET_COMPRAS_DESPACHO';
const SET_PAGE_COMPRA_DESPACHO = 'SET_PAGE_COMPRA_DESPACHO';
const SET_IDBODEGA_DESPACHO = 'SET_IDBODEGA_DESPACHO';

const SET_DATALINEAPRODUCCION_DESPACHO = 'SET_DATALINEAPRODUCCION_DESPACHO';
const SET_IDLINEAEMPRESA_DESPACHO = 'SET_IDLINEAEMPRESA_DESPACHO';

const SET_DATABODEGA_DEPACHO ='SET_DATABODEGA_DESPACHO';
const SET_IDBODEGAEMPRESA_DESPACHO = 'SET_IDBODEGAEMPRESA_DESPACHO';
const DESPACHOS_PENDIENTES = 'DESPACHOS_PENDIENTES';
// ------------------------------------
// Actions
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(cargandoPrestamos());
    dispatch({type: LOADER_DESPACHO, cargando: true});

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
        dispatch({type: LOADER_DESPACHO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_DESPACHO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_DESPACHO, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_DESPACHO, page});
            // dispatch(setPagePrestamos(page));
        }
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_DESPACHO, data: true});

}

const getDespachosPendientes = (id, page=1) => (dispatch, getStore) => {
    const store = getStore();
    const search = store.despacho.searchPendientes;
    let params = {id,page, search};
    dispatch({type: SET_PAGEPENDIENTES_DESPACHO, pagePendientes: page})

    dispatch({type: LOADER_DESPACHO, cargando: true});
    api.get(`${url}/getDespachosPendientes`,params).then(despachos => {
        if(despachos){
            dispatch({type: LOADER_DESPACHO, cargando: false});
            dispatch({type: DESPACHOS_PENDIENTES, despachos_pendientes: despachos})
        }
    }).catch((error) => {
        dispatch({type: LOADER_DESPACHO, cargando: false});

    })
};
const anularDespacho = (id, justificacion, bodega) => (dispatch, getStore) => {
    dispatch({type: LOADER_DESPACHO, cargando: true});
    api.post(`${url}/anularDespacho`,{id, justificacion}).then((data) => {
        dispatch({type: LOADER_DESPACHO, cargando: false})
        Swal('Éxito', 'Se ha anulado correctamente', 'success')
        .then(() => {
            dispatch(push(`/bodega_estado/${bodega}`))
        })
    }).catch((error) => {
         dispatch({type: LOADER_DESPACHO, cargando: false});
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
         dispatch({type: LOADER_DESPACHO, cargando: false});
    });
};

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.ingreso.values;
    dispatch({type: LOADER_DESPACHO, cargando: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: LOADER_DESPACHO, cargando: false})
        Swal('Éxito', 'Se ha creado el despacho.', 'success')
        .then(() => {
            dispatch(push('/ingresos'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_DESPACHO, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_DESPACHO, cargando: false})
    });
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
            dispatch({type: SET_EMPRESAS_DESPACHO, empresasSelect: data});
        }
    })
}

const getVentas = (page=1, bodega) => (dispatch, getStore) => {
    let ingresado = false;
    dispatch({type:SET_IDBODEGA_DESPACHO, bodega:bodega});
    dispatch({type: LOADER_DESPACHO, cargando: true});

    let params = {page, ingresado, idbodega:bodega};
    api.get(`ventas`, params).catch((error) => {
        dispatch({type: LOADER_DESPACHO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_DESPACHO, cargando: false});
        // dispatch(cargandoPrestamos(false));
        if(data){
            dispatch({type: SET_COMPRAS_DESPACHO, compras:data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGEVENTA_DESPACHO, pageVenta: page});
            // dispatch(setPagePrestamos(page));
        }
    })

}

//****/*****parte para el manejo de linea de producción y empresas */
const resetLineaEmpresa = () => (dispatch, getStore) => {
    let dataLinea={
        linea: '',
        empresa:''
    }
    let idLineaEmpresa= {
        linea: null,
        empresa: null,
        fecha: null
    }
    dispatch({type: SET_IDLINEAEMPRESA_DESPACHO, idLineaEmpresa: idLineaEmpresa});
    dispatch({type: SET_DATALINEAPRODUCCION_DESPACHO, dataLinea: dataLinea});
}
const getDataLineaEmpresa = () => (dispatch, getStore) => {
    const data = _.cloneDeep(getStore().form.ingresoDatosLinea.values);
    try {
        data.fecha = data.fecha.format("YYYY-MM-DD")
    } catch (error) {
        data.fecha = data.fecha
    }

    const dif_mes=moment().format("MM") - moment(data.fecha).month()
    const dif_año = moment().format("YYYY")  - moment(data.fecha).year()
    const meses = dif_año*12 + dif_mes -1

    if (meses >= 2 && moment(data.fecha).format("DD") < moment().format("DD")){
        Swal(
            'Error','La fecha del despacho no puede ser mayor a 2 meses','error'
        );
    }
    else{
        let params = {linea: data.linea, empresa: data.empresa}
        data.productos = []
        dispatch({type: SET_IDLINEAEMPRESA_DESPACHO, idLineaEmpresa: data});
        dispatch(initializeForm('despachobodega', data))
        dispatch({type: LOADER_DESPACHO, cargando: true});
        api.get(`lineaproduccion/getLineaEmpresa`, params).catch((error) => {
            Swal(
                'Error',
                 (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
                'error'
            );
            dispatch({type: LOADER_DESPACHO, cargando: false});
        }).then((data) => {
            if(data){
                dispatch({type: SET_DATALINEAPRODUCCION_DESPACHO, dataLinea: data});
            }
            dispatch({type: LOADER_DESPACHO, cargando: false});
        })
    }
    
}
///*******PARTE PARA EL MANEJO DE bODEGA Y EMPRESAS */
const resetBodegaEmpresa = () => (dispatch, getStore) => {
    let dataBodega={
        bodega: '',
        empresa:''
    }
    let idBodegaEmpresa= {
        bodega: null,
        empresa: null,
        fecha: null
    }
    dispatch({type: SET_IDBODEGAEMPRESA_DESPACHO, idBodegaEmpresa: idBodegaEmpresa});
    dispatch({type: SET_DATABODEGA_DEPACHO, dataBodega: dataBodega});
}
const getDataBodegaEmpresa = () => (dispatch, getStore) => {
    const data = _.cloneDeep(getStore().form.ingresoDatosBodega.values);
    try {
        data.fecha = data.fecha.format("YYYY-MM-D")
    } catch (error) {
        data.fecha = data.fecha
    }
    
    const dif_mes=moment().format("MM") - moment(data.fecha).month()
    const dif_año = moment().format("YYYY")  - moment(data.fecha).year()
    const meses = dif_año*12 + dif_mes -1

    if (meses >= 2 && moment(data.fecha).format("DD") < moment().format("DD")){
        Swal(
            'Error','La fecha del despacho no puede ser mayor a 2 meses','error'
        );
    }
    else{
        data.productos = []
        dispatch({type: SET_IDBODEGAEMPRESA_DESPACHO, idBodegaEmpresa: data});
        dispatch(initializeForm('despachobodega', data))
        dispatch({type: LOADER_DESPACHO, cargando: true});
        api.get(`bodegas/${data.bodega}`).catch((error) => {
            Swal(
                'Error',
                 (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
                'error'
            );
            dispatch({type: LOADER_DESPACHO, cargando: false});
        }).then((data) => {
            if(data){
                dispatch({type: SET_DATABODEGA_DEPACHO, dataBodega: data});
            }
            dispatch({type: LOADER_DESPACHO, cargando: false});
        })
    }

}

/***Ingreso de productos desde compra */

const despacho = (bodega, ingreso=1) => (dispatch, getStore) => {
    const formData = getStore().form.despachobodega.values;
    const store = getStore();
    formData.bodegaSalida = bodega;
    let ruta = 'movBodegas/despachoVenta';
    dispatch({type: LOADER_DESPACHO, cargando: true})
    if(ingreso === 2){
        ruta = 'movBodegas/despachoLineaProduccion'
    } else if(ingreso === 3){
        ruta = 'movBodegas/despachoBodega'
    }

    api.put(`${ruta}/${bodega}`, formData).then((data) => {
        dispatch({type: LOADER_DESPACHO, cargando: false})
        Swal('Éxito', 'Se ha creado el despacho.', 'success')
        .then(() => {
            dispatch(push(`/bodega_estado/${bodega}`))
        })
    }).catch((error) => {
        dispatch({type: LOADER_DESPACHO, cargando: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_DESPACHO, cargando: false})
    });
};

const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_DESPACHO, buscador: search});
    dispatch(listar(1));
};
const searchPendientes = (search) => (dispatch, getStore) => {
    dispatch({type: SET_SEARCHPENDIENTES_DESPACHO, buscador: searchPendientes});
    dispatch(getDespachosPendientes(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_DESPACHO, filtro_ingreso: filtro});
    dispatch(listar(1));
};

export const actions = {
    listar,
    detail,
    create,
    search,
    getEmpresasSelect,
    filtro,
    getVentas,
    getDataBodegaEmpresa,
    getDataLineaEmpresa,
    resetLineaEmpresa,
    resetBodegaEmpresa,
    despacho,
    searchPendientes,
    getDespachosPendientes,
    anularDespacho
};

export const reducer = {
    [LOADER_DESPACHO]: (state, { cargando }) => {
        return {...state, cargando }
    },
    [SET_DATA_DESPACHO]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_DESPACHO]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_DESPACHO]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_DESPACHO]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_DESPACHO]: (state, { filtro_ingreso }) => {
        return {...state, filtro_ingreso }
    },
    [SET_EMPRESAS_DESPACHO]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    },
    [SET_COMPRAS_DESPACHO]: (state, { compras }) => {
        return {...state, compras }
    },
    [SET_PAGE_COMPRA_DESPACHO]: (state, { pageCompra }) => {
        return {...state, pageCompra }
    },
    [SET_IDBODEGA_DESPACHO]: (state, { bodega }) => {
        return {...state, bodega }
    },
    [SET_DATALINEAPRODUCCION_DESPACHO]: (state, { dataLinea }) => {
        return {...state, dataLinea }
    },
    [SET_IDLINEAEMPRESA_DESPACHO]: (state, { idLineaEmpresa }) => {
        return {...state, idLineaEmpresa }
    },
    [SET_DATABODEGA_DEPACHO]: (state, { dataBodega }) => {
        return {...state, dataBodega }
    },
    [SET_IDBODEGAEMPRESA_DESPACHO]: (state, { idBodegaEmpresa }) => {
        return {...state, idBodegaEmpresa }
    },
    [DESPACHOS_PENDIENTES]: (state, { despachos_pendientes }) => {
        return {...state, despachos_pendientes }
    },
    [SET_SEARCHPENDIENTES_DESPACHO]: (state, { searchPendientes }) => {
        return {...state, searchPendientes }
    },
    [SET_PAGEPENDIENTES_DESPACHO]: (state, { pagePendientes }) => {
        return {...state, pagePendientes }
    },
    [SET_PAGEVENTA_DESPACHO]: (state, { pageVenta }) => {
        return {...state, pageVenta }
    }
}

export const initialState = {
    cargando: false,
    page: 1,
    pagePendientes: 1,
    pageVenta: 1,
    searchPendientes: '',
    pageCompra: 1,
    bodega: 0,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscador: '',
    filtro_ingreso: null,
    updateData: {},
    empresasSelect:[],
    dataBodega:{
        bodega: '',
        empresa:''
    },
    idBodegaEmpresa: {
        bodega: null,
        empresa: null,
        fecha: null
    },
    dataLinea:{
        linea: '',
        empresa:''
    },
    idLineaEmpresa: {
        linea: null,
        empresa: null,
        fecha: null
    },
    compras:{
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    despachos_pendientes: []
};

export default handleActions(reducer, initialState)
