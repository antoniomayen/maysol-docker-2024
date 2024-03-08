import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions'
import { goBack } from 'react-router-redux'
import { initialize as initializeForm } from 'redux-form'
import { push } from 'react-router-redux';
import swal from 'sweetalert2';

const url = 'compras';

const LOADER_COMPRAS = 'LOADER_COMPRAS';
const LOADER_C = 'LOADER_C';
const SET_DATA_COMPRAS = 'SET_DATA_COMPRAS';
const SET_PAGE_COMPRAS = 'SET_PAGE_COMPRAS';
const SET_UPDATE_DATA_COMPRAS ='SET_UPDATE_DATA_COMPRAS';
const SET_BUSCADOR_COMPRAS = 'SET_BUSCADOR_COMPRAS';
const SET_PROYECTO_COMPRAS = 'SET_PROYECTO_COMPRAS';
const SET_FILTRO_COMPRAS = 'SET_FILTRO_COMPRAS';
const SET_EMPRESAS_COMPRAS = 'SET_EMPRESAS_COMPRAS';
const SET_FILTRO_PENDIENTES = 'SET_FILTRO_PENDIENTES';
const STEP_COMPRAS = 'STEP_COMPRAS';
const SHOW_MODAL_COMPRAS = 'SHOW_MODAL_COMPRAS';
const PAGO_TEMP = 'PAGO_TEMP';
const FECHA_TEMP = 'FECHA_TEMP';
const PROVEEDORES_COMPRAS = 'PROVEEORES_COMPRAS';
const PRODUCTOS_COMPRAS = 'PRODUCTOS_COMPRAS';

const getProveedores = () =>  (dispatch, getStore) => {
    api.get("proveedor/getTodo").catch((error) => {
        console.log("Error al obtener proveedores",error);
        dispatch({type: PROVEEDORES_COMPRAS, proveedores: []});
    }).then((data) => {
        dispatch({type: LOADER_C, loader_c: false});
        if(data){
            dispatch({type: PROVEEDORES_COMPRAS, proveedores: data});
        }
    })
};

const getProductos = () =>  (dispatch, getStore) => {
    api.get(`productos/get_fraccionesUnidad`).catch((error) => {
        console.log("Error al obtener proveedores",error);
        dispatch({type: PRODUCTOS_COMPRAS, productos: []});
    }).then((data) => {
        dispatch({type: LOADER_C, loader_c: false});
        if(data){
            dispatch({type: PRODUCTOS_COMPRAS, productos: data});
        }
    })
};

