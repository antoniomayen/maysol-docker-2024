import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { isEmpty } from '../../../utility/validation';
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import moment from 'moment';

const LOADER = 'ESTADO_LOADER';
const LOADER_MOVIMIENTO_ESTADOCUENTA = 'LOADER_MOVIMIENTO_ESTADOCUENTA';
const ESTADO = 'ESTADO_ESTADO';
const CUENTA = 'CUENTA_CUENTA';
const IDCUENTAESTADO = 'ID_CUENTA_ESTADO';
const NUEVO_CUENTA = 'NUEVO_CUENTA';
const DATA_ESTADOCUENTA = 'DATA_ESTADOCUENTA';
const PAGE = 'ESTADO_PAGE';
const PERMISOS = 'PERMISOS';
const NUEVO_ESTADO = 'NUEVO_ESTADO';
const ACTIVO = 'ACTIVO';
const BUSCADOR = 'ESTADO_BUSCADOR';
const FILTRO = 'ESTADO_FILTRO';
const SORT = 'ESTADO_SORT';
const TOGGLEMODAL = 'TOGGLEMODAL';
const IDCUENTA = 'IDCUENTA';
const ANIO = 'ANIO';
const MES = 'MES';
const SALDO = 'SALDO';
const ME_ESTADOCUENTA= 'ME_ESTADOCUENTA';
const COMENTARIO_ESTADO = 'COMENTARIO_ESTADO'
const SET_SIMBOLO='SET_SIMBOLO';
const SET_FILTROACTIVO_EC = 'SET_FILTROACTIVO_EC'

export const constants = {
};

// ------------------------------------
// Actions
// ------------------------------------

export const initialLoad = () => (dispatch) => {

};

export const listarEstado = (page = 1, cuenta) => (dispatch, getStore) => {
    dispatch({ type: LOADER, cargando: true });
    // Variables para la búsqueda y armar los parámetros
    const store = getStore();
    const search = store.estadocuentas.buscador;
    const filtro = store.estadocuentas.filtro;
    const mes = store.estadocuentas.mes;
    const anio = store.estadocuentas.anio;
    const idActual = store.estadocuentas.idCuentaEstado;
    const filtroAnulado = store.estadocuentas.filtroActivo;

    let params = {page, search, anio: anio, mes: mes};
    if(filtro && Number(filtro) !== 0){
        params['categoria'] = filtro;
    }
    if(filtroAnulado){
        params['anulado']= filtroAnulado.value
    }
    api.get(`movimientos/estadocuenta/${ cuenta || 0}`, params).catch((error) => {
        dispatch({ type: LOADER, cargando: false });
    }).then((data) => {
        dispatch({ type: LOADER, cargando: false });
        if (data) {
            dispatch({ type: DATA_ESTADOCUENTA, dataEstadocuenta: data });

            dispatch(getSaldoCuenta());
            dispatch(getMe())
            dispatch(changePage(page));
        }
    });
};
export const listarEstadoSinLoad = (page = 1, cuenta) => (dispatch, getStore) => {
    // Variables para la búsqueda y armar los parámetros
    const store = getStore();
    const search = store.estadocuentas.buscador;
    const filtro = store.estadocuentas.filtro;
    const mes = store.estadocuentas.mes;
    const anio = store.estadocuentas.anio;
    const idActual = store.estadocuentas.idCuentaEstado;


    let params = {page, search, anio: anio, mes: mes};
    if(filtro && Number(filtro) !== 0){
        params['categoria'] = filtro;
    }
    api.get(`movimientos/estadocuenta/${ cuenta || 0}`, params).catch((error) => {
        dispatch({ type: LOADER, cargando: false });
    }).then((data) => {
        dispatch({ type: LOADER, cargando: false });
        if (data) {
            dispatch({ type: DATA_ESTADOCUENTA, dataEstadocuenta: data });

            dispatch(getSaldoCuenta());
            dispatch(getMe())
            dispatch(changePage(page));
        }
    });
};
export const getSaldoCuenta = () => (dispatch, getStore) => {
    const store = getStore();
    const mes = store.estadocuentas.mes;
    const anio = store.estadocuentas.anio;
    const idActual = store.estadocuentas.idCuentaEstado;
    let params = { anio: anio, mes: mes };
    api.get(`cierre/obtenerSaldo/${idActual || 0}`, params).catch((error) => {
        dispatch({ type: LOADER, cargando: false });
    }).then((data) => {
        dispatch({ type: LOADER, cargando: false });

        if (data) {
            dispatch({ type: SALDO, saldo: data });
        }
    });
}
export const getMe = () => (dispatch, getStore) => {

    api.get(`users/me`).catch((error) => {
        sessionStorage.removeItem("token");
        window.location.assign("/");
    }).then((data) => {
        dispatch({ type: ME_ESTADOCUENTA, meEstadocuenta:data})
    });
};

