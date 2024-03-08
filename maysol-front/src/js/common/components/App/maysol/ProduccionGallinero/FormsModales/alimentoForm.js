import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderTextArea } from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker';
import { api } from 'api/api';
import _ from "lodash";



let EditarTecnicoForm = props => {
    const { handleSubmit, verForm} = props;

    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    {/* fin selecciones */}


                            <div className="my-5">
                                <div className="row px-2 py-4">
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="cantidad_alimento">
                                            Porción alimento (g):
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="cantidad_alimento" component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="cantidad_agua">
                                            Porción de agua (l):
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="cantidad_agua" component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                    <div className="row mt-3">
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

EditarTecnicoForm = reduxForm ({
    form: 'movimiento',
    initialValues: {
        tipo: 'true'
    },
    validate: data =>{
        return validate(data, {
            'cantidad_alimento': validators.exists()("Campo requerido."),
            'cantidad_agua': validators.exists()("Campo requerido."),
        });
    }
})(EditarTecnicoForm)
const selector = formValueSelector('movimiento'); // <-- same as form name
EditarTecnicoForm = connect(state => {
  // can select values individually
//   console.log(state, 'EStadooo')
    let verForm = true;
    const tipo = selector(state, 'tipo')
    if(tipo == 'false'){
        verForm = false
    }
  return {
    verForm
  }
})(EditarTecnicoForm)

export default EditarTecnicoForm
