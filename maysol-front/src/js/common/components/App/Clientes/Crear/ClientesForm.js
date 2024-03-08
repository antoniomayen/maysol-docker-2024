import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderSelectField, renderTextArea} from '../../../Utils/renderField/renderField';
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
                <div className="col-sm-12 form-group np-r p-0">
                    <table className="table table-sm  m-0">
                        <tbody>
                        <tr>
                            <th style={{width: "30%"}} >Banco</th>
                            <th style={{width: "30%"}} >No</th>
                            <th style={{width: "30%"}} >Tipo</th>
                            <th style={{width: "10%"}} />
                        </tr>
                        {fields.map((cuenta, index) => (
                            <tr key={index}>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${cuenta}.banco`}
                                        type="text"
                                        component={renderField}
                                        placeholder="Nombre"
                                    />
                                </td>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${cuenta}.numero`}
                                        type="text"
                                        component={renderField}
                                        placeholder="Representante"
                                    />
                                </td>
                                <td className="sin-borde-top">

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
                <div className=" col-sm-12 form-group np-r p-0">
                    <table className="table table-sm  m-0">
                        <tbody>
                        <tr>
                            <th style={{width: "22%"}} >Nombre</th>
                            <th style={{width: "22%"}} >Puesto</th>
                            <th style={{width: "22%"}} >Teléfono</th>
                            <th style={{width: "22%"}} >correo</th>
                            <th style={{width: "10%"}} />
                        </tr>
                        {fields.map((contacto, index) => (
                            <tr key={index}>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${contacto}.nombre`}
                                        type="text"
                                        component={renderField}
                                        placeholder="Nombre"
                                    />
                                </td>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${contacto}.puesto`}
                                        type="text"
                                        component={renderField}
                                        placeholder="Representante"
                                    />
                                </td>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${contacto}.telefono`}
                                        type="text"
                                        component={renderField}
                                        placeholder="Representante"
                                    />
                                </td>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${contacto}.correo`}
                                        type="text"
                                        component={renderField}
                                        placeholder="Representante"
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
                                Agregar Contacto
                        </button>
                    </div>
            </div>
    </div>
)


let ClienteForm = props => {
    const { handleSubmit, editar } = props;
    const { updateData, cuentas } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">


                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 ">
                            <label htmlFor="nombre">Nombre*:</label>
                        </div>
                         <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="nombre" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <label htmlFor="empresa">Dirección:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                           <Field name="direccion" component={renderField} type="text" className="form-control"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 ">
                            <label htmlFor="nit">Nit:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="nit" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 ">
                            <label htmlFor="codigo">Código:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="codigo" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 ">
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
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 ">
                            <label htmlFor="descripcion">Descripción:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group textarea-grande">
                            <Field name="descripcion"
                                component={renderTextArea}
                                type="text"
                                className="form-control " />
                        </div>
                    </div>
                    <FieldArray name="contactos" component={renderContactos} />

                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/admin_clientes">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

ClienteForm = reduxForm({
    form: 'cliente',
    validate: data => {
        return validate(data, {
            'nombre': validators.exists()('Campo requerido.')
        })
    }
})(ClienteForm)

//In update form, picture is not a required field
export const ClienteUpdateForm = reduxForm({
    form: 'cliente',
    asyncBlurFields: [],
    validate: data => {
        return validate(data, {
            'nombre': validators.exists()('Campo requerido.')
        })
    }
})(ClienteForm)
export default ClienteForm
