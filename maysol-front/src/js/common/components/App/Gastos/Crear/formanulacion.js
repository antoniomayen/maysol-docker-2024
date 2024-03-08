import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSelectField, renderTextArea, renderSearchSelect} from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'

import Validators, { required, email, length  } from 'redux-form-validators';
import _ from "lodash";



let AnulacionForm = props => {
    const { handleSubmit } = props;

    return (
        <form onSubmit={handleSubmit}>
        <div className="form-group grid-container">
            <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                <div className="row">
                    <div className="col-md-12 form-group">
                        <div className="col-md-12">
                            <label htmlFor="justificacion">
                                Justificación:
                            </label>
                        </div>
                        <div className="col-md-12">
                            <Field name="justificacion" className="" component={renderTextArea} placeholder="Descrición" numberOfMonths={1} />
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
    </form>
    );
}

AnulacionForm = reduxForm ({
    form: 'anulacion',
    validate: data =>{
        return validate(data, {
            'justificacion': validators.exists()("Campo requerido."),
        });
    }

})(AnulacionForm)


export default AnulacionForm
