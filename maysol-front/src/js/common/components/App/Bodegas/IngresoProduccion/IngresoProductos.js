import React, {Fragment} from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
import { renderField, renderSearchSelect, renderSelectField, renderSearchCreateSelect} from '../../../Utils/renderField/renderField';
import { api } from '../../../../../api/api';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import moment from 'moment';
import { connect } from 'react-redux'
import validador from './validate';
import { dateFormatter } from '../../../Utils/renderField/renderReadField';
const proyectos = [];
let productos = [];
let subempresas = [];
const getProyectos = () =>{
    return api.get("proyectos").catch((error) => {})
            .then((data) => {
                data.results.forEach(item => {
                    if(!_.find(proyectos, {id: item.id})) {
                        proyectos.push(item);
                    }
                });
                return {options: proyectos}
            })
};

const getSubempresas = (empresa = 1) => {
    api.get(`proyectos/getSubEmpresas`, {empresa}).catch((error) => {
      console.log("Error el obtener subempresas", error);
  }).then((data) => {
        if(data){
            if(data.length > 0){
                 subempresas = [];
                data.forEach(item => {
                    if (!_.find(subempresas, { id: item.id })) {
                        subempresas.push({value: item.id, label:item.nombre, id: item.id});
                    }
                });
            } else{
                subempresas = []
            }
      }
  })
};

export const renderLineaProd = ({fields, getProductos, meta: {error, submitFailed}}) => {
    return(
        <Fragment>
            <div className="row col-sm-12 p-0 m-0">

               <div className="col-sm-12 form-group np-r tabla-gris no-striped mt-2 sin-borde p-0 ">
                    <table className="table table-sm   m-0">
                        <tbody>
                        <tr className="header-tabla font-italic">
                            <th style={{width: "40%"}} >Producto</th>
                            <th style={{width: "20%"}} >Cantidad</th>
                            <th style={{width: "20%"}} ></th>
                        </tr>
                        {fields.map((producto, index) => {
                            const todos = fields.getAll(); //Obtiene todos los productos
                            todos[index]['index'] = index
                            return (
                                <tr key={index}>

                                <td className="sin-borde-top font-italic">
                                    <Field
                                        name={`${producto}.producto`}
                                        valueKey="id"
                                        labelKey="nombre"
                                        label="nombre"
                                        component={renderSearchCreateSelect}
                                        loadOptions={getProductos}
                                    />
                                </td>
                                <td className="sin-borde-top ">
                                    <Field
                                        name={`${producto}.cantidad`}
                                        type="number"
                                        addClass={"text-right"}
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
                            )
                        })}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-center mt-2">
                        <button type="button" className="btn btn-celeste" onClick={() => fields.push({})}>
                                Agregar Producto
                        </button>
                    </div>
                </div>
                </div>
        </Fragment>
    )
};


let IngresoProdForm = props => {
    const { handleSubmit, lote } = props;
    const { updateData, original, dataLinea } = props;
    const getProductos = (search) => {
        productos = [];
        const params = { search };
        if (props.empresa) params.empresa = props.empresa;
        return api.get(`productos/get_fraccionesUnidad`, params).catch((error) => {
            console.log("Error al leer cuentas.");
        }).then((data) => {
            data.forEach(item => {
                if (!_.find(productos, { id: item.id })) {
                    productos.push(item);
                }
            });
            console.log("opciones", productos)
            return { options: productos }
        })
    };

    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="col-md-11 mt-3">
                        <div className="row">
                            <div className="row col-md-4 form-group m-0">
                                <div className="col-md-auto">
                                    <label htmlFor="concepto" className="m-0">Sub Empresa:</label>
                                </div>
                                <div className="col">
                                    <p className="text-rosado font-weight-bold text-uppercase">{dataLinea.empresa}</p>
                                </div>
                            </div>
                            <div className="row col-md-4 form-group m-0">
                                <div className="col-md-auto">
                                    <label htmlFor="concepto" className="m-0">Línea de producción:</label>
                                </div>
                                <div className="col">
                                    <p className="text-rosado font-weight-bold text-uppercase">{dataLinea.linea}</p>
                                </div>
                            </div>
                            <div className="row col-md-4 form-group m-0">
                                <div className="col-md-auto">
                                    <label htmlFor="concepto" className="m-0">Fecha ingreso:</label>
                                </div>
                                <div className="col">
                                    <p className="text-rosado font-weight-bold text-uppercase">{dateFormatter(original.fecha) }</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FieldArray name="productos" component={renderLineaProd} getProductos={getProductos} />
                    <div className="col-12 col-sm-12 borde-abajo fondo-gris text-right pr-5" style={{height:43, borderRadius:0}}></div>
                    <div className="row col-md-11 mt-3">

                        <div className="col">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <button type="button"
                                    onClick={() =>{props.cancelar()}}
                                    className="btn btn-secondary m-1">Cancelar</button>
                                <button type="submit" className="btn btn-primary m-1">Ingresar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
};

IngresoProdForm = reduxForm({
    asyncBlurFields: [],
    form: 'ingresobodega',
    validate:  values => {
        const errors = {};
        if(!values.productos || !values.productos.length){
            errors.productos = {_error: 'Debe de agregar al menos un producto' }
        }else{
            // Validar cada línea de detalle
            const detalleErrors = []
            values.productos.forEach((producto, index) =>{
                let detalleError = {}
                if(!producto.producto){
                    detalleError.producto = "Campo Requerido"
                }
                if(producto.producto){
                    const existe = _.find(values.productos, (p) => {
                        return p.producto === producto.producto && p.index !== index
                    });
                    if(existe){
                        detalleError.producto = 'El producto ya fue seleccionado en otra fila';
                    }
                }
                if(!producto.cantidad){
                    detalleError.cantidad = "Campo Requerido"
                }else{
                    if(!Number.isInteger(Number(producto.cantidad))){
                        detalleError.cantidad = "Debe de ser un número entero."
                    }
                    if(Number(producto.cantidad) < 0){
                        detalleError.cantidad = "Debe ser un valor igual o mayor a 0"
                    }
                }

                if(detalleError){
                    detalleErrors[index] = detalleError
                }
            });
            if(detalleErrors.length){
                errors.productos = detalleErrors
            }
        }
        return errors;
    },
    initialValues: {
        productos: [{}]
    }
})(IngresoProdForm);

IngresoProdForm = connect(state => {
    let lote = '';
    return{
        lote
    }
})(IngresoProdForm);

//In update form, picture is not a required field
export const IngresoProdFormUpdateForm = reduxForm({
    form: 'ingresobodega',
    asyncBlurFields: [],
})(IngresoProdForm);
export default IngresoProdForm
