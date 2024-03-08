import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'cuentas/prestamos'


export const initialLoad = () => (dispatch) => {

};

export const listar = (page = 1, cuenta) =>  (dispatch, getStore) => {
    dispatch(loaderEstadoPrestamo());

    // parametros de búsqueda
    const store = getStore();
    const search = store.estadoprestamos.buscador;
    const mes = store.estadoprestamos.mes;
    const anio = store.estadoprestamos.anio;
    const filtro = store.estadoprestamos.filtro;
    let params = {page, search, anio: anio, mes: mes};

    if(filtro){
        params['filtro'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`movimientos/estadoprestamo/${cuenta}`, params).catch((error) => {
        dispatch(loaderEstadoPrestamo(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(loaderEstadoPrestamo(false));
        if(data){
            dispatch(setDataEstadoPrestamo(data));
            dispatch(setProyectoEstadoPrestamo(cuenta))
            dispatch(getSaldoCuenta(cuenta))
        }
    })
}
export const getSaldoCuenta = (cuenta) => (dispatch, getStore) => {
    const store = getStore();
    const mes = store.estadoprestamos.mes;
    const anio = store.estadoprestamos.anio;
    let params = { anio: anio, mes: mes, escaja:'sd' };
    api.get(`cierre/obtenerSaldo/${cuenta}`, params).catch((error) => {
    }).then((data) => {
        if (data) {
            dispatch(setSaldoEstadoPrestamo(data));
        }
    });
}
export const getPrestamo = (page = 1, proyecto) =>  (dispatch, getStore) => {
    dispatch(loaderEstadoPrestamo());
    dispatch(setProyectoEstadoPrestamo(proyecto));

    // parametros de búsqueda
    const store = getStore();
    const search = store.estadoprestamos.buscador;
    const mes = store.estadoprestamos.mes;
    const anio = store.estadoprestamos.anio;
    const filtro = store.estadoprestamos.filtro;
    let params = {page, search, anio: anio, mes: mes};

    if(filtro){
        params['filtro'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`cierre/getprestamo/${proyecto}`, params).catch((error) => {
        dispatch(loaderEstadoPrestamo(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(loaderEstadoPrestamo(false));
        if(data){
            dispatch(setInfoprestamo(data))
            dispatch(getSaldoCuenta(proyecto));
            dispatch(setProyectoEstadoPrestamo(proyecto));
            dispatch(listar(1,proyecto))
        }
    })
}

export const crearMovimiento = (parametro, tipo) => (dispatch, getStore) =>{
    const formData = getStore().form.movimiento.values;
    formData.cuenta =  parametro;
    formData.tipo = tipo;
    const store = getStore();


    const idActual = store.estadoprestamos.infoProyecto.id;

    try {
        formData.fecha = formData.fecha.format("YYYY-MM-D")
    } catch (error) {
        formData.fecha = formData.fecha
    }
    let anio = new Date(formData.fecha)
    let mes = anio.getMonth()+1;
    anio = anio.getFullYear();

    let params = {anio: anio, mes: mes, idCierre: idActual};
    dispatch(loaderEstadoPrestamo(true));
    api.post(`movimientos`, formData, params).then((data) => {
        dispatch(loaderEstadoPrestamo(false));
        if(data) {
            swal('Éxito', 'Se ha guardado el gasto.', 'success')
            .then(() => {
                dispatch(setToggleModal(false));
                dispatch(getPrestamo(1, parametro));
            })
        }
    }).catch((error) => {
        dispatch(loaderEstadoPrestamo(false));
        swal(
            'ERROR',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );

    })
}

export const search = (search) => (dispatch) => {
    dispatch(setBuscador(search));
    const idActual = store.estadoprestamos.idProyecto;
    dispatch(listar(1, idActual));
}
export const anular = (id) => (dispatch, getStore) => {
    const formData = getStore().form.anulacion.values;
    dispatch(loaderEstadoPrestamo(true));
    api.put(`movimientos/anularmovimiento/${id}`, formData)
    .then((data) => {
        dispatch(loaderEstadoPrestamo(false));
        swal('Éxito', 'Se ha anulado correctamente.', 'success')
        .then(() => {
            const store = getStore();
            const idActual = store.estadoprestamos.idProyectoEstado;
            dispatch(listar(1, idActual));
            dispatch(setToggleModal(false));
        })
    })
    .catch((error) => {
        dispatch(loaderEstadoPrestamo(false));
        swal('Error',
        (error && error.detail) ? error.detail : 'No se ha logrado anular el registro.',
        'error')
        .then(() => {
            const store = getStore();
            const idActual = store.estadoprestamos.idProyectoEstado;
            dispatch(listar(1, idActual));
        })
    })
}
export const cambiarFiltro = (filtro) => (dispatch, getStore) =>{
    const store = getStore();
    const idActual = store.estadoprestamos.idProyecto;
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
    dispatch(setFiltro(valor));
    dispatch(listar(1, idActual));
}
export const setToggleModal = (estado) => (dispatch, getState) => {
    console.log(estado ,"estado")
    dispatch(setModalep(estado));
}
export const {
    loaderEstadoPrestamo,
    setDataEstadoPrestamo,
    setPageEstadoPrestamo,
    setUpdateEstadoPrestamo,
    setBuscadorEstadoPrestamo,
    setMesEstadoPrestamo,
    setAnioEstadoPrestamo,
    setSaldoEstadoPrestamo,
    setModalep,
    setProyectoEstadoPrestamo,
    setFiltroEstadoPrestamo,
    setInfoprestamo
} = createActions({
    'LOADER_ESTADO_PRESTAMO' : (loader = true) => ({loader}),
    'SET_DATA_ESTADO_PRESTAMO': (data) => ({data}),
    'SET_PAGE_ESTADO_PRESTAMO': (page) => ({page}),
    'SET_UPDATE_DATA_ESTADO_PRESTAMO': (updateData) => ({updateData}),
    'SET_BUSCADOR_ESTADO_PRESTAMO': (buscador) => ({buscador}),
    'SET_MES_ESTADO_PRESTAMO': (mes) => ({mes}),
    'SET_ANIO_ESTADO_PRESTAMO': (anio) => ({anio}),
    'SET_SALDO_ESTADO_PRESTAMO': (saldoprestamo) => ({saldoprestamo}),
    'SET_MODALEP': (toggleModalPrestamo) => ({toggleModalPrestamo}),
    'SET_PROYECTO_ESTADO_PRESTAMO': (idProyectoEstado) => ({idProyectoEstado}),
    'SET_FILTRO_ESTADO_PRESTAMO': (filtro) => ({filtro}),
    'SET_INFOPRESTAMO': (infoProyecto) => ({infoProyecto})
})
// Reducers
const reducer = {
    [loaderEstadoPrestamo]: (state, {payload: {loader}}) => ({ ...state, loader}),
    [setDataEstadoPrestamo]: (state, {payload: {data}}) => ({ ...state, data}),
    [setPageEstadoPrestamo]: (state, {payload: {page}}) => ({ ...state, page}),
    [setUpdateEstadoPrestamo]: (state, {payload: {updateData}}) => ({ ...state, updateData}),
    [setBuscadorEstadoPrestamo]: (state, {payload: {buscador}}) => ({ ...state, buscador}),
    [setMesEstadoPrestamo]: (state, {payload: {mes}}) => ({ ...state, mes}),
    [setAnioEstadoPrestamo]: (state, {payload: {anio}}) => ({ ...state, anio}),
    [setSaldoEstadoPrestamo]: (state, {payload: {saldoprestamo}}) => ({ ...state, saldoprestamo}),
    [setModalep]: (state, {payload: {toggleModalPrestamo}}) => ({ ...state, toggleModalPrestamo}),
    [setProyectoEstadoPrestamo]: (state, {payload: {idProyectoEstado}}) => ({ ...state, idProyectoEstado}),
    [setFiltroEstadoPrestamo]: (state, {payload: {filtro}}) => ({ ...state, filtro}),
    [setInfoprestamo]: (state, {payload: {infoProyecto}}) => ({ ...state, infoProyecto})
}

export const initialState = {
    loader: false,
    page: 1,
    idProyectoEstado: null,
    infoProyecto:{
        id:0,
        inicio:0,
        fin:0,
        acreedor: 'sdfsdf',
        deudor:'sdf sdf',
        descripcion: ''
    },
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
    saldoprestamo: {inicio: 0, cierre: 0},
    toggleModalPrestamo: false
}

export default handleActions(reducer, initialState)
