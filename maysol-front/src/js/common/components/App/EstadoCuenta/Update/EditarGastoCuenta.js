import React from 'react';
import _ from "lodash";
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { connect } from 'react-redux'
import { dateFormatter, formatoMoneda } from '../../../Utils/renderField/renderReadField';
import { validate, validators } from 'validate-redux-form';
import { renderField, renderSelectField, renderNoAsyncSelectField, renderTextArea, renderSearchSelect } from '../../../Utils/renderField/renderField';
import renderDatePickerDepositos from 'Utils/renderField/renderDatePickerDepositos';
import { opcionesBanco, options_recuperacion } from  '../../../../utility/constants'
import { api } from '../../../../../api/api';
import renderDatePickerNoLimit from 'Utils/renderField/renderDatePickerNoLimit'
const cuentas = [];
const categorias = [];
const personas = [];
const proveedores = [];

const getEmpresas = (search) => {

    return api.get(`proyectos`).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if (!_.find(cuentas, { id: item.id })) {
                cuentas.push(item)
            }
            item.empresas.forEach(subempresa => {
                if (!_.find(cuentas, { id: subempresa.id })) {
                    cuentas.push(subempresa);
                }
            })
        });
        console.log(cuentas, "cuentas")
        return { options: cuentas }
    })
}

export const getCategorias = (search) => {
    return api.get(`categorias`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if (!_.find(categorias, { id: item.id })) {
                categorias.push(item);
            }
        });
        return { options: categorias }
    })
};

const getPersonas = (search) => {
    return api.get(`users`).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if (!_.find(personas, { id: item.id })) {
                personas.push(item);
            }
        });
        return { options: personas }
    })
}
export const getProveedores = (search) => {
    return api.get(`proveedor`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if (!_.find(proveedores, { id: item.id })) {
                proveedores.push(item);
            }
        });
        return { options: proveedores }
    })
}
const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        console.log("heeey listen")
      return {
        ...styles,
        paddingLeft: data.subempresa ? '2em' : '',
      };
    },
  }



