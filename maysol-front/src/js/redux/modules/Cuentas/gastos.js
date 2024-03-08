import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { isEmpty } from '../../../utility/validation';
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import moment from 'moment';

const LOADER = 'GASTO_LOADER';
const LOADER_MOVIMIENTO_GASTO = 'LOADER_MOVIMIENTO_GASTO';
const GASTO = 'GASTO_GASTO';
const DATA = 'GASTO_DATA';
const DATACAJA = 'GASTO_DATA_CAJA';
const DATAHISTORICO = 'DATA_HISTORICO';
const PAGEHISTORICO = 'PAGE_HISTORICO';
const BUSCADORHISTORICO = 'BUSCADOR_HISTORICO';
const MISCAJAS = 'MIS_CAJAS';
const PAGE = 'GASTO_PAGE';
const NUEVO_GASTO = 'NUEVO_GASTO';
const ACTIVO = 'ACTIVO';
const BUSCADOR = 'GASTO_BUSCADOR';
const FILTRO = 'GASTO_FILTRO';
const SORT = 'GASTO_SORT';
const TOGGLEMODALCAJA = 'TOGGLEMODALCAJA';
const TOGGLEMODALHISTORIA = 'TOGGLEMODALHISTORIA';
const IDCUENTA = 'IDCUENTA';
const ANIO = 'ANIO';
const MES = 'MES';
const SALDO_CAJA = 'SALDO_CAJA';
const INFO_CIERRE = 'INFO_CIERRE';
const ESCAJA = 'ESCAJA';
const IDUSERHISTORICO = 'IDUSERHISTORICO';
const COMENTARIO_GASTOS = 'COMENTARIO_GASTOS';
const ID_CAJA_GASTOS = 'ID_CAJA_GASTOS';
const SET_DUENIO_GASTOS = 'SET_DUENIO_GASTOS';
const CAJA_FILTRO_CATEGORIA = 'CAJA_FILTRO_CATEGORIA';
export const constants = {
};

// ------------------------------------
// Actions
// ------------------------------------

