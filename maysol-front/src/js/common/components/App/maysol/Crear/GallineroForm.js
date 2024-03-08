import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderSelectField} from 'Utils/renderField/renderField';
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from 'api/api';
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

let GallineroForm = props => {
    const { handleSubmit, editar } = props;
    const { updateData, cuentas } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">

                    <div className="row col-md-8">
                        <div className="col-md-6">
                            <div className="m-0 col-sm-12 form-group">
                                <label htmlFor="granja">Granja*:</label>
                            </div>
                            <div className="col-sm-12 form-group">
                                <Field
                                        name={`granja`}
                                        valueKey="id"
                                        labelKey="nombre"
                                        label="Proyecto"
                                        component={renderSearchSelect}
                                        loadOptions={getProyectos}
                                        />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="col-sm-12 m-0 form-group">
                                <label htmlFor="representante">Representante*:</label>
                            </div>
                            <div className="col-sm-12 form-group">
                                <Field name="representante" component={renderField} type="text" className="form-control" />
                            </div>
                        </div>

                    </div>
                     <div className="row border-naranja py-4">
                        <div className="col-md-4">
                            <div className="col-sm-12 m-0 form-group">
                                <label htmlFor="empresa">Gallinero*:</label>
                            </div>
                            <div className="col-sm-12 form-group">
                                <Field name="gallinero" component={renderField} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="col-sm-12 m-0 form-group">
                                <label htmlFor="empresa">Cantidad de Gallinas*:</label>
                            </div>
                            <div className="col-sm-12 form-group">
                                <Field name="gallinero" component={renderField} type="number" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="col-sm-12 form-group">
                                <label htmlFor="empresa">Fecha de Inicio*:</label>
                            </div>
                            <div className="col-sm-12 m-0 form-group">
                                <Field name="gallinero" component={renderField} type="text" className="form-control" />
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/bodegas">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
};

GallineroForm = reduxForm({
    form: 'bodega',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
            'direccion': validators.exists()('Campo requerido.'),
        })
    }
})(GallineroForm);

export const GallineroUpdateForm = reduxForm({
    form: 'bodega',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
            'nit': validators.exists()('Campo requerido.'),
        })
    },
    asyncBlurFields: []
})(GallineroForm);
export default GallineroForm
