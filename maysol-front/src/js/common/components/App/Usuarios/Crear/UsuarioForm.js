import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, FieldArray, formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import { validate, validators } from 'validate-redux-form';
import { renderField, renderSearchSelect, renderSelectField, renderFieldCheck } from "Utils/renderField/renderField";
import Validators, { required, email, length, phone  } from 'redux-form-validators';
import { ROLES, nivelesOptions } from '../../../../utility/constants';
import { api } from '../../../../../api/api';
import _ from "lodash";
import validador from './validate';

const cuentas = []

let cuentasBorrar = []
const proyectos = []

const getCuentas = (search) => {

    return api.get(`cuentas`, {search}).catch((error) => {
    }).then((data) => {
        data.results.forEach(item => {
            if(!_.find(cuentas, {id: item.id})) {
                cuentas.push(item);
            }
        });
        return { options: cuentas}
    })
}
const getProyectos = () =>{
    return api.get("proyectos").catch((error) => {})
            .then((data) => {
                data.results.forEach(item => {
                    if(!_.find(proyectos, {id: item.id})) {
                        proyectos.push(item);
                    }
                })
                return {options: proyectos}
            })
}

const renderPermisos = ({fields, meta: {error, submitFailed }, accesos}) => (
    <div className="row col-sm-12 p-0">
                <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                    <label htmlFor="first_name">Cuentas*:</label>
                </div>
                <div className="col-lg-9  col-md-9 col-sm-12 form-group np-r">
                    <table className="table table-sm table-hover m-0">
                        <tbody>
                        {fields.map((acceso, index) => (
                            <tr key={index}>
                                <Field
                                name={`${acceso}.administrador`}
                                component={renderFieldCheck}
                                type="text"
                                className="form-control"
                                placeholder="Nombre"/>
                            </tr>
                        ))}
                        </tbody>
                    </table>
            </div>
    </div>
)

