import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect } from '../../../Utils/renderField/renderField';

import { api } from '../../../../../api/api';
import _ from "lodash";

const cuentas = []
const empleados = []


const getUsuarios = (search) => {

    return api.get(`users`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if(!_.find(empleados, {id: item.id})) {
                empleados.push(item);
            }
        });
        return { options: empleados}
    })
}

let EditarTecnicoForm = props => {
    const { handleSubmit} = props;

    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="text-center mb-md-5">
                        <h3><strong>{props.granja.nombre}</strong></h3>
                    </div>
                    <div className="row border-naranja pb-1 pt-4 mb-2 ">

                        <div className="row col-md-8 form-group">
                            <div className="col-md-4">
                                <label htmlFor="tecnico">
                                   Técnico de control:
                                </label>
                            </div>
                            <div className="col-md-12">
                                <Field
                                    name={`tecnico`}
                                    valueKey="id"
                                    labelKey="nombreCompleto"
                                    label="Tecnico"
                                    component={renderSearchSelect}
                                    loadOptions={getUsuarios}
                                    />
                            </div>
                        </div>
                        <div className="row col-md-12 form-group">
                            <div className="col-md-6">
                                <div className="col-md-4">
                                    <label htmlFor="telefono">
                                        Teléfono:
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <Field name="telefono" component={renderField} type="text" className="form-control" />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="col-md-4">
                                    <label htmlFor="direccion">
                                        Dirección:
                                    </label>
                                </div>
                                <div className="col-md-12">
                                    <Field name="direccion" component={renderField} type="text" className="form-control" />
                                </div>
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

EditarTecnicoForm = reduxForm ({
    form: 'cambioTecnico',
    validate: data =>{
        return validate(data, {
            'tecnico': validators.exists()("Campo requerido."),
        });
    }
})(EditarTecnicoForm)


export default EditarTecnicoForm
