import Swal from 'sweetalert2';
import { api } from 'api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { dateFormatter } from '../../../common/components/Utils/renderField/renderReadField'


const url = 'reportes';

const SET_CARGANDO_REPORTEPRODUCCION = 'SET_CARGANDO_REPORTEPRODUCCION';
const SET_CARGANDOGRAFICA_REPORTEPRODUCCION = 'SET_CARGANDOGRAFICA_REPORTEPRODUCCION';
const SET_DATA_REPORTEPRODUCCION= 'SET_DATA_REPORTEPRODUCCION';
const SET_DATAGRAFICA_REPORTEPRODUCCION = 'SET_DATAGRAFICA_REPORTEPRODUCCION';
const SET_DATATOTALES_REPORTEPRODUCCION = 'SET_DATATOTALES_REPORTEPRODUCCION';

const SET_DATESTART_REPORTEPRODUCCION = 'SET_DATESTART_REPORTEPRODUCCION';
const SET_DATEEND_REPORTEPRODUCCION = 'SET_DATEEND_REPORTEPRODUCCION';
const SET_EMPRESA_REPORTEPRODUCCION = 'SET_EMPRESA_REPORTEPRODUCCION';
const SET_NO_BOLETA_VENTAS = 'SET_NO_BOLETA_VENTAS';
const SET_LINEA_REPORTEPRODUCCION = 'SET_LINEA_REPORTEPRODUCCION';
const SET_PAGE_REPORTEPRODUCCION = 'SET_PAGE_REPORTEPRODUCCION';
const SET_VENDEDORES_VENTAS = 'SET_VENDEDORES_RVENTAS';
const SET_VENDEDOR_VENTAS = 'SET_VENDEDOR_RVENTAS';

const SET_EMPRESAS_RPRO = 'SET_EMPRESAS_RPRO';

const backgroudColor1 = [
    'rgba(69, 49, 93, 0.80)',
    'rgba(226, 70, 71, 0.80)',
    'rgba(35, 112, 160,0.80)',
    'rgba(80, 154, 174, 0.8)',
    'rgba(235, 235, 235,0.9)'
];


const listarEmpresas = () => (dispatch, getStore) => {
    dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: true});
    api.get(`proyectos/getProyectoFiltros`).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            dispatch({type: SET_EMPRESAS_RPRO, empresas:data});
            const store = getStore();
            const me = store.login.me;
            let empresa = data.find(x=> x.value === me.idProyecto)
            if(empresa){
                dispatch(setEmpresa(empresa))
            }
        }
        dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: false});
    })
};

const listar = (page = 1) => (dispatch, getStore) => {
    const { reporteCobrosVentas } = getStore();
    let { dateStart, dateEnd } = reporteCobrosVentas;
    const { empresa, vendedor, noBoleta } = reporteCobrosVentas;

    const params = { page };

    if (dateStart) {
        try { dateStart = dateStart.format('YYYY-MM-D'); } catch (error) { dateStart = dateStart }
        params.dateStart = dateStart;
    }
    if (dateEnd) {
        try { dateEnd = dateEnd.format('YYYY-MM-D'); } catch (error) { dateEnd = dateEnd; }
        params.dateEnd = dateEnd;
    }
    if (empresa) { params.empresa = empresa; }
    if (vendedor) { params.vendedor = vendedor; }
    if (noBoleta) { params.noBoleta = noBoleta; }

    dispatch({ type: SET_CARGANDO_REPORTEPRODUCCION, loading: true });
    api.get(`${url}/getCobrosVentas`, params).catch((error) => {
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if (data) {
            dispatch({ type: SET_DATA_REPORTEPRODUCCION, data });
            // dispatch(setDataPrestamos(data));
            dispatch({ type: SET_PAGE_REPORTEPRODUCCION, page });
            // dispatch(setPagePrestamos(page));
        }
    }).finally(dispatch({ type: SET_CARGANDO_REPORTEPRODUCCION, loading: false }));
};

const getVendedoresSelect = () => (dispatch, getStore) => {
    api.get(`users/getVendedores`).catch((error) => {
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if (data) {
            const vendedores = [];
            data.forEach((x) => {
                vendedores.push({ value: x.id, label: x.nombreCompleto });
            });
            dispatch({ type: SET_VENDEDORES_VENTAS, vendedores });
        }
    });
};


