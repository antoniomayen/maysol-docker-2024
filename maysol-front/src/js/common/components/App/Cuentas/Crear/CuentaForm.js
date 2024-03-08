import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSelectField} from '../../../Utils/renderField/renderField';
import { Monedas } from '../../../../utility/constants';
import Validators, { required, email, length  } from 'redux-form-validators';

const Form = props => {
    const { handleSubmit } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">


                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="banco">Banco*:</label>
                        </div>
                         <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="banco" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="numero">Numero de cuenta*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="numero" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>
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
                            <label htmlFor="nombre">Moneda*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field
                                name="moneda"
                                component={renderSelectField}
                                key type="select"
                                labelKey="label"
                                valueKey="value"
                                options={Monedas}/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/cuentas">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

const CuentaForm = reduxForm({
    form: 'cuenta',
    validate: data => {
        return validate(data, {
            'banco': validators.exists()('Campo requerido.'),
            'numero': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
            'moneda': validators.exists()('Campo requerido.')
        })
    },
    initialValues: {
        moneda: 'GTQ'
    }
})(Form)

//In update form, picture is not a required field
export const CuentaUpdateForm = reduxForm({
    form: 'cuenta',
    validate: data => {
        return validate(data, {

            'banco': validators.exists()('Campo requerido.'),
            'numero': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
            'moneda': validators.exists()('Campo requerido.')
        })
    }
})(Form)

export default CuentaForm
