import Swal from 'sweetalert2';
import { api } from '../../../api/api';
import { createActions, handleActions } from 'redux-actions';
import { initialize as initializeForm, change } from 'redux-form';
import { push } from 'react-router-redux';
import swal from 'sweetalert2';
import moment from 'moment';
const url = 'ventas';

const LOADER_VENTAS = 'LOADER_VENTAS';
const LOADER_MODAL_VENTAS = 'LOADER_MODAL_VENTAS';
const SET_DATA_VENTAS = 'SET_DATA_VENTAS';
const SET_DATA_PAGOS = 'SET_DATA_PAGOS';
const SET_PAGE_VENTAS = 'SET_PAGE_VENTAS';
const SET_UPDATE_DATA_VENTAS ='SET_UPDATE_DATA_VENTAS';
const SET_BUSCADOR_VENTAS = 'SET_BUSCADOR_VENTAS';
const SET_FILTRO_VENTAS = 'SET_FILTRO_VENTAS';
const SET_FILTRO_PENDIENTES = 'SET_FILTRO_PENDIENTES';
const SET_FILTROVENDEDORES_VENTAS = 'SET_FILTROVENDEDORES_VENTAS';
const STEP_VENTAS = 'STEP_VENTAS';
const SHOW_MODAL_VENTAS = 'SHOW_MODAL_VENTAS';
const SET_MODALCIERRE_VENTAS = 'SET_MODALCIERRE_VENTAS';
const PAGO_TEMP_VENTAS = 'PAGO_TEMP_VENTAS';
const FECHA_TEMP_VENTAS = 'FECHA_TEMP_VENTAS';
const PROVEEDORES_VENTAS = 'PROVEEORES_COMPRAS';
const CAJAVENTA_VENTAS = 'CAJAVENTA_VENTAS';
const SET_EMPRESAS_VENTA = 'SET_EMPRESAS_VENTA';
const PRODUCTOS_VENTAS = 'PRODUCTOS_VENTAS';
const BODEGAS_VENTAS = 'BODEGAS_VENTAS';
const ERROR_CUENTA_VENTAS = 'ERROR_CUENTA_VENTAS';
const SET_VENDEDORES_VENTAS = 'SET_VENDEDORES_VENTAS';
const FILTRO_PRODUCTOS = 'FILTRO_PRODUCTOS';
const FILTRO_CLIENTE = 'FILTRO_CLIENTE';
const SET_CUENTAS_BANCOS = 'SET_CUENTAS_BANCOS';
const SET_FILTRO_CUENTA = 'SET_FILTRO_CUENTA';

const SET_DATESTART_VENTAS = 'SET_DATESTART_VENTAS';
const SET_DATEEND_VENTAS = 'SET_DATAEND_VENTAS';

const SET_DATAHISTORIA_VENTAS = 'SET_DATAHISTORIA_VENTAS';

const getBodegas = () => (dispatch, getStore) => {
    dispatch({type: LOADER_VENTAS, loader_v: true});
    api.get(`bodegas/get_bodegas_proyecto`).catch((error) => {
        console.log("Error", error);
    }).then((data) => {
        if (data.length > 0){
                //Mutar cada bodega pra que tenga value y label
                data.forEach((bodega) =>{
                    bodega['value'] = bodega.id;
                    bodega['label'] = bodega.nombre
                })
            }
        dispatch({type: BODEGAS_VENTAS, bodegas: data});
        dispatch(getProductos(true))
    }).finally(()=>{
        dispatch({type: LOADER_VENTAS, loader_v: false});
    })
};

