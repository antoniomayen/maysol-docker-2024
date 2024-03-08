import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderField } from '../Utils/renderField'

const LoginForm = props => {
    const { handleSubmit, color, colorH, pristine, reset, submitting } = props;

    const onMouseOut = (event) => {
        const el = event.target;
        el.style.setProperty('background-image', color, 'important');
    };

    const onMouseOver = (event) => {
        const el = event.target;
        el.style.setProperty('background-image', colorH, 'important');
    };

    return (
        <form name="loginForm" className="form-validate mb-lg" onSubmit={handleSubmit}>
            <div className="form-group has-feedback">
                <div className="col-12">
                    <label htmlFor="first_name">Usuario:</label>
                </div>
                <div className="col-12">
                    <Field name="username" component={renderField} type="text" className="form-control" />
                </div>

            </div>
            <div className="form-group has-feedback">
                <div className="col-12">
                    <label htmlFor="first_name">Contraseña:</label>
                </div>
                <div className="col-12">
                    <Field name="password" component={renderField} type="password" className="form-control" />
                </div>
            </div>
            <div className="clearfix" />
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-start flex-column flex-sm-row align-items-stretch align-items-sm-center">
                        <button
                            type="submit"
                            className="btn btn-primary m-1"
                            onMouseEnter={onMouseOver}
                            onMouseOut={onMouseOut}
                            ref={(el) => {
                                if (el) { el.style.setProperty('background-image', color, 'important'); }
                            }}
                        >
                            Iniciar Sesión
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default reduxForm({ form: 'login' })(LoginForm);
