import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderTextArea, renderSelectField} from '../../../Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'

import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import _ from "lodash";

const cuentas = []
let cuentaSeleccionado = {
    nombre: '',
    banco: '',
    saldo: '0.00'
}

let DepositoForm = props => {
    const { handleSubmit, mensaje } = props;
    const { miCaja } = props;

    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Fecha:</label>
                            </div>
                            <div className="col-md-8">

                                <Field name="fecha"
                                className=""
                                component={renderDatePicker}
                                month={props.month}
                                anio={props.anio}
                                placeholder="Fecha" numberOfMonths={1} />
                            </div>
                        </div>
                        <div className="row col-md-6  form-group">
                            <div className="col-md-4">
                                <label htmlFor="monto">Monto:</label>
                            </div>
                            <div className="col-md-8">
                                <Field id="monto" name="monto" component={renderField} type="number" className="form-control" />
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
                                    options={[

                                        { value: '20', label: 'Tarjeta' },
                                        { value: '30', label: 'Transacción' },
                                        { value: '40', label: 'Cheque'}
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="noDocumento">
                                    {mensaje}
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

DepositoForm = reduxForm ({
    form: 'movimiento',
    validate: data =>{
        return validate(data, {
            'cuenta': validators.exists()("Campo requerido."),
            'concepto': validators.exists()("Campo requerido."),
            'monto': validators.exists()("Campo requerido."),
            'fecha': validators.exists()("Campo requerido."),
        });
    }
})(DepositoForm)

// Decorate with connect to read form values
// Decorate with connect to read form values
const selector = formValueSelector('movimiento'); // <-- same as form name
DepositoForm = connect(state => {
  // can select values individually
//   console.log(state, 'EStadooo')
  const formaPago = selector(state, 'formaPago')
    let mensaje = "No comprobate:"
    if(formaPago == '20') {
       mensaje = "No comprobante:"
    } else if(formaPago == '30'){
        mensaje = "No transacción:"
    }else if(formaPago == '40'){
        mensaje ="No cheque:"
    }
    return {
        mensaje: mensaje
    }
})(DepositoForm)

export default DepositoForm
