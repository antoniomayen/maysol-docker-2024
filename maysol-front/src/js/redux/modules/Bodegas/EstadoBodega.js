import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import moment from 'moment';


const url = 'movBodegas';

const CARGANDO_ESTADOBODEGA = 'CARGANDO_ESTADOBODEGA';
const CARGANDO_MOVIMIENTO_ESTADOBODEGA = 'CARGANDO_MOVIMIENTO_ESTADOBODEGA';
const SET_DATA_ESTADOBODEGA = 'SET_DATA_ESTADOBODEGA';
const SET_PAGE_ESTADOBODEGA = 'SET_PAGE_ESTADOBODEGA';
const SET_UPDATE_DATA_ESTADOBODEGA ='SET_UPDATE_DATA_ESTADOBODEGA';
const SET_BUSCADOR_ESTADOBODEGA = 'SET_BUSCADOR_ESTADOBODEGA';
const SET_PROYECTO_ESTADOBODEGA = 'SET_PROYECTO_ESTADOBODEGA';
const SET_FILTRO_ESTADOBODEGA = 'SET_FILTRO_ESTADOBODEGA';
const SET_EMPRESAS_ESTADOBODEGA = 'SET_EMPRESAS_ESTADOBODEGA';
const SET_DETAIL_BODEGA = 'SET_DETAIL_BODEGA';
const SET_IDBODEGA_ESTADOBODEGA = 'SET_IDBODEGA_ESTADOBODEGA';
const SET_TOGGLEMODAL_ESTADOBODEGA = 'SET_TOGGLEMODAL_ESTADOBODEGA';
const SET_DATAHISTORIA_ESTADOBODEGA = 'SET_DATAHISTORIA_ESTADOBODEGA';

const SET_FILTROMOVIMIENTO_ESTADOBODEGA ='SET_FILTROMOVIMIENTO_ESTADOBODEGA';
const SET_SEARCHHISTORIA_ESTADOBODEGA = 'SET_SEARCHHISTORIA_ESTADOBODEGA';
const SET_GRAFICA_ESTADOBODEGA = 'SET_GRAFICA_ESTADOBODEGA';

const SET_DATESTART_ESBODEGA ='SET_DATESTART_ESBODEGA';
const SET_DATEEND_ESBODEGA = 'SET_DATEEND_ESBODEGA';
const FILTRO_PRODUCTO = 'FILTRO_PRODUCTO';

const backgroudColor1 = [
    'rgba(69, 49, 93, 0.80)',
    'rgba(226, 70, 71, 0.80)',
    'rgba(35, 112, 160,0.80)',
    'rgba(80, 154, 174, 0.8)',
    'rgba(235, 235, 235,0.9)'
];
// ------------------------------------
// Actions
// ------------------------------------

const setIdBodega = (id) => (dispatch, getStore) => {
    dispatch({type: SET_IDBODEGA_ESTADOBODEGA, idBodega: id})
}

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(loadingPrestamos());


    // parametros de búsqueda
    const store = getStore();
    const search = store.estadobodega.buscador;
    const filtro = store.estadobodega.filtro_estadobodega;
    const bodega = store.estadobodega.idBodega;
    const filtro_producto = store.estadobodega.filtro_producto;

    let params = {page, search, bodega};
    if(filtro_producto) {params['stock__id'] = filtro_producto.stock}

    // if(filtro){
        //     params['tipo'] = filtro
        // }

    dispatch({type: CARGANDO_ESTADOBODEGA, loading: true});
    api.get(`inventario/getInventario/${bodega}`, params).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_ESTADOBODEGA, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_ESTADOBODEGA, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    })
};