let RetiroUpdateForm = props => {
    const { handleSubmit } = props;
    const {
        verProveedor,
        verComprobante,
        verRecuperacion,
        tipoDocumento,
        empresas ,
        usuario,
        movimiento,
        cuenta,
        cerrado} = props;
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    <div className="row">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Fecha:</label>
                            </div>
                            <div className="col-md-8">
                            {
                                cerrado ? (
                                    <span>{ movimiento && dateFormatter(movimiento.fecha)}</span>
                                ) : (
                                    <Field name="fecha"
                                        className=""
                                        component={renderDatePickerDepositos}
                                        month={props.month}
                                        anio={props.anio}
                                        placeholder="Fecha" numberOfMonths={1} />
                                )
                            }

                            </div>
                        </div>
                        {
                            (props.usuario.accesos.administrador || props.usuario.accesos.supervisor) && (
                                <div className="row col-md-6  form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="destino">Gasto de:</label>
                                    </div>
                                    <div className="col-md-8">
                                    {
                                        cerrado ? (
                                            <span>{movimiento.proyectoAfectado}</span>
                                        ) : (
                                            <Field
                                                name={`proyecto`}
                                                valueKey="id"
                                                labelKey="nombre"
                                                label="Proyecto"
                                                styles={colourStyles}
                                                component={renderNoAsyncSelectField}
                                                options={empresas}
                                                />
                                        )
                                    }

                                    </div>
                                </div>
                            )
                        }

                    </div>
                    <div className="row">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="monto">Monto:</label>
                            </div>
                            <div className="col-md-8">
                               <span>
                                   { movimiento && formatoMoneda(movimiento.monto,cuenta.simbolo)}
                               </span>
                            </div>
                        </div>
                        <div className="row col-md-6  form-group">
                            <div className="col-md-4">
                                <label htmlFor="persona">Responsable:</label>
                            </div>
                            <div className="col-md-8">
                            {
                                cerrado ? (
                                    <span>{movimiento.nombrePersona}</span>
                                ) : (
                                    <Field
                                        name={`persona`}
                                        valueKey="id"
                                        labelKey="nombreCompleto"
                                        label="persona"
                                        component={renderSearchSelect}
                                        loadOptions={getPersonas}
                                        />
                                )
                            }

                            </div>
                        </div>

                    </div>

                        <div>
                            <div className="row border-naranja mb-2 pb-1 pt-3">
                                <div className="row col-md-6 form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="proveedor">Proveedor:</label>
                                    </div>
                                    <div className="col-md-8">
                                        {
                                            cerrado ? (
                                                <span>{movimiento.proveedor}</span>
                                            ) : (
                                                <Field
                                                    name={`proveedor`}
                                                    valueKey="id"
                                                    labelKey="nombre"
                                                    label="Proyecto"
                                                    component={renderSearchSelect}
                                                    loadOptions={getProveedores}
                                                    />
                                            )
                                        }

                                    </div>
                                </div>
                                <div className="row col-md-6  form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="noComprobante">No Comprobante:</label>
                                    </div>
                                    <div className="col-md-8">
                                        {
                                            cerrado ? (
                                                <span>{movimiento.noComprobante}</span>
                                            ) : (
                                                <Field
                                                    name="noComprobante"
                                                    component={renderField}
                                                    type="text"
                                                    className="form-control" />
                                            )
                                        }

                                    </div>
                                </div>
                            </div>

                            <div className="row border-naranja mb-2 pb-1 pt-3">

                                <div className="row col-md-6  form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="formaPago">Forma de pago:</label>
                                    </div>
                                    <div className="col-md-8">
                                        {
                                            cerrado ? (
                                                <span>{movimiento.nombrePago}</span>
                                            ) : (
                                                <Field name="formaPago" component={renderSelectField}
                                                    key
                                                    type="select" labelKey="label" valueKey="value"
                                                    options={opcionesBanco}
                                                />
                                            )
                                        }

                                    </div>
                                </div>
                                {
                                    verComprobante && (
                                        <div className="row col-md-6  form-group">
                                            <div className="col-md-4">
                                                <label htmlFor="noDocumento">{tipoDocumento}:</label>
                                            </div>
                                            <div className="col-md-8">
                                                {
                                                    cerrado ? (
                                                        <span>{movimiento.noDocumento}</span>
                                                    ) : (
                                                        <Field
                                                            name="noDocumento"
                                                            component={renderField}
                                                            type="text"
                                                            className="form-control" />
                                                    )
                                                }

                                            </div>
                                        </div>
                                    )
                                }

                            </div>
                        </div>

                    <div className="row">
                        <div className="row col-md-6  form-group">
                            <div className="col-md-4">
                                <label htmlFor="categoria">Categoría:</label>
                            </div>
                            <div className="col-md-8">
                                <Field
                                        name={`categoria`}
                                        valueKey="id"
                                        labelKey="nombre"
                                        label="Categoria"
                                        component={renderSearchSelect}
                                        loadOptions={getCategorias}
                                        />
                            </div>
                        </div>
                        {/* <div className="row col-md-6  form-group">
                            <div className="col-md-4">
                                <label htmlFor="vehiculo">Vehículo:</label>
                            </div>
                            <div className="col-md-8">
                                {
                                    cerrado ? (
                                        <span>{movimiento.vehiculo}</span>
                                    ) : (
                                        <Field
                                        name="vehiculo"
                                        component={renderField}
                                        type="text"
                                        className="form-control" />
                                    )
                                }
                            </div>
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="row col-md-12  form-group">
                            <div className="col-md-2">
                                <label htmlFor="concepto">Descripción:</label>
                            </div>
                            <div className="col-md-10">
                                {
                                    cerrado ? (
                                        <p>
                                            {movimiento.concepto}
                                        </p>
                                    ) : (
                                        <Field
                                            name="concepto"
                                            component={renderTextArea}
                                            type="number"
                                            className="form-control" />
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    {
                        props.usuario.accesos.administrador && (
                            <div className="row">
                                <div className="row col-md-12  form-group">
                                    <div className="col-md-2">
                                        <label htmlFor="comentario">Comentario:</label>
                                    </div>
                                    <div className="col-md-10">
                                        <Field
                                            name="comentario"
                                            component={renderTextArea}
                                            type="number"
                                            className="form-control" />
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        (props.usuario.accesos.administrador && verRecuperacion) && (
                            <div className="row border-naranja pt-3 mb-2">
                                <div className="row col-md-6 form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="plazo">Plazo recuperación (meses):</label>
                                    </div>
                                    <div className="col-md-8">
                                            <Field
                                                name="plazo"
                                                component={renderField}
                                                type="number"
                                                className="form-control" />
                                    </div>
                                </div>
                                <div className="row col-md-6 form-group">
                                    <div className="col-md-4">
                                        <label htmlFor="plazo">Fecha inicio:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <Field
                                            name="fecha_inicio_recuperacion"
                                            className=""
                                            component={renderDatePickerNoLimit}
                                            placeholder="Fecha"
                                            numberOfMonths={1}
                                        />
                                    </div>
                                </div>
                                <div className="row col-md-6 form-group">
                                    <div className="col-md-4">
                                        <label>Categoria recuperación:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <Field name="categoria_recuperacion" component={renderSelectField}
                                               key disabled
                                               type="select" labelKey="label" valueKey="value"
                                               options={options_recuperacion}
                                        />
                                    </div>
                                </div>
                            </div>

                        )
                    }
                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <div className="col-md-6 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <button type="button" onClick={props.closeModal} className="btn btn-secondary m-1">Cancelar</button>
                                <button type="submit" className="btn btn-primary m-1">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

RetiroUpdateForm = reduxForm({
    form: "movimiento",
    validate: data => {
        return validate(data, {
            nocuenta: validators.exists()("Campo requerido"),
            fecha: validators.exists()("Campo requerido"),
            monto: validators.exists()("Campo requerido"),
            concepto: validators.exists()("Campo requerido")
        });
    }
})(RetiroUpdateForm);

const selector = formValueSelector('movimiento');
RetiroUpdateForm = connect(state => {
    const FormGasto = state.form.movimiento;
    const destino = selector(state, "destino");
    const formapago = selector(state, "formaPago");
    let tipoDocumento = "No transacción"
    let verProveedor = false;
    let verComprobante = false;
    let verRecuperacion = false;
    if (destino == 30) {
        verProveedor = true;
    }
    if(formapago != 10){
        verComprobante = true;
    }
    if(formapago == 40){
        tipoDocumento = "No Cheque"
    }else if(formapago == 20){
        tipoDocumento = "No comprobante"
    } else if(formapago == 60){
        tipoDocumento = "No Comprobante"
    }
    const categoria = selector(state, "categoria");
    //Colocar la categoria de recuperación en base a la categoria padre
    try{
        const categoria_actual = _.find(categorias, {'id': categoria});
        FormGasto.values.categoria_recuperacion = categoria_actual.categoria_recuperacion;
    }catch (e) {}
    //Colocar variable para ver recuperación
    try{
        if (FormGasto.values.categoria_recuperacion){
            verRecuperacion = true;
        }
    }catch (e) {}
    return {
        destino,
        verProveedor,
        verComprobante,
        tipoDocumento,
        verRecuperacion
    };
})(RetiroUpdateForm);

export default RetiroUpdateForm;
