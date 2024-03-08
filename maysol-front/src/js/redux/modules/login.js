import { createAction, handleActions } from 'redux-actions';
import { api } from '../../api/api';



const INITIAL = 'INITIAL';
const SUBMIT = 'SUBMIT';
const LOGIN = 'LOGIN';
const NAME_ERROR = 'NAME_ERROR';
const PASS_ERROR = 'PASS_ERROR';
const LOGIN_LOADER = 'LOGIN_LOADER';
const SUBMIT_ERROR = 'SUBMIT_ERROR';
const DIFERENTE = 'DIFERENTE';
const MENSAJE_LOGIN = 'MENSAJE_LOGIN';
const ME = 'ME';

export const constants = {
    SUBMIT,
};

// ------------------------------------
// Actions
// ------------------------------------
/* Funcion para simular el login, ELIMINAR */
function logInMock(dispatch) {
    sessionStorage.setItem('token', '123');
    dispatch({ type: LOGIN_LOADER, loader: false });
    dispatch({ type: SUBMIT, autenticado: true });
}

export const onSubmit = (data = {}) => (dispatch, getStore) => {
    let canLog = true;
    dispatch({ type: LOGIN_LOADER, loader: true });
    dispatch({ type: SUBMIT_ERROR, submitError: false });
    if (data.username === "" || data.username === undefined) {
        canLog = false;
        dispatch({ type: LOGIN_LOADER, loader: false });
    }
    if (data.password === "" || data.password === undefined) {
        canLog = false;
        dispatch({ type: LOGIN_LOADER, loader: false });
    }
    if (canLog) {
        // Esto debiera hacer una peticion a un API
        api.post("users/token", data)
            .catch((error) => {
                const mensajeLogin = (error && error.detail)? error.detail : 'A ocurrido un error, porfavor vuelva a intentarlo';
                dispatch({ type: LOGIN_LOADER, loader: false });
                dispatch({ type: SUBMIT_ERROR, submitError: true });
                dispatch({ type: MENSAJE_LOGIN, mensajeLogin });
                // ToastStore.error('Verifique que ha ingresado bien su nombre de usuario y contraseña.');
            })
            .then(resp => {
                if (resp) {
                    sessionStorage.setItem("token", resp.token);
                    dispatch({ type: SUBMIT, autenticado: true });
                    dispatch({ type: LOGIN_LOADER, loader: false });
                }
            });
    } else {
        dispatch({ type: LOGIN_LOADER, loader: false });
        dispatch({ type: SUBMIT, autenticado: false });
    }
    // dispatch({ type: LOGIN_LOADER, loader: true });
    // dispatch({ type: SUBMIT_ERROR, submitError: false });

    // if (canLog) {
    //     // Esto debiera hacer una peticion a un API
    //     setTimeout(logInMock, 2000, dispatch);
    // } else {
    //     dispatch({ type: LOGIN_LOADER, loader: false });
    //     dispatch({ type: SUBMIT, autenticado: false });
    // }
};




export const getMe = () => (dispatch, getStore) => {

    api.get(`users/me`).catch((error) => {
        sessionStorage.removeItem("token");
        dispatch({ type: SUBMIT, autenticado: false });
        window.location.assign("/");
    }).then((data) => {
        dispatch({type: LOGIN_LOADER, loader: false});
        dispatch({type: ME, me: data})
    });
};

export const irLogin = login => ({
    type: LOGIN,
    login,
  });

  export const autenticar = autenticado => ({
  type: SUBMIT,
  autenticado,
});


export const logOut = () => (dispatch) => {
    sessionStorage.removeItem('token');
    dispatch({ type: SUBMIT, autenticado: false });
    window.location.assign("/");
};

export const initialLoad = createAction(INITIAL);
export const hasNameError = nameError => ({
    type: NAME_ERROR,
    nameError,
});
export const hasPassError = passError => ({
    type: PASS_ERROR,
    passError,
});
export const diferentPass = diferente => ({
    type: DIFERENTE,
    diferente,
});

export const actions = {
    initialLoad,
    hasNameError,
    hasPassError,
    onSubmit,
    logOut,
};

export const reducers = {
    [INITIAL]: (state) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            return {
                ...state,
                redirect: true,
            };
        }
        return {
            ...state,
            redirect: false,
        };
    },
    [SUBMIT]: (state, { autenticado }) => {
        return {
            ...state,
            autenticado,
        };
    },
    [NAME_ERROR]: (state, { nameError }) => {
        return {
            ...state,
            nameError,
        };
    },
    [PASS_ERROR]: (state, { passError }) => {
        return {
            ...state,
            passError,
        };
    },
    [LOGIN_LOADER]: (state, { loader }) => {
        return {
            ...state,
            loader,
        };
    },
    [SUBMIT_ERROR]: (state, { submitError }) => {
        return {
            ...state,
            submitError,
        };
    },
    [ME]: (state, { me }) => {
        return {
            ...state,
            me,
        };
    },
    [MENSAJE_LOGIN]: (state, { mensajeLogin }) => {
        return {...state, mensajeLogin }
    }
};

export const initialState = {
    submitError: false,
    passError: false,
    nameError: false,
    autenticado: false,
    loader: false,
    mensajeLogin: '',
    me:{
        cargo:"Supervisor de proyecto",
        email:"aa@gamil.com",
        proyecto:"empresa",
        accesos: {
            administrador: true,
            backoffice: false,
            supervisor: false,
            vendedor: false,
            bodeguero: false,
            compras: false,
            sin_acceso: false
        },
        idProyecto:1,
        es_granja: false
    }
};

export default handleActions(reducers, initialState);
