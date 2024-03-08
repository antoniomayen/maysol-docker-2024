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
const SET_DATA_REPORTEPRODUCCION = 'SET_DATA_REPORTEPRODUCCION';
const SET_DATA_REPORTEPRODUCCIONGALLI = 'SET_DATA_REPORTEPRODUCCIONGALLI';
const SET_DATAGRAFICA_REPORTEPRODUCCION = 'SET_DATAGRAFICA_REPORTEPRODUCCION';
const SET_DATATOTALES_REPORTEPRODUCCION = 'SET_DATATOTALES_REPORTEPRODUCCION';

const SET_DATESTART_REPORTEPRODUCCION = 'SET_DATESTART_REPORTEPRODUCCION';
const SET_DATEEND_REPORTEPRODUCCION = 'SET_DATEEND_REPORTEPRODUCCION';
const SET_EMPRESA_REPORTEPRODUCCION = 'SET_EMPRESA_REPORTEPRODUCCION';
const SET_SUBEMPRESA_REPORTEPRODUCCION = 'SET_SUBEMPRESA_REPORTEPRODUCCION';
const SET_REPORTE_G_REPORTEPRODUCCION = 'SET_REPORTE_G_REPORTEPRODUCCION';
const SET_LINEA_REPORTEPRODUCCION = 'SET_LINEA_REPORTEPRODUCCION';
const SET_PAGE_REPORTEPRODUCCION = 'SET_PAGE_REPORTEPRODUCCION';
const SET_PAGE_REPORTEPRODUCCIONGALLI = 'SET_PAGE_REPORTEPRODUCCIONGALLI';

const SET_EMPRESAS_RPRO = 'SET_EMPRESAS_RPRO';
const SET_SUBEMPRESAS_PRO= 'SET_SUBEMPRESAS_PRO';
const SET_LINEAS_PRO= 'SET_LINEAS_PRO';


const backgroudColor1 = [
    'rgba(69, 49, 93, 0.80)',
    'rgba(226, 70, 71, 0.80)',
    'rgba(35, 112, 160,0.80)',
    'rgba(80, 154, 174, 0.8)',
    'rgba(235, 235, 235,0.9)'
];

const listarEmpresasGallineros = () => (dispatch, getStore) => {
    dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: true});
    api.get(`proyectos/getProyectoFiltrosGallinero`).catch((error) => {
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
}

const listarEmpresas = () => (dispatch, getStore) => {
    dispatch({ type: SET_REPORTE_G_REPORTEPRODUCCION, reporteGallinero: false });
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
}

const listar = (page = 1) =>  (dispatch, getStore) => {
    const store = getStore();
    // const search = store.estadobodega.buscador;
    const filtro = store.estadobodega.filtro_estadobodega;
    const bodega = store.estadobodega.idBodega;
    let dateStart = store.reporteproduccion.dateStart
    let dateEnd = store.reporteproduccion.dateEnd;
    const empresa = store.reporteproduccion.empresa;
    const subempresa = store.reporteproduccion.subempresa;
    const linea = store.reporteproduccion.linea

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

    dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: true});
    api.get(`${url}/getProduccionDetalle`, params).catch((error) => {
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
            dispatch({type: SET_DATA_REPORTEPRODUCCION, data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_REPORTEPRODUCCION, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: false});
    })
};

const listarGallinero = (page = 1) =>  (dispatch, getStore) => {
    const store = getStore();
    // const search = store.estadobodega.buscador;
    let dateStart = store.reporteproduccion.dateStart;
    let dateEnd = store.reporteproduccion.dateEnd;
    const empresa = store.reporteproduccion.empresa;
    const subempresa = store.reporteproduccion.subempresa;
    const linea = store.reporteproduccion.linea;

    let params = { page };

    if (dateStart) {
        try {
            dateStart = dateStart.format("YYYY-MM-D")
        } catch (error) {
            dateStart = dateStart;
        }
        params['dateStart'] = dateStart;
    }
    if(dateEnd){
        try {
            dateEnd = dateEnd.format("YYYY-MM-D")
        } catch (error) {
            dateEnd = dateEnd;
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

    dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: true});
    api.get(`${url}/getProduccionGallineros`, params).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: false});
    }).then((dataGallineros) => {
        // dispatch(loadingPrestamos(false));
        if(dataGallineros){
            dispatch({type: SET_DATA_REPORTEPRODUCCIONGALLI, dataGallineros});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_REPORTEPRODUCCIONGALLI, pageGallineros: page });
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: false});
    })
};

