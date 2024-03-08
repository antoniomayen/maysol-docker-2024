import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import {
    renderField,
    renderSearchSelect,
    renderSelectField,
    renderSwitch,
} from '../../../Utils/renderField/renderField';
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import { connect } from 'react-redux'

const proyectos = []

const getProyectos = () =>{
    return api.get("proyectos").catch((error) => {})
            .then((data) => {
                data.results.forEach(item => {
                    if(!_.find(proyectos, {id: item.id})) {
                        proyectos.push(item);
                    }
                });
                return {options: proyectos}
            })
};

let LineaProduccionForm = props => {
    const { handleSubmit, editar } = props;
    const { updateData, cuentas } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="nombre">Nombre*:</label>
                        </div>
                         <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="nombre" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>
                     <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="empresa">Empresa*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field
                                name={`empresa`}
                                valueKey="id"
                                labelKey="nombre"
                                label="Proyecto"
                                component={renderSearchSelect}
                                loadOptions={getProyectos}
                                />
                        </div>
                    </div>
                     <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="sumar_en_reporte">Sumar en reporte de gallineros*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="sumar_en_reporte" component={renderSwitch} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/admin_lineaproducciones">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
};

LineaProduccionForm = reduxForm({
    form: 'lineaproduccion',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
        })
    }
})(LineaProduccionForm);

export const LineaProduccionUpdateForm = reduxForm({
    form: 'lineaproduccion',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
        })
    },
    asyncBlurFields: []
})(LineaProduccionForm);
export default LineaProduccionForm