const listarHistorico = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(loadingPrestamos());


    // parametros de búsqueda
    const store = getStore();
    const search = store.estadobodega.buscarHistoria;
    const filtro = store.estadobodega.filtro_movimiento;
    const bodega = store.estadobodega.idBodega;
    let dateStart = store.estadobodega.dateStart;
    let dateEnd = store.estadobodega.dateEnd;
    const filtro_producto = store.estadobodega.filtro_producto;
    let params = {page, search, bodega};
    if(filtro_producto) {params['detalle_movimiento__stock__id'] = filtro_producto.stock}

    if(filtro){
            params['tipo'] = filtro.value
        }
        if(dateStart){
            try {
                dateStart = dateStart.format("YYYY-MM-D")
            } catch (error) {
                dateStart = dateStart
            }
            params['dateStart'] = dateStart;
        }
        if(dateEnd){
            try {
                dateEnd = dateEnd.format("YYYY-MM-D")
            } catch (error) {
                dateEnd = dateEnd
            }
            params['dateEnd'] = dateEnd;
        }

    dispatch({type: CARGANDO_ESTADOBODEGA, loading: true});
    api.get(`movBodegas/historico/${bodega}`, params).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            error.detail || 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            dispatch({type: SET_DATAHISTORIA_ESTADOBODEGA, historicoData: data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_ESTADOBODEGA, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    })
};
const getGrafica = () =>  (dispatch, getStore) => {
    // dispatch(loadingPrestamos());


    // parametros de búsqueda
    const store = getStore();
    const bodega = store.estadobodega.idBodega;

    // if(filtro){
        //     params['tipo'] = filtro
        // }

    dispatch({type: CARGANDO_ESTADOBODEGA, loading: true});
    api.get(`movBodegas/getGraficas/${bodega}`).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            error.detail || 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            // Grafica de despacho

            let dataPolarDespacho = objectoGrafica(data.despacho)
            // Grafica de Ingresos

            let dataPolarIngreso = objectoGrafica(data.ingreso);
            let objecto = {
                despacho: dataPolarDespacho,
                ingreso:dataPolarIngreso
            }
            dispatch({type: SET_GRAFICA_ESTADOBODEGA, grafica: objecto});
            // dispatch(setDataPrestamos(data));
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
    })
};
function objectoGrafica(grafica){
    let data1 = grafica.map( x=> x.cantidad);

    let labels1 = grafica.map( x => {
        let arr = [];
        return x.nombre
    })

    return {
        datasets: [{
            data: data1,
            backgroundColor: backgroudColor1,
            }],
            labels: labels1
    }
}
const detailBodega = id => (dispatch, getStore) =>{
    dispatch({type: CARGANDO_ESTADOBODEGA, loading: true});
    api.get(`bodegas/${id}`).catch((error) => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
        if(error.statusCode  === 404){
            dispatch(push('/bodegas'))
        }
    }).then((data) => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
        if(data){
            dispatch({type: SET_DETAIL_BODEGA, detalleBodega: data});
        }
    })

}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.estadobodega.values;
    dispatch({type: CARGANDO_ESTADOBODEGA, loading: true})
    api.post(`${url}`, formData).then((data) => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false})
        Swal('Éxito', 'Se ha creado la estadobodega.', 'success')
        .then(() => {
            dispatch(push('/estadobodega'))
        })
    }).catch((error) => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false})
        Swal(
            'Error',
             error.detail || 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false})
    });
};

