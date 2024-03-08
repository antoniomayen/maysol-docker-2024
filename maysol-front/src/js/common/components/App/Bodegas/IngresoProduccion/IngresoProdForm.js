import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { validate, validators } from 'validate-redux-form';
import { renderField, renderSearchSelect, renderNoAsyncSelectField} from '../../../Utils/renderField/renderField';
import { api } from '../../../../../api/api';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import moment from 'moment';
import validador from './validate';


const productos = [];
let lineaproduccion = [];

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


const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        console.log("heeey listen")
      return {
        ...styles,
        paddingLeft: data.subempresa ? '2em' : '',
      };
    },
  }

let IngresoDatosIngreso = props => {
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
                                styles={colourStyles}
                                component={renderNoAsyncSelectField}
                                options={empresas}
                                onCambio={(e) => props.setId(e.empresaId)}
                            />
                        </div>
                         <div className="col-12 col-sm-4">
                            <label htmlFor="cuenta">Linea de producción:</label>
                            <Field
                                name={`linea`}
                                valueKey="id"
                                labelKey="nombre"
                                label="Proyecto"
                                component={renderNoAsyncSelectField}
                                options={props.lineaProduccion}
                            />
                        </div>
                        <div className="col-12 col-sm-4">
                            <label htmlFor="cuenta">Fecha ingreso:</label>
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
                                <button type="submit" className="btn btn-celeste m-1">Ingresar Productos</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
};

IngresoDatosIngreso = reduxForm({
    asyncBlurFields: [],
    form: 'ingresoDatos',
    validate: data => {
        return validate(data, {
            'empresa': validators.exists()('Campo requerido.'),
            'linea': validators.exists()('Campo requerido.'),
            'fecha': validators.exists()('Campo requerido.'),
        })
    }
})(IngresoDatosIngreso);

const selector = formValueSelector('ingresoDatos');
IngresoDatosIngreso = connect(state => {
    return{
        valores: {
            empresa: selector(state, 'empresa'),
            linea:selector(state, 'linea'),
            fecha:selector(state, 'fecha')
        }
    }
})(IngresoDatosIngreso);
//In update form, picture is not a required field
export const DetalleUpdateForm = reduxForm({
    form: 'ingresoDatos',
    asyncBlurFields: [],
})(IngresoDatosIngreso);
export default IngresoDatosIngreso
