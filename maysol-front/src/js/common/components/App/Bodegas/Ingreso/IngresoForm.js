import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderTextArea} from '../../../Utils/renderField/renderField';
import { dateFormatter } from '../../../Utils/renderField/renderReadField';
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import { update } from '../../../../../redux/modules/Proyectos/proyectos';
import { connect } from 'react-redux'


const renderProductos = ({fields, meta: {error, submitFailed }, borrar}) => (
    <div className="row col-sm-12 p-0 m-0">
                <div className="col-sm-12 form-group np-r tabla-gris no-striped mt-2 sin-borde p-0 over-h">
                    <table className="table table-sm table-responsive-sm  m-0">
                        <tbody>
                        <tr className="header-tabla font-italic">
                            <th style={{width: "30%"}} >Producto </th>
                            <th style={{width: "10%"}} >Cantidad despacho </th>
                            <th style={{width: "10%"}} >Ingresadas a bodega</th>
                            <th style={{width: "20%"}} >Cantidad a Ingresar</th>
                        </tr>
                        {fields.map((producto, index) => (

                            <tr key={index}>

                                <td className="sin-borde-top font-italic">
                                    {fields.get(index).producto_nombre}
                                </td>
                                <td className="sin-borde-top " >
                                    {fields.get(index).cantidad}
                                </td>
                                <td className="sin-borde-top text-rosado ">
                                    { fields.get(index).cantidad - fields.get(index).cantidadActual}
                                </td>
                                <td className="sin-borde-top">
                                    <Field
                                        name={`${producto}.cantidadIngreso`}
                                        type="number"
                                        component={renderField}
                                        addClass={"text-right"}
                                        placeholder="Representante"
                                    />
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {/* <div className="d-flex justify-content-center mt-2">
                        <button type="button" className="btn btn-secondary" onClick={() => fields.push({})}>
                                Agregar Sub empresa
                        </button>
                    </div> */}
            </div>
    </div>
)
let IngresoBodegaForm = props => {
    const { handleSubmit, editar, borrarProducto } = props;
    const { updateData, cuentas, linea } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">

                    <FieldArray name="productos" component={renderProductos} borrar={borrarProducto} />
                    <div className="col-12 col-sm-12 borde-abajo fondo-gris text-right pr-5" style={{height:43, borderRadius:0}}></div>
                    <div className="row col-md-11 d-flex align-items-center">
                    {
                        linea && (
                            <div className="row col mt-3">
                                <div className="row col-md-12 form-group">
                                    <div className="col-auto d-flex align-items-center">
                                        <label htmlFor="concepto">
                                            Nota:
                                        </label>
                                    </div>
                                    <div className="col-md-10">
                                        <Field name="nota" className="" component={renderTextArea} placeholder="Descrición" numberOfMonths={1} />
                                    </div>
                                </div>
                            </div>
                        )
                    }

                        <div className={linea ? "col-md-4" : "col-md-12"}>
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

IngresoBodegaForm = reduxForm({
    form: 'ingresobodega',
    validate: values => {
        const errors = {};
        if(!values.productos || !values.productos.length){
            errors.productos = {_error: 'Debe de agregar al menos un producto' }
        }else{
            // Validar cada línea de detalle
            const detalleErrors = []
            values.productos.forEach((producto, index) =>{
                let detalleError = {}
                if(!producto.cantidadIngreso){
                    detalleError.cantidadIngreso = "Campo Requerido"
                }else{
                    if(!Number.isInteger(Number(producto.cantidadIngreso))){
                        detalleError.cantidadIngreso = "Debe de ser un número entero."
                    }
                    if(Number(producto.cantidadIngreso) < 0){
                        detalleError.cantidadIngreso = "Debe ser un valor igual o mayor a 0"
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
    }
})(IngresoBodegaForm);

export const BodegaUpdateForm = reduxForm({
    form: 'ingresobodega',
    asyncBlurFields: []
})(IngresoBodegaForm);
export default IngresoBodegaForm
