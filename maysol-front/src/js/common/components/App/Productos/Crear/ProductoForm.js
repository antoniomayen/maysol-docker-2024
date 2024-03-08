import React from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
// import { renderField, renderSelectField } from 'Utils/renderField/renderField';
import { renderField, renderSwitch, renderSearchSelect, renderSelectField} from '../../../Utils/renderField/renderField';
import Validators, { required, email, length  } from 'redux-form-validators';
import { api } from '../../../../../api/api';
import { update } from '../../../../../redux/modules/Proyectos/proyectos';
import { connect } from 'react-redux'
import validador from './validate';
import { Monedas } from '../../../../utility/constants';
import delteImg from '../../../../../../assets/img/icons/delete.png';
import classNames from 'classnames';

export const renderMultiplo = ({fields, meta: {error, submitFailed }, multiplo}) => (

    <div className="col-sm-12 form-group np-r ">


            {
                fields.map((multiplo, index) => (

                <div key={index} className="border-naranja mt-3">
                    <div className="float-right mt-2 mr-2">
                        <button
                            type="button"
                            className="btn btn-danger btn-normal "
                            onClick={() =>{
                                fields.remove(index)
                            }}
                        >X</button>
                    </div>
                    <div className="row">

                        <div className="col-md-4">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor={`${multiplo}.presentacion`}>Presentación*:</label>
                            </div>
                            <div className="col-md-12 form-group">
                                <Field name={`${multiplo}.presentacion`} component={renderField} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor={`${multiplo}.capacidad_maxima`}>Cantidad de unidades*:</label>
                            </div>
                            <div className="col-md-12 form-group">
                                <Field name={`${multiplo}.capacidad_maxima`} component={renderField} type="text" className="form-control" />
                            </div>
                        </div>

                    </div>
                    <hr></hr>
                    <FieldArray name={`${multiplo}.precios`} component={renderPrecio} />


                </div>
            ))}
        <div className="d-flex justify-content-center mt-2">
            <button type="button" className="btn btn-secondary" onClick={() => fields.push({})}>
                    Agregar
                    <i className="fa fa-plus ml-2" aria-hidden="true"></i>
            </button>
        </div>
</div>
)