const update = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.estadobodega.values);
    const estadobodega = getStore().estadobodega.updateData;
    try {
        if (formData.empresa.id){
            formData.empresa = formData.empresa.id
        }
    }catch (e) {}
    dispatch({type: CARGANDO_ESTADOBODEGA, loading: true});
    api.put(`${url}/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/estadobodega'));
            })
        }
    })
    .catch((error) =>{
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
        swal(
            'Error',
             error.detail || 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/estadobodega'));
        }
    })
}
const destroy = (id) => (dispatch, getStore) => {
    dispatch({type: CARGANDO_ESTADOBODEGA, loading: true});
    // dispatch(loadingPrestamos());
    api.eliminar(`${url}/${id}`).catch((error) => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
        // dispatch(loadingPrestamos(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(listar(1));
            })
    }).then((data) => {
        dispatch({type: CARGANDO_ESTADOBODEGA, loading: false});
        // dispatch(loadingPrestamos(false));
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
             error.detail || 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch({type: SET_EMPRESAS_ESTADOBODEGA, empresasSelect: data});
        }
    })
}
const searchHistora = (search) => (dispatch, getStore) => {
    const store = getStore();
    dispatch({type: SET_SEARCHHISTORIA_ESTADOBODEGA, buscarHistoria: search});
    dispatch(listarHistorico(1));
};
const search = (search) => (dispatch, getStore) => {
    const store = getStore();
    const bodega = store.estadobodega.idBodega;
    dispatch({type: SET_BUSCADOR_ESTADOBODEGA, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    const store = getStore();
    const bodega = store.estadobodega.idBodega;
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_ESTADOBODEGA, filtro_estadobodega: filtro});
    dispatch(listar(1));
};
const cambiarMovimiento = (filtro) => (dispatch) => {
    dispatch({type: SET_FILTROMOVIMIENTO_ESTADOBODEGA, filtro_movimiento: filtro});
    dispatch(listarHistorico(1));
}

const reajuste = () => (dispatch, getStore) => {
    const formData = _.cloneDeep(getStore().form.reajuste.values);

    dispatch({type: CARGANDO_MOVIMIENTO_ESTADOBODEGA, cargandoMovimiento: true});
    api.put(`movBodegas/reajuste/${formData.id}`, formData)
    .then((data) => {
        dispatch({type: CARGANDO_MOVIMIENTO_ESTADOBODEGA, cargandoMovimiento: false});
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch({type: SET_TOGGLEMODAL_ESTADOBODEGA, toggleModal: false});
                dispatch(listar(1));
            })
        }
    })
    .catch((error) =>{
        dispatch({type: CARGANDO_MOVIMIENTO_ESTADOBODEGA, cargandoMovimiento: false});
        swal(
            'Error',
             error.detail || 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch({type: SET_TOGGLEMODAL_ESTADOBODEGA, toggleModal: false});
        }
        dispatch({type: SET_TOGGLEMODAL_ESTADOBODEGA, toggleModal: false});
    })
};
const setFiltroProducto = (filtro_producto, historico = false) => (dispatch, getStore) => {
    dispatch({type: FILTRO_PRODUCTO, filtro_producto});
    if (historico){
        dispatch(listarHistorico(1));
    } else {
        dispatch(listar(1));
    }
};
const setToggleModal = (estado) => (dispatch, getStore) => {
    dispatch({type: SET_TOGGLEMODAL_ESTADOBODEGA, toggleModal: estado})
}
const setDateStart = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATESTART_ESBODEGA, dateStart: date});
    dispatch(listarHistorico(1));
}
const setDateEnd = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATEEND_ESBODEGA, dateEnd: date});
    dispatch(listarHistorico(1));
}
export const actions = {
    listar,
    listarHistorico,
    detailBodega,
    getGrafica,
    create,
    update,
    destroy,
    search,
    searchHistora,
    getEmpresasSelect,
    filtro,
    cambiarMovimiento,
    setIdBodega,
    setToggleModal,
    reajuste,
    setDateStart,
    setDateEnd,
    setFiltroProducto
};

export const reducer = {
    [CARGANDO_ESTADOBODEGA]: (state, { loading }) => {
        return {...state, loading }
    },
    [SET_DATA_ESTADOBODEGA]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_ESTADOBODEGA]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_ESTADOBODEGA]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_ESTADOBODEGA]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_ESTADOBODEGA]: (state, { filtro_estadobodega }) => {
        return {...state, filtro_estadobodega }
    },
    [FILTRO_PRODUCTO]: (state, { filtro_producto }) => {
        return {...state, filtro_producto }
    },
    [SET_EMPRESAS_ESTADOBODEGA]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    },
    [SET_DETAIL_BODEGA]: (state, { detalleBodega }) => {
        return {...state, detalleBodega }
    },
    [SET_IDBODEGA_ESTADOBODEGA]: (state, { idBodega }) => {
        return {...state, idBodega }
    },
    [SET_TOGGLEMODAL_ESTADOBODEGA]: (state, { toggleModal }) => {
        return {...state, toggleModal }
    },
    [CARGANDO_MOVIMIENTO_ESTADOBODEGA]: (state, { cargandoMovimiento }) => {
        return {...state, cargandoMovimiento }
    },
    [SET_DATAHISTORIA_ESTADOBODEGA]: (state, { historicoData }) => {
        return {...state, historicoData }
    },
    [SET_FILTROMOVIMIENTO_ESTADOBODEGA]: (state, { filtro_movimiento }) => {
        return {...state, filtro_movimiento }
    },
    [SET_SEARCHHISTORIA_ESTADOBODEGA]: (state, { buscarHistoria }) => {
        return {...state, buscarHistoria }
    },
    [SET_GRAFICA_ESTADOBODEGA]: (state, { grafica }) => {
        return {...state, grafica }
    },
    [SET_DATESTART_ESBODEGA]: (state, { dateStart }) => {
        return {...state, dateStart }
    },
    [SET_DATEEND_ESBODEGA]: (state, { dateEnd }) => {
        return {...state, dateEnd }
    }
}

export const initialState = {
    idBodega: null,
    loading: true,
    cargandoMovimiento: false,
    page: 1,
    toggleModal: false,
    filtro_movimiento: null,
    buscarHistoria: '',
    dateStart:  moment().subtract(7,'days'),
    dateEnd: moment(),
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    historicoData : {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscador: '',
    detalleBodega: {
        nombre:'',
        empresa: {
            nombre: ''
        }
    },
    filtro_estadobodega: null,
    filtro_producto: null,
    updateData: {},
    empresasSelect:[],
    grafica: {
        despacho: {},
        ingreso:{}
    }
};

export default handleActions(reducer, initialState)