const getProveedores = () =>  (dispatch, getStore) => {
    api.get("cliente/getTodo").catch((error) => {
        console.log("Error al obtener proveedores",error);
        dispatch({type: PROVEEDORES_VENTAS, proveedores: []});
    }).then((data) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        if(data){
            dispatch({type: PROVEEDORES_VENTAS, proveedores: data});
        }
    })
};
const getProductos = (con_bodega= true, bodega=0) => (dispatch, getState) => {
    let params = {};
    if (getState().form.venta){
        const store = getState().form.venta.values;
        if (store.bodega && con_bodega){
            params = {id: store.bodega};
        }
    }
    if(bodega !== 0){
        params = {id: bodega};
    }
    const state = getState()
    const me = state.login.me
    const idProyecto = me.idProyecto
    dispatch({type: LOADER_VENTAS, loader_v: true});
    return api.get(`inventario/getProductosVenta/${idProyecto}`,params).catch((error) => {
        console.log("Error al leer productos.");
    }).then((data) => {
        if(data){
            if (data.length > 0){
                //Mutar cada producto pra que tenga value y label
                data.forEach((producto) =>{
                    producto['value'] = producto.id;
                    producto['label'] = producto.nombre
                })
            }
            dispatch({type: PRODUCTOS_VENTAS, productos: data})
        }
    }).finally(()=>{
        dispatch({type: LOADER_VENTAS, loader_v: false});
    })
};

const listar = (page = 1) =>  (dispatch, getStore) => {
    dispatch({type: LOADER_VENTAS, loader_v: true});
    // parametros de búsqueda
    const store = getStore();
    const search = store.ventas.buscador;
    const filtro = store.ventas.fitro_ventas;
    const filto_pendientes = store.ventas.filtro_pendientes;
    const filtro_vendedor = store.ventas.filtro_vendedores;
    const filtro_productos = store.ventas.filtro_producto;
    const filtro_cliente = store.ventas.filtro_cliente;
    let dateStart = store.ventas.dateStart;
    let dateEnd = store.ventas.dateEnd;
    let params = {page, search};

    if(filtro){ params['proyecto'] = filtro }
    if(filtro_vendedor){params['usuario'] = filtro_vendedor.value}
    if (filto_pendientes){ params[filto_pendientes.value] = true }
    if (filtro_productos) {
        const aaaa = filtro_productos.map(item => item.value);
        params['detalle_movimiento__stock__id'] = aaaa;
    }

    if(filtro_cliente) {params['proveedor__id'] = filtro_cliente.id}

    let peticion = window.location.href.search("reporte_reportventas");
    if (peticion > 0) { params['ocultarAnulados'] = true }

    if(dateStart){
        try {
            dateStart = dateStart.format("YYYY-MM-D")
        } catch (error) {
            dateStart = dateStart
        }
        params['fecha_inicial'] = dateStart;
    }
    if(dateEnd){
        try {
            dateEnd = dateEnd.format("YYYY-MM-D")
        } catch (error) {
            dateEnd = dateEnd
        }
        params['fecha_final'] = dateEnd;
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`${url}/listar`, params).catch((error) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        if(data){
            dispatch({type: SET_DATA_VENTAS, data});
            dispatch({type: SET_PAGE_VENTAS, page});
        }
    });
    dispatch(getCajaVenta());
};