export const initialLoad = () => (dispatch) => {

};
export const getMisCajas = (id) => (dispatch, getStore) => {
    dispatch({ type: LOADER, cargando: true });
    dispatch({ type: ESCAJA, esCaja: id });
    // Variables para la búsqueda y armar los parámetros
    let params;
    if (id){
        params = {caja:id}
    }
    //fin de armar los parametros
    api.get(`cierre/getMisCajas`, params).catch((error) => {
        dispatch({ type: LOADER, cargando: false });
    }).then((data) => {
        dispatch({ type: LOADER, cargando: false });

        if (data) {
            dispatch({ type: MISCAJAS, miscajas: data });
        }
    });
};
export const reintegro = (id) => (dispatch, getStore) => {
    const store = getStore();
    const idActual = store.gastos.idCuentaEstado;
    const formData = getStore().form.reintegro.values;
    const escaja = store.gastos.esCaja;
    try {
        formData.fecha = formData.fecha.format("YYYY-MM-D")

    } catch (error) {
        formData.fecha = formData.fecha
    }
    dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: true });
    api.put(`movimientos/reintegro/${id}`, formData).then((data) => {
        dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
        if(data) {
            swal('Éxito', 'Se ha guardado el reintegro.', 'success')
            .then(() => {
                dispatch(setToggleModal(false));
                if (escaja === undefined || escaja === null){
                    dispatch(getMisCajas())
                }else{
                    dispatch(getMisCajas(escaja));
                }
            })
        }
    }).catch((error) => {
        dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
        swal(
            'ERROR',
              (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
        if(error.statusCode === 404) {
            dispatch(setToggleModal(false));
        }
    })
}
export const listarGastos = (page = 1,cuenta) => (dispatch, getStore) => {
    dispatch({ type: LOADER, cargando: true });
    // Variables para la búsqueda y armar los parámetros
    const store = getStore();
    const search = store.gastos.buscador;
    const filtro = store.gastos.filtro;
    const mes = store.estadocuentas.mes;
    const anio = store.estadocuentas.anio;
    const filtro_categoria = store.gastos.filtro_categoria;
    dispatch({type: IDCUENTA, idCuenta: cuenta});
    let params = {page, search, anio: anio, mes: mes};
    if(filtro){
        params['cierre__cuenta__tipo'] = filtro;
    }
    if (filtro_categoria > 0){
        params['categoria'] = filtro_categoria;
    }
    //fin de armar los parametros
    api.get(`movimientos/listarGastos/${cuenta}`,params).catch((error) => {
        dispatch({ type: LOADER, cargando: false });
    }).then((data) => {
        dispatch({ type: LOADER, cargando: false });

        if (data) {
            dispatch({ type: DATA, data: data });

            dispatch(getSaldoCuenta(cuenta));
            dispatch(getCuenta(cuenta));
            dispatch(changePage(page));


        }
    });
};
export const cambiarFiltroCategoria = (filtro) => (dispatch, getStore) => {
    const store = getStore();
    const idActual = store.gastos.idCuenta;
    dispatch({ type: CAJA_FILTRO_CATEGORIA, filtro_categoria: filtro});
    dispatch(listarGastos(1, idActual))
};
export const getHistorico = (page = 1,cuenta) => (dispatch, getStore) => {
    dispatch({ type: LOADER, cargando: true });
    // Variables para la búsqueda y armar los parámetros
    const store = getStore();
    const search = store.gastos.buscadorHistorico;
    const filtro = store.gastos.filtro;
    let params = {page, search};
    if(filtro){
        params['cierre__cuenta__tipo'] = filtro;
    }
    if(cuenta){
        params['caja'] = cuenta
    }
    //fin de armar los parametros
    api.get(`cierre/getHistoricoCajas`,params).catch((error) => {
        dispatch({ type: LOADER, cargando: false });
    }).then((data) => {
        dispatch({ type: LOADER, cargando: false });

        if (data) {
            dispatch({ type: IDUSERHISTORICO, iduserhistorico: cuenta})
            dispatch({ type: DATAHISTORICO, dataHistorico: data });
            dispatch({type: PAGEHISTORICO, pageHistorico: page});

        }
    });
};
export const getDuenioCaja = (cuenta) => (dispatch, getStore) => {
    let params = {};
    if(cuenta){
        params['caja'] = cuenta
    }
    //fin de armar los parametros
    api.get(`cierre/getDuenioCaja`,params).catch((error) => {
    }).then((data) => {

        if (data) {
            dispatch({ type: SET_DUENIO_GASTOS, duenioGastos: data});

        }
    });
}
export const getHistoricoSinLoad = (page = 1,cuenta) => (dispatch, getStore) => {
    // Variables para la búsqueda y armar los parámetros
    const store = getStore();
    const search = store.gastos.buscadorHistorico;
    const filtro = store.gastos.filtro;
    let params = {page, search};
    if(filtro){
        params['cierre__cuenta__tipo'] = filtro;
    }
    if(cuenta){
        params['caja'] = cuenta
    }
    //fin de armar los parametros
    api.get(`cierre/getHistoricoCajas`,params).catch((error) => {
    }).then((data) => {
        console.log("asdfsfas sdf ", data)
        if (data) {
            dispatch({ type: IDUSERHISTORICO, iduserhistorico: cuenta})
            dispatch({ type: DATAHISTORICO, dataHistorico: data });
            dispatch({type: PAGEHISTORICO, pageHistorico: page});

        }
    });
};



export const editarMovimiento = (parametro) => (dispatch, getStore) => {
    const formData = getStore().form.movimiento.values;
    let fecha_recuperacion = null;
    try{
        fecha_recuperacion = moment(formData.fecha_inicio_recuperacion).format('YYYY-MM-DD');
        if (fecha_recuperacion !== 'Invalid date' && fecha_recuperacion !=='Fecha inválida'){
            formData.fecha_inicio_recuperacion = fecha_recuperacion
        }
    } catch (e) {formData.fecha_inicio_recuperacion = null}
    formData.fecha = moment(formData.fecha).format('YYYY-MM-DD');
    dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: true });
    api.put(`movimientos/${formData.id}`, formData)
    .then((data) => {
        swal('Éxito', 'Se ha editado correctamente.', 'success')
        .then(() => {
            if(parametro){
                dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
                dispatch(listarGastos(1,parametro));
                dispatch(setToggleModal(false));
                dispatch(setToggleModalHistoria(false));
            }else{
                dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
                const store = getStore();
                const idActual = store.gastos.iduserhistorico;
                dispatch(getHistoricoSinLoad(1, idActual));
                dispatch(setToggleModal(false));
                dispatch(setToggleModalHistoria(false));
                let actual = []
                dispatch({type:COMENTARIO_GASTOS, comentarioGastos: actual})
            }
            dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
        })
    })
    .catch((error) => {
        dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
        swal('Error',
         (error && error.detail) ? error.detail : 'No se ha logrado editar el registro.',
        'error')
        .then(() => {
            if (parametro){
                dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
                dispatch(setToggleModal(false));
                dispatch(setToggleModalCuenta(false))
            }else{
                dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
                const store = getStore();
                const idActual = store.gastos.iduserhistorico;
                dispatch(getHistoricoSinLoad(1, idActual));
                let actual = []
                dispatch({type:COMENTARIO_GASTOS, comentarioGastos: actual})
            }

        })
    })
}
export const anular = (id) => (dispatch, getStore) => {
    const formData = getStore().form.anulacion.values;
    const store = getStore();
    const idCuenta = store.gastos.idCuenta;
    let params = {caja:'desdecaja'}
    dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: true });
    api.put(`movimientos/anularmovimiento/${id}`, formData, params)
    .then((data) => {
        dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
        swal('Éxito', 'Se ha anulado correctamente.', 'success')
        .then(() => {
            dispatch(listarGastos(1,idCuenta));
            dispatch(setToggleModal(false));
        })
    })
    .catch((error) => {
        dispatch({ type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false });
        swal('Error',
             (error && error.detail) ? error.detail : 'No se ha logrado anular el registro.',
            'error')
        .then(() => {
            dispatch(listarGastos(1,idCuenta));
        })
    })
}
export const buscarEstado = (search) => (dispatch, getStore) => {
    let buscador = search.replace(" ", "");
    if (Number(buscador) !== Number(buscador)){
        dispatch({ type: BUSCADOR, buscador: search });
    } else {
        // buscador = `${buscador.substring(0,4)} ${buscador.substring(4,9)} ${buscador.substring(9)}`;
        // buscador = buscador.trim();
        dispatch({ type: BUSCADOR, buscador });
    }
    const store = getStore();
    const idActual = store.gastos.idCuenta;
    dispatch(listarGastos(1, idActual));
}

