import Swal from 'sweetalert2';
import { api } from 'api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import moment from 'moment';
import { dateFormatter } from '../../../common/components/Utils/renderField/renderReadField';
import {Monedas} from '../../../common/utility/constants';


const url = 'reportes';

const SET_CARGANDO_RGANANCIAS = 'SET_CARGANDO_RGANANCIAS';
const SET_CARGANDOGRAFICA_RGANANCIAS = 'SET_CARGANDOGRAFICA_RGANANCIAS';
const SET_DATA_RGANANCIAS= 'SET_DATA_RGANANCIAS';
const SET_DATAGRAFICA_RGANANCIAS = 'SET_DATAGRAFICA_RGANANCIAS';
const SET_GANANCIAS_RGANANCIAS = 'SET_GANANCIAS_RGANANCIAS';

const SET_DATESTART_RGANANCIAS = 'SET_DATESTART_RGANANCIAS';
const SET_DATEEND_RGANANCIAS = 'SET_DATEEND_RGANANCIAS';
const SET_EMPRESA_RGANANCIAS = 'SET_EMPRESA_RGANANCIAS';
const SET_SUBEMPRESA_RGANANCIAS = 'SET_SUBEMPRESA_RGANANCIAS';
const SET_LINEA_RGANANCIAS = 'SET_LINEA_RGANANCIAS';
const SET_PAGE_RGANANCIAS = 'SET_PAGE_RGANANCIAS';

const SET_EMPRESAS_RGA = 'SET_EMPRESAS_RGA';
const SET_SUBEMPRESAS_RGA= 'SET_SUBEMPRESAS_RGA';
const SET_LINEAS_RGA= 'SET_LINEAS_RGA';

const SET_MONEDA_RGA = 'SET_MONEDA_RGA';
const SET_SIMBOLO_RGA = 'SET_SIMBOLO_RGA';

const backgroudColor1 = [
    'rgba(69, 49, 93, 0.80)',
    'rgba(226, 70, 71, 0.80)',
    'rgba(35, 112, 160,0.80)',
    'rgba(80, 154, 174, 0.8)',
    'rgba(235, 235, 235,0.9)'
];
const listarEmpresas = () => (dispatch, getStore) => {
    dispatch({type: SET_CARGANDO_RGANANCIAS, loading: true});
    api.get(`proyectos/getProyectoFiltros`).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: SET_CARGANDO_RGANANCIAS, loading: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            dispatch({type: SET_EMPRESAS_RGA, empresas:data});

            const store = getStore();
            const me = store.login.me;
            let empresa = data.find(x=> x.value === me.idProyecto)
            if(empresa){
                dispatch(setEmpresa(empresa))
            }


        }
        dispatch({type: SET_CARGANDO_RGANANCIAS, loading: false});
    })
}
const listarGanancia = (page=1) => (dispatch, getStore) => {
    const store = getStore();
    let dateStart = store.reportecostos.dateStart
    let dateEnd = store.reportecostos.dateEnd;
    const empresa = store.reportecostos.empresa;
    const subempresa = store.reportecostos.subempresa;
    const linea = store.reportecostos.linea
    const moneda = store.reportecostos.moneda;
    let params = {page};

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
    if(empresa){
        params['empresa'] = empresa;
    }
    if(subempresa){
        params['subempresa'] = subempresa.value;
    }
    if(linea){
        params['linea'] = linea.value;
    }
    if(moneda){
        params['moneda'] = moneda;
    }
    dispatch({type: SET_CARGANDO_RGANANCIAS, loading: true});
    api.get(`${url}/getGanacias`, params).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: SET_CARGANDO_RGANANCIAS, loading: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            dispatch({type: SET_GANANCIAS_RGANANCIAS, dataGanancia:data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_RGANANCIAS, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: SET_CARGANDO_RGANANCIAS, loading: false});
    })
};
const getGrafica = () => (dispatch, getStore) =>{
    const store = getStore();
    let dateStart = store.reportecostos.dateStart
    let dateEnd = store.reportecostos.dateEnd;
    const empresa = store.reportecostos.empresa;
    const subempresa = store.reportecostos.subempresa;
    const linea = store.reportecostos.linea
    const moneda = store.reportecostos.moneda;
    let params = {};

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
    if(empresa){
        params['empresa'] = empresa;
    }
    if(subempresa){
        params['subempresa'] = subempresa.value;
    }
    if(linea){
        params['linea'] = linea.value;
    }
    if(moneda){
        params['moneda'] = moneda;
    }
    dispatch({type: SET_CARGANDOGRAFICA_RGANANCIAS, loadingGrafica: true});
    api.get(`${url}/getCostoGananciaGrafica`, params).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: SET_CARGANDOGRAFICA_RGANANCIAS, loadingGrafica: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            dispatch({type: SET_DATAGRAFICA_RGANANCIAS, grafica:data});
            // dispatch(setDataPrestamos(data));
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: SET_CARGANDOGRAFICA_RGANANCIAS, loadingGrafica: false});
    })

}
const listar = (page = 1) =>  (dispatch, getStore) => {
    const store = getStore();
    // const search = store.estadobodega.buscador;
    const filtro = store.estadobodega.filtro_estadobodega;
    const bodega = store.estadobodega.idBodega;
    let dateStart = store.reportecostos.dateStart
    let dateEnd = store.reportecostos.dateEnd;
    const empresa = store.reportecostos.empresa;
    const subempresa = store.reportecostos.subempresa;
    const linea = store.reportecostos.linea
    const moneda = store.reportecostos.moneda;
    let params = {page};

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
    if(empresa){
        params['empresa'] = empresa;
    }
    if(subempresa){
        params['subempresa'] = subempresa.value;
    }
    if(linea){
        params['linea'] = linea.value;
    }
    if(moneda){
        params['moneda'] = moneda
    }
    dispatch({type: SET_CARGANDO_RGANANCIAS, loading: true});
    api.get(`${url}/getCostos`, params).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: SET_CARGANDO_RGANANCIAS, loading: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            dispatch({type: SET_DATA_RGANANCIAS, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_RGANANCIAS, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: SET_CARGANDO_RGANANCIAS, loading: false});
    })
};
const setDateStart = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATESTART_RGANANCIAS, dateStart: date});
    dispatch(listar(1));
    dispatch(getGrafica(1));
    dispatch(listarGanancia(1));
}
const setDateEnd = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATEEND_RGANANCIAS, dateEnd: date});
    dispatch(listar(1));
    dispatch(getGrafica(1));
    dispatch(listarGanancia(1));
}
const setEmpresa = (empresa) => (dispatch, getStore) => {
    let lineas = []
    let subempresas = []
    empresa.lineaproduccion.forEach(item => {
        lineas.push({value: item.id, label:item.nombre, id: item.id});
    });
    empresa.empresas.forEach(item => {
         subempresas.push({value: item.id, label:item.nombre, id: item.id});
    });
    dispatch({type: SET_EMPRESA_RGANANCIAS, empresa: empresa.value});
    dispatch({type: SET_SUBEMPRESA_RGANANCIAS, subempresa: null})
    dispatch({type: SET_LINEA_RGANANCIAS, linea: null})

    dispatch({type: SET_LINEAS_RGA, lineas});
    dispatch({type: SET_SUBEMPRESAS_RGA, subempresas})
    dispatch(listar(1));
    dispatch(getGrafica(1));
    dispatch(listarGanancia(1));
}
const setSubempresa = (subempresa) => (dispatch, getStore) => {
    dispatch({type: SET_SUBEMPRESA_RGANANCIAS, subempresa: subempresa});
    dispatch(listar(1));
    dispatch(getGrafica(1));
    dispatch(listarGanancia(1));
}
const setLinea = (linea) => (dispatch, getStore) => {
    dispatch({type: SET_LINEA_RGANANCIAS, linea: linea});
    dispatch(listar(1));
    dispatch(getGrafica(1));
    dispatch(listarGanancia(1));
}
const setMoneda = (moneda) => (dispatch, getStore) => {
    dispatch({type: SET_MONEDA_RGA, moneda: moneda});
    let getSimbolo = Monedas.find(x => x.value === moneda);
    dispatch({type: SET_SIMBOLO_RGA, simbolo: getSimbolo.simbolo})
    dispatch(listar(1));
    dispatch(getGrafica(1));
    dispatch(listarGanancia(1));
}
export const actions = {
    listarEmpresas,
    listar,
    listarGanancia,
    getGrafica,
    setDateStart,
    setDateEnd,
    setEmpresa,
    setSubempresa,
    setLinea,
    setMoneda
};