const listarTotales = (page=1) => (dispatch, getStore) => {
    const store = getStore();
    let dateStart = store.reporteproduccion.dateStart
    let dateEnd = store.reporteproduccion.dateEnd;
    const empresa = store.reporteproduccion.empresa;
    const subempresa = store.reporteproduccion.subempresa;
    const linea = store.reporteproduccion.linea

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
    dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: true});
    api.get(`${url}/getProduccionTotales`, params).catch((error) => {
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
            dispatch({type: SET_DATATOTALES_REPORTEPRODUCCION, dataTotales:data});
            // dispatch(setDataPrestamos(data));
            dispatch({type: SET_PAGE_REPORTEPRODUCCION, page});
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: SET_CARGANDO_REPORTEPRODUCCION, loading: false});
    })
};
const getGrafica = () => (dispatch, getStore) =>{
    const store = getStore();
    let dateStart = store.reporteproduccion.dateStart
    let dateEnd = store.reporteproduccion.dateEnd;
    const empresa = store.reporteproduccion.empresa;
    const subempresa = store.reporteproduccion.subempresa;
    const linea = store.reporteproduccion.linea

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
    params.reporteGallinero = store.reporteproduccion.reporteGallinero;

    dispatch({type: SET_CARGANDOGRAFICA_REPORTEPRODUCCION, loadingGrafica: true});
    api.get(`${url}/getProduccionGrafica`, params).catch((error) => {
        // dispatch(loadingPrestamos(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
            );
            dispatch({type: SET_CARGANDOGRAFICA_REPORTEPRODUCCION, loadingGrafica: false});
    }).then((data) => {
        // dispatch(loadingPrestamos(false));
        if(data){
            let grafica = data
            let arr = [];

            let fechas =_.chain(grafica).groupBy("fecha").map(function(v, i) {
                return dateFormatter(i)
            }).value();
            let fechasSinFormato =_.chain(grafica).groupBy("fecha").map(function(v, i) {
                return i
            }).value();
            let result=_.chain(grafica).groupBy("nombre").map(function(v, i) {

                return  i

            }).value();
            let resultA = result.map(function(v,i){
                let data = [];
                fechasSinFormato.forEach((x) =>{
                    let a = _.find(grafica, {'fecha': x, 'nombre':v});
                    if(a){
                        data.push(a.cantidad)
                    }else{
                        data.push(0);
                    }
                })
                return {
                    nombre: v,
                    data:data
                }
            })

            // let result=_.chain(grafica).groupBy("tipo").map(function(v, i) {
            //     let gasto = arr.find(x => x.id === Number(i))
            //     return {
            //     id: i,
            //     nombre: gasto.espaniol,
            //     data: _.map(v, 'cantidad')
            //     }
            // }).value();

            let datasetsLine = [];

            resultA.map((x,index) => {
                let indexColor = Math.floor(Math.random() * (4 - 0)) + 0;
                let obj = {
                    data: x.data,
                    label:  x.nombre,
                    backgroundColor: 'transparent',
                    borderColor: backgroudColor1[indexColor]
                }
                datasetsLine.push(obj)
            })
            // result=_.chain(grafica).groupBy("fecha").map(function(v, i) {
            //     return dateFormatter(i)
            // }).value();

            let dataLinear = {
                datasets: datasetsLine,
                labels: fechas
            };
            dispatch({type: SET_DATAGRAFICA_REPORTEPRODUCCION, grafica:dataLinear});
            // dispatch(setDataPrestamos(data));
            // dispatch(setPagePrestamos(page));
        }
        dispatch({type: SET_CARGANDOGRAFICA_REPORTEPRODUCCION, loadingGrafica: false});
    })

}

