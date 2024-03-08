import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray, FormSection } from 'redux-form';
import {
    renderField, renderTextArea, renderSearchSelect, renderSelectField, renderFieldCheck, renderPercentage,
    renderCreateSelect, renderNoAsyncSelectField, renderNumber, renderCurrency
}
    from '../../../Utils/renderField/renderField';
import { api } from '../../../../../api/api';
import { connect } from 'react-redux'
import validador from './validate'
import { opcionesBanco, gastoCaja, Monedas, opcionesVenta } from '../../../../utility/constants';
import renderDatePickerNoLimit from 'Utils/renderField/renderDatePickerNoLimit'
import { formatoMoneda } from 'Utils/renderField/renderReadField'
import Stepper from 'react-stepper-horizontal';
import {BreakLine} from "../../../Utils/tableOptions";
import { TableHeaderColumn } from 'react-bootstrap-table'
import { BootstrapTable } from 'react-bootstrap-table';
import Modal from 'react-responsive-modal';
import moment from 'moment';

const cuentas = [];
const cajas = [];

const getCuentas = (search) => {
    return api.get(`cuentas`).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        // this.props.setCuentas(data.results);
        data.results.forEach(item => {
            if (!_.find(cuentas, { id: item.id })) {
                cuentas.push(item);
            }
        });
        return { options: cuentas }
    })
};

