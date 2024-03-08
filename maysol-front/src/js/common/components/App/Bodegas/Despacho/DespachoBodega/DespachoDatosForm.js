import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { validate, validators } from 'validate-redux-form';
import { renderField, renderSearchSelect, renderNoAsyncSelectField} from 'Utils/renderField/renderField';
import { api } from 'api/api';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import moment from 'moment';


const productos = [];
let lineaproduccion = [];
let empresas = [];

const getProductos = (search) => {
    return api.get(`productos/get_fraccionesUnidad`,{search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.forEach(item => {
            if (!_.find(productos, { id: item.id })) {
                productos.push(item);
            }
        });
        return { options: productos }
    })
};
const getLineaProduccion = (search) => {
    return api.get(`lineaproduccion`,{search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if (!_.find(lineaproduccion, { id: item.id })) {
                lineaproduccion.push(item);
            }
        });
        return { options: lineaproduccion }
    })
};

const getProyectos = (search) =>{
    empresas = [];
    return api.get(`proyectos/getEmpresasBodega/`,{search}).catch((error) => {

    }).then((data) => {
        data.forEach(item => {
            if (!_.find(empresas, { id: item.id })) {
                empresas.push(item);
            }
        });
        return { options: empresas }
    })
};

const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        console.log("heeey listen")
      return {
        ...styles,
        paddingLeft: data.subempresa ? '2em' : '',
      };
    },
  }

let DespachoDatosIngreso = props => {
    const { handleSubmit, lote, setValores, empresas } = props;
    const { updateData, valores } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="px-5 py-4">
                    <div className="row">
                         <div className="col-12 col-sm-4">
                            <label htmlFor="cuenta">Empresa:</label>
                            <Field
                                            name={`empresa`}
                                            valueKey="id"
                                            labelKey="nombre"
                                            label="Proyecto"
                                            onCambio={props.handleEmpresaChange}
                                            component={renderSearchSelect}
                                            loadOptions={props.getEmpresas}
                                            />
                        </div>
                         <div className="col-12 col-sm-4">
                            <label htmlFor="cuenta">Bodega:</label>

                            <Field
                                name={`bodega`}
                                valueKey="id"
                                labelKey="nombre"
                                label="Bodega"
                                component={renderNoAsyncSelectField}
                                options={props.bodegas}
                                />
                        </div>
                        <div className="col-12 col-sm-4">
                            <label htmlFor="cuenta">Fecha despacho:</label>
                            <Field
                                name={'fecha'}
                                className=""
                                component={renderDatePicker}
                                placeholder="Fecha"
                                numberOfMonths={1}
                            />
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-12">
                            <div className="d-flex justify-content-center flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <button type="submit" className="btn btn-celeste m-1">Despachar Productos</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
};

DespachoDatosIngreso = reduxForm({
    asyncBlurFields: [],
    form: 'ingresoDatosBodega',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'bodega': validators.exists()('Campo requerido.'),
            'fecha': validators.exists()('Campo requerido.'),
        })
    }
})(DespachoDatosIngreso);

const selector = formValueSelector('ingresoDatosBodega');
DespachoDatosIngreso = connect(state => {
    return{
        valores: {
            empresa: selector(state, 'empresa'),
            linea:selector(state, 'linea'),
            fecha:selector(state, 'fecha')
        }
    }
})(DespachoDatosIngreso);
//In update form, picture is not a required field
export const DetalleUpdateForm = reduxForm({
    form: 'ingresoDatosBodega',
    asyncBlurFields: [],
})(DespachoDatosIngreso);
export default DespachoDatosIngreso