export const renderPrecio = ({fields, meta: {error, submitFailed }, multiplo}) => (

    <div className="col-sm-12 form-group np-r ">


            {
                fields.map((precio, index) => (

                <div key={index} className=" mt-3">
                    <div className="float-right mt-2 mr-2">
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-normal "
                            onClick={() =>{
                                fields.remove(index)
                            }}
                        >X</button>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor={`${precio}.moneda`}>Moneda:</label>
                            </div>
                            <div className="col-md-12 form-group">
                                <Field
                                        name={`${precio}.moneda`}
                                        component={renderSelectField}
                                        key type="select"
                                        labelKey="label"
                                        valueKey="value"
                                        options={Monedas}/>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor={`${precio}.precio`}>Precios*:</label>
                            </div>
                            <div className="col-md-12 form-group">
                                {/*<Field name={`${precio}.precio`} component={renderField} type="number" className="form-control" />*/}
                                <FieldArray name={`${precio}.precioD`} component={preciosSS} />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <hr></hr>
        <div className="d-flex justify-content-center mt-2">
            <button disabled={fields.length >= 2} type="button" className="btn btn-link" onClick={() => fields.push({})}>
                    Agregar Precio
                    <i className="fa fa-plus ml-2" aria-hidden="true"></i>
            </button>
        </div>
</div>
)


export const preciosSS = ({ input, disabled, fields, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div className="col-sm-12 form-group np-r" >
            <div className="row">
                {
                    fields.map((precio, index) => (
                        <div key={index} className="col-md-3">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor={`${precio}.precio`}>Precio {index + 1}*:</label>
                                <img
                                    height={25}
                                    src={delteImg}
                                    style={{
                                        cursor: "pointer",
                                        float: "right"
                                    }}
                                    onClick={() => {
                                        fields.remove(index)
                                    }}
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <Field name={`${precio}.precio`} component={renderField} type="number"
                                       className="form-control"/>
                            </div>
                        </div>
                    ))
                }
                <div className="d-flex justify-content-center mt-2 col-md-3">
                    <button type="button" className="btn btn-link" onClick={() => fields.push({})}>
                        <i className="fa fa-plus ml-2" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            {error && (
                <div className="invalid-feedback" style={{ display: "block" }}>
                    {error}
                </div>
            )}
        </div>
    )
}




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


let ProductoForm = props => {
    const { handleSubmit, editar } = props;
    const { updateData, cuentas } = props;
    const { verMultiplos, verPrecios } = props;
    return(
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">


                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor="nombre">Nombre*:</label>
                            </div>
                            <div className="col-md-12 form-group">
                                <Field name="nombre" component={renderField} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor="presentacion">Presentación*:</label>
                            </div>
                            <div className="col-md-12 form-group">
                                <Field name="presentacion" component={renderField} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor="empresa">Empresa*:</label>
                            </div>
                            <div className="col-md-12 form-group">
                                <Field
                                            name={`empresa`}
                                            valueKey="id"
                                            labelKey="nombre"
                                            label="Empresa"
                                            component={renderSearchSelect}
                                            loadOptions={getProyectos}
                                            />
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="col-md-12 m-0 form-group">
                                <label htmlFor="porcentaje">Coste producción (porcentaje):</label>
                            </div>
                            <div className="col-md-12 form-group">
                                <Field name="porcentaje" component={renderField} type="number" className="form-control" />
                            </div>
                        </div>

                        <div className="col-md-3 p-0 p-md-3 d-flex align-items-center">
                            <div className="row col-md-12">
                                <div className=" col-md-auto m-0 form-group">
                                    <label htmlFor="vendible">Vendible:</label>
                                </div>
                                <div className="col-md-auto m-0 form-group">
                                    <Field name="vendible" component={renderSwitch} type="text" className="form-control" />
                                </div>
                            </div>
                        </div>

                    </div>
                    {
                        verPrecios && (
                            <div>
                                <div className="row border-naranja">
                                   <div className="col-md-12 m-0 form-group">
                                        <label htmlFor="precio">Precio por unidad</label>
                                    </div>
                                    <FieldArray name="precios" component={renderPrecio} />
                                </div>

                            </div>

                        )
                    }

                    <div className="row">
                        <div className="col">
                            <div className="row col-md-auto p-0 p-md-3">
                                <div className="col-md-auto m-0 form-group">
                                    <label htmlFor="multiplos">Se venden multiplos de este producto:</label>
                                </div>
                                <div className="col-md-auto form-group">
                                    <Field name="multiplos" component={renderSwitch} type="text" className="form-control" />
                                </div>

                            </div>
                        </div>
                    </div>
                    <div>
                        {
                            verMultiplos && (
                                <FieldArray name="fracciones" component={renderMultiplo} />
                            )
                        }
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <Link className="btn btn-secondary m-1" to="/productos">Cancelar</Link>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

ProductoForm = reduxForm({
    form: 'producto',
    initialValues: {
        presentacion: "Unidad",
        moneda:'GTQ',
        vendible: false,
        precios:[{moneda: 'GTQ'}],
        fracciones:[
            {
            precios: [
                {moneda: 'GTQ'}
            ]
        }
        ]
    },
    validate: validador,
})(ProductoForm)
const selector = formValueSelector('producto'); // <-- same as form name
ProductoForm = connect(state => {
  // can select values individually
  const fracciones = selector(state, 'multiplos');
  const vendible = selector(state, "vendible");
  let verMultiplos = false;
  let verPrecios = false;
  let initialValues= null;
  if(fracciones) {
    verMultiplos = true;
//     precios:[
//         {moneda: 'GTQ'}
//     ],
//     fracciones:[
//         {
//             precios:[
//                 {moneda: 'GTQ'}
//             ]
//         }
//     ]
  }
  if(vendible){
      verPrecios = true;
  }
  return {
    verMultiplos: verMultiplos,
    verPrecios
  }
})(ProductoForm)
//In update form, picture is not a required field
export const ProductoUpdateForm = reduxForm({
    form: 'producto',
    validate: validador,
    asyncBlurFields: []
})(ProductoForm)

export default ProductoForm