export const reducer = {
    [SET_CARGANDO_RGANANCIAS]: (state, { loading }) => {
        return {...state, loading }
    },
    [SET_PAGE_RGANANCIAS]: (state, { page }) => {
        return {...state,  page }
    },
    [SET_CARGANDOGRAFICA_RGANANCIAS]: (state, { loadingGrafica }) => {
        return {...state, loadingGrafica }
    },
    [SET_DATA_RGANANCIAS]: (state, { data }) => {
        return {...state, data }
    },
    [SET_DATAGRAFICA_RGANANCIAS]: (state, { grafica }) => {
        return {...state, grafica }
    },
    [SET_GANANCIAS_RGANANCIAS]: (state, { dataGanancia }) => {
        return {...state, dataGanancia }
    },
    [SET_DATESTART_RGANANCIAS]: (state, { dateStart }) => {
        return {...state, dateStart }
    },
    [SET_DATEEND_RGANANCIAS]: (state, { dateEnd }) => {
        return {...state, dateEnd }
    },
    [SET_EMPRESA_RGANANCIAS]: (state, { empresa }) => {
        return {...state, empresa }
    },
    [SET_SUBEMPRESA_RGANANCIAS]: (state, { subempresa }) => {
        return {...state, subempresa }
    },
    [SET_LINEA_RGANANCIAS]: (state, { linea }) => {
        return {...state, linea }
    },
    [SET_EMPRESAS_RGA]: (state, { empresas }) => {
        return {...state,  empresas }
    },
    [SET_LINEAS_RGA]: (state, { lineas }) => {
        return {...state, lineas }
    },
    [SET_SUBEMPRESAS_RGA]: (state, { subempresas }) => {
        return {...state, subempresas }
    },
    [SET_MONEDA_RGA]: (state, { moneda }) => {
        return {...state, moneda }
    },
    [SET_SIMBOLO_RGA]: (state, { simbolo  }) => {
        return {...state,  simbolo }
    }
}
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
    grafica: [],
    dataGanancia: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    dateStart:  moment().subtract(7,'days'),
    dateEnd: moment(),
    empresa: null,
    subempresa: null,
    linea: null,
    empresas:[],
    lineas:[],
    subempresas:[],
    moneda: 'GTQ',
    simbolo: "Q"
};

export default handleActions(reducer, initialState)
