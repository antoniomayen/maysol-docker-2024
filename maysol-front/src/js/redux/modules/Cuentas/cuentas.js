import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { isEmpty } from '../../../utility/validation';
import { push } from 'react-router-redux';
import swal from 'sweetalert2';


const LOADER = 'CUENTA_LOADER';
const CUENTA = 'CUENTA_CUENTA';
const DATA = 'CUENTA_DATA';
const PAGE = 'CUENTA_PAGE';
const PERMISOS = 'PERMISOS';
const NUEVO_CUENTA = 'NUEVO_CUENTA';
const ACTIVO = 'ACTIVO';
const BUSCADOR = 'CUENTA_BUSCADOR';
const FILTRO = 'CUENTA_FILTRO';
const SORT = 'CUENTA_SORT';
const TOGGLEMODAL = 'TOGGLEMODAL';

export const constants = {
};

// ------------------------------------
// Actions
// ------------------------------------

export const initialLoad = () => (dispatch) => {

};
// Actions
export const crearCuenta = () => (dispatch, getState) => {
    const formData = getState().form.cuenta.values;

    if (formData.nombre) {
        dispatch({ type: LOADER, loader: true });
        api.post(`cuentas`, formData).catch((error) => {
            Swal(
                'ERROR',
                (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
                'error'
            );
            if (error.statusCode === 404) {
                dispatch(push('/cuentas'));
            }
            dispatch({ type: LOADER, loader: false });
        }).then((data) => {
            dispatch({ type: LOADER, loader: false });
            if (data) {
                Swal(
                    'Éxito',
                    'Datos almacenados correctamente',
                    'success'
                ).then(() => {
                    dispatch(push('/cuentas'));
                });
            }
        });
    }
};

export const listarCuenta = (page = 1) => (dispatch, getStore) => {
    //**paramétros */
    const store = getStore();
    const search = store.cuentas.buscador;

    let params = {page, search};


    dispatch({ type: LOADER, loader: true });
    api.get('cuentas', params).catch((error) => {
        dispatch({ type: LOADER, loader: false });
    }).then((data) => {
        dispatch({ type: LOADER, loader: false });

        if (data) {
            dispatch(changePage(page));
            dispatch({ type: DATA, data });
        }
    });
};
export const buscarCuenta = (search) => (dispatch) => {
    let buscador = search.replace(" ", "");
  if (Number(buscador) !== Number(buscador)){
    dispatch({ type: BUSCADOR, buscador: search });
  } else {
    buscador = `${buscador.substring(0,4)} ${buscador.substring(4,9)} ${buscador.substring(9)}`;
    buscador = buscador.trim();
    dispatch({ type: BUSCADOR, buscador });
  }
  dispatch(listarCuenta(1));
}

export const getCuenta = id => async (dispatch, getState) => {
    dispatch({type: LOADER, loader: true});
    api.get(`cuentas/${id}`).catch((error) => {
        dispatch({type: LOADER, loader: false});
        if(error.statusCode === 404){
            dispatch(push('/cuentas'));
        }
    }).then((data) => {
        if(data){
            dispatch({type: NUEVO_CUENTA, nuevo_cuenta: data});
            dispatch(initializeForm('cuenta', data))
        }
        dispatch({type: LOADER, loader: false});
    });
}
export const borrarCuenta = (id) => (dispatch, getState) => {
    dispatch({type: LOADER, loader: true});
    api.eliminar(`cuentas/${id}`).then((data)=>{
        dispatch({type: LOADER, loader: false});
        swal('Éxito', 'Datos borrados correctamente.', 'success')
            .then(()=> {
                dispatch(listarCuenta());
            })
    }).catch((error) => {
        if(error){
            dispatch({type: LOADER, loader: false});
            swal('Error', error.detail ? error.detail : 'No se ha logrado borrar el registro.', 'error')
                .then(()=> {
                    dispatch(push('/cuentas'));
                })
        }
    })
};
export const editarCuenta = () => (dispatch, getState) =>{
    const formData = getState().form.cuenta.values;
    delete formData.tipo;
    dispatch({type: LOADER, loader: true});
    api.put(`cuentas/${formData.id}`, formData).catch((error) => {
        dispatch({type: LOADER, loader: false});
        Swal(
            'ERROR',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
        if (error.statusCode === 404) {
            dispatch(push('/cuentas'));
        }
        dispatch({ type: LOADER, loader: false });
    }).then((data) => {
        dispatch({type: LOADER, loader: false});
        if(data){
            swal('Éxito', 'Datos editados correctamente.', 'success')
            .then(()=> {
                dispatch(push('/cuentas'));
            })
        }
    })
}


export const crearDeposito = () => (dispatch, getState) =>{
    const formData = getState().form.deposito.values;
    formData.tipo = 10;
    formData.concepto = "Depósito bancario.";
    dispatch({type: LOADER, loader: true});
    api.post(`movimientos`, formData).catch((error) => {
        dispatch({type: LOADER, loader: false});
        swal(
            'ERROR',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
        if(error.statusCode === 404) {
            dispatch(setToggleModal(false));
        }
    }).then((data) => {
        dispatch({type: LOADER, loader: false});
        if(data) {
            swal('Éxito', 'Se ha guardado el depósito.', 'success')
            .then(() => {
                dispatch(setToggleModal(false));
                dispatch(listarCuenta(1));
            })
        }
    })
}

export const setToggleModal = (estado) => (dispatch, getState) => {
    dispatch({type: TOGGLEMODAL, toggleModal: estado})
}
// Reducers
const reducers = {
    [LOADER]: (state, { loader }) => {
        return { ...state, loader }
    },
    [CUENTA]: (state, { cuenta }) => {
        return { ...state, cuenta }
    },
    [DATA]: (state, { data }) => {
        return { ...state, data }
    },
    [PAGE]: (state, { page }) => {
        return {
            ...state,
            page,
        };
    },
    [PERMISOS]: (state, { permisos }) => {
        return { ...state, permisos }
    },
    [NUEVO_CUENTA]: (state, { nuevo_cuenta }) => {
        return { ...state, nuevo_cuenta }
    },
    [ACTIVO]: (state, { activo }) => {
        return { ...state, activo }
    },
    [BUSCADOR]: (state, { buscador }) => {
        return { ...state, buscador }
    },
    [FILTRO]: (state, { filtro }) => {
        return { ...state, filtro }
    },
    [SORT]: (state, { sort }) => {
        return { ...state, sort }
    },
    [TOGGLEMODAL] : (state, {toggleModal}) =>{
        return {...state, toggleModal }
     }
}
export const changePage = page => ({
    type: PAGE,
    page,
});
export const initialState = {
    loader: false,
    page: 1,
    nuevo_cuenta: {
        id: '',
        nombre: '',
        banco: '',
        numero: ''
    },
    cuenta: {},
    data: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    buscador: '',
    filtro: null,
    rol: null,
    activo: true,
    activos: "",
    sort: "",
    toggleModal: false
}

export default handleActions(reducers, initialState);
