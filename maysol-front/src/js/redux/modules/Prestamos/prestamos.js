import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'cuentas/prestamos';

const LOADER_PRESTAMOS = 'LOADER_PRESTAMOS';
const SET_DATA_PRESTAMOS = 'SET_DATA_PRESTAMOS';
const SET_PAGE_PRESTAMOS = 'SET_PAGE_PRESTAMOS';
const SET_UPDATE_DATA_PRESTAMOS ='SET_UPDATE_DATA_PRESTAMOS';
const SET_BUSCADOR_PRESTAMOS = 'SET_BUSCADOR_PRESTAMOS';
const SET_MES_PRESTAMOS = 'SET_MES_PRESTAMOS';
const SET_ANIO_PRESTAMOS = 'SET_ANIO_PRESTAMOS';
const SET_SALDO_PRESTAMOS = 'SET_SALDO_PRESTAMOS';
const SET_MODAL_PRESTAMOS = 'SET_MODAL_PRESTAMOS';
const SET_PROYECTO_PRESTAMOS = 'SET_PROYECTO_PRESTAMOS';
const SET_FILTRO_PRESTAMOS = 'SET_FILTRO_PRESTAMOS';
const ACTIVE_TAB = 'ACTIVE_TAB_PRESTAMOS';
const LOADER_HISTORIAL = 'LOADER_HISTORIAL_PRESTAMOS';
const DATA_HISTORIAL = 'DATA_HISTORIAL_PRESTAMOS';
const PAGE_HISTORIAL = 'PAGE_HISTORIAL_PRESTAMOS';
const SEARCH_HISTORIAL = 'SEARCH_HISTORIAL_PRESTAMOS';

const SET_DEUDOR_PRESTAMO = 'SET_DEUDOR_PRESTAMO';
const SET_ACREEDOR_PRESTAMO = 'SET_ACREEDOR_PRESTAMO';

const SET_TOTALES_PRESTAMO = 'SET_TOTALES_PRESTAMO';

// ------------------------------------
// Actions
// ------------------------------------