export const render_Productos = ({fields, meta: {error, submitFailed}, valores, no_mod, productos, simbolo}) => {
    let total = 0;
    return(
        <Fragment>
            <div className="col-sm-12 form-group">
                {/*Encabezado de productos en modo Escritorio*/}
                <div className="row ver-escritorio-flex">
                    <div className="col-12 col-md-3"><label htmlFor="fecha">Producto y presentación:</label></div>
                    <div className="col-12 col-md-2 px-0"><label htmlFor="cuenta">Precio:</label></div>
                    <div className="col-10 col-md-1 p-0 m-0"><label htmlFor="cuenta">Existencias:</label></div>
                    <div className="col-12 col-sm-2"><label htmlFor="cuenta">Cantidad:</label></div>
                    <div className="col-12 col-sm-3"><label htmlFor="cuenta">Subtotal:</label></div>
                    <div className="col-12 col-sm-1"><label htmlFor="cuenta">&nbsp;</label></div>
                </div>
                {fields.map((producto, index) => {
                    let todos = fields.getAll(); //Obtiene todos los productos
                    const prod_actual = fields.get(index); //Obtiene el producto actual
                    let precios_prod = [];
                    let existencias_prod = 0;
                    let subtotal_prod = 0;

                    todos[index]['index'] = index; //Mutar cada fila par agregarle el index
                    todos[index]['simbolo'] = simbolo; //Mutar cada fila par agregarle el simbolo
                    if (prod_actual['producto'] !== undefined){
                        try{
                            const _prod = _.find(productos, {'id': parseInt(prod_actual['producto'])});
                            todos[index]['producto_nombre'] = _prod.nombre;
                            existencias_prod = _prod.cantidad;
                            _prod[valores.moneda].forEach((precio) => {
                                precio.precioD.forEach(precioD => {
                                    precios_prod.push({value: precioD.precio, label: formatoMoneda(precioD.precio, simbolo)});
                                })
                            })
                            // todos[index]['producto_nombre'] = _prod.nombre;
                        }catch (e) {}
                    }
                    if (!isNaN(prod_actual.cantidad) && !isNaN(prod_actual.precio_costo)){
                        subtotal_prod = prod_actual.cantidad * prod_actual.precio_costo;
                        total += prod_actual.cantidad * prod_actual.precio_costo;
                    }
                    if (valores.despacho_inmediato === "false" && todos[0]['producto'] === undefined){
                        try{
                            const prod = productos[0];
                            todos[0]['producto'] = prod.id;
                            todos[0]['precio_costo'] = prod.precios[0]
                        }catch (e) {}
                    }
                    //Si selecciono el producto pero no el precio entonce lo establece
                    if (prod_actual['producto'] !== undefined && prod_actual['precio_costo'] === undefined){
                        try{
                            prod_actual['precio_costo'] = precios_prod[0]['value']
                        }catch (e) {}
                    }
                    //Si selecciono el producto y ya tiene un precio compara si pertecene a ese producto
                    if (prod_actual['producto'] !== undefined && prod_actual['precio_costo'] !== undefined){
                        try{
                            const precio = _.find(precios_prod, {value: parseFloat(prod_actual['precio_costo'])});
                            //Si el precio actual no pertenece a los precios del producto coloca el primero
                            if (precio === undefined){
                                prod_actual['precio_costo'] = precios_prod[0]['value']
                            }
                        }catch(e){}
                    }
                    return(
                        <div key={index} className={ index !== 0 ? 'mt-3 border-naranja-movil py-4 py-sm-0 mb-2 mb-sm-0' : 'border-naranja-movil py-4 py-sm-0 mb-2 mb-sm-0'}>
                            {!no_mod && (<div className="float-right mt-2 mr-2 ver-movil-flex">
                                <button type="button" className="btn btn-danger btn-normal"
                                        onClick={() =>{
                                            fields.remove(index)
                                        }}>X
                                </button>
                            </div>)}
                            <div className="row">
                                <div className="col-12 col-md-3">
                                    <label className="ver-movil">Producto y presentación:</label>
                                    <Field
                                        disabled={no_mod}
                                        name={`${producto}.producto`}
                                        valueKey="id"
                                        labelKey="nombre"
                                        label="nombre"
                                        component={renderSelectField}
                                        options={productos}
                                    />
                                </div>
                                <div className="col-12 col-md-2 px-md-0">
                                    <label className="ver-movil">Precio:</label>
                                    <Field
                                        name={`${producto}.precio_costo`}
                                        searchable={false}
                                        disabled={no_mod}
                                        valueKey="value"
                                        labelKey="label"
                                        label="label"
                                        addClass="text-center"
                                        component={renderNoAsyncSelectField}
                                        options={precios_prod}
                                    />
                                </div>
                                <div className="col-12 col-sm-1 d-flex justify-content-center align-content-center">
                                    <label className="ver-movil">Existentes:</label>
                                    <p className="pt-2"><strong className={valores.despacho_inmediato === "true" ? 'rojo' : 'azul'}>
                                        {existencias_prod}</strong></p>
                                </div>
                                <div className="col-12 col-sm-2">
                                    <label className="ver-movil">Cantidad:</label>
                                    <Field
                                        disabled={no_mod}
                                        name={`${producto}.cantidad`}
                                        type="number"
                                        component={renderField}
                                        placeholder="Cantidad"
                                    />
                                    {(valores.despacho_inmediato == "true" && (prod_actual.cantidad > existencias_prod))
                                    &&(<div className="required-text">
                                        Cantidad supera las existencias
                                    </div>)}
                                </div>
                                <div className="col-12 col-sm-3">
                                    <label className="ver-movil">Subtotal:</label>

                                    <Field
                                        disabled={true}
                                        name={`${producto}.subtotal`}
                                        type="text"
                                        addClass="text-right"
                                        simbolo={simbolo}
                                        decimalScale={2}
                                        component={renderNumber}
                                        placeholder="Costo"
                                        input = {{value: `${subtotal_prod}`}}
                                    />
                                </div>
                                {!no_mod && (<div className="col-1 px-0 mx-0 ver-escritorio">
                                    <button type="button" className="btn btn-danger btn-normal"
                                            onClick={() =>{
                                                fields.remove(index)
                                            }}>X
                                    </button>
                                </div>)}
                            </div>
                        </div>)})}
                <div className="row pt-3">
                    <div className={`col-0 col-sm-4 col-md-1 col-lg-3`}>
                    </div>
                    <div className="col-12 col-sm-4 col-md-5 col-lg-5 mr-0 mr-lg-2 text-center">
                        {!no_mod && (<button name="btnProductos" className="btn btn-celeste"
                                             onClick={(e) =>{e.preventDefault(); fields.push({})}}>
                            Agregar producto
                            <i className="fa fa-plus ml-2" aria-hidden="true" />
                        </button>)}
                        <Field name="errorProd" component={renderField} type="text" disabled={true} addClass={'ocultar'}/>
                    </div>
                    <div className="col-12 col-sm-6 col-md-5 col-lg-3 text-right">
                        <div className="row">
                            <div className="col-2 mx-0 px-0">
                                <label className="text-m">Total</label>
                            </div>
                            <div className="col-8 ml-0 pl-0 ">
                                <label className="rojo text-m">{formatoMoneda(total, simbolo)}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-1">
                    </div>
                </div>
            </div>
        </Fragment>
    )
};
const TablaProductos = (productos) => {
    const _data = (productos !== undefined && productos !== null) ? productos.productos : [];
    const data = {results: _data};
    function subtotal(cell, row) {
        const sub = parseInt(row.cantidad) * parseFloat(row.precio_costo);
        return  <div>{formatoMoneda(sub, row.simbolo)}</div>
    };
    return(
        <BootstrapTable
            data={_data}>
            <TableHeaderColumn tdStyle={BreakLine} thStyle={BreakLine} isKey={true}
                               dataField="producto_nombre">Producto</TableHeaderColumn>
            <TableHeaderColumn tdStyle={BreakLine} thStyle={BreakLine}
                               dataField="cantidad" dataAlign="center">Cantidad</TableHeaderColumn>
            <TableHeaderColumn tdStyle={BreakLine} thStyle={BreakLine}
                               dataField="precio_costo" dataAlign="right" dataFormat={formatoMoneda}>Costo unitario</TableHeaderColumn>
            <TableHeaderColumn tdStyle={BreakLine} thStyle={BreakLine} dataFormat={subtotal} dataAlign="right"
                               dataField="total">Sub total</TableHeaderColumn>
        </BootstrapTable>
    )
};
export const renderPagos = ({fields, meta: {error, submitFailed}, no_mod, anularPago, orden_id, show, abrir, cerrar,
                                pago_temp, setPagoTemp, clearPagoTemp, simbolo, setError, error_cuenta}) => {
    let no_trans = "No Transacción";
    let moneda_cuenta = "GTQ";
    if (pago_temp.formaPago){
        try {
            const transac = _.find(opcionesVenta, {'value': pago_temp.formaPago});
            no_trans = transac.documento;
        } catch (e) {}
    }
    setError(false);
    try{
        const cuenta_select = _.find(cuentas, {'id': pago_temp.cuenta});
        moneda_cuenta = cuenta_select.moneda;
        if (cuenta_select.simbolo !== simbolo){
            setError(true)
        }
    } catch (e) {
        moneda_cuenta = 'GTQ';
    }
    return(
        <div>
            <Modal open={show} onClose={()=> {cerrar()}} >
                <div  style={{ Width: '100%' }}>
                    <div className="modal-header">
                        <div className="panel-body">
                            <span className="reset-caption">Registrar nuevo abono</span>
                        </div>
                    </div>
                    <div className="modal-body form-group ">
                        {/*Contenido del Abono*/}
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor=".fecha">Fecha*:</label>
                                <Field
                                    disabled={false}
                                    name={`_fecha`}
                                    className=""
                                    component={renderDatePickerNoLimit}
                                    placeholder="Fecha"
                                    numberOfMonths={1}
                                    onChange={(e) => {
                                        try{
                                            pago_temp['fecha'] = moment(e).format('YYYY-MM-DDTmm:ss')
                                        }catch (e) {
                                            pago_temp['fecha'] = ""
                                        }
                                    }}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="_formaPago">Forma de pago:</label>
                                <Field name="_formaPago" component={renderSelectField}
                                       type="select" labelKey="label" valueKey="value"
                                       options={opcionesVenta}
                                       input = {{value: pago_temp['formaPago'], onChange:(e) => {
                                               setPagoTemp('formaPago', e.target.value);
                                           }}}
                                />
                            </div>
                            {(pago_temp.formaPago !== "10" && pago_temp.formaPago !== "40") &&(<div className="col-md-4">
                                <label htmlFor="cuenta">Cuenta</label>
                                <div className="row mx-0 px-0">
                                    <div className={`form-group col-md-10 pl-0 ml-0`}>
                                        <Field name={`_cuenta`} valueKey="id"
                                               labelKey="nombre" label="nombre" component={renderSearchSelect}
                                               loadOptions={getCuentas}
                                               input = {{value: pago_temp['cuenta'],  onChange: (e) => {
                                                       return e
                                                   }}}
                                               onCambio={(e) => {
                                                   setPagoTemp('cuenta', e.id);
                                               }}
                                        />
                                    </div>
                                    {(pago_temp.cuenta || pago_temp.caja) && (<div className="col-md-1 pl-0 ml-0">
                                        <label className="pt-2 texto-monedas">{moneda_cuenta}</label>
                                    </div>)}
                                </div>
                                {(pago_temp['cuenta'] && error_cuenta) && <div className="required-text">
                                    No puede pagar con una cuenta de moneda diferente
                                </div>}
                            </div>)}
                            <div className="col-md-4">
                                <label htmlFor="_noDocumento">No. Documento:</label>
                                <Field  disabled={false} name="_noDocumento" component={renderField}
                                        type="text" className="form-control"
                                        input = {{value: pago_temp['noDocumento'], onChange:(e) => {
                                                setPagoTemp('noDocumento', e.target.value);
                                            }}}
                                />
                            </div>
                            {pago_temp.formaPago !== "10" &&(<div className="col-md-4">
                                <label htmlFor="_noComprobante">{`${no_trans}:`}</label>
                                <Field name="_noComprobante" component={renderField}
                                       type="text" className="form-control"
                                       input = {{value: pago_temp['noComprobante'], onChange: (e) => {
                                               setPagoTemp('noComprobante', e.target.value);
                                           }}}
                                />
                            </div>)}
                            <div className="col-md-4">
                                <label htmlFor="_monto">{`Monto`}</label>
                                <Field name="_monto" component={renderField}
                                       type="number" className="form-control" disabled={false}
                                       input = {{value: pago_temp['monto'], onChange:(e) => {
                                               setPagoTemp('monto', e.target.value);
                                           }}}
                                />
                            </div>
                        </div>
                        {(pago_temp.formaPago === "10" || pago_temp.formaPago === "40") &&(<div className="col-12 pt-1 px-0 text-center">
                            <span className="rojo">¡EL MONTO A RECIBIR INGRESARA A SU CAJA DE VENTAS!</span>
                        </div>)}
                        <div className="row pt-3">
                            <div className="col-12">
                                <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                    <button className="btn btn-secondary m-1" onClick={(e) => {
                                        e.preventDefault();
                                        clearPagoTemp(true);
                                        cerrar()
                                    }}>Cancelar</button>
                                    <button className="btn btn-primary m-1" onClick={(e) => {
                                        e.preventDefault();
                                        if (!error_cuenta || (pago_temp.formaPago === "10" ||
                                            pago_temp.formaPago === "40")){     
                                            if (!clearPagoTemp()){
                                                fields.push(pago_temp);
                                                cerrar()
                                            }            
                                        }
                                    }}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="row px-4">
                <div className="col-12 col-md-3 col-sm-4">
                    <label className="rojo mt-2">PAGO AL CRÉDITO</label>
                </div>
                <div className="col-0 col-sm-2 col-md-4 col-lg-5">
                </div>
                <div className="col-12 col-md-6 col-lg-4 text-right">
                    {!no_mod &&(<button className="btn btn-celeste" onClick={(e) => {
                        e.preventDefault();
                        abrir()
                    }}>Registrar nuevo abono</button>)}
                </div>
            </div>
            {/*Tabla de abonos*/}
            <div className="row col-sm-12 p-0 m-0">
                <div className="col-sm-12 form-group np-r mt-2 sin-borde p-0">
                    <table className="react-bs-container-body table table-sm  m-0 react-bs-table-container">
                        <tbody>
                        <tr className="header-tabla font-italic react-bs-container-header">
                            <th style={{width: "14%"}} >Fecha</th>
                            <th style={{width: "14%"}} className="ver-escritorio-cell">No Documento</th>
                            <th style={{width: "14%"}} >Forma de pago</th>
                            <th style={{width: "14%"}} className="ver-escritorio-cell">No transacción</th>
                            <th style={{width: "14%"}} >Abono</th>
                            <th style={{width: "5%"}} ></th>
                        </tr>
                        {fields.map((pago, index) => {
                            const pagos = fields.getAll(); // Obtiene todos los pagos
                            let _forma_pago = "";

                            const pago_actual = fields.get(index); // Pago actual

                            pagos[index]['moneda'] = 'GTQ'; //Mutar cada fila par agregarle la moneda
                            pagos[index]['simbolo'] = 'Q'; //Mutar cada fila par agregarle el
                            //Si no es efectivo y cheque entonces setea la moneda de la cuenta
                            if(pago_actual.formaPago !== "10" && pago_actual.formaPago !== "40"){
                                try{const cuenta_select = _.find(cuentas, {'id': pago_actual.cuenta});
                                    pagos[index]['moneda'] = cuenta_select.moneda; //Mutar cada fila par agregarle la moneda
                                    pagos[index]['simbolo'] = cuenta_select.simbolo; //Mutar cada fila par agregarle el simbolo
                                } catch (e) {}
                            }
                            try {
                                const fomaPago_select = _.find(opcionesVenta, {'value': pago_actual.formaPago})
                                _forma_pago = fomaPago_select.label
                            }catch (e) {}

                            return(
                                <tr key={index}>
                                    <td className="sin-borde-top">
                                        <span className={pago_actual.anulado ? 'tachar': ''}>
                                            {/*{pago_actual.fecha.format("MM/DD/YYYY")}*/}
                                         {moment(pago_actual.fecha).format("DD/MM/YYYY")}
                                        </span>
                                    </td>
                                    <td className="sin-borde-top ver-escritorio-cell">
                                        <span className={pago_actual.anulado ? 'tachar': ''}>
                                            {pago_actual.noDocumento}
                                        </span>
                                    </td>
                                    <td className="sin-borde-top">
                                        <span className={pago_actual.anulado ? 'tachar': ''}>
                                            {pago_actual.hasOwnProperty('id') ? pago_actual.formaPago_nombre : _forma_pago}
                                        </span>
                                    </td>
                                    <td className="sin-borde-top ver-escritorio-cell">
                                        <span className={pago_actual.anulado ? 'tachar': ''}>
                                            {pago_actual.noComprobante}
                                        </span>
                                    </td>
                                    <td className="sin-borde-top text-right">
                                        <span className={pago_actual.anulado ? 'tachar': ''}>
                                            {formatoMoneda(pago_actual.monto, pago_actual.simbolo)}
                                        </span>
                                    </td>
                                    <td className="text-center sin-borde-top" style={{width: "10%"}}>
                                        {(!no_mod && !pago_actual.anulado) && (<img onClick={() =>{
                                            if (pago_actual.hasOwnProperty('id')){
                                                anularPago(pago_actual.id, orden_id)
                                            } else{
                                                fields.remove(index)
                                            }
                                        }} className="action-img" title="Eliminar"
                                                                                    src={require("../../../../../../assets/img/icons/delete.png")} alt="Delete" />)}
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

let VentaForm = props => {
    //Valores
    const { handleSubmit, editar, updateData, step, valores, productos, total_venta, no_trans, proveedores, showModalOV,
        descuento_total,
        orden_id, pago_temp_ventas, pagos_monedas, bodegas, simbolo_venta, error_cuenta, simbolo_cuenta,
        count_productos} = props;
    //Funciones
    const {anularPago, openModalOC, set_step, getProductos, closeModalOC, setPagoTemp, getBodegas, setErrorCuenta,
            cambioDescuento} = props;
    let no_modificar = false;
    let no_modificar_pagos = false;
    let abonar = false;
    const has_cuenta= false;

    if(editar && updateData){
        no_modificar = true
        // no_modificar = updateData.pago_automatico === "true" || updateData.ingresado;
        no_modificar_pagos = updateData.pago_completo;
        // if(updateData.pagos !== undefined && updateData.pagos.length > 0){
        //     no_modificar = true
        // }
        if(!updateData.pago_completo){
            abonar = true;
        }
        // if(!updateData.ingresado && !updateData.pago_completo && updateData.pagos !== undefined && updateData.pagos.length > 0 ){
        //     abonar = true;
        // }
    }
    // if (valores.pago_automatico == "true"){
    //     if (simbolo_cuenta !== simbolo_venta){
    //         setErrorCuenta(true)
    //     }else{
    //         setErrorCuenta(false)
    //     }
    // }

    let total_final = Number(parseFloat(total_venta).toFixed(2)) -  Number(parseFloat(descuento_total).toFixed(2));
    // console.log("PRecios")
    // console.log("Total venta",total_venta)
    // console.log('descuento', descuento_total)
    // console.log('final', total_final)
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                {/*Cliente*/}
                {step === 0 &&(<div className="row pb-4 px-0 px-sm-3">
                    <div className="row">
                        <div className="col-12">
                            <label className="rojo">Cliente:</label>
                        </div>
                    </div>
                    <div className="row px-0 px-md-3">
                        <div className="col-md-4 pr-sm-1">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="proveedor">Cliente*:</label>
                                </div>
                                <div className="col-md-8">
                                    <Field
                                        disabled={no_modificar}
                                        name='cliente'
                                        valueKey="id"
                                        labelKey="nombre"
                                        component={renderCreateSelect}
                                        opciones={proveedores}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 pr-0 mr-0">
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="presentacion">Fecha*:</label>
                                </div>
                                <div className="col-md-9 form-group">
                                    <Field
                                        disabled={no_modificar}
                                        name="fecha"
                                        className=""
                                        component={renderDatePickerNoLimit}
                                        placeholder="Fecha"
                                        numberOfMonths={1}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="presentacion">Moneda*:</label>
                                </div>
                                <div className="col-md-9 form-group">
                                    <Field
                                        disabled={no_modificar}
                                        name="moneda"
                                        component={renderSelectField}
                                        type="select"
                                        labelKey="label"
                                        valueKey="value"
                                        placeholder="Fecha"
                                        options={Monedas}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="row">
                                <div className="col-md-2">
                                    <label htmlFor="descripcion">Notas:</label>
                                </div>
                                <div className="col-md-10 ml-0 pl-0">
                                    <Field
                                        disabled={no_modificar}
                                        name="descripcion"
                                        component={renderTextArea}
                                        type="number"
                                        className="form-control" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)}
                {/*Fin Cliente*/}

                {/*Productos*/}
                {step === 1 &&(<div className="row pb-4 px-0 px-sm-3">
                    {/*Datos del tab anterios -Cliente-*/}
                    <div className="row col-12">
                        <div className="col-12 col-md-4">
                            <label className="quit-uppercase">Cliente: <span className="text-primary text-uppercase">
                                {(typeof valores.cliente === 'object' ? valores.cliente.label : valores.cliente)}
                            </span></label>
                        </div>
                        <div className="col-12 col-md-4">
                            <label className="quit-uppercase">Fecha: <span className="text-primary text-uppercase">
                                  {(valores.fecha && typeof valores.fecha !== 'string') && valores.fecha.format("MM/DD/YYYY")
                                  || (typeof valores.fecha === 'string') && valores.fecha}</span></label>
                        </div>
                        <div className="col-12 col-md-12">
                            <label className="quit-uppercase">Descripción: <span className="text-primary text-uppercase">{valores.descripcion}</span></label>
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-center bd-highlight mb-3 mt-2">
                        <div className="col-12 col-lg-8 text-center border-naranja py-3">
                            <div className="row d-flex justify-content-center">
                                <div className="d-flex justify-content-center align-content-center col-12 col-md-6 col-lg-4 px-0">
                                    <div className="d-inline-block">
                                        <Field name="despacho_inmediato"  disabled={no_modificar}  component="input"
                                               type="radio" value={"true"} onChange={()=>{getBodegas()}}/>
                                    </div>
                                    <div className="pl-2 pr-4 d-inline-block">
                                        <label htmlFor="despacho_inmediato" className={valores.despacho_inmediato == "true" ? 'rojo': ''}>Despacho inmediato&nbsp;&nbsp;</label>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center align-content-center col-12 col-md-6 col-lg-4 px-0">
                                    <div className="d-inline-block">
                                        <Field name="despacho_inmediato"  disabled={no_modificar}  component="input" type="radio" value={"false"}
                                               onChange={()=>{getProductos(false)}} />
                                    </div>
                                    <div className="pl-2 d-inline-block">
                                        <label htmlFor="despacho_inmediato" className={valores.despacho_inmediato != "true" ? 'rojo': ''}>Venta previa a despacho</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*<label className="">TOTAL*/}
                        {/*<span className="rojo"> Q.00.0</span></label>*/}
                    </div>
                    {valores.despacho_inmediato == "true" &&(<div className="col-12 col-sm-4">
                        <label>Bodega a Despachar:</label>
                        <Field
                            disabled={no_modificar}
                            name="bodega"
                            valueKey="id"
                            labelKey="nombre"
                            label="nombre"
                            onCambio={()=>{getProductos()}}
                            component={renderSelectField}
                            options={bodegas}
                        />
                    </div>)}
                    <div className="row col-12 px-0 px-md-3">
                        <div className="col-12 pt-2">
                            <label className="rojo">PRODUCTOS</label>
                        </div>
                        <FieldArray name="productos" component={render_Productos} valores={valores} no_mod={no_modificar} productos={productos}
                        simbolo={simbolo_venta}/>
                    </div>
                </div>)}
                {/*Fin Productos*/}

                {/*Forma de pago*/}
                {step === 2 &&(<div className="pt-sm-1 pb-sm-1">
                    <div className="row d-flex justify-content-center mb-3">
                        <div className="col-md-12">
                            {/*Datos del tab anterios -Proveedor y Products ESCRITORIO-*/}
                            <div className="col-md-12 mt-2 px-1 px-md-0 ver-escritorio">
                                <div className="borde-superior row col-12 m-0 ">
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label className="quit-uppercase">Cliente:<span className="text-primary text-uppercase">
                                            {(typeof valores.cliente === 'object' ? valores.cliente.label : valores.cliente)}</span>
                                        </label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label className="quit-uppercase">Fecha:<span className="text-primary text-uppercase">
                                            {(valores.fecha && typeof valores.fecha !== 'string') && valores.fecha.format("MM/DD/YYYY")
                                            || (typeof valores.fecha === 'string') && valores.fecha}</span></label>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label className="quit-uppercase text-m">Total venta:
                                            <span className="text-primary text-uppercase text-m"> {formatoMoneda(total_venta)}</span></label>
                                    </div>
                                    <div className="col-12 col-md-12">
                                        <label className="quit-uppercase">Descripción:
                                            <span className="text-primary text-uppercase">{valores.descripcion}</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="tabla-5p">
                                    <TablaProductos productos={valores.productos ? valores.productos : []}/>
                                </div>
                            </div>
                            {/*Fin datos del tab anterior*/}
                            {/*Datos del tab anterior MOVIL*/}
                            <div className="col-md-12 mt-2 px-1 px-0 px-md-0 ver-movil">
                                <div className="row col-12 m-0 px-0">
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label className="quit-uppercase">Cliente: <span className="text-primary text-uppercase">
                                            {(typeof valores.cliente === 'object' ? valores.cliente.label : valores.cliente)}</span></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label className="quit-uppercase">Fecha: <span className="text-primary text-uppercase">
                                  {(valores.fecha && typeof valores.fecha !== 'string') && valores.fecha.format("MM/DD/YYYY")
                                  || (typeof valores.fecha === 'string') && valores.fecha}</span></label>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label className="quit-uppercase">TOTAL VENTA:
                                            <span className="rojo"> {formatoMoneda(total_venta, simbolo_venta)}</span></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label>Productos: <span className="text-primary">{count_productos}</span></label>
                                    </div>
                                </div>
                            </div>
                            {/**/}
                            <div className="row d-flex justify-content-center my-1">
                                <p className="violeta mt-3 mb-1">SELECCIONA EL TIPO DE PAGO</p>
                            </div>
                            <div className="col-12 py-2 py-md-4 d-flex justify-content-center bd-highlight border-naranja">
                                <div className="col-12 col-md-10 col-lg-8">
                                    <div className="row">
                                        <div className="d-flex justify-content-center align-content-center col-12 col-md-6 px-0">
                                            <div className="d-inline-block">
                                                <Field name="pago_automatico"  disabled={no_modificar}  component="input" type="radio" value={"true"} />
                                            </div>
                                            <div className="pl-2 pr-1 d-inline-block">
                                                <label htmlFor="pago_automatico" className={valores.pago_automatico == "true" ? 'rojo':''}>Pago Inmediato</label>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-content-center col-12 col-md-6 px-0">
                                            <div className="d-inline-block">
                                                <Field name="pago_automatico"  disabled={no_modificar}  component="input" type="radio" value={"false"} />
                                            </div>
                                            <div className="pl-2 d-inline-block">
                                                <label htmlFor="pago_automatico" className={valores.pago_automatico == "false" ?'rojo':''}>Pago al Crédito</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {valores.pago_automatico == "true" && (<Fragment>
                                <div className="col-12 border-completo mt-4 py-3 px-0 px-md-5">
                                    <div className="row pb-3">
                                        <div className="col-12">
                                            <label className="rojo">PAGO INMEDIATO</label>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="formaPago">Forma de pago:</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <Field name="formaPago" component={renderSelectField}
                                                           type="select" labelKey="label" valueKey="value"
                                                           options={opcionesVenta}  disabled={no_modificar}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {(valores.formaPago != "10" && valores.formaPago != "40") && (<div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="cuenta">Cuenta*:</label>
                                                </div>
                                                <div className={`form-group col-md-${has_cuenta ? '7 pr-0 mr-0' : '9'}`}>
                                                    <Field disabled={no_modificar} name={`cuenta`} valueKey="id"
                                                           labelKey="nombre" label="nombre" component={renderSearchSelect}
                                                           loadOptions={getCuentas}
                                                    />
                                                    {(valores.cuenta && error_cuenta) && <div className="required-text">
                                                        No puede pagar con una cuenta de moneda diferente
                                                    </div>}
                                                </div>
                                            </div>
                                        </div>)}
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="noDocumento">No. Documento:</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <Field  disabled={no_modificar} name="noDocumento" component={renderField}
                                                            type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        {valores.formaPago != "10" && (<div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="noComprobante">{`${no_trans}:`}</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <Field name="noComprobante" component={renderField}
                                                           type="text" className="form-control" disabled={no_modificar}/>
                                                </div>
                                            </div>
                                        </div>)}
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="descuento">Descuento:</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <Field  disabled={no_modificar}
                                                            name="descuento"
                                                            addClass="text-right"
                                                            component={renderCurrency}
                                                            simbolo={simbolo_venta}
                                                            type="number" className="form-control"
                                                            onKeyDown={(e) => console.log("Preciono tecla")}
                                                            _onChange={(e) => cambioDescuento(e, 'descuento')}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="porcentaje">Porcentaje:</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <Field  disabled={no_modificar}
                                                            name="porcentaje"
                                                            addClass="text-right"
                                                            component={renderPercentage}
                                                            type="number" className="form-control"
                                                            _onChange={(e) => cambioDescuento(e, 'porcentaje')}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 d-flex justify-content-center bd-highlight">
                                            <label className="">subtotal
                                                <span className=""> {formatoMoneda(total_venta, simbolo_venta)}</span></label>
                                        </div>
                                        <div className="col-12 d-flex justify-content-center bd-highlight">
                                            <label className="">descuento
                                                <span className=""> -{formatoMoneda(descuento_total, simbolo_venta)}</span></label>
                                        </div>
                                        <div className="col-12 d-flex justify-content-center bd-highlight mb-3">
                                            <label className="">TOTAL
                                                <span className="rojo"> {formatoMoneda(total_final, simbolo_venta)}</span></label>
                                        </div>
                                    </div>
                                    {(valores.formaPago === "10" || valores.formaPago === "40") &&(<div className="col-12 px-0 text-center">
                                        <span className="rojo">¡EL MONTO A RECIBIR INGRESARA A SU CAJA DE VENTAS!</span>
                                    </div>)}
                                </div>
                            </Fragment>)}
                            {valores.pago_automatico == "false" && (
                                <div className="col-md-12 border-completo mt-4 py-4 px-0">
                                    <FieldArray name="pagos" component={renderPagos} no_mod={no_modificar_pagos}
                                                anularPago={anularPago} orden_id={orden_id} show={showModalOV}
                                                abrir={openModalOC} cerrar={closeModalOC} pago_temp={pago_temp_ventas}
                                                setPagoTemp={setPagoTemp} clearPagoTemp={props.clearPagoTemp}
                                                simbolo={simbolo_venta} setError={setErrorCuenta} error_cuenta={error_cuenta}
                                    />
                                    <div className="row px-4" style={{'marginLeft': 0, 'marginRight': 0}}>
                                        <div className="col-12 col-sm-4">
                                            <div className="row" >
                                                <div className="col-1 mr-0 pr-0">
                                                    <Field name="pago_completo" component={renderFieldCheck}
                                                           type="checkbox"
                                                           disabled={true}
                                                           className="form-control"
                                                           placeholder="Correo"/>
                                                </div>
                                                <div className="col-10 pl-0 ml-0">
                                                    <label htmlFor="pago_completo">Pagado completamente</label>
                                                </div>
                                                <Field name="errorPagoCompleto" component={renderField} type="text" disabled={true} addClass={'ocultar'}/>
                                            </div>
                                        </div>
                                        <div className="col-1 col-sm-4">
                                        </div>
                                        <div className="col-12 col-sm-4">

                                            <div className="row pb-0 mb-0 ver-escritorio-flex">
                                                <div className="col-6 mx-0 px-0">
                                                    <label className="">Descuento:</label>
                                                </div>
                                                <div className="col-6 ml-0 pl-0  text-right">
                                                    <Field  disabled={no_modificar}
                                                            name="descuento"
                                                            component={renderCurrency}
                                                            simbolo={simbolo_venta}
                                                            addClass="text-right"
                                                            type="number" className="form-control " />
                                                </div>
                                            </div>
                                            <div className="row pb-0 mb-0 ver-escritorio-flex">
                                                <div className="col-6 mx-0 px-0">
                                                    <label className="">Total productos</label>
                                                </div>
                                                <div className="col-6 ml-0 pl-0  text-right">
                                                    <label className="rojo text-m">{formatoMoneda(total_venta- descuento_total , simbolo_venta)}</label>
                                                </div>
                                            </div>
                                            <div className="row pb-0 mb-0 ver-escritorio-flex">
                                                <div className="col-6 mx-0 px-0">
                                                    <label className="">Saldo:</label>
                                                </div>
                                                <div className="col-6 ml-0 pl-0  text-right">
                                                    <label className="rojo text-m">{formatoMoneda(total_venta- descuento_total -pagos_monedas , simbolo_venta)}</label>
                                                </div>
                                            </div>
                                            <div className="row pt-0 mt-0">
                                                <div className="col-6 mx-0 px-0">
                                                    <label className="">Total pagado</label>
                                                </div>
                                                <div className="col-6 ml-0 pl-0 text-right">
                                                    <label className="violeta text-m mb-0">
                                                        {formatoMoneda(pagos_monedas, simbolo_venta)}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>)}
                {/*Fin forma de pago*/}
            </div>
            {/*Botones Desktop*/}
            <div className="ver-escritorio-flex">
                <div className="mr-auto">
                    <Link className="btn btn-celeste m-1" to="/ventas">Cancelar</Link>
                </div>
                <div className="p-2">
                    {step !== 0 && (<button className="btn btn-secondary m-1" onClick={(e) => {
                        e.preventDefault();
                        set_step(step-1)
                    }}><i className="text-m fa fa-angle-left" aria-hidden="true"/> Atras</button>)}
                </div>
                <div className="p-2">
                    {step !== 2 && (<button className="btn btn-primary m-1" onClick={(e) => {
                        e.preventDefault();
                        set_step(step+1)
                    }}>Siguiente <i className="text-m fa fa-angle-right" aria-hidden="true" /></button>)}
                    {(step === 2 && !no_modificar) && (
                        <button type="submit" className="btn btn-primary m-1">Guardar</button>)}
                    {(step === 2 && abonar) && (<button className="btn btn-primary m-1"
                                                        onClick={(e) =>{
                                                            e.preventDefault();
                                                            props.abonar(orden_id)
                                                        }}>Actualizar pagos</button>)}
                </div>
            </div>
            {/* Botones Movil*/}
            {step === 0 && (<div className="row ver-movil-flex">
                <div className="col-12 text-center">
                    <button className="btn-s btn-primary" onClick={(e) => {
                        e.preventDefault();
                        set_step(step+1)
                    }}>Siguiente <i className="text-m fa fa-angle-right" aria-hidden="true" /></button>
                </div>
                <div className="col-12 text-center mt-2">
                    <Link className="btn-s btn-celeste" style={{padding: '0.4rem 1.7rem'}} to="/ventas">Cancelar</Link>
                </div>
            </div>)}
            {step === 1 && (<div className="row ver-movil-flex">
                <div className="col-6">
                    <button className="btn-s btn-secondary m-1" onClick={(e) => {
                        e.preventDefault();
                        set_step(step-1)
                    }}><i className="text-m fa fa-angle-left" aria-hidden="true"/> Atras</button>
                </div>
                <div className="col-6">
                    <button className="btn-s btn-primary m-1" onClick={(e) => {
                        e.preventDefault();
                        set_step(step+1)
                    }}>Siguiente <i className="text-m fa fa-angle-right" aria-hidden="true" /></button>
                </div>
            </div>)}

            {step === 2 && (<div className="row ver-movil-flex">
                <div className="col-0 col-md-3 col-lg-5">
                </div>
                <div className="col-6 col-md-3 col-lg-2 text-right">
                    {step !== 0 && (<button className="btn-s btn-secondary m-1" onClick={(e) => {
                        e.preventDefault();
                        set_step(step-1)
                    }}><i className="text-m fa fa-angle-left" aria-hidden="true"/> Atras</button>)}
                </div>
                <div className="col-6 col-md-3 col-lg-2 text-right">
                    {step !== 2 && (<button className="btn-s btn-primary m-1" onClick={(e) => {
                        e.preventDefault();
                        set_step(step+1)
                    }}>Siguiente <i className="text-m fa fa-angle-right" aria-hidden="true" /></button>)}

                    {(step === 2 && !no_modificar) && (
                        <button type="submit" className="btn-s btn-primary m-1">Guardar</button>)}
                    {(step === 2 && abonar) && (<button className="btn-s btn-primary"
                                                        onClick={(e) =>{
                                                            e.preventDefault();
                                                            props.abonar(orden_id)
                                                        }}>Actualizar pagos</button>)}
                </div>
            </div>)}

            <div className="col-12">
                <div className="d-flex justify-content-center flex-column flex-sm-row align-items-stretch align-items-sm-center">
                    <div className="col-12 col-md-7">
                        <Stepper
                            steps={[
                                {
                                    title: '1',
                                    onClick: (e) => {
                                        e.preventDefault();
                                        set_step(0)
                                    }
                                },
                                {
                                    title: '2',
                                    onClick: (e) => {
                                        e.preventDefault();
                                        set_step(1)
                                    }
                                },
                                {
                                    title: '3',
                                    onClick: (e) => {
                                        e.preventDefault();
                                        set_step(2)
                                    }
                                },
                            ]}
                            size={18}
                            defaultBarColor='#1B7F9F'
                            defaultBorderWidth={90}
                            lineMarginOffset={2}
                            circleFontSize={0}
                            activeTitleColor="#C24E51"
                            activeColor="#E44142"
                            activeStep={ step }
                        />
                    </div>
                </div>
            </div>
        </form>
    )
};

VentaForm = reduxForm({
    form: 'venta',
    asyncBlurFields: [],
    touchOnChange: true,
    touchOnBlur: true,
    initialValues: {
        despacho_inmediato: "false",
        pago_automatico: "true",
        caja_chica: "false",
        moneda: "GTQ",
        productos: [
            {index: 0}
        ]
    },
    validate: validador
})(VentaForm);
const selector = formValueSelector('venta'); // <-- same as form name
VentaForm = connect(state => {
    let valores = {};
    let total_venta = 0;
    let no_trans = 'No. Transacción';
    let pagos_monedas = 0;
    let simbolo_venta = 'Q';
    let simbolo_cuenta = 'Q';
    let count_productos = 0;
    let descuento_total = 0;

    const ventaForm = _.cloneDeep(state.form.venta);
    const store = _.cloneDeep(state.ventas);
    if(ventaForm && ventaForm.values){
        valores = ventaForm.values;

        if(valores.descuento){
            descuento_total = valores.descuento
        }
        if (valores.productos){
            //Calcula el total de la venta
            valores.productos.forEach((prod) => {
                count_productos += 1;
                if (!isNaN(prod.cantidad) && !isNaN(prod.precio_costo)){
                    total_venta += (parseFloat(prod.cantidad) * parseFloat(prod.precio_costo));
                }
            })
        }
        //Setea el texto correcto para Documento de transacción
        if (valores.formaPago){
            try {
                const transac = _.find(opcionesVenta, {'value': valores.formaPago});
                no_trans = transac.documento;
            } catch (e) {}
        }
        //Setea el simbolo de la cuenta seleccionada
        if (valores.cuenta){
            try {
                const cuenta_select = _.find(cuentas, {'id': valores.cuenta});
                simbolo_cuenta = cuenta_select.simbolo;
            } catch (e) {}
        }
        //Setea el simbolo de la moneda seleccionada
        if (valores.moneda){
            try {
                const moneda = _.find(Monedas, {'value': valores.moneda});
                simbolo_venta = moneda.simbolo;
            } catch (e) {}
        }
        //Obtiene el total de los abonos por moneda
        if (valores.pagos){
            valores.pagos.forEach((pago) => {
                if (!isNaN(pago.monto)){
                    // No sumar si esta anulado
                    if (pago.hasOwnProperty('id')){
                        if (!pago.anulado){
                            pagos_monedas += parseFloat(pago.monto);
                        }
                    } else {
                        pagos_monedas += parseFloat(pago.monto)
                    }
                }
            })
        }
        if (valores.despacho_inmediato === "true" && valores.bodega === undefined && store.bodegas.length > 0){
            try{
                //Muta el state del formulario para seleccionar la primer bodega
                state.form.venta.values.bodega = store.bodegas[0].id
            }catch (e) {}
            try{
                const prod = store.productos[0];
                valores.productos[0]['producto'] = prod.id
                valores.productos[0]['producto'] = prod.precios[0]
            }catch (e) {}
        }

        //    Si los productos que estan no pertenecen a los productos que estan en redux
        // if(valores.productos.length > 0){
        //     const productos = store.productos
        //     let existe = true;
        //     valores.productos.forEach((prod, index) =>{
        //         if (prod.producto){
        //             if (_.find(productos, {'id': parseInt(prod.producto)}) === undefined){
        //                 state.form.venta.values.productos.splice(index, 1);
        //             }
        //         }
        //     });
        //
        // }
    }


    return {
        valores,
        total_venta,
        no_trans,
        pagos_monedas,
        simbolo_venta,
        simbolo_cuenta,
        count_productos,
        descuento_total
    }
})(VentaForm);

export const VentaUpdateForm = reduxForm({
    form: 'venta',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    dirty: true,
    touchOnChange: true,
    asyncBlurFields: []
})(VentaForm);

export default VentaForm
