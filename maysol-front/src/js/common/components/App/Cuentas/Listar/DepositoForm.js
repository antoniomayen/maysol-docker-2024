import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSelectField, renderTextArea, renderSearchSelect, renderCurrency} from '../../../Utils/renderField/renderField';
import renderDatePickerDepositos from 'Utils/renderField/renderDatePickerDepositos'
import { dateFormatter, formatoMoneda } from '../../../Utils/renderField/renderReadField';

import {opcionesBanco, opcionesCaja, options_recuperacion} from '../../../../utility/constants';
import { api } from '../../../../../api/api';
import _ from "lodash";

const cuentas = []
const empleados = []

let cuentaSeleccionado = {
    nombre: '',
    banco: '',
    saldo: '0.00'
};
let categorias = [];
export const getCategorias = (search) => {
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
}

let DepositoForm = props => {
    const { handleSubmit, verCajas, opcionesPago, cerrado, movimiento, editar, textoPago } = props;
    const { cuenta, usuario } = props;
    cuentaSeleccionado = {
        nombre: '',
        banco: '',
        saldo: '0.00'
    }
    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                <div className="row">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Fecha:</label>
                            </div>
                            <div className="col-md-8">
                                {
                                    cerrado ? (
                                        <span>{movimiento && dateFormatter(movimiento.fecha)}</span>
                                    ) : (
                                        <Field name="fecha"
                                            className=""
                                            component={renderDatePickerDepositos}
                                            month={props.month}
                                            anio={props.anio}
                                            placeholder="Fecha" numberOfMonths={1} />
                                    )
                                }

                            </div>
                        </div>

                    </div>


                    <div className="row">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="depositante">Depositante:</label>
                            </div>
                            <div className="col-md-8">
                                {
                                  cerrado ? (
                                    <span>{movimiento.depositante}</span>
                                  )   : (
                                    <Field
                                    name="depositante"
                                    component={renderField}
                                    type="text"
                                    className="form-control" />
                                  )
                                }

                            </div>
                        </div>
                        <div className="row col-md-6  form-group">
                            <div className="col-md-4">                             
                                    <label htmlFor="monto">Monto:</label>
                            </div>
                            <div className="col-md-8">
                               {
                                   cerrado || editar ? (
                                    <span>
                                        { movimiento && formatoMoneda(movimiento.monto, cuenta  && cuenta.simbolo ? cuenta.simbolo : 'Q')}
                                    </span>
                                   ) : (
                                        <Field id="monto" name="monto" component={renderField} type="number" className="form-control" />
                                   )
                               }
                            </div>
                        </div>
                    </div>
                    <div className="row border-naranja pb-1 pt-2 mb-2">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="formaPago">Forma de pago:</label>
                            </div>
                            <div className="col-md-8">
                                {
                                    cerrado ? (
                                        <span>{movimiento.nombrePago}</span>
                                    ) : (
                                        <Field name="formaPago" component={renderSelectField}
                                            key
                                            type="select" labelKey="label" valueKey="value"
                                            options={opcionesBanco}
                                        />
                                    )
                                }

                            </div>
                        </div>
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="noDocumento">
                                   {textoPago}:
                                </label>
                            </div>
                            <div className="col-md-8">
                                {
                                    cerrado ? (
                                        <span>{movimiento.noDocumento}</span>
                                    )   : (
                                        <Field name="noDocumento" component={renderField} type="text" className="form-control" />
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    {
                        usuario.accesos.administrador && (
                            <div className="row">
                                <div className="row col-md-6  form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="categoria">Categoría:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <Field
                                            name={`categoria`}
                                            valueKey="id"
                                            labelKey="nombre"
                                            label="Categoria"
                                            component={renderSearchSelect}
                                            loadOptions={getCategorias}
                                        />
                                    </div>
                                </div>
                                <div className="row col-md-6  form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="categoria">Categoría recuperación:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <Field name="categoria_recuperacion" component={renderSelectField}
                                               key disabled
                                               type="select" labelKey="label" valueKey="value"
                                               options={options_recuperacion}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="row">
                        <div className="row col-md-12 form-group">
                            <div className="col-md-2">
                                <label htmlFor="concepto">
                                    Descripción:
                                </label>
                            </div>
                            <div className="col-md-10">
                                {
                                    cerrado ? (
                                        <p>
                                            {movimiento.concepto}
                                        </p>
                                    ) : (
                                        <Field
                                            name="concepto"
                                            component={renderTextArea}
                                            type="number"
                                            className="form-control" />
                                    )
                                }
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
            'fecha': validators.exists()("Campo requerido."),
            'depositante': validators.exists()("Campo requerido."),
            'monto': validators.exists()("Campo requerido."),
            'formaPago': validators.exists()("Campo requerido."),
            'noDocuento': validators.exists()("Campo requerido."),
        });
    }
})(DepositoForm)

// Decorate with connect to read form values
// Decorate with connect to read form values
const selector = formValueSelector('movimiento'); // <-- same as form name
DepositoForm = connect(state => {
  // can select values individually
//   console.log
    const FormDeposito = state.form.movimiento;
  const formaPago = selector(state, 'formaPago')
  let textoPago = 'No. comprobante';

  if(formaPago == '40'){
      textoPago = 'No. cheque'
  }else if (formaPago == '30'){
      textoPago = 'No. transacción'
  }else if(formaPago == '60'){
      textoPago = "No. comprobante"
  }
  const categoria = selector(state, "categoria");
    //Colocar la categoria de recuperación en base a la categoria padre
    try{
        const categoria_actual = _.find(categorias, {'id': categoria});
        FormDeposito.values.categoria_recuperacion = categoria_actual.categoria_recuperacion;
    }catch (e) {}
  return {
    textoPago: textoPago
  }
})(DepositoForm)

export default DepositoForm
