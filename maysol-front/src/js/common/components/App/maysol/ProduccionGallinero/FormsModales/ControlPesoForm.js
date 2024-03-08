import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderTextArea, renderTimeField } from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import { api } from 'api/api';
import _ from "lodash";

const cuentas = []
const empleados = []


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

const renderPesos = ({fields, meta: {error, submitFailed }}) => (
    <div className=" col-sm-12 p-0">
                <div className="col-md-12 p-0 text-center text-primary font-italic">
                    <strong>Ingrese peso actual </strong>
                </div>
                <div className="col-sm-12 p-0 form-group np-r">
                    <table className="table table-sm  m-0">
                        <tbody>

                        {fields.map((peso, index) => (
                            <tr key={index}>
                                <td className="sin-borde-top text-center">
                                    Gallina {index +1}
                                </td>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${peso}.peso`}
                                        type="number"
                                        component={renderField}
                                        placeholder="peso"
                                    />
                                </td>
                                <td className="text-center sin-borde-top" style={{width: "10%"}}>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-normal "
                                        onClick={() =>{
                                            fields.remove(index)
                                        }}
                                    >X</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center mt-2">
                        <button type="button" className="btn btn-secondary" onClick={() => fields.push({})}>
                                Agregar gallina
                        </button>
                    </div>
            </div>
    </div>
)

let PesoForm = props => {
    const { handleSubmit} = props;

    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row col-md-12">
                        <div className="col-md-6">
                            <div className="col-12 col-md-auto">
                                <label htmlFor="fecha">
                                Fecha de control:
                                </label>
                            </div>
                            <div className="col-md-12">
                                <Field
                                    name={'fecha'}
                                    className=""
                                    component={renderDatePicker}
                                    placeholder="Fecha"
                                    numberOfMonths={1}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="col-12 col-md-auto">
                                <label htmlFor="fecha">
                                Hora:
                                </label>
                            </div>
                            <div className="col-md-12">
                                <Field
                                    name={`hora`}
                                    component={renderTimeField}
                                    required={ true }/>
                            </div>
                        </div>

                    </div>
                    <div className="pb-1 pt-4 my-4 d-flex justify-content-center">
                        <div className="col-md-8 border-naranja">
                            <FieldArray name="pesos" component={renderPesos} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-auto">
                            <label htmlFor="nota">
                               Comentario:
                            </label>
                        </div>
                        <div className="col">
                            <Field
                                name={'nota'}
                                className=""
                                component={renderTextArea}
                                placeholder="Fecha"
                            />
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

PesoForm = reduxForm ({
    form: 'movimiento',
    validate: data =>{
        return validate(data, {
            'fecha': validators.exists()("Campo requerido."),
            'hora': validators.exists()("Campo requerido"),
            'comentario': validators.exists()("Campo requerido."),
        });
    },
    initialValues: {
        pesos: [
            {}
        ]
    },
})(PesoForm)


export default PesoForm
