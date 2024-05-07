import React, {Fragment, useState} from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray, FormSection } from 'redux-form';
import { validate, validators, asyncValidate } from 'validate-redux-form';
import { renderField, renderTextArea, renderSearchSelect, renderSelectField, renderFieldCheck, renderSearchCreateSelect,
    renderCurrency,
renderCreateSelect}
from '../../../Utils/renderField/renderField';
import { api } from '../../../../../api/api';
import { connect } from 'react-redux'
import validador from './validate';
import { opcionesBanco, gastoCaja, Monedas } from '../../../../utility/constants';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import renderDatePickerNoLimit from 'Utils/renderField/renderDatePickerNoLimit'
import { formatoMoneda, dateFormatter } from 'Utils/renderField/renderReadField'
import Stepper from 'react-stepper-horizontal';
import {BreakLine} from "../../../Utils/tableOptions";
import Table from 'Utils/Grid'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { BootstrapTable } from 'react-bootstrap-table';
import Modal from 'react-responsive-modal';
import moment from 'moment';

const proveedores = [];
const productos = [];
const cuentas = [];
const cajas = [];
let categorias = [];

const getCategorias = (search) => {
    return api.get(`categorias`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if (!_.find(categorias, { id: item.id })) {
                categorias.push(item);
            }
        });
        return { options: categorias }
    })
};
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
const getCajas = (search) => {
    return api.get(`cierre/getMisCajas`).catch((error) => {
        console.log("Error", error);
    }).then((data) => {
        data.forEach(item => {
            if (!_.find(cajas, { id: item.id })) {
                cajas.push(item);
            }
        });
        return { options: cajas }
    })
};
const getProductos = (search) => {
    return api.get(`productos/get_fraccionesUnidad`,{search}).catch((error) => {
        console.log("Error al leer productos.");
    }).then((data) => {
        data.forEach(item => {
            if (!_.find(productos, { id: item.id })) {
                productos.push(item);
            }
        });
        return { options: productos }
    })
};
export const renderPagos = ({fields, meta: {error, submitFailed}, no_mod, anularPago, orden_id, show, abrir, cerrar,
                            pago_temp, setPagoTemp, clearPagoTemp}) => {
    let no_trans = "No Transacción";
    let moneda_cuenta = "GTQ";
    if (pago_temp.formaPago){
        try {
            const transac = _.find(opcionesBanco, {'value': pago_temp.formaPago});
            no_trans = transac.documento;
        } catch (e) {
            const transac = _.find(gastoCaja, {'value': pago_temp.formaPago});
            no_trans = transac.documento;
        }
    }
    try{
        const cuenta_select = _.find(cuentas, {'id': pago_temp.cuenta});
        moneda_cuenta = cuenta_select.moneda;
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
                            <div className="col-12">
                                <label htmlFor="cuenta">Debitar de:</label>
                            </div>
                            <div className="col-12 col-md-2">
                                <div className="row">
                                    <div className="col-2 col-md-2">
                                        <Field name="caja_chica"  disabled={false}  component="input" type="radio" value={"false"}
                                               checked={pago_temp['caja_chica'] === 'false'}
                                               onChange={(e) => {
                                                   pago_temp['caja_chica'] = e.target.value
                                               }}/>
                                    </div>
                                    <div className="col-8 col-md-9">
                                        <label htmlFor="caja_chica">Cuenta</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-3">
                                <div className="row">
                                    <div className="col-2">
                                        <Field name="caja_chica"  disabled={false}  component="input" type="radio" value={"true"}
                                               checked={pago_temp['caja_chica'] === 'true'}
                                               onChange={(e) => {
                                                   setPagoTemp('caja_chica', e.target.value);
                                                   // pago_temp['caja_chica'] = e.target.value
                                               }}/>
                                    </div>
                                    <div className="col-10">
                                        <label htmlFor="caja_chica">Caja chica</label>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                <label htmlFor="cuenta">{pago_temp.caja_chica !== "true" ? 'Cuenta:' : 'Caja chica:'}</label>
                                <div className="row mx-0 px-0">
                                    {pago_temp.caja_chica !== 'true' && (<div className={`form-group col-md-10 pl-0 ml-0`}>
                                        <Field disabled={false} name={`_cuenta`} valueKey="id"
                                               labelKey="nombre" label="nombre" component={renderSearchSelect}
                                               loadOptions={getCuentas}
                                               input = {{value: pago_temp['cuenta'],  onChange: (e) => {
                                                       return e
                                                   }}}
                                               onCambio={(e) => {
                                                   setPagoTemp('cuenta', e.id);
                                               }}
                                        />
                                    </div>)}
                                    {pago_temp.caja_chica === 'true' && (<div className="col-md-10 form-group pl-0 ml-0">
                                        <Field disabled={false} name={`_caja`} valueKey="id"
                                               labelKey="fechaInicio" label="fechaInicio" component={renderSearchSelect}
                                               loadOptions={getCajas}
                                               input = {{value: pago_temp['caja'],  onChange: (e) => {
                                                       return e
                                                   }}}
                                               onCambio={(e) => {
                                                   setPagoTemp('caja', e.id);
                                               }}
                                        />
                                    </div>)}
                                    {(pago_temp.cuenta || pago_temp.caja) && (<div className="col-md-1 pl-0 ml-0">
                                            <label className="pt-2 texto-monedas">{moneda_cuenta}</label>
                                    </div>)}

                                </div>
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="_noDocumento">No. Documento:</label>
                                <Field  disabled={false} name="_noDocumento" component={renderField}
                                        type="text" className="form-control"
                                        input = {{value: pago_temp['noDocumento'], onChange:(e) => {
                                            setPagoTemp('noDocumento', e.target.value);
                                        }}}
                                />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="_formaPago">Forma de pago:</label>
                                <Field name="_formaPago" component={renderSelectField}
                                       type="select" labelKey="label" valueKey="value"
                                       options={pago_temp.caja_chica === "true" ? gastoCaja : opcionesBanco}  disabled={false}
                                        input = {{value: pago_temp['formaPago'], onChange:(e) => {
                                            setPagoTemp('formaPago', e.target.value);
                                        }}}
                                />
                            </div>
                            {pago_temp.formaPago !== "10" &&(<div className="col-md-4">
                                <label htmlFor="_noComprobante">{`${no_trans}:`}</label>
                                <Field name="_noComprobante" component={renderField}
                                       type="text" className="form-control" disabled={false}
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
                        <div className="row pt-4">
                            <div className="col-12">
                                <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                    <button className="btn btn-secondary m-1" onClick={(e) => {
                                        e.preventDefault();
                                        clearPagoTemp(true);
                                        cerrar()
                                    }}>Cancelar</button>
                                    <button className="btn btn-primary m-1" onClick={(e) => {
                                        e.preventDefault();
                                        if (!clearPagoTemp()){
                                            fields.push(pago_temp);
                                            cerrar()
                                        }
                                    }}>Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="row px-0 px-sm-4">
                <div className="col-12 col-sm-4 col-md-4 col-lg-3">
                    <label className="rojo mt-2">PAGO AL CRÉDITO</label>
                </div>
                <div className="col-0 col-sm-8 col-md-8 col-lg-5">
                    <div className="row">
                        <div className="col-12 col-sm-3 col-md-5 px-0 d-flex align-items-center justify-content-center">
                            <label>Categoria de gastos</label>
                        </div>
                        <div className="col-12 col-sm-9 col-md-7 px-0">
                            <Field
                                name='categoria'
                                valueKey="id"
                                labelKey="nombre"
                                label="Categoria"
                                component={renderSearchSelect}
                                loadOptions={getCategorias}
                            />
                        </div>

                    </div>
                </div>
                <div className="mt-2 col-10 col-sm-8 col-md-8 col-lg-4 text-right">
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
                            <th style={{width: "14%"}}  className="ver-escritorio-cell">Debitado de</th>
                            <th style={{width: "14%"}} >Fecha</th>
                            <th style={{width: "14%"}} className="ver-escritorio-cell">No Documento</th>
                            <th style={{width: "14%"}} >Forma de pago</th>
                            <th style={{width: "14%"}} className="ver-escritorio-cell">No transacción</th>
                            <th style={{width: "14%"}} >Abono</th>
                            <th style={{width: "5%"}} ></th>
                        </tr>
                        {fields.map((pago, index) => {
                            const pagos = fields.getAll(); // Obtiene todos los pagos
                            let nombre_cuenta = "";
                            let nombre_caja = "";
                            let _forma_pago = "";
                            if (pagos[index]['caja_chica'] === undefined){
                                pagos[index]['caja_chica'] = "false";
                            }
                            const pago_actual = fields.get(index); // Pago actual
                            pago_actual.caja_chica = (pago_actual.caja_chica === true  || pago_actual.caja_chica === 'true') ? 'true' : 'false';

                            //Si esta pagando con caja chica
                            if (pago_actual.caja_chica === "true"){
                                pagos[index]['moneda'] = 'GTQ'; //Mutar cada fila par agregarle la moneda
                                pagos[index]['simbolo'] = 'Q'; //Mutar cada fila par agregarle el simbolo
                                try{
                                    const caja_select = _.find(cajas, {'id': pago_actual.caja});
                                    nombre_caja = caja_select.fechaInicio;
                                }catch (e) { }
                                try {
                                    const fomaPago_select = _.find(gastoCaja, {'value': pago_actual.formaPago})
                                    _forma_pago = fomaPago_select.label
                                }catch (e) {}
                            } else {
                                //Pago con cuenta
                                try {
                                    const fomaPago_select = _.find(opcionesBanco, {'value': pago_actual.formaPago})
                                    _forma_pago = fomaPago_select.label
                                }catch (e) {}
                                try{const cuenta_select = _.find(cuentas, {'id': pago_actual.cuenta});
                                    nombre_cuenta = cuenta_select.nombre;
                                    pagos[index]['moneda'] = cuenta_select.moneda; //Mutar cada fila par agregarle la moneda
                                    pagos[index]['simbolo'] = cuenta_select.simbolo; //Mutar cada fila par agregarle el simbolo
                                } catch (e) {}
                            }

                            return(
                                <tr key={index}>
                                    <td className="sin-borde-top ver-escritorio-cell">
                                        {pago_actual.caja_chica === 'true' && (<span className={pago_actual.anulado ? 'tachar': ''}>
                                            {pago_actual.hasOwnProperty('id') ? `Caja ${pago_actual.caja_nombre}` : `Caja ${nombre_caja}` }
                                        </span>)}
                                        {pago_actual.caja_chica !== 'true' && (<span className={pago_actual.anulado ? 'tachar': ''}>
                                            {pago_actual.hasOwnProperty('id') ? `Cuenta ${pago_actual.cuenta_nombre}`: `Cuenta ${nombre_cuenta}` }
                                        </span>)}
                                    </td>
                                    <td className="sin-borde-top">
                                        <span className={pago_actual.anulado ? 'tachar': ''}>
                                            {dateFormatter(pago_actual.fecha)}
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

export const render_Productos = ({fields, meta: {error, submitFailed},  simbolo, no_mod, productos}) => {
    let total = 0;
    let _simbolo ='Q';
    if(simbolo !== undefined){
        _simbolo = simbolo
    }
    return(
        <Fragment>
            <div className="col-sm-12 form-group">
                {fields.map((producto, index) => {
                    const todos = fields.getAll(); //Obtiene todos los productos
                    todos[index]['index'] = index; //Mutar cada fila par agregarle el index
                    todos[index]['simbolo'] = _simbolo; //Mutar cada fila par agregarle el index
                    if (todos[index]['producto'] !== undefined){
                        try{
                            const _prod = _.find(productos, {'id': todos[index]['producto']});
                            todos[index]['producto_nombre'] = _prod.nombre;
                        }catch (e) {}
                    }
                    const prod = fields.get(index); // Producto actual
                    console.log("Producto", prod);
                    let subtotal = 0;
                    if (!isNaN(prod.cantidad) && !isNaN(prod.precio_costo)){
                        subtotal = prod.cantidad * prod.precio_costo;
                        total += prod.cantidad * prod.precio_costo;
                    }
                    return(
                        <div key={index} className={ index !== 0 ? 'pt-2 border-naranja-movil py-4 py-sm-0 mb-2 mb-sm-0' : 'border-naranja-movil py-4 py-sm-0 mb-2 mb-sm-0'}>
                            {!no_mod && (<div className="float-right mt-2 mr-2">
                                <button type="button" className="btn btn-danger btn-normal"
                                        onClick={() =>{
                                            fields.remove(index)
                                        }}>X
                                </button>
                            </div>)}
                            <div className="row">
                                <div className="col-12 col-md-4 pr-0 mr-0">
                                    <label htmlFor="fecha">Producto:</label>
                                    <Field
                                        disabled={no_mod}
                                        name={`${producto}.producto`}
                                        valueKey="id"
                                        labelKey="nombre"
                                        component={renderCreateSelect}
                                        opciones={productos}
                                    />
                                    {/*<Field*/}
                                        {/*disabled={no_mod}*/}
                                        {/*name={`${producto}.producto`}*/}
                                        {/*valueKey="id"*/}
                                        {/*labelKey="nombre"*/}
                                        {/*label="Producto"*/}
                                        {/*component={renderSearchCreateSelect}*/}
                                        {/*loadOptions={getProductos}*/}
                                    {/*/>*/}
                                </div>
                                <div className="col-12 col-sm-2 pr-0 mr-0">
                                    <label htmlFor="cuenta">Cantidad:</label>
                                    <Field
                                        disabled={no_mod}
                                        name={`${producto}.cantidad`}
                                        type="number"
                                        component={renderField}
                                        placeholder="Cantidad"
                                    />
                                </div>
                                <div className="col-2 col-sm-1 mr-0 pr-0" style={{maxWidth: '4.333333%'}}>
                                    <label>&nbsp;</label>
                                    <p className="pt-2 texto-monedas">{_simbolo}</p>
                                </div>
                                <div className="col-10 col-sm-2 pr-0 ml-0 pl-0">
                                    <label htmlFor="cuenta">Costo unitario:</label>
                                    <Field
                                        disabled={no_mod}
                                        name={`${producto}.precio_costo`}
                                        type="number"
                                        component={renderField}
                                        placeholder="Costo"
                                    />
                                </div>
                                <div className="col-12 col-sm-3 pr-0 mr-0">
                                    <label htmlFor="cuenta">Subtotal:</label>
                                    <Field
                                        disabled={true}
                                        name={`${producto}.subtotal`}
                                        type="text"
                                        addClass="text-right"
                                        component={renderField}
                                        placeholder="Costo"
                                        input = {{value: `${simbolo} ${subtotal}`}}
                                    />
                                </div>
                            </div>
                        </div>)})}
                <div className="row pt-3">
                    <div className="col-0 col-sm-4 col-md-1 col-lg-3">
                    </div>
                    <div className="col-12 col-sm-4 col-md-5 col-lg-5 mr-0 mr-lg-2 text-center">
                        {!no_mod && (<button name="btnProductos" className="btn btn-celeste"
                                             onClick={() => fields.push({})}>
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

const ProductoNombre = (cell) => {
    let nombre = ''
    try {
        nombre = cell.label
    } catch (error) {

    }
    return (<span>{nombre}</span>)
}
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
                /*dataFormat={ProductoNombre}*///con esta linea no muestra nombre del producto
                dataField="producto_nombre">Producto</TableHeaderColumn>
            <TableHeaderColumn tdStyle={BreakLine} thStyle={BreakLine}
                dataField="cantidad" dataAlign="center">Cantidad</TableHeaderColumn>
            <TableHeaderColumn tdStyle={BreakLine} thStyle={BreakLine}
                dataField="precio_costo">Costo unitario</TableHeaderColumn>
            <TableHeaderColumn tdStyle={BreakLine} thStyle={BreakLine} dataFormat={subtotal} dataAlign="right"
                dataField="total">Sub total</TableHeaderColumn>
        </BootstrapTable>
    )
};

let CompraForm = props => {
    const { handleSubmit, editar, count_products, simbolo, has_cuenta, auto, total_products, productos } = props;
    const { updateData, no_trans, orden_id , moneda_cuenta, step, set_step, valores, proveedor, openModalOC} = props;
    const { pagos_monedas,  cchica, anularPago, showModalOC, closeModalOC, setPagoTemp, pago_temp, proveedores} = props;
    let no_modificar = false;
    let no_modificar_pagos = false;
    let abonar = false;
    if(editar && updateData){
        if (updateData.ingresado && updateData.pago_completo) {
            no_modificar = true;
            abonar = false;
        } else {
            no_modificar = false;
            abonar = true;
        }
        no_modificar_pagos=updateData.pago_completo
        /*
            no_modificar = updateData.pago_automatico === "true" || updateData.ingresado;
            no_modificar_pagos = updateData.pago_completo;
            if(updateData.pagos !== undefined && updateData.pagos.length > 0){
                no_modificar = true
            }
            if(!updateData.pago_completo && updateData.pagos !== undefined && updateData.pagos.length > 0 ){
                abonar = true;
            }
        */
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                {/*Proveedor*/}
                {step === 0 &&(<div className="row pb-4 px-0 px-sm-3">
                    <div className="row">
                        <div className="col-12">
                            <label className="rojo">Proveedor:</label>
                        </div>
                    </div>
                    <div className="row px-0 px-md-3">
                        <div className="col-md-4 pr-sm-1">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="proveedor">Proveedor*:</label>
                                </div>
                                <div className="col-md-8">
                                    <Field
                                        disabled={no_modificar}
                                        name={`proveedor`}
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
                                    <label htmlFor="descripcion">Descripción:</label>
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
                {/*Fin Proveedor*/}

                {/*Productos*/}
                {step === 1 &&(<div className="row pb-4 px-0 px-sm-3">
                    {/*Datos del tab anterios -Proveedor-*/}
                    <div className="row col-12">
                        <div className="col-12 col-md-4">
                            <label className="quit-uppercase">Proveedor:<span className="text-primary text-uppercase"> {typeof proveedor === 'object' ?
                                proveedor.label : proveedor}</span></label>
                        </div>
                         <div className="col-12 col-md-4">
                              <label className="quit-uppercase">Fecha:<span className="text-primary text-uppercase"> {(valores.fecha && typeof valores.fecha !== 'string') &&
                                  valores.fecha.format("MM/DD/YYYY") || (typeof valores.fecha === 'string') && valores.fecha}</span></label>
                        </div>
                         <div className="col-12 col-md-12">
                             <label className="quit-uppercase">Descripción:<span className="text-primary text-uppercase"> {valores.descripcion}</span></label>
                        </div>
                    </div>

                    <div className="row col-12 px-0 px-md-3">
                        <div className="col-12 pt-2">
                            <label className="rojo">PRODUCTOS:</label>
                        </div>
                        <FieldArray name="productos" component={render_Productos} simbolo={simbolo} no_mod={no_modificar} productos={productos}  />
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
                                        <label className="quit-uppercase">Proveedor:<span className="text-primary text-uppercase"> {typeof proveedor === 'object' ?
                                            proveedor.label : proveedor}</span></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label className="quit-uppercase">Fecha:<span className="text-primary text-uppercase"> {(valores.fecha && typeof valores.fecha !== 'string') &&
                                        valores.fecha.format("MM/DD/YYYY") || (typeof valores.fecha === 'string') && valores.fecha}</span></label>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label className="quit-uppercase text-m">Total compra:
                                            <span className="text-primary text-uppercase text-m"> {formatoMoneda(total_products, simbolo)}</span></label>
                                    </div>
                                    <div className="col-12 col-md-12">
                                        <label className="quit-uppercase">Descripción:<span className="text-primary text-uppercase"> {valores.descripcion}</span></label>
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
                                        <label className="quit-uppercase">Proveedor:<span className="text-primary text-uppercase"> {typeof proveedor === 'object' ?
                                            proveedor.label : proveedor}</span></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label className="quit-uppercase">Fecha:<span className="text-primary text-uppercase"> {(valores.fecha && typeof valores.fecha !== 'string') &&
                                        valores.fecha.format("MM/DD/YYYY/") || (typeof valores.fecha === 'string') && valores.fecha}</span></label>
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label className="quit-uppercase">TOTAL COMPRA:
                                            <span className="rojo"> {formatoMoneda(total_products, simbolo)}</span></label>
                                    </div>
                                    <div className="col-12 col-sm-6 col-md-4">
                                        <label>Productos:<span className="text-primary"> {count_products}</span></label>
                                    </div>
                                </div>
                            </div>
                            {/**/}
                            <div className="row d-flex justify-content-center my-1">
                                <p className="violeta mt-3 mb-1">SELECCIONA EL TIPO DE PAGO</p>
                            </div>
                            <div className="col-12 py-2 py-md-4 d-flex justify-content-center bd-highlight border-naranja">
                                <div className="col-12 col-md-8 col-lg-6">
                                    <div className="row">
                                        <div className="d-flex justify-content-center align-content-center col-12 col-md-6 px-0">
                                            <div className="d-inline-block">
                                                <Field name="pago_automatico"  disabled={no_modificar}  component="input" type="radio" value={"true"} />
                                            </div>
                                            <div className="pl-2 pr-1 d-inline-block">
                                                <label htmlFor="pago_automatico" className={valores.pago_automatico == "true" && 'rojo'}>Pago Inmediato</label>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-content-center col-12 col-md-6 px-0">
                                            <div className="d-inline-block">
                                                <Field name="pago_automatico"  disabled={no_modificar}  component="input" type="radio" value={"false"} />
                                            </div>
                                            <div className="pl-2 d-inline-block">
                                                <label htmlFor="pago_automatico" className={valores.pago_automatico != "true" && 'rojo'}>Pago al Crédito</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {auto && (<Fragment>
                                <div className="col-12 border-completo mt-4 py-3 px-0 px-md-5">
                                    <div className="row pb-3">
                                        <div className="col-12">
                                            <label className="rojo">PAGO INMEDIATO</label>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <label htmlFor="cuenta">Debitar de:</label>
                                        </div>
                                        <div className="col-12 col-md-2">
                                            <div className="row">
                                                <div className="col-2 col-md-2">
                                                    <Field name="caja_chica"  disabled={no_modificar}  component="input" type="radio" value={"false"} />
                                                </div>
                                                <div className="col-8 col-md-9">
                                                    <label htmlFor="caja_chica">Cuenta</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-3">
                                            <div className="row">
                                                <div className="col-2">
                                                    <Field name="caja_chica"  disabled={no_modificar}  component="input" type="radio" value={"true"} />
                                                </div>
                                                <div className="col-10">
                                                    <label htmlFor="caja_chica">Caja chica</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="cuenta">{`${cchica ? 'Caja chica' : 'Cuenta'}*:`}</label>
                                                </div>
                                                {!cchica && (<div className={`form-group col-md-${has_cuenta ? '7 pr-0 mr-0' : '9'}`}>
                                                    <Field disabled={no_modificar} name={`cuenta`} valueKey="id"
                                                           labelKey="nombre" label="nombre" component={renderSearchSelect}
                                                           loadOptions={getCuentas}
                                                    />
                                                </div>)}
                                                {cchica && (<div className="col-md-7 form-group pr-0  ml-0">
                                                    <Field disabled={no_modificar} name={`caja`} valueKey="id"
                                                           labelKey="fechaInicio" label="fechaInicio" component={renderSearchSelect}
                                                           loadOptions={getCajas}
                                                    />
                                                </div>)}
                                                {(has_cuenta || cchica) && (<div className="col-md-1 pl-0 ml-0">
                                                    <div className="col-md-12 form-group">
                                                        <label className="pt-2 texto-monedas">{moneda_cuenta}</label>
                                                    </div>
                                                </div>)}
                                            </div>
                                        </div>
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
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="formaPago">Forma de pago:</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <Field name="formaPago" component={renderSelectField}
                                                           type="select" labelKey="label" valueKey="value"
                                                           options={cchica ? gastoCaja : opcionesBanco}  disabled={no_modificar}
                                                    />
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
                                                           type="number" className="form-control" disabled={no_modificar}/>
                                                </div>
                                            </div>
                                        </div>)}
                                        <div className="col-md-6">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label htmlFor="noComprobante">Categoria de gastos</label>
                                                </div>
                                                <div className="col-md-9 form-group">
                                                    <Field
                                                        name='categoria'
                                                        valueKey="id"
                                                        labelKey="nombre"
                                                        label="Categoria"
                                                        component={renderSearchSelect}
                                                        loadOptions={getCategorias}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 ver-movil-flex justify-content-center bd-highlight mb-3">
                                                <label className="">TOTAL
                                                    <span className="rojo"> {formatoMoneda(total_products, simbolo)}</span></label>
                                        </div>
                                    </div>

                                </div>
                            </Fragment>)}
                            {!auto && (
                                <div className="col-md-12 border-completo mt-4 py-4 px-0">
                                    <FieldArray name="pagos" component={renderPagos} no_mod={no_modificar_pagos}
                                            anularPago={anularPago} orden_id={orden_id} show={showModalOC}
                                                abrir={openModalOC} cerrar={closeModalOC} pago_temp={pago_temp}
                                                setPagoTemp={setPagoTemp} clearPagoTemp={props.clearPagoTemp}/>
                                    <div className="row px-4" style={{'marginLeft': 0, 'marginRight': 0}}>
                                        <div className="col-12 col-sm-4">
                                            <div className="row" >
                                                <div className="col-1 mr-0 pr-0">
                                                    <Field name="pago_completo" component={renderFieldCheck}
                                                           type="checkbox"
                                                           disabled={no_modificar_pagos}
                                                           className="form-control"
                                                           placeholder="Correo"/>
                                                </div>
                                                <div className="col-10 pl-0 ml-0">
                                                    <label htmlFor="pago_completo">Marcar como pagado completamente</label>
                                                </div>
                                                <Field name="errorPagoCompleto" component={renderField} type="text" disabled={true} addClass={'ocultar'}/>
                                            </div>
                                        </div>
                                        <div className="col-1 col-sm-4">
                                        </div>
                                        <div className="col-12 col-sm-4">
                                            <div className="row pb-0 mb-0 ver-escritorio-flex">
                                                <div className="col-6 mx-0 px-0">
                                                    <label className="">Total productos</label>
                                                </div>
                                                <div className="col-6 ml-0 pl-0  text-right">
                                                    <label className="rojo text-m">{formatoMoneda(total_products, simbolo)}</label>
                                                </div>
                                            </div>
                                            <div className="row pt-0 mt-0">
                                                <div className="col-6 mx-0 px-0">
                                                    <label className="">Total pagado</label>
                                                </div>
                                                <div className="col-6 ml-0 pl-0">
                                                    <div className="row text-right">
                                                        {Object.keys(pagos_monedas).map((key) => {
                                                            return (<div className="col-12 ml-0 pl-0  text-right">
                                                                {key != "undefined" &&(<label className="violeta text-m mb-0">
                                                                    {formatoMoneda(pagos_monedas[key], key)}</label>)}
                                                            </div>)
                                                        })}
                                                    </div>
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
                <div className="mr-auto p-2">
                    <Link className="btn btn-celeste m-1" to="/compras">Cancelar</Link>
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
                    {(step === 2 && !no_modificar && !abonar) && (
                        <button type="submit" className="btn btn-primary m-1">Guardar</button>)}
                    {(step === 2 && no_modificar && !abonar) && (
                        <button type="submit" className="btn btn-primary m-1">Actualizar categoria</button>)}
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
                    <Link className="btn-s btn-celeste" style={{padding: '0.4rem 1.7rem'}} to="/compras">Cancelar</Link>
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

            {step === 2 && (<div className="row ver-movil-flex justify-content-center align-items-center">
                {step !== 0 && (<button className="btn-s btn-secondary m-1" onClick={(e) => {
                    e.preventDefault();
                    set_step(step-1)
                }}><i className="text-m fa fa-angle-left" aria-hidden="true"/> Atras</button>)}
                {step !== 2 && (<button className="btn-s btn-primary m-1" onClick={(e) => {
                    e.preventDefault();
                    set_step(step+1)
                }}>Siguiente <i className="text-m fa fa-angle-right" aria-hidden="true" /></button>)}
                {(step === 2 && !no_modificar && !abonar) && (
                    <button type="submit" className="btn-s btn-primary m-1">Guardar</button>)}
                {(step === 2 && no_modificar && !abonar) && (
                    <button type="submit" className="btn btn-primary m-1">Actualizar categoria</button>)}
                {(step === 2 && abonar) && (<button className="btn-s btn-primary"
                                                    onClick={(e) =>{
                                                        e.preventDefault();
                                                        props.abonar(orden_id)
                                                    }}>Actualizar pagos</button>)}
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

CompraForm = reduxForm({
    form: 'compra',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    dirty: true,
    touchOnChange: true,
    initialValues: {
        pago_automatico: "true",
        caja_chica: "false",
        moneda: "GTQ",
        categoria: null,
    },
    validate: validador
})(CompraForm);
const selector = formValueSelector('compra'); // <-- same as form name
CompraForm = connect(state => {
    // can select values individually
    let moneda = 'GTQ';
    let proveedor = '';
    let simbolo = 'Q';
    let no_trans = 'No. Transacción';
    let has_cuenta = false;
    let moneda_cuenta = 'GTQ';
    let auto = true;
    let total_products = 0;
    let count_products = 0;
    let cchica = false;
    let valores = {};
    const pagos_monedas = {};
    const compra_form = _.cloneDeep(state.form.compra);
    if(compra_form  && compra_form.values){
        valores = compra_form.values;
        if(valores){
            auto = valores.pago_automatico === "true";
        }
        cchica = valores.caja_chica === "true";
        if (!cchica){
            if (valores.cuenta){
                has_cuenta = true;
                try{
                    const cuenta = _.find(cuentas, { 'id': valores.cuenta});
                    moneda_cuenta = cuenta.moneda;
                }catch (e) {}
            }
        }
        if(valores.moneda){
            const _moneda = _.find(Monedas, {'value': valores.moneda});
            simbolo = _moneda.simbolo;
        }
        if (valores.productos){
            valores.productos.forEach((prod) => {
                count_products += 1;
                if (!isNaN(prod.cantidad) && !isNaN(prod.precio_costo)){
                    total_products +=  parseFloat(prod.cantidad) *  parseFloat(prod.precio_costo);
                }
            })
        }
        if (valores.formaPago){
            try {
                const transac = _.find(opcionesBanco, {'value': valores.formaPago});
                no_trans = transac.documento;
            } catch (e) {
                try{
                    const transac = _.find(gastoCaja, {'value': valores.formaPago});
                    no_trans = transac.documento;
                } catch (e) {}
            }
        }
        if (valores.proveedor){
            try{
                const obj_proveedor = _.find(proveedores, {'id': valores.proveedor});
                proveedor = obj_proveedor.nombre;
            } catch (e) { proveedor = valores.proveedor}
        }

        if (valores.pagos){
            valores.pagos.forEach((pago) => {
                if (!isNaN(pago.monto)){
                    // No sumar si esta anulado
                    if (pago.hasOwnProperty('id')){
                        if (!pago.anulado){
                            if(pagos_monedas.hasOwnProperty(pago.simbolo)){
                                pagos_monedas[pago.simbolo] = pagos_monedas[pago.simbolo] + parseFloat(pago.monto);
                            } else {
                                pagos_monedas[pago.simbolo] = parseFloat(pago.monto);
                            }
                        }
                    } else {
                        if(pagos_monedas.hasOwnProperty(pago.simbolo)){
                            pagos_monedas[pago.simbolo] = pagos_monedas[pago.simbolo] + parseFloat(pago.monto);
                        } else {
                            pagos_monedas[pago.simbolo] = parseFloat(pago.monto);
                        }
                    }
                }
            })
        }
    }
    const fracciones = selector(state, 'multiplos');
    let verMultiplos = false;
    if(fracciones) {
        verMultiplos = true;
    }
    return {
        verMultiplos: verMultiplos,
        moneda,
        simbolo,
        has_cuenta,
        auto,
        total_products,
        no_trans,
        cchica,
        moneda_cuenta,
        valores,
        proveedor,
        pagos_monedas,
        count_products
    }
})(CompraForm);
//In update form, picture is not a required field
export const CompraUpdateForm = reduxForm({
    form: 'compra',
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    dirty: true,
    touchOnChange: true,
    validate: validador,
    asyncBlurFields: []
})(CompraForm);

export default CompraForm
