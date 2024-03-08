import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { isEmpty } from '../../../utility/validation';
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import { getMe } from '../login';

const LOADER_USUARIO = 'LOADER_USUARIO';
const USUARIO = 'USUARIO_USUARIO';
const DATA = 'USUARIO_DATA';
const PAGE = 'USUARIO_PAGE';
const PERMISOS = 'PERMISOS';
const NUEVO_USUARIO = 'NUEVO_USAURIO';
const ACTIVO = 'ACTIVO';
const BUSCADOR = 'USUARIO_BUSCADOR';
const FILTRO = 'USUARIO_FILTRO';
const SORT = 'USUARIO_SORT';
const MOSTRAR_PASS = 'MOSTRAR_PASS';
const USUARIOS_TODO= 'USUARIOS_TODO';

export const constants = {

};
export const initialLoad = () => (dispatch) =>{

};
 // ACTIONS
export const crearUsuario = () => (dispatch, getState) => {
    const formData = getState().form.usuario.values;
    if(formData.username) {
        dispatch({ type: LOADER_USUARIO, cargando: true});
        api.post(`users`, formData).then((data) => {
            if(data){
                dispatch({type: LOADER_USUARIO, cargando: false});
                swal(
                    'Exito',
                    'Usuario creado correctamente.',
                    'success'
                ).then(() => {
                    dispatch(push('/admin_usuarios'));
                })
            }
        }).catch((error) => {
            dispatch({ type: LOADER_USUARIO, cargando: false });
            swal(
                'ERROR',
                (error && error.detail) ? error.detail : 'Ha ocurrido un error al guardar el usuario.',
                'error'
            );
            if (error.statusCode === 404) {
                dispatch(push('/admin_usuarios'));
            }
        });
    }
}


export const listarUsuarios = (page = 1) => (dispatch, getStore) => {
    const store = getStore();
    const search = store.usuarios.buscador;

    let params = {page, search};

    dispatch({type: LOADER_USUARIO, cargando: true});
    api.get(`users`, params).catch((error) => {
        dispatch({type: LOADER_USUARIO, cargando: false});
    }).then((data)=> {
        dispatch({type: LOADER_USUARIO, cargando: false});
        if(data) {
            dispatch(changePage(page));
            dispatch({type: DATA, data});
        }

    })
}

export const buscarUsuarios = (search) => (dispatch) => {
    let buscador = search.replace(" ", "");
  if (Number(buscador) !== Number(buscador)){
    dispatch({ type: BUSCADOR, buscador: search });
  } else {
    buscador = `${buscador.substring(0,4)} ${buscador.substring(4,9)} ${buscador.substring(9)}`;
    buscador = buscador.trim();
    dispatch({ type: BUSCADOR, buscador });
  }
  dispatch(listarUsuarios(1));
}
export const getUsuario = id => (dispatch, getState) =>{
    dispatch({type: LOADER_USUARIO, cargando: true});
    api.get(`users/${id}`).catch((error) => {
        dispatch({type: LOADER_USUARIO, cargando: true});
        if(error.statusCode === 404){
            dispatch(push('/admin_usuarios'))
        }
    }).then((data) => {
        if(data){
            const usuario = { ...data}
            dispatch({type: NUEVO_USUARIO, nuevo_usuario: usuario});
            dispatch(initializeForm('usuario', usuario));
        }
        dispatch({type: LOADER_USUARIO, cargando: false})
    });
}
export const editarUsuario = () => (dispatch, getState) =>{
    const formData = getState().form.usuario.values;
    const usuario = getState().usuarios.nuevo_usuario;
    // let cuentasBorradas = usuario.asignado.filter((el) => !formData.asignado.includes(el));
    // formData.borrados = cuentasBorradas;
    formData.proyecto = null;
    dispatch({type: LOADER_USUARIO, cargando: true})
    api.put(`users/${formData.id}`, formData).catch((error) => {
        dispatch({type: LOADER_USUARIO, cargando: false});
        swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar',
            'error'
        );
        if( error.statusCode === 404) {
            dispatch(push('/admin_usuarios'));
        }
    }).then((data) => {
        dispatch({type: LOADER_USUARIO, cargando: false});
        dispatch(getMe());
        if(data) {
            swal(
                'Éxito',
                'Datos editados correctamente.',
                'success'
            ).then(() => {
                dispatch(push('/admin_usuarios'))
            })
        }
    })
}
export const borrarUsuario = (id) => (dispatch, getState) => {
    dispatch({type: LOADER_USUARIO, cargando: true});
    api.eliminar(`users/${id}`).catch((error) => {
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(push('/admin_usuarios'));
            });
    }).then((data) => {
        dispatch({type: LOADER_USUARIO, cargando: false});
        swal('Éxito', 'Datos borrados correctamente.', 'success')
            .then(()=> {
                dispatch(listarUsuarios());
            })
    });
}

export const cambiarEstadoPass = (estado) =>(dispatch, getState) =>{
    dispatch({type: MOSTRAR_PASS, mostrar_pass: estado});
}

 // REDUCERS
 const reducers = {
     [LOADER_USUARIO] : (state, {cargando}) =>{
        return {...state, cargando}
     },
     [USUARIO] : (state, {usuario}) =>{
        return {...state, usuario}
     },
     [DATA] : (state, {data}) =>{
        return {...state, data}
     },
     [PAGE]: (state, { page }) => {
        return {
            ...state,
            page,
        };
    },
     [PERMISOS] : (state, {permisos}) =>{
        return {...state, permisos}
     },
     [NUEVO_USUARIO] : (state, {nuevo_usuario}) =>{
        return {...state, nuevo_usuario}
     },
     [ACTIVO] : (state, {activo}) =>{
        return {...state, activo}
     },
     [BUSCADOR] : (state, {buscador}) =>{
        return {...state, buscador}
     },
     [FILTRO] : (state, {filtro}) =>{
        return {...state, filtro}
     },
     [SORT] : (state, {sort}) =>{
        return {...state, sort }
     },
     [MOSTRAR_PASS] : (state, {mostrar_pass}) =>{
         return {...state, mostrar_pass }
      }
 }
export const changePage = page => ({
    type: PAGE,
    page,
});

 export const initialState = {
    page: 1,
    cargando: false,
    nuevo_usuario: {

    },
    cuenta_eliminar: {},
    usuario:{},
    mostrar_pass: true,
    data:{
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    buscador: '',
    filtro: null,
    activo: true,
    activos: "",
    sort: ""
 }

 export default handleActions(reducers, initialState);
