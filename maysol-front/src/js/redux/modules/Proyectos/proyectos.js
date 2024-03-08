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

export const listar = (page = 1) =>  (dispatch, getStore) => {
    dispatch(loader());

    // parametros de búsqueda
    const store = getStore();
    const search = store.proyectos.buscador;
    let params = {page, search};

    api.get(`${url}`, params).catch((error) => {
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
export const search = (search) => (dispatch) => {
    dispatch(setBuscador(search));

    dispatch(listar(1));
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

            dispatch(setUpdateData(data));
            dispatch(initializeForm('proyecto', data))
        }
    })
}
export const create = () => (dispatch, getStore) => {
    const formData = getStore().form.proyecto.values;
    formData.cuentas = _.map(formData.cuentas, 'id');
    dispatch(loader())
    api.post(`${url}`, formData).then((data) => {
        dispatch(loader(false))
        Swal('Éxito', 'Se ha creado el proyecto.', 'success')
        .then(() => {
            dispatch(push('/admin_empresas'))
        })
    }).catch((error) => {
        dispatch(loader(false));
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch(loader(false))
    });
}
export const update = () => (dispatch, getStore) => {
    const formData = getStore().form.proyecto.values;
    const empresa = getStore().proyectos.updateData;
    let cuentasBorradas = empresa.cuentas.filter((el) => !formData.cuentas.includes(el));
    let empresasBorradas = empresa.empresas.filter((el) => {
        if(formData.empresas.find(x => x.id === el.id)){
            return
        }
        return el
    })


    formData.cuentas = _.map(formData.cuentas, 'id');
    formData.borrados = empresasBorradas;
    formData.cuentasBorradas = cuentasBorradas;
    formData.cuentasBorradas = _.map(formData.cuentasBorradas, 'id')
    dispatch(loader());
    api.put(`${url}${formData.id}`, formData)
    .then((data) => {
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
    .catch((error) =>{
        dispatch(loader(false));
        swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos.',
            'error'
        )
        if(error.statusCode === 404){
            dispatch(push('/admin_empresas'));
        }
        dispatch(getProyecto(formData.id));
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
export const { loader, setData, setPage, setUpdateData, setBuscador} = createActions({
    'LOADER' : (loader = true) => ({loader}),
    'SET_DATA': (data) => ({data}),
    'SET_PAGE': (page) => ({page}),
    'SET_UPDATE_DATA': (updateData) => ({updateData}),
    'SET_BUSCADOR': (buscador) => ({buscador})
})
// Reducers
const reducer = {
    [loader]: (state, {payload: {loader}}) => ({ ...state, loader}),
    [setData]: (state, {payload: {data}}) => ({ ...state, data}),
    [setPage]: (state, {payload: {page}}) => ({ ...state, page}),
    [setUpdateData]: (state, {payload: {updateData}}) => ({ ...state, updateData}),
    [setBuscador]: (state, {payload: {buscador}}) => ({ ...state, buscador}),
}

export const initialState = {
    loader: false,
    page: 1,
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
        representante: "",
        cuenta: ""
    },
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    filtro: null
}

export default handleActions(reducer, initialState)
