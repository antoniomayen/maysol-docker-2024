import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import { PL, CF } from '../../../common/utility/constants';
import { dateFormatter } from '../../../common/components/Utils/renderField/renderReadField'
import _ from 'lodash';
import {Monedas} from '../../../common/utility/constants';

const url = 'reportecf';

const backgroudColor1 = [
    'rgba(69, 49, 93, 0.80)',
    'rgba(226, 70, 71, 0.80)',
    'rgba(35, 112, 160,0.80)',
    'rgba(80, 154, 174, 0.8)',
    'rgba(235, 235, 235,0.9)'
];

export const initialLoad = () => (dispatch) => {

};

export const listarReportecf = (tipo) =>  (dispatch, getStore) => {
    dispatch(setLoaderReportecf());
    dispatch(setTipoReporte(tipo));
    // parametros de búsqueda
    const store = getStore();
    const search = store.reportecf.buscadorCategorias;
    const mes = store.reportecf.mesRepo;
    const anio = store.reportecf.anioRepo;
    let empresa = store.reportecf.empresaRepo;

    const moneda = store.reportecf.monedaTab
    if(empresa === 0 || empresa === undefined){
        empresa = store.login.me.idProyecto;
        dispatch(setEmpresarepo(empresa))
    }
    let params = {anio,  mes,  tipo, empresa, moneda};

    const usuario = store.reportecf.usuarioFiltro;
    const categoria = store.reportecf.categoriaFiltro;
    if (usuario && Number(usuario) !== 0) params['usuario'] = usuario;
    if (categoria && Number(categoria) !== 0) params['categoria'] = categoria;

    api.get(`${url}/getReporte`, params).catch((error) => {
        dispatch(setLoaderReportecf(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){

            dispatch(setDataReportecf(data.resumen));
            dispatch(listarReporteDetalle(tipo));
            dispatch(graficaLinear(tipo));
            dispatch(graficaRadial(tipo));
            dispatch(setLoaderReportecf(false));
            // dispatch(setEmpresarepo(usuario.idProyecto))

        }
    })
}
export const listarReporteDetalle = (tipo) => (dispatch, getStore) => {
    const store = getStore();
    const search = store.reportecf.buscadorCategorias;
    const mes = store.reportecf.mesRepo;
    const anio = store.reportecf.anioRepo;
    const empresa = store.reportecf.empresaRepo;
    const search_detalle = store.reportecf.search_gastos;
    const reporte = store.reportecf.tipoReporte;
    const moneda = store.reportecf.monedaTab
    let params = {anio,  mes,  tipo: reporte, empresa, opcion:1, search: search_detalle, moneda};


    const usuario = store.reportecf.usuarioFiltro;
    const categoria = store.reportecf.categoriaFiltro;
    if (usuario && Number(usuario) !== 0) params['usuario'] = usuario;
    if (categoria && Number(categoria) !== 0) params['categoria'] = categoria;

    api.get(`${url}/getReporte`, params).catch((error) => {
        dispatch(setLoaderReportecf(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch(setDetalleReporte(data.detalle));
            dispatch(setLoaderReportecf(false));

        }
    })
}

export const getEmpresas = () =>  (dispatch, getStore) => {
    api.get(`proyectos/getEstables/`).catch((error) => {
        dispatch(setLoaderReportecf(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch(setEmpresasestables(data));
            dispatch(getUsuarios(''))
        }
    })
}

export const getUsuarios = (search) => (dispatch, getStore) => {
    const store = getStore();
    const empresa = store.reportecf.empresaRepo
    let params = {};
    if(empresa){
        params["proyecto"] = empresa
    }
    return api.get(`users/getTodosUsuarios`, params).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        dispatch(setUsuarioEmpresa(data))
    })
}
export const searchCategoria = (search) => (dispatch) => {
    dispatch(setBuscadorReportecf(search));
    dispatch(listarReportecf(1));
}


export const setToggleModal = (estado) => (dispatch, getState) => {
    dispatch(setModalep(estado));
}
export const cambiarMes = (mes) => (dispatch, getStore) =>{
    dispatch(setMesrepo(mes));
    const store = getStore();
    const reporte = store.reportecf.tipoReporte;
    dispatch(listarReportecf(reporte));
}
export const cambiarAnio = (anio) => (dispatch, getStore) => {
    dispatch(setAniorepo(anio));
    const store = getStore();
    const reporte = store.reportecf.tipoReporte;
    dispatch(listarReportecf(reporte));
}
export const cambiarEmpresa = (empresa) => (dispatch, getStore) => {
    dispatch(setEmpresarepo(empresa));
    const store = getStore();
    const reporte = store.reportecf.tipoReporte;
    dispatch(listarReportecf(reporte));
    dispatch(getUsuarios(''));
}

export const setCategoriaFiltro = (categoria) => (dispatch, getStore) => {
    dispatch(setFiltroCategoria(categoria))
    const store = getStore();
    const reporte = store.reportecf.tipoReporte;
    dispatch(listarReportecf(reporte));
    dispatch(listarReporteDetalle(reporte));
}
export const setUsuarioFiltro = (usuario) => (dispatch, getStore) => {
    dispatch(setFiltroUsuario(usuario))
    const store = getStore();
    const reporte = store.reportecf.tipoReporte;
    dispatch(listarReportecf(reporte));
    dispatch(listarReporteDetalle(reporte));
}
export const graficaRadial = (tipo) => (dispatch, getStore)  => {

    const store = getStore();

    const search = store.reportecf.buscadorCategorias;
    const mes = store.reportecf.mesRepo;
    const anio = store.reportecf.anioRepo;
    const empresa = store.reportecf.empresaRepo;
    const moneda = store.reportecf.monedaTab
    let params = {anio,  mes,  tipo, empresa, opcion:2, moneda};

    const usuario = store.reportecf.usuarioFiltro;
    const categoria = store.reportecf.categoriaFiltro;
    if (usuario && Number(usuario) !== 0) params['usuario'] = usuario;
    if (categoria && Number(categoria) !== 0) params['categoria'] = categoria;

    api.get(`${url}/getReporte`, params).catch((error) => {
        dispatch(setLoaderReportecf(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            let grafica = data.grafica1;
            let data1 = grafica.map( x=> x.cantidad);

            let labels1 = grafica.map( x => {
                let arr = [];
                tipo == "CF" ? arr = CF : arr = PL;
                let obj = arr.find(cat => cat.id === x.tipo)
                return obj !== undefined ? obj.espaniol : ''
            })


            let dataPolar = {
                datasets: [{
                data: data1,
                backgroundColor: backgroudColor1,
                }],
                labels: labels1
            };
            dispatch(setGrafica1(dataPolar))
            dispatch(setLoaderReportecf(false));

        }
    })



}
export const graficaLinear = (tipo) => (dispatch, getStore)  =>{
    const store = getStore();


    const search = store.reportecf.buscadorCategorias;
    const mes = store.reportecf.mesRepo;
    const anio = store.reportecf.anioRepo;
    const empresa = store.reportecf.empresaRepo;
    const moneda= store.reportecf.monedaTab;
    let params = {anio,  mes,  tipo, empresa, opcion:3, moneda};

    const usuario = store.reportecf.usuarioFiltro;
    const categoria = store.reportecf.categoriaFiltro;
    if (usuario && Number(usuario) !== 0) params['usuario'] = usuario;
    if (categoria && Number(categoria) !== 0) params['categoria'] = categoria;

    api.get(`${url}/getReporte`, params).catch((error) => {
        dispatch(setLoaderReportecf(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            let grafica = data.grafica2
            let arr = [];
            tipo == "CF" ? arr = CF : arr = PL;

            let result=_.chain(grafica).groupBy("tipo").map(function(v, i) {
                let gasto = arr.find(x => x.id === Number(i))
                return {
                id: i,
                nombre: gasto.espaniol,
                data: _.map(v, 'cantidad')
                }
            }).value();

            let datasetsLine = [];

            result.map((x,index) => {
                let obj = {
                    data: x.data,
                    label:  x.nombre,
                    backgroundColor: 'transparent',
                    borderColor: backgroudColor1[index]
                }
                datasetsLine.push(obj)
            })
            result=_.chain(grafica).groupBy("fecha").map(function(v, i) {
                let gasto = arr.find(x => x.id === Number(i))
                return dateFormatter(i)
            }).value();

            let dataLinear = {
                datasets: datasetsLine,
                labels: result
            };
            Swal.close();
            dispatch(setGrafica2(dataLinear))
            dispatch(setLoaderReportecf(false));

        }
    })

};

export const exportarExcel = () => (dispatch, getStore)  => {
    const store = getStore();
    const anio = store.reportecf.anioRepo;
    const mes = store.reportecf.mesRepo;
    const empresa = store.reportecf.empresaRepo;
    const {moneda, idioma} = store.reportecf;
    const token = sessionStorage.getItem('token');
    let path = `/api/reportecf/descarga/?auth_token=${token}&anio=${anio}&empresa=${empresa}&mes=${mes}`;
    const usuario = store.reportecf.usuarioFiltro;
    const categoria = store.reportecf.categoriaFiltro;
    if (usuario && Number(usuario) !== 0) path += `&usuario=${usuario}`;
    if (categoria && Number(categoria) !== 0) path += `&categoria=${categoria}`;
    if (moneda !== null) { path += `&moneda=${moneda.value}`; }
    if (idioma !== null) { path += `&idioma=${idioma.value}`; }
    window.location.replace(path);
};
export const exportarExcelDetalle = () => (dispatch, getStore)  => {
    const store = getStore();
    const anio = store.reportecf.anioRepo;
    const mes = store.reportecf.mesRepo;
    const empresa = store.reportecf.empresaRepo;
    const tipo = store.reportecf.tipoReporte;
    const moneda = store.reportecf.monedaTab
    const tipo_moneda = store.reportecf.moneda.value
    const token = sessionStorage.getItem('token');
    let path = `/api/reportecf/descarga_detalle/?auth_token=${token}&anio=${anio}&empresa=${empresa}&mes=${mes}`;
    const usuario = store.reportecf.usuarioFiltro;
    const categoria = store.reportecf.categoriaFiltro;
    if (usuario && Number(usuario) !== 0) path += `&usuario=${usuario}`;
    if (categoria && Number(categoria) !== 0) path += `&categoria=${categoria}`;
    if (moneda !== null) { path += `&moneda=${moneda}`; }
    if (tipo !== null) { path += `&tipo=${tipo}`; }
    if (tipo_moneda !== null) { path += `&tipo_moneda=${tipo_moneda}`; }

    window.location.replace(path);
};

const searchGastos = (search_gastos)  => (dispatch) => {
    dispatch(setSearchGastos(search_gastos));
    dispatch(listarReporteDetalle())
};
const set_moneda_reporte = (moneda)  => (dispatch) => {
    dispatch(setMonedaReporte(moneda));
};
const set_idioma = (idima)  => (dispatch) => {
    dispatch(setIdioma(idima));
};
const set_moneda_tab = (monedaTab) => (dispatch, getStore) => {
    const store = getStore()
    dispatch(setMonedatabReporte(monedaTab));
    let getSimbolo = Monedas.find(x => x.value === monedaTab);
    dispatch(setSimboloReporte(getSimbolo.simbolo))
    const reporte = store.reportecf.tipoReporte;
    dispatch(listarReportecf(reporte));
}
export const actions = {
    listarReportecf,
    listarReporteDetalle,
    getEmpresas,
    getUsuarios,
    searchCategoria,
    setToggleModal,
    cambiarMes,
    cambiarAnio,
    cambiarEmpresa,
    setCategoriaFiltro,
    setUsuarioFiltro,
    graficaRadial,
    graficaLinear,
    searchGastos,
    exportarExcel,
    exportarExcelDetalle,
    set_moneda_reporte,
    set_idioma,
    set_moneda_tab
};

export const {
    setLoaderReportecf,
    setPageReportcf,
    setIdCategoria,
    setDataReportecf,
    setBuscadorReportecf,
    setFiltroReportecf,
    setInfoReportecf,
    setEmpresasestables,
    setMesrepo,
    setAniorepo,
    setEmpresarepo,
    setTipoReporte,
    setGrafica1,
    setGrafica2,
    setDetalleReporte,
    setFiltroUsuario,
    setFiltroCategoria,
    setUsuarioEmpresa,
    setSearchGastos,
    setMonedaReporte,
    setIdioma,
    setMonedatabReporte,
    setSimboloReporte
} = createActions({
    'SET_LOADER_REPORTECF' : (loaderReportecf = true) => ({loaderReportecf}),
    'SET_PAGE_REPORTECF' : (pageReportecf) => ({pageReportecf}),
    'SET_ID_REPORTECF' : (idCategoria) => ({idCategoria}),
    'SET_DATA_REPORTECF' : (dataResumencf) => ({dataResumencf}),
    'SET_BUSCADOR_REPORTECF' : (buscadorReportecf) => ({buscadorReportecf}),
    'SET_FILTRO_REPORTECF' : (filtroReportecf) => ({filtroReportecf}),
    'SET_INFO_REPORTECF' : (infoReporte) => ({infoReporte}),
    'SET_EMPRESASESTABLES' : (empresasEstables) => ({empresasEstables}),
    'SET_MESREPO' : (mesRepo) => ({mesRepo}),
    'SET_ANIOREPO' : (anioRepo) => ({anioRepo}),
    'SET_EMPRESAREPO' : (empresaRepo) => ({empresaRepo}),
    'SET_TIPO_REPORTE' : (tipoReporte) => ({tipoReporte}),
    'SET_GRAFICA1' : (grafica1) => ({grafica1}),
    'SET_GRAFICA2' : (grafica2) => ({grafica2}),
    'SET_DETALLE_REPORTE' : (detalleReporte) => ({detalleReporte}),
    'SET_FILTRO_USUARIO' : (usuarioFiltro) => ({usuarioFiltro}),
    'SET_FILTRO_CATEGORIA' : (categoriaFiltro) => ({categoriaFiltro}),
    'SET_USUARIO_EMPRESA' : (usuariosEmpresa) => ({usuariosEmpresa}),
    'SET_SEARCH_GASTOS' : (search_gastos) => ({search_gastos}),
    'SET_MONEDA_REPORTE': (moneda) => ({moneda}),
    'SET_IDIOMA': (idioma) => ({idioma}),
    'SET_MONEDATAB_REPORTE': (monedaTab) => ({monedaTab}),
    'SET_SIMBOLO_REPORTE': (simbolo) => ({simbolo}),
});
// Reducers
const reducer = {
    [setLoaderReportecf]: (state, {payload: {loaderReportecf}}) => ({ ...state, loaderReportecf}),
    [setPageReportcf]: (state, {payload: {pageReportecf}}) => ({ ...state, pageReportecf}),
    [setIdCategoria]: (state, {payload: {idCategoria}}) => ({ ...state, idCategoria}),
    [setDataReportecf]: (state, {payload: {dataResumencf}}) => ({ ...state, dataResumencf}),
    [setBuscadorReportecf]: (state, {payload: {buscadorReportecf}}) => ({ ...state, buscadorReportecf}),
    [setFiltroReportecf]: (state, {payload: {filtroReportecf}}) => ({ ...state, filtroReportecf}),
    [setInfoReportecf]: (state, {payload: {infoReporte}}) => ({ ...state, infoReporte}),
    [setEmpresasestables]: (state, {payload: {empresasEstables}}) => ({ ...state, empresasEstables}),
    [setMesrepo]: (state, {payload: {mesRepo}}) => ({ ...state, mesRepo}),
    [setAniorepo]: (state, {payload: {anioRepo}}) => ({ ...state, anioRepo}),
    [setEmpresarepo]: (state, {payload: {empresaRepo}}) => ({ ...state, empresaRepo}),
    [setTipoReporte]: (state, {payload: {tipoReporte}}) => ({ ...state, tipoReporte}),
    [setGrafica1]: (state, {payload: {grafica1}}) => ({ ...state, grafica1}),
    [setGrafica2]: (state, {payload: {grafica2}}) => ({ ...state, grafica2}),
    [setDetalleReporte]: (state, {payload: {detalleReporte}}) => ({ ...state, detalleReporte}),
    [setFiltroUsuario]: (state, {payload: {usuarioFiltro}}) => ({ ...state, usuarioFiltro}),
    [setFiltroCategoria]: (state, {payload: {categoriaFiltro}}) => ({ ...state, categoriaFiltro}),
    [setUsuarioEmpresa]: (state, {payload: {usuariosEmpresa}}) => ({ ...state, usuariosEmpresa}),
    [setSearchGastos]: (state, {payload: {search_gastos}}) => ({ ...state, search_gastos}),
    [setMonedaReporte]: (state, {payload: {moneda}}) => ({...state, moneda}),
    [setIdioma]: (state, {payload: {idioma}}) => ({...state, idioma}),
    [setMonedatabReporte]: (state, {payload: {monedaTab}}) => ({...state, monedaTab}),
    [setSimboloReporte]: (state, {payload: {simbolo}}) => ({...state, simbolo})

};

export const initialState = {
    loaderReportecf: false,
    pageReportecf: 1,
    idCategoria:null,
    empresasEstables: [],
    mesRepo: new Date().getMonth() + 1,
    anioRepo: new Date().getFullYear(),
    usuarioTodos:[],
    categoriasTodos:[],
    empresaRepo: 0,
    usuariosEmpresa:[],
    tipoReporte: 'CF',
    grafica1: {},
    grafica2: {},
    detalleReporte: [],
    dataResumencf: [],
    dataDetallecf:{
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscadorReportecf: '',
    filtroReportecf: null,
    infoReporte: {},
    usuarioFiltro:0,
    categoriaFiltro: 0,
    search_gastos: '',
    moneda: {value: 'YEN', label: 'Yenes'},
    mes_final: null,
    idioma: {value: 'jp', label: 'Japonés'},
    monedaTab: 'GTQ',
    simbolo: 'Q'
};

export default handleActions(reducer, initialState)