const listarMovimientos = (page = 1) => (dispatch) => {
    dispatch({ type: LOADER_VENTAS, loader_v: true });
    const params = { page };

    api.get('/movimientos/get_ventas').catch((error) => {
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((dataListPagos) => {
        if (dataListPagos) {
            dispatch({ type: SET_DATA_PAGOS, dataListPagos });
            dispatch(change('cierreVenta', 'movimientos', dataListPagos.results));
            dispatch(change('cierreVenta', 'monto', 0.0));
        }
    }).finally(dispatch({ type: LOADER_VENTAS, loader_v: false }));
};

const listar_historia = (page = 1) =>  (dispatch, getStore) => {
    dispatch({type: LOADER_VENTAS, loader_v: true});
    // parametros de búsqueda
    const store = getStore();
    const search = store.ventas.buscador;
    const filtro = store.ventas.fitro_ventas;
    const filtro_vendedor = store.ventas.filtro_vendedores;
    const filtro_cuenta = store.ventas.filtro_cuenta;
    let dateStart = store.ventas.dateStart;
    let dateEnd = store.ventas.dateEnd;
    let params = {page, search};

    if(filtro){ params['proyecto'] = filtro }
    if(filtro_vendedor){params['cuenta__caja_venta__id'] = filtro_vendedor.value}
    if(filtro_cuenta){
        params['cuenta_id']= parseInt(filtro_cuenta.value)
    }
    if(dateStart){
        try {
            dateStart = dateStart.format("YYYY-MM-D")
        } catch (error) {
            dateStart = dateStart
        }
        params['fecha_inicial'] = dateStart;
    }
    if(dateEnd){
        try {
            dateEnd = dateEnd.format("YYYY-MM-D")
        } catch (error) {
            dateEnd = dateEnd
        }
        params['fecha_final'] = dateEnd;
    }
    // movimientos/estadocuenta/${proyecto}
    api.get(`cierre/getHistoricoVentas`, params).catch((error) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        if(data){
            dispatch({type: SET_DATAHISTORIA_VENTAS, data_historia: data});
            dispatch({type: SET_PAGE_VENTAS, page});
        }
    })
};
const getCajaVenta = () => (dispatch, getStore) => {
    const store = getStore();
    const parms = {};
    if (store.ventas.filtro_vendedores) parms.id = store.ventas.filtro_vendedores.value;
    api.get('cuentas/getMeCVenta', parms).catch((error) => {
        Swal(
            'Error',
            (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            dispatch({type: CAJAVENTA_VENTAS, cajaVenta: data});
        }
    });
};
const detail = id => (dispatch, getState) =>{
    dispatch({type: LOADER_VENTAS, loader_v: true});
    api.get(`${url}/${id}`).catch((error) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        if(error.statusCode  === 404){
            dispatch(push('/ventas'))
        }
    }).then((data) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        if(data){
            const data_detail = _.cloneDeep(data);
            data_detail.pago_automatico = data.pago_automatico === true ? 'true' : 'false';
            data_detail.despacho_inmediato = data.despacho_inmediato === true ? 'true' : 'false';
            data_detail.bodega = data.bodega_entrega;
            dispatch(getBodegas());
            if (data_detail.pago_automatico){
                // setear la data del pago si fue automatico
                try{
                    const pago = data_detail.pagos[0];
                    data_detail.cliente = {value: data.cliente.id, label: data.cliente.nombre};
                    data_detail.cuenta = pago.cuenta;
                    data_detail.formaPago = pago.formaPago;
                    data_detail.noComprobante = pago.noComprobante;
                    data_detail.noDocumento = pago.noDocumento;
                }catch(e){ }
            }
            //Mutar el precio costo para que sea un numero no un string
            if(data_detail.productos && data_detail.productos.length > 0){
                data_detail.productos.forEach((prod) => {
                    prod.precio_costo = parseFloat(prod.precio_costo)
                })
            }
            dispatch({type: SET_UPDATE_DATA_VENTAS, updateData: data_detail});
            dispatch(initializeForm('venta', _.cloneDeep(data_detail)));
        }
    })
};

