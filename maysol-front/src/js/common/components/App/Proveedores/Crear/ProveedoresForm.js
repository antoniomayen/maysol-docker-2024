import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderSelectField} from '../../../Utils/renderField/renderField';
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import { update } from '../../../../../redux/modules/Proyectos/proyectos';
import { connect } from 'react-redux'

const proyectos = []

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

const renderCuentas = ({fields, meta: {error, submitFailed }, cuentas}) => (
    <div className=" col-sm-12 p-0">
        <div className="col-sm-12 form-group label p-0">
            <label htmlFor="first_name">Cuentas*:</label>
        </div>
        <div className="row ver-escritorio-flex titulo-tabla py-1">
            <div className="col-4"><strong>Banco</strong></div>
            <div className="col-4"><strong>Numero</strong></div>
            <div className="col-3"><strong>Tipo</strong></div>
            <div className="col-1" />
        </div>
        {fields.map((cuenta, index) => (
            <div className="mb-2 mb-sm-0 border-naranja-movil">
                <div className="float-right mt-2 mr-2 ver-movil-flex">
                    <button type="button" className="btn btn-danger btn-normal"
                            onClick={() =>{
                                fields.remove(index)
                            }}>X
                    </button>
                </div>
                <div className="row py-2 py-sm-1">
                    <div className="col-12 col-sm-4">
                        <label className="ver-movil">Banco:</label>
                        <Field
                            name={`${cuenta}.banco`}
                            type="text"
                            component={renderField}
                            placeholder="Nombre"
                        />
                    </div>
                    <div className="col-12 col-sm-4">
                        <label className="ver-movil">Numero:</label>
                        <Field
                            name={`${cuenta}.numero`}
                            type="text"
                            component={renderField}
                            placeholder="Representante"
                        />
                    </div>
                    <div className="col-12 col-sm-3 col-md-0">
                        <label className="ver-movil">Tipo:</label>
                        <Field name={`${cuenta}.tipo`}
                               component={renderSelectField}
                               key type="select"
                               labelKey="label"
                               valueKey="value"
                               options={[
                                   { value: 'MONETARIO', label: 'Monetario.' },
                                   { value: 'AHORRO', label: 'Ahorro.' }

                               ]}
                        />
                    </div>
                    <div className="col-1 ver-escritorio" >
                        <button
                            type="button"
                            className="btn btn-danger btn-normal "
                            onClick={() =>{
                                fields.remove(index)
                            }}
                        >X</button>
                    </div>
                </div>
            </div>
        ))}
        <div className="col-sm-12 form-group np-r p-0">
            <div className="d-flex justify-content-center mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => fields.push({})}>
                    Agregar Cuenta
                </button>
            </div>
        </div>
    </div>
)


const renderContactos = ({fields, meta: {error, submitFailed }, contactos}) => (
    <div className=" col-sm-12 p-0">
        <div className="col-sm-12 form-group label p-0">
            <label htmlFor="first_name">contactos*:</label>
        </div>
        <div className="row ver-escritorio-flex titulo-tabla py-1">
            <div className="col-3"><strong>Nombre</strong></div>
            <div className="col-3"><strong>Puesto</strong></div>
            <div className="col-2"><strong>Teléfono</strong></div>
            <div className="col-3"><strong>Correo</strong></div>
            <div className="col-1" />
        </div>
        {fields.map((contacto, index) => (
            <div className="mb-2 mb-sm-0 border-naranja-movil">
                <div className="float-right mt-2 mr-2 ver-movil-flex">
                    <button type="button" className="btn btn-danger btn-normal"
                            onClick={() =>{
                                fields.remove(index)
                            }}>X
                    </button>
                </div>
                <div className="row py-2 py-sm-1">
                    <div className="col-12 col-sm-3">
                        <label className="ver-movil">Nombre:</label>
                        <Field
                            name={`${contacto}.nombre`}
                            type="text"
                            component={renderField}
                            placeholder="Nombre"
                        />
                    </div>
                    <div className="col-12 col-sm-3">
                        <label className="ver-movil">Puesto:</label>
                        <Field
                            name={`${contacto}.puesto`}
                            type="text"
                            component={renderField}
                            placeholder="Representante"
                        />
                    </div>
                    <div className="col-12 col-sm-2 col-md-0">
                        <label className="ver-movil">Teléfono:</label>
                        <Field
                            name={`${contacto}.telefono`}
                            type="text"
                            component={renderField}
                            placeholder="Representante"
                        />
                    </div>
                    <div className="col-12 col-sm-3">
                        <label className="ver-movil">Correo:</label>
                        <Field
                            name={`${contacto}.correo`}
                            type="text"
                            component={renderField}
                            placeholder="Representante"
                        />
                    </div>
                    <div className="col-1 ver-escritorio" >
                        <button
                            type="button"
                            className="btn btn-danger btn-normal "
                            onClick={() =>{
                                fields.remove(index)
                            }}
                        >X</button>
                    </div>
                </div>

            </div>
        ))}
        <div className=" col-sm-12 form-group np-r p-0">
            <div className="d-flex justify-content-center mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => fields.push({})}>
                    Agregar Contacto
                </button>
            </div>
        </div>
    </div>
)


let ProveedorForm = props => {
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
                            <label htmlFor="nit">Nit:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="nit" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="codigo">Código:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="codigo" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="correo_caja">Correo:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="correo_caja" component={renderField} type="email" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="empresa">empresa:</label>
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

                    <FieldArray name="cuentas" component={renderCuentas} />
                    <FieldArray name="contactos" component={renderContactos} />






                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/admin_proveedores">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

ProveedorForm = reduxForm({
    form: 'proveedor',
    validate: data => {
        return validate(data, {
            'nombre': validators.exists()('Campo requerido.')
        })
    }
})(ProveedorForm)

//In update form, picture is not a required field
export const ProveedorUpdateForm = reduxForm({
    form: 'proveedor',
    asyncBlurFields: [],
    validate: data => {
        return validate(data, {
            'nombre': validators.exists()('Campo requerido.')
        })
    }
})(ProveedorForm)
export default ProveedorForm
