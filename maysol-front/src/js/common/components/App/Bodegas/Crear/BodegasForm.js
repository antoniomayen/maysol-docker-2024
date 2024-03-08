import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSearchSelect, renderNoAsyncSelectField } from '../../../Utils/renderField/renderField';
import Validators, { required, email, length } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import { update } from '../../../../../redux/modules/Proyectos/proyectos';
import { connect } from 'react-redux'

const proyectos = []

const getProyectos = () => {
    return api.get("proyectos").catch((error) => { })
        .then((data) => {
            data.results.forEach(item => {
                if (!_.find(proyectos, { id: item.id })) {
                    proyectos.push(item);
                }
            });
            return { options: proyectos }
        })
};

class EstructuraBodega extends Component {
    state = {
        encargados: []
    }
    componentWillMount(){
    }
    componentDidUpdate(prevProps, prevState){
        if(prevProps.valores !== this.props.valores){
            if(this.props.editar && (prevProps.valores == null || prevProps.valores == undefined)){
                this.getEncargados(this.props.valores.empresa.id)
            }
        }
    }

    getEncargados = (proyecto) => {
        let usuarios = [];
        api.get("users",{proyecto:proyecto, accesos__bodeguero:true}).catch((error) => { })
        .then((data) => {
            data.results.forEach(item => {
                if (!_.find(usuarios, { id: item.id })) {
                    usuarios.push({value: item.id, label: item.first_name});
                }
            });
            this.setState({encargados: usuarios})
        })
    }
    render() {

        return (
            <Fragment>
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
                        <label htmlFor="direccion">Dirección*:</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                        <Field name="direccion" component={renderField} type="text" className="form-control" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <label htmlFor="empresa">empresa*:</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                        <Field
                            name={`empresa`}
                            valueKey="id"
                            labelKey="nombre"
                            label="Proyecto"
                            onCambio={e => {
                                if(e){
                                    this.getEncargados(e.id);
                                }
                            }}
                            component={renderSearchSelect}
                            loadOptions={getProyectos}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <label htmlFor="encargado">Encargado*:</label>
                    </div>
                    <div className="col-lg-9 col-md-9 col-sm-12 form-group">
                        <Field
                            name={`encargado`}
                            valueKey="id"
                            labelKey="first_name"
                            label="Encargado"
                            component={renderNoAsyncSelectField}
                            options={this.state.encargados}
                        />
                    </div>
                </div>
            </Fragment>
        )
    }
}

let BodegaForm = props => {
    const { handleSubmit, editar } = props;
    const { updateData, cuentas, valores } = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <EstructuraBodega valores={valores} editar={editar}/>
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

BodegaForm = reduxForm({
    form: 'bodega',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
            'direccion': validators.exists()('Campo requerido.'),
        })
    }
})(BodegaForm);
const selector = formValueSelector('bodega');
BodegaForm = connect(state => {
    const tiene_caja = selector(state, "tiene_caja");
    let valores;
    if(state.form.bodega && state.form.bodega.values){
        valores = state.form.bodega.values;
    }
    return {
        valores
    };
})(BodegaForm);
export const BodegaUpdateForm = reduxForm({
    form: 'bodega',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'nombre': validators.exists()('Campo requerido.'),
            'nit': validators.exists()('Campo requerido.'),
        })
    },
    asyncBlurFields: []
})(BodegaForm);
export default BodegaForm