const create = () => (dispatch, getStore) => {
    const formData = getStore().form.venta.values;
    const store = getStore().ventas;
    let errores = false;
    if(formData.pago_completo){
        if(!formData.pagos || formData.pagos.length <= 0){
            errores = true;
            Swal('Error','Se debe registrar por lo menos un pago para marcar el pago completo', 'error');
        }
    }
    if (store.error_cuenta){
        errores = true;
        Swal('Error','No se puede registrar el pago con una cuenta de diferente moneda a la Venta', 'error');
    }
    if(!formData.cliente || !formData.fecha || !formData.moneda ){
        errores = true;
        Swal('Error','Se debe completar la información general de la Orden de compra', 'error');
        dispatch({type: STEP_VENTAS, step_ventas: 0})
    }
    if(!formData.productos || formData.productos.length <= 0){
        errores = true;
        Swal('Error','Se debe registrar por lo menos un producto', 'error');
        dispatch({type: STEP_VENTAS, step_ventas: 1})
    }
    if (!errores){
        try{ formData.fecha = moment(formData.fecha).format("YYYY-MM-DD")}catch (e) {}
        dispatch({type: LOADER_VENTAS, loader_v: true});
        if (typeof formData.bodega === "object"){
            formData.bodega = formData.bodega.value
        }

        api.post(`${url}`, formData).then((data) => {
            Swal('Éxito', 'Se ha creado la Orden de Venta.', 'success')
                .then(() => {
                    dispatch(push('/ventas'))
                })
        }).catch((error) => {
            console.log("ERror", error);
            Swal(
                'Error',
                (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
                'error'
            );
        }).finally(() => {
            dispatch({type: LOADER_VENTAS, loader_v: false});
        });
    }
};
const abonar = (orden_id) => (dispatch, getStore) => {
    const formData = getStore().form.venta.values;
    const compra = getStore().ventas.updateData;
    let pagos_borrados = compra.pagos.filter((el) => !formData.pagos.includes(el));
    const data_post = {};
    data_post["pagos"] = formData.pagos;
    data_post["orden_venta"] = orden_id;
    data_post["pago_completo"] = formData.pago_completo;
    data_post["pagosBorrados"] = pagos_borrados;
    dispatch({type: LOADER_VENTAS, loader_v: true});
    api.post(`${url}/registrarPago`, data_post).then((data) => {
        Swal('Éxito', 'Se ha abonado correctamente', 'success')
        .then(() => {
            dispatch(push('/ventas'))
        })
    }).catch((error) => {
        console.log("ERror", error);
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
    });
};
const update = () => (dispatch, getStore) => {
    const formData = getStore().form.venta.values;
    const ventas = getStore().ventas.updateData;

    let fraccionesBorradas = ventas.productos.filter((el) => {
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
    dispatch({type: LOADER_VENTAS, loader_v: true})
    api.put(`${url}/${formData.id}`, formData).then((data) => {
        dispatch({type: LOADER_VENTAS, loader_v: false})
        Swal('Éxito', 'Se ha actualizado el producto.', 'success')
        .then(() => {

        })
    }).catch((error) => {
        dispatch({type: LOADER_VENTAS, loader_v: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        dispatch({type: LOADER_VENTAS, loader_v: false})
    });
};
const cierreCajaVenta = () => (dispatch, getStore) => {
    const formData = getStore().form.cierreVenta.values;
    let fecha = null;
    try{
        fecha = moment(formData.fecha).format('YYYY-MM-DD');
        if (fecha !== 'Invalid date'){
                formData.fecha = fecha
        }
    } catch (e) {formData.fecha = null}

    const movem = [];
    for (let i = 0; i<formData.movimientos.length; i++){
        if (formData.movimientos[i].estado == true) {
            movem.push(formData.movimientos[i]);
        }
    }
    formData.movimientos = movem;


    dispatch({type: LOADER_MODAL_VENTAS, loaderModal: true})
    api.post(`cierre/cierreCajaVenta`, formData).then((data) => {
        Swal('Éxito', 'Se ha cerrado la caja de venta.', 'success')
        .then(() => {
            dispatch(getCajaVenta());
            dispatch(closeModalCierre());
            dispatch(listar(1));
            dispatch(push('/ventas'));
            dispatch({type: LOADER_MODAL_VENTAS, loaderModal: false});
        })
    }).catch((error) => {
        dispatch({type: LOADER_MODAL_VENTAS, loaderModal: false})
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).finally(() => {
        
    });
}
const borrar = (id, justificacion) => (dispatch) => {
    dispatch({type: LOADER_VENTAS, loader_v: true});
    api.post(`ventas/anular/${id}`, {id, justificacion}).then((data) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        swal('Éxito', 'Datos borrados correctamente.', 'success')
            .then(()=> {
                dispatch(getCajaVenta());
                dispatch(listar(1));
            })
    }).catch((error) => {
        dispatch({type: LOADER_VENTAS, loader_v: false});
        swal('Error', (error && error.detail) ? error.detail : 'No se ha logrado borrar el registro.', 'error')
            .then(() => {
                dispatch(push('/ventas'));
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
            dispatch({type: LOADER_VENTAS, loader_v: true});
            const justificacion = result.value;
            api.post(`ventas/anularPago/`,{id, justificacion}).catch((error) => {
                dispatch({type: LOADER_VENTAS, loader_v: false});
                swal('Error', 'No se ha logrado anular el registro.', 'error')
                    .then(() => {
                        dispatch(push(`/ventas/`));
                    });
            }).then((data) => {
                dispatch({type: LOADER_VENTAS, loader_v: false});
                swal('Éxito', 'El pago se anulo correctamente', 'success')
                    .then(()=> {
                         // dispatch(detail(orden_id));
                         dispatch(push(`/ventas/`));
                         // dispatch(push(`/compra/${orden_id}`));
                    })
            });
        }
    });
};
const cambioDescuento = (valor, campo) => (dispatch, getStore) => {
    const { values: detalle, values } = _.cloneDeep(getStore().form.venta);
    let total_venta = 0;
    if (detalle.productos){
        //Calcula el total de la venta
        detalle.productos.forEach((prod) => {
            if (!isNaN(prod.cantidad) && !isNaN(prod.precio_costo)){
                total_venta += (parseFloat(prod.cantidad) * parseFloat(prod.precio_costo));
            }
        })
    }
    if (campo === "descuento") {
        if (valor){
            detalle.porcentaje = ((valor / parseFloat(total_venta)) * 100).toFixed(2);
        }
        else
            detalle.porcentaje = 0;
    } else {
        if (valor)
            detalle.descuento = ((valor / 100) * parseFloat(total_venta)).toFixed(2);
        else
            detalle.descuento = 0;
    }
    // detalle.subtotal = detalle.precio - parseFloat(detalle.descuento);
    dispatch(initializeForm('venta', {...values}));
};
const search = (search) => (dispatch, getStore) => {
    dispatch({type: SET_BUSCADOR_VENTAS, buscador: search});
    dispatch(listar(1));
    dispatch(listar_historia());
};
const set_filtro_pendites = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_PENDIENTES, filtro_pendientes: filtro});
    dispatch(listar(1));

};
const set_filtro_vendedores = (filtro) => (dispatch, getStore) => {
    if(filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTROVENDEDORES_VENTAS, filtro_vendedores: filtro});
    dispatch(listar(1))
    dispatch(listar_historia());
};
const set_filtro_cuentas = (filtro) => (dispatch, getStore) => {
    if(filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_CUENTA, filtro_cuenta: filtro});
    dispatch(listar_historia());
};


const set_filtro_producto = (filtro) => (dispatch, getStore) => {
    if(filtro == 0){
        filtro = null
    }
    dispatch({type: FILTRO_PRODUCTOS, filtro_producto: filtro});
    dispatch(listar(1))
    dispatch(listar_historia());
};
const set_filtro_cliente = (filtro) => (dispatch, getStore) => {
    if(filtro == 0){
        filtro = null
    }
    dispatch({type: FILTRO_CLIENTE, filtro_cliente: filtro});
    dispatch(listar(1))
    dispatch(listar_historia());
};
const filtro = (filtro) => (dispatch, getStore) => {
    if (filtro == 0){
        filtro = null
    }
    dispatch({type: SET_FILTRO_VENTAS, fitro_ventas: filtro});
    dispatch(listar(1));
};


const set_step = (step_ventas) => (dispatch) => {
    dispatch({type: STEP_VENTAS, step_ventas})
};
const openModalOC = () => (dispatch) => {
    dispatch({type: SHOW_MODAL_VENTAS, showModalOV: true})
};
const closeModalOC = () => (dispatch) => {
    dispatch({type: SHOW_MODAL_VENTAS, showModalOV: false})
};
const openModalCierre = () => (dispatch) => {
    dispatch({type: SET_MODALCIERRE_VENTAS, modalCierre: true})
}
const closeModalCierre = () => (dispatch) => {
    dispatch({type: SET_MODALCIERRE_VENTAS, modalCierre: false})
}
const setPagoTemp = (key, value) => (dispatch, getStore) => {
    const store = getStore();
    const ventas = store.ventas;
    const pago_temp_ventas = _.cloneDeep(ventas.pago_temp_ventas);
    pago_temp_ventas[key] = value;
    dispatch({type: PAGO_TEMP_VENTAS, pago_temp_ventas});
};
const setErrorCuenta = (value = false) => (dispatch, getStore) => {
    dispatch({type: ERROR_CUENTA_VENTAS, error_cuenta: value});
};
const clearPagoTemp = (cancelar) => (dispatch, getStore) => {
    const store = getStore();
    const ventas = store.ventas;
    const ventasForm = store.form.venta;
    let valores = {}
    let descuento=0;
    let pagos=0;
    let error=false;
    let saldo=0;
    let total_venta=0;
    const pago_temp_ventas = _.cloneDeep(ventas.pago_temp_ventas);
    if (ventasForm && ventasForm.values){
        valores=ventasForm.values
        if(valores.descuento){
            descuento = valores.descuento
        }
        if (valores.productos){
            //Calcula el total de la venta
            valores.productos.forEach((prod) => {
                if (!isNaN(prod.cantidad) && !isNaN(prod.precio_costo)){
                    total_venta += (parseFloat(prod.cantidad) * parseFloat(prod.precio_costo));
                }
            })
        }
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
        
        saldo=(total_venta - descuento - pagos).toFixed(2)
    }
    if (!cancelar)
    {
        if (parseFloat(pago_temp_ventas.monto) > parseFloat(saldo)){
            error=true;
            Swal('Error','El monto es mayor al saldo', 'error');
            return true;
        }
    }
    if (!error){
        const fecha = pago_temp_ventas.fecha;
        dispatch({type: PAGO_TEMP_VENTAS, pago_temp_ventas: {caja_chica: "false", fecha: fecha}});
    }
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
            dispatch({type: SET_EMPRESAS_VENTA, empresasSelect: data});
        }
    })
}
const getVendedoresSelect = () => (dispatch, getStore) => {
    let params = {principales:""}
    api.get(`users/getVendedores`).catch((error) => {
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            let vendedores = [];
            data.forEach(x => {
                vendedores.push({value: x.id , label: x.nombreCompleto});
            });
            dispatch({type: SET_VENDEDORES_VENTAS, vendedores: vendedores});
        }
    })
}


