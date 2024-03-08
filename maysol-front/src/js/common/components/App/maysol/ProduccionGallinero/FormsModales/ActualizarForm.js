import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderTextArea, renderTimeField } from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker';
import { api } from 'api/api';
import _ from "lodash";



let EditarTecnicoForm = props => {
    const { handleSubmit, verForm} = props;

    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">

                    {/* fin selecciones */}

                            <div className="py-4">
                                <div className="row px-2">
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="fecha">
                                                Fecha control:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field
                                                    name={'fecha'}
                                                    className=""
                                                    component={renderDatePicker}
                                                    placeholder="Fecha"
                                                    numberOfMonths={1}
                                                />
                                        </div>
                                    </div>
                                    <div className="row col-md-6 form-group">
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
                                        </div>


                                </div>
                                <div className="row px-2">

                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="edad">
                                                Fecha inicio:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field
                                                    name={'fechaInicio'}
                                                    className=""
                                                    disabled={true}
                                                    component={renderDatePicker}
                                                    placeholder="Fecha"
                                                    numberOfMonths={1}
                                                />
                                        </div>
                                    </div>
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="edad">
                                                Edad Semanas:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="edad" component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                </div>


                                <div className="row px-2">
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="raza">
                                                Raza Gallinas:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="raza" component={renderField} type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="noGallinas">
                                            No de Gallinas:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="noGallinas" component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row px-2">
                                    <div className="col-12 col-md-auto">
                                        <label htmlFor="justificacion">
                                        Comentario:
                                        </label>
                                    </div>
                                    <div className="col">
                                        <Field
                                            name={'justificacion'}
                                            className=""
                                            component={renderTextArea}
                                            placeholder="Fecha"
                                        />
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
            'tecnico': validators.exists()("Campo requerido."),
            'edad': validators.exists()("Campo requerido"),
            'hora': validators.exists()("Campo requerido"),
            'justificacion': validators.exists()("Campo requerido"),
            'noGallinas': validators.exists()("Campo requerido"),
            'raza': validators.exists()("Campo requerido")
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
