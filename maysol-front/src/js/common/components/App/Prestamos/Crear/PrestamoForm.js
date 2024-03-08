import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSelectField, renderTextArea, renderSearchSelect, renderNoAsyncSelectField} from '../../../Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'

import Validators, { required, email, length  } from 'redux-form-validators';
import { connect } from 'react-redux'

import { api } from '../../../../../api/api';
import { ROLES, opcionesBanco, opcionesCaja } from '../../../../utility/constants';





let PrestamoForm = props => {
    const { handleSubmit, me, textoPago } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">


                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                            <label htmlFor="proyecto">Proyecto Acreedor*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field
                                name={`proyectoAcreedor`}
                                valueKey="id"
                                labelKey="nombre"
                                label="Deudor"
                                component={renderNoAsyncSelectField}
                                options={props.acreedores}
                                onCambio = {(e)=>{
                                    // let seleccionado = e.value
                                    // if(props.seleccionado != seleccionado){
                                    //     props.handleAcreedorChange(parseInt(props.seleccionado?props.seleccionado:0), seleccionado);
                                    // }
                                    props.handleSeleccionadoAcreedor(e)
                                }}
                                />
                        </div>
                    </div>


                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                            <label htmlFor="acreedor">Cuenta Acreedor*:</label>
                        </div>
                         <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                                    <Field
                                            name={`acreedor`}
                                            valueKey="id"
                                            labelKey="nombre"
                                            label="Acreedor"
                                            component={renderNoAsyncSelectField}
                                            options={props.cuentasAcreedor}
                                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                            <label htmlFor="proyectoDeudor">Proyecto Deudor*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field
                                name={`proyectoDeudor`}
                                valueKey="id"
                                labelKey="nombre"
                                label="Deudor"
                                component={renderNoAsyncSelectField}
                                options={props.deudores}
                                onCambio = {(e)=>{
                                    props.handleSeleccionadoDeudor(e)
                                }}
                                />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                            <label htmlFor="deudor">Cuenta Deudor*:</label>
                        </div>
                         <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                                    <Field
                                            name={`deudor`}
                                            valueKey="id"
                                            labelKey="nombre"
                                            label="Deudor"
                                            component={renderNoAsyncSelectField}
                                            options={props.cuentasDeudor}
                                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                            <label htmlFor="fecha">Fecha*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field
                                        name="fecha"
                                        className=""
                                        component={renderDatePicker}
                                        placeholder="Fecha"
                                        numberOfMonths={1}
                                        />
                        </div>
                    </div>
                    <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                                <label htmlFor="saldo">Monto:</label>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                                <Field
                                    name="saldo"
                                    component={renderField}
                                    type="number"
                                    className="form-control" />
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                            <label htmlFor="formaPago">Forma de pago:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="formaPago" component={renderSelectField}
                                key
                                type="select" labelKey="label" valueKey="value"
                                options={opcionesBanco}
                            />
                        </div>
                    </div>
                    <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                                <label htmlFor="noDocumento">
                                   {textoPago}:
                                </label>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                                <Field name="noDocumento" component={renderField} type="text" className="form-control" />
                            </div>
                    </div>
                    <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-12 form-group">
                                <label htmlFor="descripcion">Descripción:</label>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                                <Field
                                    name="descripcion"
                                    component={renderTextArea}
                                    type="number"
                                    className="form-control" />
                            </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/admin_prestamos">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

PrestamoForm = reduxForm({
    form: 'prestamo',
    validate: data => {
        return validate(data, {
            'deudor': validators.exists()('Campo requerido.'),
            'acreedor': validators.exists()('Campo requerido.'),
            'proyecto': validators.exists()('Campo requerido.'),
            'fecha': validators.exists()('Campo requerido.'),
            'saldo': validators.exists()('Campo requerido.'),
            'descripcion': validators.exists()('Campo requerido.')
        })
    }
})(PrestamoForm)
// Decorate with connect to read form values
// Decorate with connect to read form values
const selector = formValueSelector('prestamo'); // <-- same as form name
PrestamoForm = connect(state => {
  // can select values individually
//   console.log(state, 'EStadooo')
  const formaPago = selector(state, 'formaPago')
  let textoPago = 'No. comprobante';

  if(formaPago == '40'){
      textoPago = 'No. cheque'
  }else if (formaPago == '30'){
      textoPago = 'No. transacción'
  }else if(formaPago == '50'){
      textoPago = 'No boleta'
  }
  return {
    textoPago: textoPago
  }
})(PrestamoForm)


//In update form, picture is not a required field
export const PrestamoUpdateForm = reduxForm({
    form: 'prestamo',
    validate: data => {
        return validate(data, {

            'acreedor': validators.exists()('Campo requerido.'),
            'proyecto': validators.exists()('Campo requerido.'),
            'deudor': validators.exists()('Campo requerido.'),
            'monto': validators.exists()('Campo requerido.'),
            'fecha': validators.exists()('Campo requerido.'),
            'formaPago': validators.exists()('Campo requerido.'),
            'noDocumento': validators.exists()('Campo requerido.')
        })
    }
})(PrestamoForm)

export default PrestamoForm