const getCuentasBancariasSelect = () => (dispatch, getStore) => {
    let params = {principales:""}
    api.get(`cuentas/getMeCuentasBancarias`).catch((error) => {
        Swal(
            'Error',
             (error && error.detail) ? error.detail : 'Ha ocurrido un error, por favor vuelva a intentar.',
            'error'
        );
    }).then((data) => {
        if(data){
            let cuentas = [];
            data.results.forEach(x => {
                cuentas.push({value: x.id , label: x.nombre});
            });
            dispatch({type: SET_CUENTAS_BANCOS, cuentasBancarias: cuentas});
        }
    })
}

//FILTRO DE FECHAS
const setDateStart = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATESTART_VENTAS, dateStart: date});
    dispatch(listar(1));
    dispatch(listar_historia());
}
const setDateEnd = (date) => (dispatch, getStore) => {
    dispatch({type: SET_DATEEND_VENTAS, dateEnd: date});
    dispatch(listar(1));
    dispatch(listar_historia());
}
export const actions = {
    listar,
    detail,
    create,
    search,
    update,
    borrar,
    filtro,
    set_filtro_pendites,
    abonar,
    anularPago,
    set_step,
    openModalOC,
    closeModalOC,
    openModalCierre,
    closeModalCierre,
    setPagoTemp,
    clearPagoTemp,
    getProveedores,
    getCajaVenta,
    getEmpresasSelect,
    cierreCajaVenta,
    listarMovimientos,
    getProductos,
    getBodegas,
    setErrorCuenta,
    set_filtro_vendedores,
    getVendedoresSelect,
    setDateStart,
    setDateEnd,
    listar_historia,
    set_filtro_producto,
    set_filtro_cliente,
    cambioDescuento,
    getCuentasBancariasSelect,
    set_filtro_cuentas
};