export const exportarExcel = () => (dispatch, getStore) => {
    const token = sessionStorage.getItem('token');
    let path = `/api/${url}/getCobrosVentasExcel/?auth_token=${token}`;

    const { reporteCobrosVentas } = getStore();
    let { dateStart, dateEnd } = reporteCobrosVentas;
    const { empresa, vendedor, noBoleta } = reporteCobrosVentas;

    if (dateStart) {
        try { dateStart = dateStart.format('YYYY-MM-D'); } catch (error) { dateStart = dateStart }
        path += `&dateStart=${dateStart}`;
    }
    if (dateEnd) {
        try { dateEnd = dateEnd.format('YYYY-MM-D'); } catch (error) { dateEnd = dateEnd; }
        path += `&dateEnd=${dateEnd}`;
    }
    if (empresa) { path += `&empresa=${empresa}`; }
    if (vendedor) { path += `&vendedor=${vendedor}`; }
    if (noBoleta) { path += `&noBoleta=${noBoleta}`; }
    window.open(path);
};

const setVendedor = item => (dispatch, getStore) => {
    if (item === null) {
        dispatch({ type: SET_VENDEDOR_VENTAS, vendedor: null });
    } else {
        dispatch({ type: SET_VENDEDOR_VENTAS, vendedor: item.value });
    }
    dispatch(listar());
};
const setNoBoleta = noBoleta => (dispatch, getStore) => {
    dispatch({ type: SET_NO_BOLETA_VENTAS, noBoleta: noBoleta.target.value });
    dispatch(listar());
};

const setDateStart = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATESTART_REPORTEPRODUCCION, dateStart: date});
    dispatch(listar(1));
};
const setDateEnd = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATEEND_REPORTEPRODUCCION, dateEnd: date});
    dispatch(listar(1));
};
const setEmpresa = (empresa) => (dispatch, getStore) => {
    dispatch({type: SET_EMPRESA_REPORTEPRODUCCION, empresa: empresa.value});
    dispatch({type: SET_LINEA_REPORTEPRODUCCION, linea: null})

    dispatch(listar(1));
};
export const actions = {
    listarEmpresas,
    listar,
    setDateStart,
    setDateEnd,
    setEmpresa,
    getVendedoresSelect,
    setVendedor,
    setNoBoleta,
    exportarExcel,
};

export const reducer = {
    [SET_CARGANDO_REPORTEPRODUCCION]: (state, { loading }) => {
        return {...state, loading }
    },
    [SET_PAGE_REPORTEPRODUCCION]: (state, { page }) => {
        return {...state,  page }
    },
    [SET_CARGANDOGRAFICA_REPORTEPRODUCCION]: (state, { loadingGrafica }) => {
        return {...state, loadingGrafica }
    },
    [SET_DATA_REPORTEPRODUCCION]: (state, { data }) => {
        return {...state, data }
    },
    [SET_DATAGRAFICA_REPORTEPRODUCCION]: (state, { grafica }) => {
        return {...state, grafica }
    },
    [SET_DATATOTALES_REPORTEPRODUCCION]: (state, { dataTotales }) => {
        return {...state, dataTotales }
    },
    [SET_DATESTART_REPORTEPRODUCCION]: (state, { dateStart }) => {
        return {...state, dateStart }
    },
    [SET_DATEEND_REPORTEPRODUCCION]: (state, { dateEnd }) => {
        return {...state, dateEnd }
    },
    [SET_EMPRESA_REPORTEPRODUCCION]: (state, { empresa }) => {
        return {...state, empresa }
    },
    [SET_EMPRESAS_RPRO]: (state, { empresas }) => {
        return {...state, empresas }
    },
    [SET_VENDEDORES_VENTAS]: (state, { vendedores }) => {
        return { ...state, vendedores };
    },
    [SET_VENDEDOR_VENTAS]: (state, { vendedor }) => {
        return { ...state, vendedor };
    },
    [SET_NO_BOLETA_VENTAS]: (state, { noBoleta }) => {
        return { ...state, noBoleta };
    },
};
export const initialState = {
    loading: true,
    loadingGrafica: false,
    page: 1,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    dateStart:  moment().subtract(7,'days'),
    dateEnd: moment(),
    empresa: null,
    empresas: [],
    vendedores: [],
    vendedor: null,
    noBoleta: null,
};

export default handleActions(reducer, initialState)
