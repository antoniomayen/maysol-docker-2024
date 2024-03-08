import React from 'react';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { renderField, renderSearchSelect, renderCurrency } from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker';
import renderDatePickerNoLimit from 'Utils/renderField/renderDatePickerNoLimit'
import { api } from 'api/api';
import {renderSelectField} from "../../../../Utils/renderField/renderField";

const options_recuperacion=[
    {value: '159', label: '減価償却 - Depreciación'},
    {value: '160', label: '減価償却（システム系-30万円以上) - Depreciación de sistemas'},
    {value: '161', label: '設立投資 - Establecimiento de inversión'},
];

let CostoGranajaForm = props => {
    const { handleSubmit, verForm} = props;

    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                    {/* fin selecciones */}


                            <div className="my-5">
                                <div className="row px-2 ">
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="monto">
                                            Monto:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="monto" component={renderCurrency} type="number" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="plazo">
                                            Plazo(meses):
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="plazo" component={renderField} type="number" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row px-2 ">
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="fecha_inicio_costo">
                                            Fecha Inicio:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field
                                                name={'fecha_inicio_costo'}
                                                className=""
                                                component={renderDatePickerNoLimit}
                                                placeholder="Fecha"
                                                numberOfMonths={1}
                                            />
                                        </div>
                                    </div>
                                    <div className="row col-md-6 form-group">
                                        <div className="col-md-4">
                                            <label htmlFor="fecha_inicio_costo">
                                            Categoria recuperación:
                                            </label>
                                        </div>
                                        <div className="col-md-8">
                                            <Field name="categoria_recuperacion" component={renderSelectField}
                                               key
                                               type="select" labelKey="label" valueKey="value"
                                               options={options_recuperacion}
                                        />
                                        </div>
                                    </div>

                                </div>
                            </div>

                    <div className="row mt-3">
                        <div className="col-12 d-flex justify-content-end">
                            <div className="col-md-6 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <button type="button" onClick={props.closeModal} className="btn btn-secondary m-1">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary m-1">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>;
}

CostoGranajaForm = reduxForm ({
    form: 'costogranja',
    initialValues: {

    },
    validate: values =>{
        const errors = {};
        if(!values.plazo){
            errors.plazo = "Campo requerido"
        }
        else{
            if(!Number.isInteger(Number(values.plazo))){
                errors.plazo = "Debe de ser un número entero."
            }
            if(Number(values.plazo) < 0){
                errors.plazo = "Debe ser un valor igual o mayor a 0"
            }
        }
        if(!values.fecha_inicio_costo){
            errors.fecha_inicio_costo = "Campo Requerido"
        }
        if(!values.monto){
            errors.monto = "Campo Requerido"
        }else{
            if(Number(values.monto) < 0){
                errors.monto = "Debe ser un valor igual o mayor a 0"
            }
        }
        return errors;

    }
})(CostoGranajaForm)
// const selector = formValueSelector('costogranja'); // <-- same as form name
// CostoGranajaForm = connect(state => {
//   // can select values individually
// //   console.log(state, 'EStadooo')
//     let verForm = true;
//     const tipo = selector(state, 'tipo')
//     if(tipo == 'false'){
//         verForm = false
//     }
//   return {
//     verForm
//   }
// })(CostoGranajaForm)

export default CostoGranajaForm