const listar = (page = 1) =>  (dispatch, getStore) => {
    dispatch({type: LOADER_C, loader_c: true});
    // parametros de búsqueda
    const store = getStore();
    const search = store.compras.buscador;
    const filtro = store.compras.fitro_compras;
    const filto_pendientes = store.compras.filtro_pendientes;
    let params = {page, search};

    if(filtro){ params['proyecto'] = filtro }
    if (filto_pendientes){ params[filto_pendientes.value] = true }
    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}/listar`, params).catch((error) => {
        console.log("Error",error);
        dispatch({type: LOADER_C, loader_c: false});
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_C, loader_c: false});
        if(data){
            dispatch({type: SET_DATA_COMPRAS, data});
            dispatch({type: SET_PAGE_COMPRAS, page});
        }
    })
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_C, loader_c: true});
    api.get(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_C, loader_c: false});
        if(error.statusCode  === 404){
            dispatch(push('/compras'))
        }
    }).then((data) => {
        dispatch({type: LOADER_C, loader_c: false});
        if(data){
            // let unidad = data.fracciones[0];
            // delete unidad.id;
            // data.fracciones.splice(0,1);
            // data = {...data, ...unidad}
            const data_detail = _.cloneDeep(data);
            data_detail.pago_automatico = data.pago_automatico === true ? 'true' : 'false';
            if (data_detail.pago_automatico){
                // setear la data del pago si fue automatico
                try{
                    const pago = data_detail.pagos[0];
                    data_detail.proveedor = {value: data.proveedor.id, label: data.proveedor.nombre};
                    data_detail.cuenta = pago.cuenta;
                    data_detail.formaPago = pago.formaPago;
                    data_detail.noComprobante = pago.noComprobante;
                    data_detail.noDocumento = pago.noDocumento;
                    data_detail.caja_chica = pago.caja_chica === true ? 'true' : 'false';
                    data_detail.caja_chica = pago.caja_chica === true ? 'true' : 'false';
                    data_detail.caja = pago.caja;
                    data_detail.categoria = pago.categoria;
                }catch(e){ }
            }
            dispatch({type: SET_UPDATE_DATA_COMPRAS, updateData: data_detail});
            dispatch(initializeForm('compra', data_detail));
        }
    })
}

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.compra.values;
    let errores = false;
    if(formData.pago_completo){
        if(!formData.pagos || formData.pagos.length <= 0){
            errores = true;
            Swal('Error','Se debe registrar por lo menos un pago para marcar el pago completo', 'error');
        }
    }
    if (formData.pago_automatico === "false"){
        /*if(!formData.pagos || formData.pagos.length <= 0){
            errores = true;
            Swal('Error','Se debe registrar por lo menos un pago', 'error');
        }*/
    }
    if(!formData.proveedor || !formData.fecha || !formData.moneda || !formData.descripcion){
        errores = true;
        Swal('Error','Se debe completar la información general de la Orden de compra', 'error');
        dispatch({type: STEP_COMPRAS, step_compras: 0})
    }
    if(!formData.productos || formData.productos.length <= 0){
        errores = true;
        Swal('Error','Se debe registrar por lo menos un producto', 'error');
        dispatch({type: STEP_COMPRAS, step_compras: 1})
    }
    if (!errores){
        dispatch({type: LOADER_C, loader_c: true});
        api.post(`${url}`, formData).then((data) => {
            Swal('Éxito', 'Se ha creado la Orden de Compra.', 'success')
                .then(() => {
                    dispatch(push('/compras'))
                })
        }).catch((error) => {
            console.log("ERror", error);
            Swal(
                'Error',
                (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
                'error'
            );
        }).finally(() => {
            dispatch({type: LOADER_C, loader_c: false});
        });
    }
};
const abonar = (orden_id) => (dispatch, getStore) => {
    const formData = getStore().form.compra.values;
    const compra = getStore().compras.updateData;
    let pagos_borrados = compra.pagos.filter((el) => !formData.pagos.includes(el));

    const data_post = {};
    data_post["pagos"] = formData.pagos;
    data_post["categoria"] = formData.categoria;
    data_post["orden_compra"] = orden_id;
    data_post["pago_completo"] = formData.pago_completo;
    data_post["pagosBorrados"] = pagos_borrados;
    dispatch({type: LOADER_C, loader_c: true});
    api.post(`compras/registrarPago`, data_post).then((data) => {
        Swal('Éxito', 'Se han actualizado los pagos exitosamente', 'success')
        .then(() => {
            dispatch(push('/compras'))
        })
    }).catch((error) => {
        console.log("ERror", error);
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_C, loader_c: false});
    });
};
const update = () => (dispatch, getStore) => {
    const formData = getStore().form.compra.values;
    const compras = getStore().compras.updateData;

    let fraccionesBorradas = compras.productos.filter((el) => {
        !formData.productos.includes(el.id)
        if (formData.productos.find(x => x.id === el.id)) {
            return
        }
        return el
    })
    formData.productosBorrados = fraccionesBorradas;
    try {
        if (formData.proveedor.id){
            formData.proveedor = formData.proveedor.id
        }
    }catch (e) {}
    dispatch({type: LOADER_C, loader_c: true})
    api.put(`${url}/${formData.id}`, formData).then((data) => {
        dispatch({type: LOADER_C, loader_c: false})
        Swal('Éxito', 'Se ha actualizado la categoria.', 'success')
        .then(() => {
            dispatch(push('/compras'))
        })
    }).catch((error) => {
        dispatch({type: LOADER_C, loader_c: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_C, loader_c: false})
    });
};
const borrar = (id, justificacion) => (dispatch) => {
    dispatch({type: LOADER_C, loader_c: true});
    api.post(`compras/anular/${id}`, {id, justificacion}).then((data) => {
        dispatch({type: LOADER_C, loader_c: false});
        swal('Éxito', 'Datos borrados correctamente.', 'success')
            .then(()=> {
                dispatch(listar(1));
            })
    }).catch((error) => {
        dispatch({type: LOADER_C, loader_c: false});
        swal('Error', (error && error.detail) ? error.detail : 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(push('/compras'));
            });
    });
};
const anularPago = (id, orden_id) => (dispatch, getState) => {
    Swal({
        title: 'Anular pago',
        text: 'Justifique la anulación',
        input: 'text',
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn-force btn-primary m-1',
        cancelButtonClass: 'btn-force btn-secondary m-1',
        confirmButtonText: 'Sí, Anular',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.value) {
            dispatch({type: LOADER_C, loader_c: true});
            const justificacion = result.value;
            api.post(`compras/anularPago/`,{id, justificacion}).catch((error) => {
                dispatch({type: LOADER_C, loader_c: false});
                swal('Error', 'No se ha logrado anular el registro.', 'error')
                    .then(() => {
                        dispatch(push(`/compras/`));
                    });
            }).then((data) => {
                dispatch({type: LOADER_C, loader_c: false});
                swal('Éxito', 'El pago se anulo correctamente', 'success')
                    .then(()=> {
                         // dispatch(detail(orden_id));
                         dispatch(push(`/compras/`));
                         // dispatch(push(`/compra/${orden_id}`));
                    })
            });
        }
    });
};
const getEmpresasSelect = () => (dispatch, getStore) => {
    let params = {principales:""}
    api.get(`proyectos/getEmpresasSelect`, params).catch((error) => {
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch({type: SET_EMPRESAS_COMPRAS, empresasSelect: data});
        }
    })
}
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_COMPRAS, buscador: search});
    dispatch(listar(1));
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_COMPRAS, fitro_compras: filtro});
    dispatch(listar(1));
};
const set_filtro_pendites = (filtro) => (dispatch) => {
    dispatch({type: SET_FILTRO_PENDIENTES, filtro_pendientes: filtro})
    dispatch(listar(1));
};
const set_step = (step_compras) => (dispatch) => {
    dispatch({type: STEP_COMPRAS, step_compras})
};
const openModalOC = () => (dispatch) => {
    dispatch({type: SHOW_MODAL_COMPRAS, showModalOC: true})
};
const closeModalOC = () => (dispatch) => {
    dispatch({type: SHOW_MODAL_COMPRAS, showModalOC: false})
};
const setPagoTemp = (key, value) => (dispatch, getStore) => {
    const store = getStore();
    const compras = store.compras;
    const pago_temp = _.cloneDeep(compras.pago_temp);
    pago_temp[key] = value;
    dispatch({type: PAGO_TEMP, pago_temp});
};
const clearPagoTemp = (cancelar) => (dispatch, getStore) => {
    const store = getStore();
    const compras = store.compras;
    const comprasForm = store.form.compra;
    const pago_temp = _.cloneDeep(compras.pago_temp);
    let valores = {}
    let pagos=0;
    let error=false;
    let saldo=0;
    let total_products=0;
    if (comprasForm && comprasForm.values){
        valores=comprasForm.values
        if (valores.pagos){
            valores.pagos.forEach((pago) => {
                if (!isNaN(pago.monto)){
                    // No sumar si esta anulado
                    if (pago.hasOwnProperty('id')){
                        if (!pago.anulado){
                            pagos += parseFloat(pago.monto);
                        }
                    } else {
                        pagos += parseFloat(pago.monto)
                    }
                }
            })
        }
        if (valores.productos){
            valores.productos.forEach((prod) => {
                if (!isNaN(prod.cantidad) && !isNaN(prod.precio_costo)){
                    total_products +=  parseFloat(prod.cantidad) *  parseFloat(prod.precio_costo);
                }
            })
        }
        saldo=(total_products - pagos).toFixed(2)
    }
    if (!cancelar)
    {
        if (parseFloat(pago_temp.monto) > parseFloat(saldo)){
            error=true;
            Swal('Error','El monto debe ser menor', 'error');
            return true;
        }
    }
    if (!error){
        const fecha = pago_temp.fecha;
        dispatch({type: PAGO_TEMP, pago_temp: {caja_chica: "false", fecha: fecha}});
    }
    
};
export const actions = {
    listar,
    detail,
    create,
    search,
    update,
    borrar,
    getEmpresasSelect,
    filtro,
    abonar,
    set_filtro_pendites,
    anularPago,
    set_step,
    openModalOC,
    closeModalOC,
    setPagoTemp,
    clearPagoTemp,
    getProveedores,
    getProductos
};

export const reducer = {
    [SET_DATA_COMPRAS]: (state, { data }) => {
        return {...state, data }
    },
    [SET_PAGE_COMPRAS]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_COMPRAS]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_COMPRAS]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_COMPRAS]: (state, { fitro_compras }) => {
        return {...state, fitro_compras }
    },
    [SET_FILTRO_PENDIENTES]: (state, { filtro_pendientes }) => {
        return {...state, filtro_pendientes }
    },
    [SET_EMPRESAS_COMPRAS]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    },
    [LOADER_C]: (state, { loader_c }) => {
        return {...state, loader_c }
    },
    [STEP_COMPRAS]: (state, { step_compras }) => {
        return {...state, step_compras }
    },
    [SHOW_MODAL_COMPRAS]: (state, { showModalOC }) => {
        return {...state, showModalOC }
    },
    [PAGO_TEMP]: (state, { pago_temp }) => {
        return {...state, pago_temp }
    },
    [FECHA_TEMP]: (state, { _fecha }) => {
        return {...state, _fecha }
    },
    [PROVEEDORES_COMPRAS]: (state, { proveedores }) => {
        return {...state, proveedores }
    },
    [PRODUCTOS_COMPRAS]: (state, { productos }) => {
        return {...state, productos }
    }
};

export const initialState = {
    loader: false,
    loader_c: false,
    page: 1,
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
        tTotal: 0,
        tPagos: 0
    },
    buscador: '',
    fitro_compras: null,
    filtro_pendientes: null,
    updateData: {},
    empresasSelect:[],
    step_compras: 0,
    showModalOC: false,
    pago_temp: {caja_chica: "false"},
    proveedores: [],
    productos: []
};

export default handleActions(reducer, initialState)