export const buscarHistoria= (search) => (dispatch, getStore) => {

    dispatch({ type: BUSCADORHISTORICO, buscadorHistorico: search });

    const store = getStore();
    const idActual = store.gastos.idCuenta;
    dispatch(getHistorico(1, idActual));
}

// Función para el cambio de mes
export const cambiarMes = (mes) => (dispatch, getStore) =>{
    dispatch({type:MES, mes:mes})
    const store = getStore();
    const idActual = store.gastos.idCuenta;
    dispatch(listarGastos(1, idActual));
}

// función para el cambio de año
export const cambiarAnio = (anio) => (dispatch, getStore) => {
    dispatch({type: ANIO, anio:anio});
    const store = getStore();
    const idActual = store.gastos.idCuenta;
    dispatch(listarGastos(1, idActual));
}
export const getSaldoCuenta = (cuenta) => (dispatch, getStore) => {
    const store = getStore();
    const mes = store.gastos.mes;
    const anio = store.gastos.anio;
    const idActual = store.gastos.idCuenta;
    let params = { anio: anio, mes: mes,escaja:'holi' };
    api.get(`cierre/obtenerSaldo/${cuenta}`, params).catch((error) => {
        dispatch({ type: LOADER, cargando: false });
    }).then((data) => {
        dispatch({ type: LOADER, cargando: false });

        if (data) {
            let saldo = {
                monto: data.saldo
            }
            dispatch({ type: SALDO_CAJA, saldocaja: data });
            dispatch(initializeForm('reintegro', saldo))
        }
    });
}
export const cierreCajaChica = () => (dispatch, getStore) => {
    const store = getStore();
    const idActual = store.estadocuentas.idCuenta;
    let formData = {cuenta: 'random'}
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
                dispatch(listarGastos(1, null));
            })
        }
    })

}

