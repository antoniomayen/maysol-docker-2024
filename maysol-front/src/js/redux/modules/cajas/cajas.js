import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'cuentas/cajas'


export const initialLoad = () => (dispatch) => {

};

export const listar = (page = 1) =>  (dispatch, getStore) => {
    dispatch(loadercajas());

    // parametros de búsqueda
    const store = getStore();
    const search = store.cajas.buscador;
    const mes = store.cajas.mes;
    const anio = store.cajas.anio;
    const filtro = store.cajas.filtroEmpresas;
    let params = {page, search, anio: anio, mes: mes};

    if(filtro){
        params['filtro'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`cierre/getCajasUsuarios`, params).catch((error) => {
        dispatch(loadercajas(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(loadercajas(false));
        if(data){
            dispatch(setDatacajas(data));
            dispatch(setPagecajas(page));
        }
    })
}
export const getEmpresasSelect = () => (dispatch, getStore) => {
    let params = {principales:""}
    api.get(`proyectos/getEmpresasSelect`, params).catch((error) => {
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch(setDataempresas(data));
        }
    })
}
export const cambiarMes = (mes) => (dispatch, getStore) =>{
    dispatch(setMes(mes))
    const store = getStore();
    const idActual = store.cajas.idProyecto;
    dispatch(listar(1, idActual));
}
export const cambiarAnio = (anio) => (dispatch, getStore) => {
    dispatch(setAnio(anio));
    const store = getStore();
    const idActual = store.cajas.idProyecto;
    dispatch(listar(1, idActual));
}
export const search = (search) => (dispatch) => {
    dispatch(setBuscadorcajas(search));
    dispatch(listar(1));
}

export const cambiarFiltro = (filtro) => (dispatch, getStore) =>{
    const store = getStore();
    dispatch(setFiltroempresas(filtro));
    dispatch(listar(1));
}
export const setToggleModal = (estado) => (dispatch, getState) => {
    dispatch(setModal(estado));
}
export const {
    loadercajas,
    setDataempresas,
    setFiltroempresas,
    setDatacajas,
    setPagecajas,
    setUpdateDatacajas,
    setBuscadorcajas,
    setMescajas,
    setAniocajas,
    setSaldocajas,
    setModalcajas,
    setProyectocajas,
    setFiltrocajas
} = createActions({
    'LOADERCAJAS' : (loader = true) => ({loader}),
    'SET_DATAEMPRESAS' : (dataempresas) => ({dataempresas}),
    'SET_Filtroempresas' : (filtroEmpresas) => ({filtroEmpresas}),
    'SET_DATACAJAS': (dataCajaUsuarios) => ({dataCajaUsuarios}),
    'SET_PAGECAJAS': (page) => ({page}),
    'SET_UPDATE_DATACAJAS': (updateData) => ({updateData}),
    'SET_BUSCADORCAJAS': (buscador) => ({buscador}),
    'SET_MESCAJAS': (mes) => ({mes}),
    'SET_ANIOCAJAS': (anio) => ({anio}),
    'SET_SALDOCAJAS': (saldo) => ({saldo}),
    'SET_MODALCAJAS': (toggleModal) => ({toggleModal}),
    'SET_PROYECTOCAJAS': (idProyecto) => ({idProyecto}),
    'SET_FILTROCAJAS': (filtro) => ({filtro})
})
// Reducers
const reducer = {
    [loadercajas]: (state, {payload: {loader}}) => ({ ...state, loader}),
    [setDataempresas]: (state, {payload: {dataempresas}}) => ({ ...state, dataempresas}),
    [setFiltroempresas]: (state, {payload: {filtroEmpresas}}) => ({ ...state, filtroEmpresas}),
    [setDatacajas]: (state, {payload: {dataCajaUsuarios}}) => ({ ...state, dataCajaUsuarios}),
    [setPagecajas]: (state, {payload: {page}}) => ({ ...state, page}),
    [setUpdateDatacajas]: (state, {payload: {updateData}}) => ({ ...state, updateData}),
    [setBuscadorcajas]: (state, {payload: {buscador}}) => ({ ...state, buscador}),
    [setMescajas]: (state, {payload: {mes}}) => ({ ...state, mes}),
    [setAniocajas]: (state, {payload: {anio}}) => ({ ...state, anio}),
    [setSaldocajas]: (state, {payload: {saldo}}) => ({ ...state, saldo}),
    [setModalcajas]: (state, {payload: {toggleModal}}) => ({ ...state, toggleModal}),
    [setProyectocajas]: (state, {payload: {idProyecto}}) => ({ ...state, idProyecto}),
    [setFiltrocajas]: (state, {payload: {filtro}}) => ({ ...state, filtro})
}

export const initialState = {
    loader: false,
    page: 1,
    idProyecto: null,
    filtroEmpresas: 0,
    dataempresas:[],
    dataCajaUsuarios: {
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
    toggleModal: false
}

export default handleActions(reducer, initialState)
