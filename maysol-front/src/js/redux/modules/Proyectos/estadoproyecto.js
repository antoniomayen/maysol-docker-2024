import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'proyectos/'


export const initialLoad = () => (dispatch) => {

};

export const listar = (page = 1, proyecto) =>  (dispatch, getStore) => {
    dispatch(loader());
    dispatch(setProyecto(proyecto));

    // parametros de búsqueda
    const store = getStore();
    const search = store.estadoproyectos.buscador;
    const mes = store.estadoproyectos.mes;
    const anio = store.estadoproyectos.anio;
    const filtro = store.estadoproyectos.filtro;
    let params = {page, search, anio: anio, mes: mes};

    if(filtro){
        params['filtro'] = filtro
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`movimientos/`, params).catch((error) => {
        dispatch(loader(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(loader(false));
        if(data){
            dispatch(setData(data));
            dispatch(setPage(page));
        }
    })
}
export const cambiarMes = (mes) => (dispatch, getStore) =>{
    dispatch(setMes(mes))
    const store = getStore();
    const idActual = store.estadoproyectos.idProyecto;
    dispatch(listar(1, idActual));
}
export const cambiarAnio = (anio) => (dispatch, getStore) => {
    dispatch(setAnio(anio));
    const store = getStore();
    const idActual = store.estadoproyectos.idProyecto;
    dispatch(listar(1, idActual));
}
export const search = (search) => (dispatch) => {
    dispatch(setBuscador(search));
    const idActual = store.estadoproyectos.idProyecto;
    dispatch(listar(1, idActual));
}
export const getProyecto = id => (dispatch, getState) =>{
    dispatch(loader());
    api.get(`${url}${id}`).catch((error) => {
        dispatch(loader(false));
        if(error.statusCode  === 404){
            dispatch(push('/admin_empresas'))
        }
    }).then((data) => {
        dispatch(loader(false))
        if(data){
            const proyecto = {
                id: data.id,
                nombre: data.nombre,
                representante: data.representante
            }
            dispatch(setUpdateData(proyecto));
            dispatch(initializeForm('proyecto', proyecto))
        }
    })
}
export const movimiento = (proyecto, tipo) => (dispatch, getStore) => {
    const store = getStore();
    const mes = store.estadoproyectos.mes;
    const anio = store.estadoproyectos.anio;
    const idActual = store.estadoproyectos.idProyecto;
    let params = {anio: anio, mes: mes};
    const formData = getStore().form.movimiento.values;
    formData.fecha = formData.fecha.format("YYYY-MM-D")

    dispatch(loader())
    api.post(`movimientos/deposito/${idActual}`,formData, params).catch((error) => {
        dispatch(loader(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(loader(false))
        Swal('Éxito', 'Se ha creado el depósito.', 'success')
        .then(() => {
            dispatch(setToggleModal(false))
        })
    })
}
export const create = () => (dispatch, getStore) => {
    const formData = getStore().form.proyecto.values;
    dispatch(loader())
    api.post(`${url}`, formData).catch((error) => {
        dispatch(loader(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(loader(false))
        Swal('Éxito', 'Se ha creado el proyecto.', 'success')
        .then(() => {
            dispatch(push('/admin_empresas'))
        })
    })
}
export const update = () => (dispatch, getStore) => {
    const formData = getStore().form.proyecto.values;
    dispatch(loader());
    api.put(`${url}${formData.id}`, formData).catch((error) =>{
        dispatch(loader(false));
        swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/admin_empresas'));
        }
    }).then((data) => {
        dispatch(loader(false));
        if(data){
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/admin_empresas'));
            })
        }
    })
}
export const destroy = (id) => (dispatch, getStore) => {
    dispatch(loader());
    api.eliminar(`${url}${id}`).catch((error) => {
        dispatch(loader(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
        .then(() => {
            dispatch(listar(1));
        })
    }).then((data) => {
        dispatch(loader(false));
        swal('Éxito', 'Se ha eliminado correctamente.', 'success')
        .then(() => {
            dispatch(listar(1));
        })
    })
}
export const anular = (id) => (dispatch, getStore) => {
    const formData = getStore().form.anulacion.values;
    dispatch(loader());
    api.put(`movimientos/anularmovimiento/${id}`, formData).catch((error) => {
        dispatch(loader(false));
        swal('Error', 'No se ha logrado anular el registro.', 'error')
        .then(() => {
            dispatch(listar(1));
        })
    }).then((data) => {
        dispatch(loader(false));
        swal('Éxito', 'Se ha anulado correctamente.', 'success')
        .then(() => {
            dispatch(listar(1));
            dispatch(setToggleModal(false));
        })
    })
}
export const cambiarFiltro = (filtro) => (dispatch, getStore) =>{
    const store = getStore();
    const idActual = store.estadoproyectos.idProyecto;
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
    dispatch(setModal(estado));
}
export const {
    loader,
    setData,
    setPage,
    setUpdateData,
    setBuscador,
    setMes,
    setAnio,
    setSaldo,
    setModal,
    setProyecto,
    setFiltro
} = createActions({
    'LOADER' : (loader = true) => ({loader}),
    'SET_DATA': (data) => ({data}),
    'SET_PAGE': (page) => ({page}),
    'SET_UPDATE_DATA': (updateData) => ({updateData}),
    'SET_BUSCADOR': (buscador) => ({buscador}),
    'SET_MES': (mes) => ({mes}),
    'SET_ANIO': (anio) => ({anio}),
    'SET_SALDO': (saldo) => ({saldo}),
    'SET_MODAL': (toggleModal) => ({toggleModal}),
    'SET_PROYECTO': (idProyecto) => ({idProyecto}),
    'SET_FILTRO': (filtro) => ({filtro})
})
// Reducers
const reducer = {
    [loader]: (state, {payload: {loader}}) => ({ ...state, loader}),
    [setData]: (state, {payload: {data}}) => ({ ...state, data}),
    [setPage]: (state, {payload: {page}}) => ({ ...state, page}),
    [setUpdateData]: (state, {payload: {updateData}}) => ({ ...state, updateData}),
    [setBuscador]: (state, {payload: {buscador}}) => ({ ...state, buscador}),
    [setMes]: (state, {payload: {mes}}) => ({ ...state, mes}),
    [setAnio]: (state, {payload: {anio}}) => ({ ...state, anio}),
    [setSaldo]: (state, {payload: {saldo}}) => ({ ...state, saldo}),
    [setModal]: (state, {payload: {toggleModal}}) => ({ ...state, toggleModal}),
    [setProyecto]: (state, {payload: {idProyecto}}) => ({ ...state, idProyecto}),
    [setFiltro]: (state, {payload: {filtro}}) => ({ ...state, filtro})
}

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
    toggleModal: false
}

export default handleActions(reducer, initialState)