let UsuarioForm = props => {
    const { handleSubmit, mostrar_pass, cambiarEstadoPass, verCheck, usuario } = props;
    const { editando }  = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                            <label htmlFor="first_name">Nombre*:</label>
                        </div>
                        <div className="col-lg-9  col-md-9 col-sm-12 form-group">
                            <Field name="first_name" component={renderField} type="text" className="form-control" placeholder="Nombre"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                            <label htmlFor="last-name">Apellido*:</label>
                        </div>
                        <div className="col-lg-9  col-md-9 col-sm-12 form-group">
                            <Field name="last_name" component={renderField} type="text" className="form-control" placeholder="Apellido"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                            <label htmlFor="username">Usuario*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="username" component={renderField} type="text" className="form-control" placeholder="Usuario"/>
                        </div>
                    </div>
                    {
                        mostrar_pass &&
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                                <label htmlFor="password">Contraseña*:</label>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                                <Field name="password" component={renderField} type="text" className="form-control" placeholder="ContraseÃ±a"/>
                            </div>
                        </div>
                    }
                    {
                        editando &&
                        <div className="row d-flex justify-content-end">
                            <button type="button" className="btn btn-link pt-0" onClick={props.cambiarEstado}>
                            {
                                mostrar_pass ? <span>Ocultar Campo.</span> : <span>Cambiar contraseña.</span>
                            }
                            </button>
                        </div>

                    }

                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                            <label htmlFor="email">Correo*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="email" component={renderField} type="email" className="form-control" placeholder="Correo"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                            <label htmlFor="telefono">Teléfono*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="telefono" component={renderField} type="number" className="form-control" placeholder="TelÃ©fono" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                            <label htmlFor="puestos">Puesto*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group ">
                            <Field name="puestos" component={renderSelectField} key type="select" labelKey="label" valueKey="value"
                                options={nivelesOptions}
                            />
                        </div>
                    </div>
                    {
                        verCheck && (
                            <div className="row">
                                <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                                </div>
                                <div className="col-lg-9  col-md-9 col-sm-12 form-group custom-control custom-checkbox">
                                    <FormSection name="accesos">

                                        <div className="row col-12">
                                            <div className="col-auto m-0 form-group label">
                                                <Field name="supervisor" component={renderFieldCheck}
                                                    type="checkbox"
                                                    className="form-control"
                                                    placeholder="Correo"/>
                                            </div>
                                            <div className="ml-3 ml-sm-0 col-lg-9 m-0 col-md-9 col-sm-12 form-group ">
                                                <label htmlFor="class">Supervisor</label>

                                            </div>
                                        </div>
                                        <div className="row col-12">
                                            <div className="col-auto m-0 form-group label">
                                                <Field name="vendedor" component={renderFieldCheck}
                                                    type="checkbox"
                                                    className="form-control"
                                                    placeholder="Correo"/>
                                            </div>
                                            <div className="ml-3 ml-sm-0 col-lg-9 m-0 col-md-9 col-sm-12 form-group ">
                                                <label htmlFor="class">Vendedor</label>

                                            </div>
                                        </div>
                                        <div className="row col-12">
                                            <div className="col-auto m-0 form-group label">
                                                <Field name="bodeguero" component={renderFieldCheck}
                                                    type="checkbox"
                                                    className="form-control"
                                                    placeholder="Correo"/>
                                            </div>
                                            <div className="ml-3 ml-sm-0 col-lg-9 col-md-9 m-0 col-sm-12 form-group ">
                                                <label htmlFor="class">Bodeguero</label>

                                            </div>
                                        </div>
                                        <div className="row col-12">
                                            <div className="col-auto m-0 form-group label">
                                                <Field name="compras" component={renderFieldCheck}
                                                    type="checkbox"
                                                    className="form-control"
                                                    placeholder="Correo"/>
                                            </div>
                                            <div className="ml-3 ml-sm-0 col-lg-9 col-md-9 col-sm-12 m-0 form-group ">
                                                <label htmlFor="class">Compras</label>

                                            </div>
                                        </div>
                                        <div className="row col-12">
                                            <div className="col-auto form-group label m-0">
                                                <Field name="sin_acceso" component={renderFieldCheck}
                                                    type="checkbox"
                                                    className="form-control"
                                                    placeholder="Correo"/>
                                            </div>
                                            <div className="ml-3 ml-sm-0 col-lg-9 col-md-9 col-sm-12 form-group m-0">
                                                <label htmlFor="class">Sin acceso</label>

                                            </div>
                                        </div>

                                    </FormSection>

                                    <Field name="errorPermisos" component={renderField} type="text" disabled={true} addClass={'ocultar'}/>
                                </div>
                            </div>
                        )
                    }

                    <div>
                        <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                                <label htmlFor="proyecto">Empresa*:</label>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-12 form-group ">
                                {
                                    editando ? (
                                        <span className="h4 text-rosado">
                                            {usuario.proyecto}
                                        </span>
                                    ) :
                                    (
                                        <Field
                                            name={`proyecto`}
                                            valueKey="id"
                                            labelKey="nombre"
                                            label="Proyecto"
                                            component={renderSearchSelect}
                                            loadOptions={getProyectos}
                                            />
                                    )
                                }
                            </div>
                         </div>
                    </div>


                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/admin_usuarios">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

UsuarioForm = reduxForm({
    asyncBlurFields: [], // this seems to prevent the error
    form: 'usuario',
    validate: validador
})(UsuarioForm)
const selector = formValueSelector('usuario');
UsuarioForm = connect(state  => {
    const rol = selector(state, 'puestos');
    let verCheck = false;
    if (rol == ROLES.COLABORADOR) {
        verCheck = true;
    }
    return {
        verCheck
    }
})(UsuarioForm)

//In update form, picture is not a required field
export const UsuarioUpdateForm = reduxForm({
    form: 'usuario',
    validate: data => {
        return validate(data, {
            'username': validators.exists()('Campo requerido.'),
            'first_name': validators.exists()('Campo requerido.'),
            'last_name': validators.exists()('Campo requerido.'),
            'telefono': validators.exists()('Campo requerido.'),
        })
    }
})(UsuarioForm)

export default UsuarioForm