export const crearGasto = (parametro, destino) => (dispatch, getStore) =>{
    const formData = getStore().form.movimiento.values;
    const store = getStore();
    const mes = store.gastos.mes;
    const anio = store.gastos.anio;
    let params = { anio: anio, mes: mes, tipo: 20, destino: destino, cierrecaja: parametro};

    // formData.cuenta = parametro;
    try {
        formData.fecha =  moment(formData.fecha).format("YYYY-MM-DD");
    } catch (error) {
        formData.fecha = formData.fecha
    }
    formData.destino = destino
    formData.tipo = formData.tipo = 20
    dispatch({type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: true});
    api.post(`movimientos`, formData, params).catch((error) => {
        dispatch({type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false});
        swal(
            'ERROR',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, verifique los datos y vuelva a intentar.',
            'error'
        );
        if(error.statusCode === 404) {
            dispatch(setToggleModal(false));
            dispatch(setToggleModalCuenta(false))
        }
    }).then((data) => {
        dispatch({type: LOADER_MOVIMIENTO_GASTO, cargandoMovimiento: false});
        if(data) {
            swal('Éxito', 'Se ha guardado el gasto.', 'success')
            .then(() => {


                    dispatch(listarGastos(1,parametro));
                    dispatch(setToggleModal(false));

            })
        }
    })
}
export const getCuenta = id => async (dispatch, getStore) => {
    const store = getStore();
    const mes = store.estadocuentas.mes;
    const anio = store.estadocuentas.anio;
    let params = { anio: anio, mes: mes, caja:'caja' };
    dispatch({type: LOADER, cargando: true});
    api.get(`cierre/getCierre/${id || 0}`, params).catch((error) => {
        dispatch({type: LOADER, cargando: true});
        // if(error.statusCode === 404){
        //     dispatch(push('/cuentas'));
        // }
    }).then((data) => {
        if(data){
            const cuenta = data
            dispatch({type: INFO_CIERRE, infoCierre: cuenta});

        }
        dispatch({type: LOADER, cargando: false});
    });
}