export const buscarEstado = (search) => (dispatch, getStore) => {
    let buscador = search.replace(" ", "");
    if (Number(buscador) !== Number(buscador)){
        dispatch({ type: BUSCADOR, buscador: search });
    } else {
        buscador = `${buscador.substring(0,4)} ${buscador.substring(4,9)} ${buscador.substring(9)}`;
        buscador = buscador.trim();
        dispatch({ type: BUSCADOR, buscador });
    }
    const store = getStore();
    const idActual = store.estadocuentas.idCuentaEstado;
    dispatch(listarEstado(1, idActual));
}
export const editarMovimiento = (cerra) => (dispatch, getStore) => {
    const formData = getStore().form.movimiento.values;
    let fecha_recuperacion = null;
    try{
        fecha_recuperacion = moment(formData.fecha_inicio_recuperacion).format('YYYY-MM-DD');
        if (fecha_recuperacion !== 'Invalid date' && fecha_recuperacion !== 'Fecha inválida'){
                formData.fecha_inicio_recuperacion = fecha_recuperacion
        }
        
    } catch (e) {formData.fecha_inicio_recuperacion = null}
    formData.es_cuenta=true; //se manda al backend la bandera si es cuenta
    let fecha = null;
    try{
        fecha = moment(formData.fecha).format('YYYY-MM-DD');
        if (fecha !== 'Invalid date' && fecha !== 'Fecha inválida'){
            formData.fecha = fecha;
        }
    } catch (e) { formData.fecha = null }

    dispatch({ type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: true });
    api.put(`movimientos/${formData.id}`, formData)
    .then((data) => {
        try { if (cerra) cerra(); } catch (e) { }
        swal('Éxito', 'Se ha editado correctamente.', 'success')
        .then(() => {
            dispatch({ type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: false });
            const store = getStore();
            const idActual = store.estadocuentas.idCuentaEstado;
            dispatch(listarEstadoSinLoad(1, idActual));
            dispatch(setToggleModal(false));
        });

    })
    .catch((error) => {
        swal('Error',
         (error && error.detail) ? error.detail : 'No se ha logrado editar el registro.',
        'error')
        .then(() => {
            dispatch({ type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: false });
            const store = getStore();
            const idActual = store.estadocuentas.idCuentaEstado;
            dispatch(listarEstado(1, idActual));
        })
    })
}
export const anular = (id) => (dispatch, getStore) => {
    const formData = getStore().form.anulacion.values;
    dispatch({ type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: true });
    api.put(`movimientos/anularmovimiento/${id}`, formData)
    .then((data) => {
        dispatch({ type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: false });
        swal('Éxito', 'Se ha anulado correctamente.', 'success')
        .then(() => {
            const store = getStore();
            const idActual = store.estadocuentas.idCuentaEstado;
            dispatch(listarEstado(1, idActual));
            dispatch(setToggleModal(false));
        })
    })
    .catch((error) => {
        dispatch({ type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: false });
        swal('Error',
         (error && error.detail) ? error.detail : 'No se ha logrado anular el registro.',
        'error')
        .then(() => {
            const store = getStore();
            const idActual = store.estadocuentas.idCuentaEstado;
            dispatch(listarEstado(1, idActual));
        })
    })
}
export const cambiarMes = (mes) => (dispatch, getStore) =>{
    dispatch({type:MES, mes:mes})
    const store = getStore();
    const idActual = store.estadocuentas.idCuentaEstado;
    dispatch(getCuenta( idActual));
}
export const cambiarAnio = (anio) => (dispatch, getStore) => {
    dispatch({type: ANIO, anio:anio});
    const store = getStore();
    const idActual = store.estadocuentas.idCuentaEstado;
    dispatch(getCuenta(idActual));
}
export const cierreEstado = () => (dispatch, getStore) => {
    const store = getStore();
    const idActual = store.estadocuentas.idCuentaEstado;
    console.log("IdActual")
    let formData = {cuenta: idActual}
    api.post(`cierre/cierreCuenta`, formData).catch((error) => {
        swal(
            'ERROR',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER, cargando: false});
        if(data) {
            swal('Éxito', 'Se ha cerrado el periodo correctamente.', 'success')
            .then(() => {
                dispatch(setToggleModal(false));
            })
        }
    })

}
export const crearMovimiento = (parametro, tipo) => (dispatch, getStore) =>{
    const formData = getStore().form.movimiento.values;
    const store = getStore();
    const mes = store.estadocuentas.mes;
    const anio = store.estadocuentas.anio;
    const idActual = store.estadocuentas.idCuentaEstado;
    let params = {anio: anio, mes: mes, proyecto: idActual};
    //Es un deposito
    if(tipo == 10){
        if (formData.depositara ===  "10" || formData.depositara === "20"  ){
            // se debe de realizar un deposito a la cuenta
            formData.tipo = 30;
            formData.destino = 10
            params = {anio: anio, mes: mes, proyecto: idActual, destino: formData.destino};
        }
        else{
            // se debe de realizar un retiro a la cuenta
            formData.tipo = 10;
        }
    }
    // ES un retiro
    else if(tipo == 30){
        const permiso = store.estadocuentas.meEstadocuenta;
        if (permiso.accesos.administrador){
            params = {anio: anio, mes: mes, proyecto: idActual, destino: 30};
        } else{
            formData.destino = 30;
            params = {anio: anio, mes: mes, destino: 30};
        }
    }

    formData.cuenta =  parametro;


    try {
        console.log('Fecha reducer', formData.fecha)
        formData.fecha = formData.fecha.format("YYYY-MM-D")

    } catch (error) {
        formData.fecha = formData.fecha
    }

    dispatch({type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: true});
    api.post(`movimientos`, formData, params).then((data) => {
        dispatch({type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: false});
        if(data) {
            swal('Éxito', 'Se ha guardado el gasto.', 'success')
            .then(() => {
                dispatch(setToggleModal(false));
                dispatch(listarEstado(1, parametro));
            })
        }
    }).catch((error) => {
        dispatch({type: LOADER_MOVIMIENTO_ESTADOCUENTA, loaderMovimiento: false});
        swal(
            'ERROR',
              (error && error.detail) ? error.detail :  'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
        if(error.statusCode === 404) {
            dispatch(setToggleModal(false));
        }
    })
}
export const cambiarFiltro = (filtro) => (dispatch, getStore) =>{
    const store = getStore();
    const idActual = store.estadocuentas.idCuentaEstado;

    dispatch({type: ACTIVO, activo: filtro})
    dispatch({type: FILTRO, filtro: filtro});
    dispatch(listarEstado(1, idActual));
}
export const cambiarActivo = (estado) => (dispatch, getStore) => {
    dispatch({type: SET_FILTROACTIVO_EC, filtroActivo: estado});
    const store = getStore();
    const idActual = store.estadocuentas.idCuentaEstado;
    dispatch(listarEstado(1, idActual));
}
export const getCuenta = id => async (dispatch, getStore) => {
    const store = getStore();
    const mes = store.estadocuentas.mes;
    const anio = store.estadocuentas.anio;
    const cuentas = store.cuentas.data.results;
    let simbolo = "";
    cuentas.forEach((cuenta=>{
        if(cuenta.id==id){
            simbolo=cuenta.simbolo;
        }
    }))
    dispatch({type: SET_SIMBOLO, simbolo: simbolo})
    let params = { anio: anio, mes: mes };
    dispatch({type: LOADER, cargando: true});
    dispatch({type: IDCUENTAESTADO, idCuentaEstado: id});
    api.get(`cierre/getCierre/${id || 0}`, params).catch((error) => {
        dispatch({type: LOADER, cargando: true});
        // if(error.statusCode === 404){
        //     dispatch(push('/cuentas'));
        // }
    }).then((data) => {
        if(data){
            const cuenta = data
            dispatch({type: CUENTA, cuenta: cuenta});
            dispatch(listarEstado(1, id))

        }
        dispatch({type: LOADER, cargando: false});
    });
}
export const setToggleModal = (estado) => (dispatch, getState) => {
    dispatch({type: TOGGLEMODAL, toggleModal: estado})
}

export const verficarDatosComentario = (value) => (dispatch, getStore) =>{
    const comentarios = getStore().estadocuentas.comentariosEstado
    if (comentarios.length === 0){
        let nuevo = comentarios
        nuevo.push(value)
        dispatch({type: COMENTARIO_ESTADO, comentariosEstado: nuevo})
    }else{
        comentarios.forEach(item => {
            if (!_.find(comentarios, { id: value.id })) {
                let nuevo = comentarios
                nuevo.push(value)
                dispatch({type: COMENTARIO_ESTADO, comentariosEstado: nuevo})
            }
            else{
                if (item.id === value.id){
                    if(value.comentario){
                        item.comentario = value.comentario
                    }
                    if(value.categoria){
                        item.categoria = value.categoria
                    }
                }
            }

        });
    }
}

// Reducers
const reducers = {
    [LOADER]: (state, { cargando }) => {
        return { ...state, cargando }
    },
    [ESTADO]: (state, { estado }) => {
        return { ...state, estado }
    },
    [DATA_ESTADOCUENTA]: (state, { dataEstadocuenta }) => {
        return { ...state, dataEstadocuenta }
    },
    [PAGE]: (state, { page }) => {
        return {
            ...state,
            page,
        };
    },
    [NUEVO_ESTADO]: (state, { nuevo_estado }) => {
        return { ...state, nuevo_estado }
    },
    [ACTIVO]: (state, { activo }) => {
        return { ...state, activo }
    },
    [CUENTA]: (state, { cuenta }) => {
        return { ...state, cuenta }
    },
    [SET_SIMBOLO]: (state, { simbolo}) => {
        return { ...state, simbolo }
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
     },
    [IDCUENTA]: (state, {idCuenta}) =>{
        return {...state, idCuenta}
    },
    [IDCUENTAESTADO]: (state, {idCuentaEstado}) =>{
        return {...state, idCuentaEstado}
    },
    [MES] : (state, {mes}) =>{
        return {...state, mes }
     },
    [ANIO]: (state, {anio}) =>{
        return {...state, anio}
    },
    [SALDO]: (state, {saldo}) =>{
        return {...state, saldo}
    },
    [ME_ESTADOCUENTA]: (state, {meEstadocuenta}) =>{
        return {...state, meEstadocuenta}
    },
    [COMENTARIO_ESTADO]: (state, {comentariosEstado}) =>{
        return {...state, comentariosEstado}
    },
    [LOADER_MOVIMIENTO_ESTADOCUENTA]: (state, {loaderMovimiento}) =>{
        return {...state, loaderMovimiento}
    },
    [SET_FILTROACTIVO_EC]: (state, {filtroActivo}) =>{
        return {...state, filtroActivo}
    }
}
export const changePage = page => ({
    type: PAGE,
    page,
});
export const initialState = {
    cargando: false,
    loaderMovimiento: false,
    page: 1,
    idCuenta: null,
    idCuentaEstado: null,
    simbolo: "",
    nuevo_estado: { },
    estado: {},
    cuenta: {},
    comentariosEstado:[],
    meEstadocuenta: {
        is_superadmin:false,
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
        }
    },
    dataEstadocuenta: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    buscador: '',
    activo: "",
    filtro:null,
    filtroActivo: null,
    rol: null,
    activo: '',
    activos: "",
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    sort: "",
    saldo: {inicio: 0, cierre: 0},
    toggleModal: false
}

export default handleActions(reducers, initialState);
