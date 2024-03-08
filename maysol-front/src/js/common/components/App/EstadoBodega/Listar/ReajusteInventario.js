import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'

import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderTextArea} from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import { dateFormatter } from '../../../Utils/renderField/renderReadField';
import Validators, { required, email, length  } from 'redux-form-validators';
import validador  from './validate';
import _ from "lodash";



let ReajusteForm = props => {
    const { handleSubmit } = props;
    return (
        <form onSubmit={handleSubmit}>
        <div className="form-group grid-container">
            <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                <div>
                    <div className="row">
                        <div className=" col-md-4 form-group m-0">
                            <div className="col-md-12">
                                <label htmlFor="concepto" className="m-0">Lote:</label>
                            </div>
                            <div className="col">
                                <p className="text-rosado font-weight-bold text-uppercase">{dateFormatter(props.valores.fecha)}</p>
                            </div>
                        </div>
                        <div className=" col-md-4 form-group m-0">
                            <div className="col-md-auto">
                                <label htmlFor="concepto" className="m-0">Producto:</label>
                            </div>
                            <div className="col">
                                <p className="text-rosado font-weight-bold text-uppercase">{props.valores.producto}</p>
                            </div>
                        </div>
                        <div className=" col-md-4 form-group m-0">
                            <div className="col-md-auto">
                                <label htmlFor="concepto" className="m-0">Unidades actuales:</label>
                            </div>
                            <div className="col">
                                <p className="text-rosado font-weight-bold text-uppercase">{props.valores.cantidad}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="border-naranja">
                    <div className="col-md-12 form-group">
                        <div className="col-md-12 text-center">
                            <label htmlFor="justificacion">
                                Actualizar unidades
                            </label>
                        </div>
                        <div className="col-md-12 d-flex justify-content-center">
                            <div className="col-md-4">
                                <Field name="reajuste" className=""
                                    component={renderField}
                                    type="number"
                                    placeholder="Actualizar"  />
                            </div>
                        </div>

                    </div>
                    <div className="col-md-12 form-group">
                        <div className="col-md-12 text-center">
                            <label htmlFor="nota">
                                Nota
                            </label>
                        </div>
                        <div className="col-md-12 d-flex justify-content-center">
                            <div className="col-md-6">
                                <Field name="nota" className=""
                                    component={renderTextArea}
                                    type="number"
                                    placeholder="Actualizar"  />
                            </div>
                        </div>

                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 d-flex justify-content-center">
                        <div className="col-md-6 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                            <button type="button" onClick={props.closeModal} className="btn btn-secondary m-1">
                                Cancelar
                            </button>
                            <button type="submit" className="btn btn-primary m-1">
                                Actualizar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
    );
}

ReajusteForm = reduxForm ({
    form: 'reajuste',
    validate: validador
})(ReajusteForm)


export default ReajusteForm