const listar = (page = 1) =>  (dispatch, getStore) => {
    // dispatch(loaderPrestamos());
    dispatch({type: LOADER_PRESTAMOS, loader: true});

    // parametros de búsqueda
    const store = getStore();
    const search = store.prestamos.buscador;
    const mes = store.prestamos.mes;
    const anio = store.prestamos.anio;
    const filtro = store.prestamos.filtro;
    const f_deudor = store.prestamos.f_deudor;
    const f_acreedor = store.prestamos.f_acreedor;

    let params = {page, search};

    if(filtro){
        params['filtro'] = filtro
    }
    if(f_deudor){
        params['cuenta__deudor_id'] = f_deudor.value;
    }
    if(f_acreedor){
        params['cuenta__proyecto_id'] = f_acreedor.value;
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`cierre/getPrestamos/`, params).catch((error) => {
        dispatch({type: LOADER_PRESTAMOS, loader: false});
        // dispatch(loaderPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_PRESTAMOS, loader: false});
        // dispatch(loaderPrestamos(false));
        if(data){
            dispatch(getTotales());
            dispatch({type: SET_DATA_PRESTAMOS, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_PRESTAMOS, page});
            // dispatch(setPagePrestamos(page));
        }
    })
};
const create = () => (dispatch, getStore) => {
    const formData = getStore().form.prestamo.values;
    dispatch({type: LOADER_PRESTAMOS, loader: true});
    // dispatch(loaderPrestamos())
    let anio = null;
    let mes = null;
    try {
        formData.fecha = formData.fecha.format("YYYY-MM-D");


    } catch (error) {
        formData.fecha = formData.fecha
    }
    anio = new Date(formData.fecha)
    mes = anio.getMonth()+1;
    anio = anio.getFullYear();
    let params = {anio: anio, mes: mes, prestamo: 'prestamo'};

    api.post(`movimientos`, formData, params).then((data) => {
        dispatch({type: LOADER_PRESTAMOS, loader: false});
        // dispatch(loaderPrestamos(false));
        if(data) {
            swal('Éxito', 'Se ha guardado el prestamo.', 'success')
                .then(() => {
                    dispatch(push('/admin_prestamos'));
                })
        }
    }).catch((error) => {
        dispatch({type: LOADER_PRESTAMOS, loader: false});
        // dispatch(loaderPrestamos(false));
        let mensaje = null;
        try {
            mensaje = error[0];
        } catch (error) {
            mensaje = null
        }
        swal(
            'ERROR',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
        if(error.statusCode === 404) {
            dispatch(setToggleModal(false));
        }
    })
};
const cambiarMes = (mes) => (dispatch, getStore) =>{
    dispatch({type: SET_MES_PRESTAMOS, mes});
    // dispatch(setMes(mes))
    const store = getStore();
    const idActual = store.prestamos.idProyecto;
    dispatch(listar(1));
};
const cambiarAnio = (anio) => (dispatch, getStore) => {
    dispatch({type: SET_ANIO_PRESTAMOS, anio});
    // dispatch(setAnio(anio));
    const store = getStore();
    const idActual = store.prestamos.idProyecto;
    dispatch(listar(1));
};
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_PRESTAMOS, buscador: search});
    // dispatch(setBuscador(search));
    dispatch(listar(1));
};
const destroy = () => (dispatch, getStore) => {
    const formData = getStore().form.anulacion.values;
    dispatch({type: LOADER_PRESTAMOS, loader: true});
    // dispatch(loaderPrestamos());
    api.put(`movimientos/anularPrestamo/${formData.id}`, formData)
    .then((error) => {
        dispatch({type: LOADER_PRESTAMOS, loader: false});
        // dispatch(loaderPrestamos(false));
        swal('Éxito', (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.', 'success')
            .then(() => {
                dispatch(listar(1));
                dispatch(setToggleModal(false));
            })
    })
    .catch((error) => {
        dispatch({type: LOADER_PRESTAMOS, loader: false});
        // dispatch(loaderPrestamos(false));
        swal('Error',
        (error && error.detail) ? error.detail : 'No se ha logrado borrar el registro.',
        'error')
            .then(() => {
                dispatch(listar(1));
                dispatch(setToggleModal(false));
            })
    })
};
const cambiarFiltro = (filtro) => (dispatch, getStore) =>{
    const store = getStore();
    const idActual = store.prestamos.idProyecto;
    let valor= null;
    if(filtro==='true'){
        //verifica los retiros
        valor = 30;
    } else if(filtro==='false'){
        // verifica los depósitos
        valor = 10;
    }else{
        valor = null;
    }
    dispatch({type: SET_FILTRO_PRESTAMOS, filtro: valor});
    // dispatch(setFiltro(valor));
    dispatch(listar(1));
};

const setToggleModal = (estado) => (dispatch, getState) => {
    dispatch({type: SET_MODAL_PRESTAMOS, toggleModal: estado});
    // dispatch(setModal(estado));
};

const getHistorial = (page = 1) =>  (dispatch, getStore) => {
    const store = getStore();
    const prestamos = _.cloneDeep(store.prestamos);
    const search = prestamos.search_historial;
    dispatch({type: LOADER_HISTORIAL, loader_historial: true});
    let params = {page, historia: true, search};
    const f_deudor = prestamos.f_deudor;
    const f_acreedor = prestamos.f_acreedor;

    if(f_deudor){
        params['cuenta__deudor_id'] = f_deudor.value;
    }
    if(f_acreedor){
        params['cuenta__proyecto_id'] = f_acreedor.value;
    }
    api.get(`cierre/getPrestamos`, params).catch((error) => {
        Swal(
            'Error',
            'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch({type: DATA_HISTORIAL, data_historial: data});
            dispatch({type: PAGE_HISTORIAL, page_historial: page});
        }
    }).finally(() => {
        dispatch({type: LOADER_HISTORIAL, loader_historial: false});
    })
};
const getTotales = (page = 1) =>  (dispatch, getStore) => {
    const store = getStore();
    const prestamos = _.cloneDeep(store.prestamos);
    const search = prestamos.search_historial;
    dispatch({type: LOADER_HISTORIAL, loader_historial: true});
    let params = {page, search};
    const f_deudor = prestamos.f_deudor;
    const f_acreedor = prestamos.f_acreedor;

    if(f_deudor){
        params['cuenta__deudor_id'] = f_deudor.value;
    }
    if(f_acreedor){
        params['cuenta__proyecto_id'] = f_acreedor.value;
    }
    api.get(`cierre/total_prestamos`, params).catch((error) => {
        Swal(
            'Error',
            'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch({type: SET_TOTALES_PRESTAMO, totales: data});
        }
    }).finally(() => {
        dispatch({type: LOADER_HISTORIAL, loader_historial: false});
    })
};
// ------------------------------------
// PureActions
// ------------------------------------

const changeTab = active_tab  => (dispatch, getStore) => {
    dispatch({
        type: ACTIVE_TAB,
        active_tab
    });
    if(active_tab == 'activos'){
        dispatch(listar());
    }else{
        dispatch(getHistorial());
    }
};
const changeSearchHistorial = (search_historial)  => (dispatch) => {
    dispatch({type: SEARCH_HISTORIAL, search_historial});
    dispatch(getHistorial());
};
//filtros
const setFiltroDeudor =(filtro) => (dispatch, getStore) => {
    dispatch({type: SET_DEUDOR_PRESTAMO, f_deudor: filtro});
    dispatch(listar());
    dispatch(getHistorial());
}
const setFiltroAcreedor =(filtro) => (dispatch, getStore) => {
    dispatch({type: SET_ACREEDOR_PRESTAMO, f_acreedor: filtro})
    dispatch(listar());
    dispatch(getHistorial());
}
export const actions = {
    setToggleModal,
    cambiarFiltro,
    destroy,
    search,
    cambiarAnio,
    cambiarMes,
    create,
    listar,
    changeTab,
    getHistorial,
    changeSearchHistorial,
    setFiltroDeudor,
    getTotales,
    setFiltroAcreedor
};

export const reducer = {
    [LOADER_PRESTAMOS]: (state, { loader }) => {
        return {...state, loader }
    },
    [SET_DATA_PRESTAMOS]: (state, { data}) => {
        return { ...state, data }
    },
    [SET_PAGE_PRESTAMOS]: (state, { page }) => {
        return {
            ...state,
            page
        }
    },
    [SET_UPDATE_DATA_PRESTAMOS]: (state, { updateData }) => {
        return {
            ...state,
            updateData
        }
    },
    [SET_BUSCADOR_PRESTAMOS]: (state, { buscador }) => {
        return {
            ...state,
            buscador
        }
    },
    [SET_MES_PRESTAMOS]: (state, { mes }) => {
        return {
            ...state,
            mes
        }
    },
    [SET_ANIO_PRESTAMOS]: (state, { anio }) => {
        return {
            ...state,
            anio
        }
    },
    [SET_SALDO_PRESTAMOS]: (state, {saldo}) => {
        return {
            ...state,
            saldo
        }
    },
    [SET_MODAL_PRESTAMOS]: (state, {toggleModal}) => {
        return {
            ...state,
            toggleModal
        }
    },
    [SET_PROYECTO_PRESTAMOS]: (state, {idProyecto}) => {
        return {
            ...state,
            idProyecto
        }
    },
    [SET_FILTRO_PRESTAMOS]: (state, {filtro}) => {
        return {
            ...state,
            filtro
        }
    },
    [ACTIVE_TAB]: (state, {active_tab}) => {
        return {
            ...state,
            active_tab
        }
    },
    [LOADER_HISTORIAL]: (state, {loader_historial}) => {
        return {
            ...state,
            loader_historial
        }
    },
    [DATA_HISTORIAL]: (state, {data_historial}) => {
        return {
            ...state,
            data_historial
        }
    },
    [PAGE_HISTORIAL]: (state, {page_historial}) => {
        return {
            ...state,
            page_historial
        }
    },
    [SEARCH_HISTORIAL]: (state, {search_historial}) => {
        return {
            ...state,
            search_historial
        }
    },
    [SET_DEUDOR_PRESTAMO]: (state, { f_deudor }) => {
        return {...state, f_deudor }
    },
    [SET_ACREEDOR_PRESTAMO]: (state, { f_acreedor }) => {
        return {...state, f_acreedor }
    },
    [SET_TOTALES_PRESTAMO]: (state, { totales }) => {
        return {...state, totales }
    }
};

export const initialState = {
    loader: false,
    page: 1,
    idProyecto: null,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscador: '',
    updateData: {
        id: 0,
        nombre: "",
        representante: ""
    },
    filtro: null,
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    saldo: {inicio: 0, cierre: 0},
    toggleModal: false,
    active_tab: 'activos',
    loader_historial: false,
    data_historial: [],
    page_historial: 1,
    search_historial: '',
    f_deudor: null,
    f_acreedor: null,
    totales: {
        total_dolares: 0,
        total_quetzales: 0
    }
};

export default handleActions(reducer, initialState)
