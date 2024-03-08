import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect} from '../../../Utils/renderField/renderField';
import { renderSelectPlusField} from '../../../Utils/renderField/renderSelectplus';
import Validators, { required, email, length  } from 'redux-form-validators';
import { connect } from 'react-redux'





let CategoriaForm = props => {
    const { handleSubmit, editar, cf, pl } = props;
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
                            <label htmlFor="nombrejapones">Nombre Japonés*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="nombrejapones" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="cf">CF*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field
                            name="cf"
                            component={renderSelectPlusField}
                            type="text"
                            options={cf}
                            labelKey="label" valueKey="id"
                            className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="pl">PL*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field
                            name="pl"
                            component={renderSelectPlusField}
                            type="text"
                            options={pl}
                            labelKey="label" valueKey="id"
                            className="form-control"  />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/admin_categorias">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

CategoriaForm = reduxForm({
    form: 'categoria',
    validate: data => {
        return validate(data, {
            'nombre': validators.exists()('Campo requerido.'),
            'tipoGasto': validators.exists()('Campo requerido.'),
            'nombrejapones': validators.exists()('Campo requerido.')

        })
    }
})(CategoriaForm)

//In update form, picture is not a required field
export const CategoriaUpdateForm = reduxForm({
    form: 'categoria',
    validate: data => {
        return validate(data, {

            'nombre': validators.exists()('Campo requerido.'),
            'nombrejapones': validators.exists()('Campo requerido.')
        })
    },
    asyncBlurFields: []
})(CategoriaForm)

export default CategoriaForm