export const cambiarFiltro = (filtro) => (dispatch, getStore) =>{
    const store = getStore();
    const idActual = store.gastos.idCuenta;
    let valor= null;
    if(filtro==='true'){
        //verifica los Cuenta
       valor = 10;
    } else if(filtro==='false'){
        // verifica los Caja
        valor = 30;
    }else{
        valor = null;
    }
    dispatch({type: ACTIVO, activo: filtro})
    dispatch({type: FILTRO, filtro: valor});
    dispatch(listarGastos(1, idActual));
}
export const borrarGasto = (id) => (dispatch, getState) => {
    dispatch({type: LOADER, cargando: true});
    api.eliminar(`movimientos/${id}`).catch((error) => {
        dispatch({type: LOADER, cargando: false});
        swal('Error', 'No se ha logrado borrar el registro.', 'error')
            .then(()=> {
                dispatch(push('/gastos'));
            })
    }).then((data)=>{
        dispatch({type: LOADER, cargando: false});
        swal('Éxito', 'Datos borrados correctamente.', 'success')
            .then(()=> {
                dispatch(listarGastos(1,getState().gastos.idCuenta));
            })
    })
}
export const setFormReintegro = () => (dispatch, getStore) => {
    const store = getStore();
    const infoCierre = store.gastos.infoCierre;
    const saldocaja = store.gastos.saldocaja;
    // console.log(infoCierre)
    let fecha = new Date(infoCierre.fechaInicio );
    fecha = `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`
    let saldo = {
        monto: saldocaja.saldo,
        fecha: fecha
    }
    dispatch(initializeForm('reintegro', saldo))
}
export const setToggleModal = (estado) => (dispatch, getState) => {
    dispatch({type: TOGGLEMODALCAJA, toggleModalCaja: estado})
}
export const setToggleModalHistoria = (estado) => (dispatch, getState) => {
    dispatch({type: TOGGLEMODALHISTORIA, toggleModalHistoria: estado})
}
export const verficarDatosComentarioGasto = (value) => (dispatch, getStore) =>{
    const comentarios = getStore().gastos.comentarioGastos
    if (comentarios.length === 0){
        let nuevo = comentarios
        nuevo.push(value)
        dispatch({type: COMENTARIO_GASTOS, comentarioGastos: nuevo})
    }else{
        comentarios.forEach(item => {
            if (!_.find(comentarios, { id: value.id })) {
                let nuevo = comentarios
                nuevo.push(value)
                dispatch({type: COMENTARIO_GASTOS, comentarioGastos: nuevo})
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
    [GASTO]: (state, { gasto }) => {
        return { ...state, gasto }
    },
    [DATA]: (state, { data }) => {
        return { ...state, data }
    },
    [INFO_CIERRE]: (state, {infoCierre}) =>{
        return {...state, infoCierre}
    },
    [DATACAJA]: (state, { dataCaja }) => {
        return { ...state, dataCaja }
    },
    [MISCAJAS]: (state, { miscajas }) => {
        return { ...state, miscajas }
    },
    [PAGE]: (state, { page }) => {
        return {
            ...state,
            page,
        };
    },
    [NUEVO_GASTO]: (state, { nuevo_gasto }) => {
        return { ...state, nuevo_gasto }
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
    [TOGGLEMODALCAJA] : (state, {toggleModalCaja}) =>{
        return {...state, toggleModalCaja }
     },
     [TOGGLEMODALHISTORIA] : (state, {toggleModalHistoria}) =>{
        return {...state, toggleModalHistoria }
     },
     [IDCUENTA] : (state, {idCuenta}) =>{
         return {...state, idCuenta }
      },
    [MES] : (state, {mes}) =>{
        return {...state, mes }
    },
    [ANIO]: (state, {anio}) =>{
        return {...state, anio}
    },
    [SALDO_CAJA]: (state, {saldocaja}) =>{
        return {...state, saldocaja}
    },
    [DATAHISTORICO]: (state, {dataHistorico}) =>{
        return {...state, dataHistorico}
    },
    [PAGEHISTORICO]: (state, {pageHistorico}) =>{
        return {...state, pageHistorico}
    },
    [BUSCADORHISTORICO]: (state, {buscadorHistorico}) =>{
        return {...state, buscadorHistorico}
    },
    [ESCAJA]: (state, {esCaja}) =>{
        return {...state, esCaja}
    },
    [IDUSERHISTORICO]: (state, {iduserhistorico}) =>{
        return {...state, iduserhistorico}
    },
    [COMENTARIO_GASTOS]: (state, {comentarioGastos}) =>{
        return {...state, comentarioGastos}
    },
    [ID_CAJA_GASTOS]: (state, {idCajaGastos}) =>{
        return {...state, idCajaGastos}
    },
    [LOADER_MOVIMIENTO_GASTO]: (state, {cargandoMovimiento}) =>{
        return {...state, cargandoMovimiento}
    },
    [SET_DUENIO_GASTOS]: (state, {duenioGastos}) =>{
        return {...state, duenioGastos}
    },
    [CAJA_FILTRO_CATEGORIA]: (state, {filtro_categoria}) =>{
        return {...state, filtro_categoria}
    },
};
export const changePage = page => ({
    type: PAGE,
    page,
});
export const initialState = {
    cargando: false,
    duenioGastos: {nombre: ""},
    cargandoMovimiento: false,
    page: 1,
    infoCierre:{},
    idCuenta: null,
    miscajas: [],
    iduserhistorico: null,
    idCajaGastos: null,
    nuevo_gasto: { },
    buscadorHistorico: '',
    gasto: {},
    comentarioGastos: [],
    data: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    dataCaja: {
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    dataHistorico:{
        count: 0,
        next: null,
        previous: null,
        results: []
    },
    pageHistorico: 1,
    buscador: '',
    filtro: null,
    rol: null,
    activo: "",
    activos: "",
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    sort: "",
    esCaja: null,
    saldocaja: {inicio: 0, cierre:null},
    toggleModalCaja: false,
    toggleModalHistoria: false,
    filtro_categoria: 0
}

export default handleActions(reducers, initialState);
