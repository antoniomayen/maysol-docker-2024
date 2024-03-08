import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderSelectField, renderFieldCheck, renderSwitch} from '../../../Utils/renderField/renderField';
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import { update } from '../../../../../redux/modules/Proyectos/proyectos';
import { connect } from 'react-redux'


let cuentas = []

const getCuentas = (search) => {

    return api.get(`cuentas/getSelectCuenta`, {search}).catch((error) => {
    }).then((data) => {
        cuentas = []
        data.forEach(item => {
            if(!_.find(cuentas, {id: item.id})) {
                cuentas.push(item);
            }
        });
        return { options: cuentas}
    })
}
const renderSubEmpresa = ({fields, meta: {error, submitFailed }, empresa}) => (
    <div className="row col-sm-12 p-0">
                <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                    <label htmlFor="first_name">Subempresas*:</label>
                </div>
                <div className="col-lg-9  col-md-9 col-sm-12 form-group np-r over-h">
                    <table className="table table-sm table-responsive-sm  m-0">
                        <tbody>
                        <tr>
                            <th style={{width: "30%"}} >Nombre</th>
                            <th style={{width: "30%"}} >Representante</th>
                            <th style={{width: "10%"}} />
                        </tr>
                        {fields.map((empresa, index) => (
                            <tr key={index}>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${empresa}.nombre`}
                                        type="text"
                                        component={renderField}
                                        placeholder="Nombre"
                                    />
                                </td>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${empresa}.representante`}
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
                                Agregar Sub empresa
                        </button>
                    </div>
            </div>
    </div>
)
const renderCuentas = ({fields, meta: {error, submitFailed}, cuenta}) => (
    <div className="row col-sm-12 p-0">
                <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                    <label htmlFor="first_name">Cuentas*:</label>
                </div>
                <div className="col-lg-9  col-md-9 col-sm-12 form-group np-r">
                    <table className="table table-sm  m-0">
                        <tbody>
                        <tr>
                            <th style={{width: "90%"}} >Cuenta</th>
                            <th style={{width: "10%"}} />
                        </tr>
                        {fields.map((cuenta, index) => (
                            <tr key={index}>

                                <td className="sin-borde-top">
                                    <Field
                                        name={`${cuenta}.id`}
                                        valueKey="id"
                                        labelKey="nombre"
                                        label="Cuenta"
                                        component={renderSearchSelect}
                                        loadOptions={getCuentas}
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
                                Agregar cuenta
                        </button>
                    </div>
            </div>
    </div>
)
let ProyectoForm = props => {
    const { handleSubmit, editar } = props;
    const { updateData, cuentas } = props;
    const { verCuentas } = props;
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
                            <label htmlFor="representante">Representante*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                            <Field name="representante" component={renderField} type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 label">
                            <label htmlFor="fase">fase*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group ">
                            <Field name="fase" component={renderSelectField} key type="select" labelKey="label" valueKey="value"
                                options={[
                                    { value: 10, label: 'Investigación.' },
                                    { value: 20, label: 'Empresa.' }

                                ]}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-3 col-md-3 col-sm-12 form-group label">
                            <label htmlFor="fase">Gallineros*:</label>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-12 form-group ">
                            <Field name={`es_gallinero`} component={renderSwitch}
                                type="text"
                                className="form-control"
                                placeholder="Correo"/>
                        </div>
                    </div>
                    {
                        verCuentas && (
                            <FieldArray name="empresas" component={renderSubEmpresa} />
                        )
                    }
                    {
                        verCuentas &&(

                            <FieldArray name="cuentas" component={renderCuentas} />
                        )
                    }




                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/admin_empresas">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

ProyectoForm = reduxForm({
    form: 'proyecto',
    validate: data => {
        return validate(data, {
            'nombre': validators.exists()('Campo requerido.'),
            'representante': validators.exists()('Campo requerido.')

        })
    },
    initialValues: {
        cuentas: [{}]
    }
})(ProyectoForm)
const selector = formValueSelector('proyecto'); // <-- same as form name
ProyectoForm = connect(state => {
  // can select values individually
  const fase = selector(state, 'fase')
  let verCuentas = false;
  if(fase == '20') {
    verCuentas = true;
  }
  return {
    verCuentas: verCuentas
  }
})(ProyectoForm)
//In update form, picture is not a required field
export const ProyectoUpdateForm = reduxForm({
    form: 'proyecto',
    validate: data => {
        return validate(data, {

            'nombre': validators.exists()('Campo requerido.'),
            'representante': validators.exists()('Campo requerido.')
        })
    },
    asyncBlurFields: []
})(ProyectoForm)

export default ProyectoForm
