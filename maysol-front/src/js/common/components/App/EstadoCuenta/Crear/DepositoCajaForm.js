import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSelectField, renderTextArea, renderSearchSelect, renderTimeField} from '../../../Utils/renderField/renderField';
import renderDatePickerDepositos from 'Utils/renderField/renderDatePickerDepositos'
import { opcionesBanco, opcionesCaja  } from '../../../../utility/constants'
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import _ from "lodash";
import {formatoMoneda} from "../../../Utils/renderField/renderReadField";

const cuentas = []
const empleados = []

let cuentaSeleccionado = {
    nombre: '',
    banco: '',
    saldo: '0.00'
}
const getCuentas = (search) => {

    return api.get(`cuentas`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if(!_.find(cuentas, {id: item.id})) {
                cuentas.push(item);
            }
        });
        return { options: cuentas}
    })
}

const getUsuarios = (search) => {

    return api.get(`users/getUsuariosProyecto`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.forEach(item => {
            if(!_.find(empleados, {id: item.id})) {
                empleados.push(item);
            }
        });
        return { options: empleados}
    })
}

let DepositoCajaForm = props => {
    const { handleSubmit, verCajas, opcionesPago, textoPago, editar, movimiento } = props;
    cuentaSeleccionado = {
        nombre: '',
        banco: '',
        saldo: '0.00'
    }
    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        {/* inicio de la fecha */}
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Fecha:</label>
                            </div>
                            <div className="col-md-8">

                                <Field name="fecha"
                                className=""
                                component={renderDatePickerDepositos}
                                month={props.month}
                                anio={props.anio}
                                placeholder="Fecha" numberOfMonths={1} />
                            </div>
                        </div>
                        {editar && (
                            <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Destino:</label>
                            </div>
                            <div className="col-md-8">

                                <span>{movimiento.descDestino}</span>
                            </div>
                        </div>
                        )}
                        {!editar &&(<div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="noGallinas">
                                Hora:
                                </label>
                            </div>
                            <div className="col-md-8">
                                <Field
                                    name={`hora`}
                                    component={renderTimeField}
                                    required={ true }/>
                            </div>
                        </div>)}
                        {/* fin del row */}
                    </div>
                    <div className="row">
                        {!editar &&(<div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="depositara">Depositar a:</label>
                            </div>
                            <div className="col-md-8">
                                <Field name="depositara" component={renderSelectField} key type="select" labelKey="label" valueKey="value"
                                    options={[
                                        { value: 20, label: 'Mi caja.' },
                                        { value: 10, label: 'Otras cajas.' }
                                    ]
                                    }
                                />
                            </div>
                        </div>)}
                        {
                            verCajas && (

                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="empleado">Empleado:</label>
                                        </div>
                                        <div className="col-md-8">
                                                <Field
                                                        name={`empleado`}
                                                        valueKey="id"
                                                        labelKey="nombreCompleto"
                                                        label="empleado"
                                                        component={renderSearchSelect}
                                                        loadOptions={getUsuarios}
                                                        />

                                        </div>
                                    </div>


                            )
                        }
                        <div className="row col-md-6  form-group">
                            <div className="col-md-4">
                                <label htmlFor="monto">Monto:</label>
                            </div>
                            <div className="col-md-8">
                                {editar ?(
                                     <span htmlFor="monto">{ movimiento && formatoMoneda(movimiento.monto,  'Q')}</span>
                                ) : (
                                    <Field id="monto" name="monto" component={renderField} type="number" className="form-control" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row border-naranja pb-1 pt-2 mb-2">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="formaPago">Forma de pago:</label>
                            </div>
                            <div className="col-md-8">
                                <Field name="formaPago" component={renderSelectField}
                                    key
                                    type="select" labelKey="label" valueKey="value"
                                    options={opcionesCaja}
                                />
                            </div>
                        </div>
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="noDocumento">
                                   {textoPago}:
                                </label>
                            </div>
                            <div className="col-md-8">
                                <Field name="noDocumento" component={renderField} type="text" className="form-control" />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="row col-md-12 form-group">
                            <div className="col-md-2">
                                <label htmlFor="concepto">
                                    Descripción:
                                </label>
                            </div>
                            <div className="col-md-10">
                                <Field name="concepto" className="" component={renderTextArea} placeholder="Descrición" numberOfMonths={1} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <div className="col-md-6 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <button type="button" onClick={props.closeModal} className="btn btn-secondary m-1">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary m-1">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>;
}

DepositoCajaForm = reduxForm ({
    form: 'movimiento',
    validate: data =>{
        return validate(data, {
            'fecha': validators.exists()("Campo requerido."),
            'depositante': validators.exists()("Campo requerido."),
            'monto': validators.exists()("Campo requerido."),
            'depositara': validators.exists()("Campo requerido."),
            'formaPago': validators.exists()("Campo requerido."),
            'noDocuento': validators.exists()("Campo requerido."),
            'concepto': validators.exists()("Campo requerido."),
            'hora': validators.exists()("Campo requerido."),
        });
    },
    initialValues:{
        depositara: "20",
        destino: 10,
        hora:  "08:00"
    },
})(DepositoCajaForm)

// Decorate with connect to read form values
// Decorate with connect to read form values
const selector = formValueSelector('movimiento'); // <-- same as form name
DepositoCajaForm = connect(state => {
  // can select values individually
//   console.log(state, 'EStadooo')
  const depositara = selector(state, 'depositara')
  const formaPago = selector(state, 'formaPago')
  let verCajas = false;
  let opcionesPago = opcionesCaja;
  let textoPago = 'No. comprobante';
  if(depositara == 0) {
    //  let nuevo = cuentas.find(x => x.id === cuenta);
    //  cuentaSeleccionado = nuevo
    opcionesPago = opcionesBanco;
  }
  if (depositara == 10 ){
      verCajas = true;
  }
  if(formaPago == '40'){
      textoPago = 'No. cheque'
  } else if(formaPago == '60'){
      textoPago = "No comprobante"
  } else if(formaPago == '30'){
      textoPago = "No transacción"
  }
  return {
    verCajas: verCajas,
    opcionesPago: opcionesPago,
    textoPago: textoPago
  }
})(DepositoCajaForm)

export default DepositoCajaForm
