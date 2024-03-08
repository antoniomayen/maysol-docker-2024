import React from 'react';
import { Field, reduxForm, formValueSelector, change } from 'redux-form';
import { renderField, renderSearchSelect, renderCurrency} from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import { api } from 'api/api';
import _ from "lodash";
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import { dateFormatter } from 'Utils/renderField/renderReadField';

const cuentas = [];
const categorias = [];

const getCuentas = (search) => {

    return api.get(`cuentas/getSelectCuenta`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.forEach(item => {
            if(!_.find(cuentas, {id: item.id})) {
                cuentas.push(item);
            }
        });
        return { options: cuentas}
    })
};
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

let CierreVentaForm = props => {
    const { handleSubmit, mensaje } = props;
    const { miCaja } = props;

    return <form onSubmit={handleSubmit}>
            <div className="form-group grid-container">
                <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">

                    <div className="col-md-12 text-center">
                        <span className="ml-0 text-uppercase text-rosado h4"><strong>Caja de venta   </strong></span><span className="ml-0 text-uppercase text-primary h3"><strong >{dateFormatter(props.cajaVenta.fecha)}</strong></span>
                    </div>
                    <div className="row pb-1 pt-2 mb-2 mt-md-5">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="monto">
                                    Saldo Actual
                                </label>
                            </div>
                            <div className="col-md-8">
                                <RenderCurrency value={props.cajaVenta.saldo} simbolo={props.cajaVenta.simbolo} className={'text-secondary h4 font-weight-bold'}/>
                            </div>
                        </div>
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Fecha:</label>
                            </div>
                            <div className="col-md-8">

                                <Field name="fecha"
                                className=""
                                component={renderDatePicker}
                                placeholder="Fecha" numberOfMonths={1} />
                            </div>
                        </div>

                    </div>
                    <div className="row pb-1 pt-2">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="cuenta">
                                    Cuenta a depositar
                                </label>
                            </div>
                            <div className="col-md-8">
                                <Field
                                    name={`cuenta`}
                                    valueKey="id"
                                    labelKey="nombre"
                                    label="Proyecto"
                                    component={renderSearchSelect}
                                    loadOptions={getCuentas}
                                    />
                            </div>
                        </div>
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="monto">
                                    Monto depositar
                                </label>
                            </div>
                            <div className="col-md-8">
                                <Field name="monto" component={renderCurrency}  type="number" className="form-control" />
                            </div>
                        </div>

                    </div>
                    <div className="row pb-1 pt-2 mb-2">
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="noDocumento">
                                    No. Boleta
                                </label>
                            </div>
                            <div className="col-md-8">
                                <Field name="noDocumento" component={renderField} type="text" className="form-control" />
                            </div>
                        </div>
                        <div className="row col-md-6 form-group">
                            <div className="col-md-4">
                                <label htmlFor="fecha">Categoria:</label>
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
                    </div>

                    <div className="col-md-12 mt-3 d-flex justify-content-center">
                        <button type="submit" className="btn btn-rosado btn-lg">
                            Hacer Deposito
                        </button>
                     </div>
                </div>
            </div>
        </form>;
}

CierreVentaForm = reduxForm ({
    form: 'cierreVenta',
    validate: data =>{
        const errors = {}
        if(!data.cuenta){
            errors.cuenta = "Campo requerido";
        }
        if(!data.noDocumento){
            errors.noDocumento = "Campo requerido";
        }
        if(!data.monto){
            errors.monto = "Campo requerido";
        }

        if(Number(data.monto) < 0){
            errors.monto = "Debe ser un valor igual o mayor a 0"
        }
        if(!data.fecha){
            errors.fecha = 'Campo requerido';
        }
        return errors;
    }
})(CierreVentaForm)



export default CierreVentaForm
