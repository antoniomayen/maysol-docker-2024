import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSelectField, renderTextArea, renderSearchSelect} from 'Utils/renderField/renderField';
import renderDatePickerNoLimit from 'Utils/renderField/renderDatePickerNoLimit'

import Validators, { required, email, length  } from 'redux-form-validators';
import _ from "lodash";



let ReintegroForm = props => {
    const { handleSubmit } = props;

    return (
        <div>
            <div className="col-md-12">
                <h3 className="ml-0 text-uppercase text-primary "><strong>REINTEGRO</strong></h3>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="form-group grid-container ">
                    <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                        <div className="row border-naranja pt-3">

                            <div className="row col-md-6  form-group">
                                <div className="col-md-4">
                                    <label htmlFor="monto">Monto:</label>
                                </div>
                                <div className="col-md-8">
                                    <Field
                                        id="monto"
                                        name="monto"
                                        component={renderField}
                                        type="number"
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="row col-md-6 form-group">
                                <div className="col-md-4">
                                    <label htmlFor="fecha">Fecha:</label>
                                </div>
                                <div className="col-md-8">
                                    <Field
                                        name="fecha"
                                        className=""
                                        component={renderDatePickerNoLimit}
                                        placeholder="Fecha"
                                        numberOfMonths={1}
                                    />
                                </div>
                            </div>
                            <div className="row col-md-6 form-group">
                                <div className="col-md-4">
                                    <label htmlFor="concepto">
                                        Descripción:
                                    </label>
                                </div>
                                <div className="col-md-8">
                                    <Field name="concepto" className="" component={renderTextArea} placeholder="Descrición" numberOfMonths={1} />
                                </div>
                            </div>

                        </div>
                        <div className="col-md-12 mt-3 d-flex justify-content-center">
                                    <button type="submit" className="btn btn-rosado btn-lg">
                                        Guardar
                                    </button>
                        </div>

                    </div>
                </div>
            </form>
        </div>

    );
}

ReintegroForm = reduxForm ({
    form: 'reintegro',
    validate: data =>{
        return validate(data, {
            'concepto': validators.exists()("Campo requerido."),
            'monto': validators.exists()("Campo requerido")
        });
    }
})(ReintegroForm)


export default ReintegroForm