export const reducer = {
    [SET_DATA_VENTAS]: (state, { data }) => {
        return {...state, data }
    },
    [SET_DATA_PAGOS]: (state, { dataListPagos }) => {
        return {...state, dataListPagos }
    },
    [SET_PAGE_VENTAS]: (state, { page }) => {
        return {...state, page }
    },
    [SET_UPDATE_DATA_VENTAS]: (state, { updateData }) => {
        return {...state, updateData }
    },
    [SET_BUSCADOR_VENTAS]: (state, { buscador }) => {
        return {...state, buscador }
    },
    [SET_FILTRO_VENTAS]: (state, { fitro_ventas }) => {
        return {...state, fitro_ventas }
    },
    [SET_FILTRO_PENDIENTES]: (state, { filtro_pendientes }) => {
        return {...state, filtro_pendientes }
    },
    [SET_FILTROVENDEDORES_VENTAS]: (state, { filtro_vendedores }) => {
        return {...state, filtro_vendedores }
    },
    [FILTRO_PRODUCTOS]: (state, { filtro_producto }) => {
        return {...state, filtro_producto }
    },
    [FILTRO_CLIENTE]: (state, { filtro_cliente }) => {
        return {...state, filtro_cliente }
    },
    [SET_VENDEDORES_VENTAS]: (state, { vendedores }) => {
        return {...state,  vendedores}
    },
    [LOADER_VENTAS]: (state, { loader_v }) => {
        return {...state, loader_v }
    },
    [STEP_VENTAS]: (state, { step_ventas }) => {
        return {...state, step_ventas }
    },
    [SHOW_MODAL_VENTAS]: (state, { showModalOV }) => {
        return {...state, showModalOV }
    },
    [PAGO_TEMP_VENTAS]: (state, { pago_temp_ventas }) => {
        return {...state, pago_temp_ventas }
    },
    [FECHA_TEMP_VENTAS]: (state, { _fecha }) => {
        return {...state, _fecha }
    },
    [PROVEEDORES_VENTAS]: (state, { proveedores }) => {
        return {...state, proveedores }
    },
    [CAJAVENTA_VENTAS]: (state, { cajaVenta }) => {
        return {...state, cajaVenta }
    },
    [SET_MODALCIERRE_VENTAS]: (state, { modalCierre }) => {
        return {...state, modalCierre }
    },
    [LOADER_MODAL_VENTAS]: (state, { loaderModal }) => {
        return {...state, loaderModal }
    },
    [SET_EMPRESAS_VENTA]: (state, { empresasSelect }) => {
        return {...state, empresasSelect }
    },
    [PRODUCTOS_VENTAS]: (state, { productos }) => {
        return {...state, productos }
    },
    [BODEGAS_VENTAS]: (state, { bodegas }) => {
        return {...state, bodegas }
    },
    [ERROR_CUENTA_VENTAS]: (state, { error_cuenta }) => {
        return {...state, error_cuenta }
    },
    [SET_DATESTART_VENTAS]: (state, { dateStart }) => {
        return {...state, dateStart }
    },
    [SET_DATEEND_VENTAS]: (state, { dateEnd }) => {
        return {...state, dateEnd }
    },
    [SET_DATAHISTORIA_VENTAS]: (state, { data_historia }) => {
        return {...state,  data_historia}
    },
    [SET_CUENTAS_BANCOS]: (state, { cuentasBancarias }) => {
        return {...state,  cuentasBancarias}
    },
    [SET_FILTRO_CUENTA]: (state, { filtro_cuenta }) => {
        return {...state,  filtro_cuenta}
    }
};

export const initialState = {
    cuentasBancarias: [],
    filtro_cuenta: null,
    loader_v: false,
    loaderModal: false,
    page: 1,
    cajaVenta: {
        saldo: 0,
        inicio: 0,
        fecha: null,
        simbolo: 'Q'
    },
    data: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    dataListPagos: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    data_historia: {
        count: 0,
        next: null,
        previous: null,
        results: [],
    },
    buscador: '',
    fitro_ventas: null,
    filtro_pendientes: null,
    filtro_vendedores: null,
    filtro_producto: null,
    filtro_cliente: null,
    vendedores: [],
    updateData: {},
    step_ventas: 0,
    showModalOV: false,
    modalCierre: false,
    empresasSelect:[],
    pago_temp_ventas: {caja_chica: "false"},
    proveedores: [],
    productos: [],
    bodegas: [],
    error_cuenta: false,
    dateStart:  moment().subtract(15,'days'),
    dateEnd: moment(),
};

export default handleActions(reducer, initialState)
