import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSwitch, renderSearchSelect, renderSelectField} from '../../../Utils/renderField/renderField';
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import { update } from '../../../../../redux/modules/Proyectos/proyectos';
import { connect } from 'react-redux'


export const renderMultiplo = ({fields, meta: {error, submitFailed }, multiplo}) => (
               
                <div className="col-sm-12 form-group np-r ">
                    
                        {fields.map((multiplo, index) => (
                           
                            <div key={index} className="border-naranja mt-3"> 
                                <div className="row">
                                    
                                    <div className="col-md-4">
                                        <div className="col-md-12 m-0 form-group">
                                            <label htmlFor={`${multiplo}.presentacion`}>Presentación*:</label>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <Field name={`${multiplo}.presentacion`} component={renderField} type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="col-md-12 m-0 form-group">
                                            <label htmlFor={`${multiplo}.capacidad_maxima`}>Cantidad de unidades*:</label>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <Field name={`${multiplo}.capacidad_maxima`} component={renderField} type="text" className="form-control" />
                                        </div>
                                    </div>

                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="col-md-12 m-0 form-group">
                                            <label htmlFor={`${multiplo}.precio`}>Precio 01*:</label>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <Field name={`${multiplo}.precio`} component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="col-md-12 m-0 form-group">
                                            <label htmlFor={`${multiplo}.precio2`}>Precio 02:</label>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <Field name={`${multiplo}.precio2`} component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="col-md-12 m-0 form-group">
                                            <label htmlFor={`${multiplo}.precio3`}>Precio 03:</label>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <Field name={`${multiplo}.precio3`} component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="col-md-12 m-0 form-group">
                                            <label htmlFor={`${multiplo}.vendible`}>Vendible:</label>
                                        </div>
                                        <div className="col-md-12 form-group">
                                            <Field name={`${multiplo}.vendible`} component={renderSwitch} type="text" className="form-control" />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                        <div className="d-flex justify-content-center mt-2">
                        <button type="button" className="btn btn-secondary" onClick={() => fields.push({})}>
                                Agregar
                                <i class="fa fa-plus ml-2" aria-hidden="true"></i>
                        </button>
                    </div>
            </div>
)


