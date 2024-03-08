import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSelectField, renderCurrency, renderTextArea, renderSearchSelect} from '../../../Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'

import Validators, { required, email, length  } from 'redux-form-validators';

import { api } from '../../../../../api/api';
const cuentas = [];

const opcionesBanco = [
    { value: '20', label: 'Tarjeta' },
    { value: '30', label: 'Transacción' },
    { value: '40', label: 'Cheque'}
]


const getCuentas = (search) => {

    return api.get(`cuentas/getEstadoCuenta`).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if (!_.find(cuentas, { id: item.id })) {
                cuentas.push(item);
            }
        });
        return { options: cuentas }
    })
}

let GastoCuentaForm = props => {
    const { handleSubmit } = props;
    const { verProveedor, verComprobante, tipoDocumento, opcionesPago } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Fecha:</label>
                            </div>
                            <div className="col-md-8">
                                <Field
                                    name="fecha"
                                    className=""
                                    component={renderDatePicker}
                                    placeholder="Fecha"
                                    numberOfMonths={1}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="monto">Monto:</label>
                            </div>
                            <div className="col-md-8">
                                <Field
                                    name="monto"
                                    component={renderField}
                                    type="number"
                                    className="form-control" />
                            </div>
                        </div>

                    </div>


                        <div>
                            <div className="row border-naranja mb-1 py-2">
                                <div className="row col-md-6 m-0 form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="proveedor">Proveedor:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <Field
                                            name="proveedor"
                                            component={renderField}
                                            type="text"
                                            className="form-control" />
                                    </div>
                                </div>
                                <div className="row col-md-6 m-0 form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="noComprobante">No Comprobante:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <Field
                                            name="noComprobante"
                                            component={renderField}
                                            type="text"
                                            className="form-control" />
                                    </div>
                                </div>
                            </div>

                            <div className="row border-naranja mb-2 pb-1 pt-3">

                                <div className="row col-md-6 m-0 form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="formaPago">Forma de pago:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <Field name="formaPago" component={renderSelectField}
                                            key
                                            type="select" labelKey="label" valueKey="value"
                                            options={opcionesBanco}
                                        />
                                    </div>
                                </div>
                                {
                                    verComprobante && (
                                        <div className="row col-md-6 m-0 form-group">
                                            <div className="col-md-4">
                                                <label htmlFor="noDocumento">{tipoDocumento}:</label>
                                            </div>
                                            <div className="col-md-8">
                                                <Field
                                                    name="noDocumento"
                                                    component={renderField}
                                                    type="text"
                                                    className="form-control" />
                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        </div>



                    <div className="row">
                        <div className="row col-md-6  form-group">
                            <div className="col-md-4">
                                <label htmlFor="concepto">Descripción:</label>
                            </div>
                            <div className="col-md-8">
                                <Field
                                    name="concepto"
                                    component={renderTextArea}
                                    type="number"
                                    className="form-control" />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <div className="col-md-6 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <button type="button" onClick={props.closeModal} className="btn btn-secondary m-1">Cancelar</button>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

GastoCuentaForm = reduxForm({
    form: 'movimiento',
    validate: data => {
        return validate(data, {
            'noDocumento': validators.exists()('Campo requerido'),
            'noComprobante': validators.exists()('Campo requerido'),
            'proveedor': validators.exists()('Campo requerido'),
            'cuenta': validators.exists()('Campo requerido'),
            'fecha': validators.exists()('Campo requerido'),
            'monto': validators.exists()('Campo requerido'),
            'formaPago': validators.exists()('Campo requerido'),
            'concepto': validators.exists()('Campo requerido')
        });
    }
})(GastoCuentaForm)

const selector = formValueSelector('movimiento');
GastoCuentaForm = connect(state => {
    const destino = selector(state, "destino");
    const formapago = selector(state, "formaPago");

    let verProveedor = false;

    let verComprobante = false
    let tipoDocumento = "No transacción";
    let opcionesPago = []
    if (destino === '20') {
        verProveedor = true;
        opcionesPago = opcionesBanco;
        verComprobante = true;
    } else if(destino === '10')  {
        opcionesPago = opcionesCaja;
    }
    if ( formapago != 10){
        verComprobante = true;
    }
    if(formapago == 40){
        tipoDocumento = "No Cheque";
    }
    return {
        destino,
        verProveedor,
        opcionesPago,
        verComprobante,
        tipoDocumento
    };
})(GastoCuentaForm);

export default GastoCuentaForm