const setDateStart = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATESTART_REPORTEPRODUCCION, dateStart: date});
    dispatch(listar(1));
    dispatch(listarGallinero(1));
    dispatch(getGrafica(1));
    dispatch(listarTotales(1));
}
const setDateEnd = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATEEND_REPORTEPRODUCCION, dateEnd: date});
    dispatch(listar(1));
    dispatch(listarGallinero(1));
    dispatch(getGrafica(1));
    dispatch(listarTotales(1));
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
    dispatch({type: SET_EMPRESA_REPORTEPRODUCCION, empresa: empresa.value});
    dispatch({type: SET_SUBEMPRESA_REPORTEPRODUCCION, subempresa: null})
    dispatch({type: SET_LINEA_REPORTEPRODUCCION, linea: null})

    dispatch({type: SET_LINEAS_PRO, lineas});
    dispatch({type: SET_SUBEMPRESAS_PRO, subempresas})
    dispatch(listar(1));
    dispatch(listarGallinero(1));
    dispatch(getGrafica(1));
    dispatch(listarTotales(1));
}
const setSubempresa = (subempresa) => (dispatch, getStore) => {
    dispatch({type: SET_SUBEMPRESA_REPORTEPRODUCCION, subempresa: subempresa});
    dispatch(listar(1));
    dispatch(listarGallinero(1));
    dispatch(getGrafica(1));
    dispatch(listarTotales(1));
}
const setLinea = (linea) => (dispatch, getStore) => {
    dispatch({type: SET_LINEA_REPORTEPRODUCCION, linea: linea});
    dispatch(listar(1));
    dispatch(listarGallinero(1));
    dispatch(getGrafica(1));
    dispatch(listarTotales(1));
}

const setEsReporte = () => (dispatch) => {
    dispatch({ type: SET_REPORTE_G_REPORTEPRODUCCION, reporteGallinero: true });
}

export const actions = {
    listarEmpresas,
    listar,
    listarTotales,
    getGrafica,
    setDateStart,
    setDateEnd,
    setEmpresa,
    setSubempresa,
    setLinea,
    listarGallinero,
    listarEmpresasGallineros,
    setEsReporte,
};

export const reducer = {
    [SET_CARGANDO_REPORTEPRODUCCION]: (state, { loading }) => {
        return {...state, loading }
    },
    [SET_PAGE_REPORTEPRODUCCION]: (state, { page }) => {
        return {...state,  page }
    },
    [SET_PAGE_REPORTEPRODUCCIONGALLI]: (state, { pageGallineros }) => {
        return {...state, pageGallineros }
    },
    [SET_CARGANDOGRAFICA_REPORTEPRODUCCION]: (state, { loadingGrafica }) => {
        return {...state, loadingGrafica }
    },
    [SET_DATA_REPORTEPRODUCCION]: (state, { data }) => {
        return {...state, data }
    },
    [SET_DATA_REPORTEPRODUCCIONGALLI]: (state, { dataGallineros }) => {
        return {...state, dataGallineros }
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
    [SET_SUBEMPRESA_REPORTEPRODUCCION]: (state, { subempresa }) => {
        return {...state, subempresa }
    },
    [SET_REPORTE_G_REPORTEPRODUCCION]: (state, { reporteGallinero }) => {
        return {...state, reporteGallinero }
    },
    [SET_LINEA_REPORTEPRODUCCION]: (state, { linea }) => {
        return {...state, linea }
    },
    [SET_EMPRESAS_RPRO]: (state, { empresas }) => {
        return {...state,  empresas }
    },
    [SET_LINEAS_PRO]: (state, { lineas }) => {
        return {...state, lineas }
    },
    [SET_SUBEMPRESAS_PRO]: (state, { subempresas }) => {
        return {...state, subempresas }
    }
}
export const initialState = {
    loading: true,
    loadingGrafica: false,
    page: 1,
    pageGallineros: 1,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    grafica: [],
    dataTotales: [],
    dateStart:  moment().subtract(7,'days'),
    dateEnd: moment(),
    empresa: null,
    subempresa: null,
    reporteGallinero: false,
    linea: null,
    empresas:[],
    lineas:[],
    subempresas:[],
    dataGallineros: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
};

export default handleActions(reducer, initialState)
