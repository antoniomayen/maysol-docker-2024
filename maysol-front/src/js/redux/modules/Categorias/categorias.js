import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'categorias'


export const initialLoad = () => (dispatch) => {

};

export const listarCategoria = (page = 1) =>  (dispatch, getStore) => {
    dispatch(setLoaderCategoria());

    // parametros de búsqueda
    const store = getStore();
    const search = store.categorias.buscadorCategorias;
    let params = {page, search};


    api.get(`${url}`, params).catch((error) => {
        dispatch(setLoaderCategoria(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(setLoaderCategoria(false));
        if(data){
            dispatch(setPageCategoria(page))
            dispatch(setDataCategoria(data));

        }
    })
}
export const listarTodosCategoria = (page = 1) =>  (dispatch, getStore) => {
    dispatch(setLoaderCategoria());

    // parametros de búsqueda
    const store = getStore();
    const search = store.categorias.buscadorCategorias;
    let params = {page, search};


    api.get(`${url}`, params).catch((error) => {
        dispatch(setLoaderCategoria(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(setLoaderCategoria(false));
        if(data){
            dispatch(setTodosCategoria(data));

        }
    })
}
export const getCategoria = (id) =>  (dispatch, getStore) => {
    dispatch(setLoaderCategoria());

    // parametros de búsqueda
    const store = getStore();



    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}/${id}`).catch((error) => {
        dispatch(setLoaderCategoria(false));
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch(setLoaderCategoria(false));
        if(data){
            dispatch(setInfoCategoria(data))
            dispatch(initializeForm('categoria', data))

        }
    })
}

export const crearCategoria = () => (dispatch, getStore) =>{
    const formData = getStore().form.categoria.values;

    dispatch(setLoaderCategoria(true));
    api.post(`${url}`, formData).then((data) => {
        dispatch(setLoaderCategoria(false));
        if(data) {
            swal('Éxito', 'Se ha guardado el gasto.', 'success')
            .then(() => {
                dispatch(push('/admin_categorias'));
            })
        }
    }).catch((error) => {
        dispatch(setLoaderCategoria(false));
        swal(
            'ERROR',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
    })
}
export const actualizarCategoria = () => (dispatch, getStore) =>{
    const formData = getStore().form.categoria.values;
    const id = formData.id
    dispatch(setLoaderCategoria(true));
    api.put(`${url}/${id}`, formData).then((data) => {
        dispatch(setLoaderCategoria(false));
        if(data) {
            swal('Éxito', 'Se ha guardado el gasto.', 'success')
            .then(() => {
                dispatch(push('/admin_categorias'));
            })
        }
    }).catch((error) => {
        dispatch(setLoaderCategoria(false));
        swal(
            'ERROR',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );

    })
}
export const borrarCategorias = (id) => (dispatch, getState) => {
    dispatch(setLoaderCategoria());
    api.eliminar(`${url}/${id}`)
    .then((data)=>{
        dispatch(setLoaderCategoria(false));
        swal('Éxito', 'Datos borrados correctamente.', 'success')
            .then(()=> {
                dispatch(listarCategoria(1));
            })
    })
    .catch((error) => {
        dispatch(setLoaderCategoria(false));
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(()=> {
                dispatch(push('/admin_categorias'));
            })
    })
}
export const searchCategoria = (search) => (dispatch) => {
    dispatch(setBuscadorCategoria(search));
    dispatch(listarCategoria(1));
}


export const setToggleModal = (estado) => (dispatch, getState) => {
    console.log(estado ,"estado")
    dispatch(setModalep(estado));
}
export const {
    setLoaderCategoria,
    setPageCategoria,
    setIdCategoria,
    setDataCategoria,
    setBuscadorCategoria,
    setFiltroCategorias,
    setInfoCategoria,
    setTodosCategoria
} = createActions({
    'SET_LOADER_CATEGORIA' : (loaderCategoria = true) => ({loaderCategoria}),
    'SET_PAGE_CATEGORIA' : (pageCategoria) => ({pageCategoria}),
    'SET_ID_CATEGORIA' : (idCategoria) => ({idCategoria}),
    'SET_DATA_CATEGORIA' : (dataCategoria) => ({dataCategoria}),
    'SET_BUSCADOR_CATEGORIA' : (buscadorCategorias) => ({buscadorCategorias}),
    'SET_FILTRO_CATEGORIA' : (filtroCategorias) => ({filtroCategorias}),
    'SET_INFO_CATEGORIA' : (infoCategoria) => ({infoCategoria}),
    'SET_TODOS_CATEGORIA' : (todosCategoria) => ({todosCategoria}),
})
// Reducers
const reducer = {
    [setLoaderCategoria]: (state, {payload: {loaderCategoria}}) => ({ ...state, loaderCategoria}),
    [setPageCategoria]: (state, {payload: {pageCategoria}}) => ({ ...state, pageCategoria}),
    [setIdCategoria]: (state, {payload: {idCategoria}}) => ({ ...state, idCategoria}),
    [setDataCategoria]: (state, {payload: {dataCategoria}}) => ({ ...state, dataCategoria}),
    [setBuscadorCategoria]: (state, {payload: {buscadorCategorias}}) => ({ ...state, buscadorCategorias}),
    [setFiltroCategorias]: (state, {payload: {filtroCategorias}}) => ({ ...state, filtroCategorias}),
    [setInfoCategoria]: (state, {payload: {infoCategoria}}) => ({ ...state, infoCategoria}),
    [setTodosCategoria]: (state, {payload: {todosCategoria}}) => ({ ...state, todosCategoria})

}

export const initialState = {
    loaderCategoria: false,
    pageCategoria: 1,
    idCategoria:null,
    dataCategoria: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    todosCategoria: [],
    buscadorCategorias: '',
    filtroCategorias: null,
    infoCategoria: {}
}

export default handleActions(reducer, initialState)
