import React from 'react';
import moment from 'moment';
import { Field, FieldArray, reduxForm, formValueSelector, change } from 'redux-form';
import { renderField, renderSearchSelect, renderCurrency } from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import { api } from 'api/api';
import _ from "lodash";
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import { dateFormatter } from 'Utils/renderField/renderReadField';
import { Link } from 'react-router-dom';
import CardGrandeForm from '../../../../Utils/Cards/cardGrande';
import CardRed from '../../../../Utils/Cards/cardGrandeRed';
import { TableHeaderColumn } from 'react-bootstrap-table';
import { BreakLine } from '../../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import { renderSwitch, renderFieldCheck } from '../../../../Utils/renderField';
import { connect } from 'react-redux';
import BodegaForm from '../../../Bodegas/Crear/BodegasForm';

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

const renderVentas = ({fields, meta: {error, submitFailed }, borrar, cambiar}) => (
    <div className="col-sm-12 react-bs-container-header" style={{ padding: 0 }}>
        <table className="table table-sm  m-0">
            <thead>
                <tr>
                    <th style={{width: "20%"}} />
                    <th style={{width: "10%"}} className="text-left">Fecha</th>
                    <th style={{width: "10%"}} className="text-left">ID VENTA</th>
                    <th style={{width: "20%"}} className="text-left">DESCRIPCION</th>
                    <th style={{width: "10%"}} className="text-left">Cliente</th>
                    <th style={{width: "10%"}} className="text-left">Total</th>
                </tr>
            </thead>
            <tbody style={{ backgroundColor: '#fff', color: '#000' }}>
                {fields.map((ventas, index) => (
                    <tr key={index}>
                        <td className="sin-borde-top text-center">
                            <Field
                                name={`movimientos.${index}.estado`}
                                type="checkbox"
                                className="form-control"
                                component={renderFieldCheck}
                                onChangeBe={(val) => {
                                    let totals = 0;
                                    let cant = 0;
                                    for (let i = 0; i < fields.length; i++) {
                                        if (i === index) {
                                            if (val !== 'true') {
                                                totals += fields.get(i).monto;
                                                cant += 1;
                                            }
                                        } else if (fields.get(i).estado === true) {
                                            totals += fields.get(i).monto;
                                            cant += 1;
                                        }
                                    }
                                    cambiar(totals, cant);
                                }}
                                placeholder="Representante"
                            />
                        </td>
                        <td className="sin-borde-top text-left">
                            {moment(fields.get(index).fecha).format('DD-MM-YYYY')}
                        </td>
                        <td className="sin-borde-top text-right">
                            {fields.get(index).id}
                        </td>
                        <td className="sin-borde-top text-left">
                            {fields.get(index).concepto}
                        </td>
                        <td className="sin-borde-top text-left">
                            {fields.get(index).usuario}
                        </td>
                        <td className="sin-borde-top text-right">
                            <RenderCurrency value={fields.get(index).monto || 0} simbolo="Q" />
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
);

let CierreVentaForm = props => {
    const { handleSubmit, cant, monto, loaderModal } = props;
    const { miCaja } = props;

    const cambiar = (val, cant) => {
        props.change('monto', val);
        props.change('cant', cant);
    };

    return <form onSubmit={handleSubmit}>
        <CardGrandeForm titulo="DEPOSITO de CUENTA">
            <div className="form-group grid-container row">
                <div className="col-md-12 text-center">
                    <span className="ml-0 text-uppercase text-rosado h4"><strong>Caja de venta   </strong></span><span className="ml-0 text-uppercase text-primary h3"><strong >{dateFormatter(props.cajaVenta.fecha)}</strong></span>
                </div>
                <div className="col-lg-3">
                    <label htmlFor="fecha">Fecha:</label>
                    <Field
                        name="fecha"
                        className=""
                        component={renderDatePicker}
                        placeholder="Fecha"
                        numberOfMonths={1}
                    />
                </div>
                <div className="col-lg-3">
                    <label htmlFor="cuenta">
                        Cuenta a depositar
                    </label>
                    <Field
                        name={`cuenta`}
                        valueKey="id"
                        labelKey="nombre"
                        label="Proyecto"
                        component={renderSearchSelect}
                        loadOptions={getCuentas}
                    />
                </div>
                <div className="col-lg-4">
                    <br/>
                    <div>
                        <label htmlFor="ventas">
                            COBROS&emsp;&emsp;<span className="ml-0 text-uppercase text-rosado h5"><strong>{ cant || '00' }</strong></span>
                        </label>
                    </div>
                </div>
                <div className="col-lg-2">
                    <br/>
                    <Link to="/ventas" className="btn btn-gris w-100">
                        Cancelar
                    </Link>
                </div>
                <div className="col-lg-3">
                    <label htmlFor="noDocumento">
                        No. Boleta
                    </label>
                    <Field name="noDocumento" component={renderField} type="text" className="form-control" />
                </div>
                <div className="col-lg-3">
                    <label htmlFor="fecha">Categoria:</label>
                    <Field
                        name={`categoria`}
                        valueKey="id"
                        labelKey="nombre"
                        label="Categoria"
                        component={renderSearchSelect}
                        loadOptions={getCategorias}
                    />
                </div>
                <div className="col-lg-3 row invisible">
                    <div className="col-md-6">
                        TOTAL A DEPOSITAR
                    </div>
                    <div className="col-md-6">
                        <Field name="monto" component={renderCurrency} disabled type="number" addClass="no-ColorBac" />
                    </div>
                </div>
                <div className="col-lg-4">
                    <br/>
                    <div className="borderRoun">
                        <label htmlFor="monto">
                            TOTAL A DEPOSITAR&emsp;&emsp;
                        </label>
                        <RenderCurrency value={monto || 0} simbolo={props.cajaVenta.simbolo} className={'text-secondary h4 font-weight-bold'}/>
                    </div>
                </div>
                {loaderModal==false ?
                    <div className="col-lg-2">
                    <br/>
                        <button type="submit" className="btn btn-rosado w-100">
                            Hacer Deposito
                        </button>
                    </div>
                :""
                }
                
            </div>
        </CardGrandeForm>
        <br />
        <br />
        <br />
        <CardRed titulo="Ventas" red>
            <FieldArray
                props={{cambiar}}
                name="movimientos"
                component={renderVentas}
                disabled
                type="number" addClass="no-ColorBac"
            />
        </CardRed>
    </form>;
}

CierreVentaForm = reduxForm ({
    enableReinitialize: true,
    form: 'cierreVenta',
    validate: data =>{
        const errors = {}
        if(!data.cuenta){
            errors.cuenta = "Campo requerido";
        }
        if(!data.monto){
            errors.monto = "Campo requerido";
        }
        if(!data.noDocumento){
            errors.noDocumento = "Campo requerido";
        }
        if(Number(data.monto) < 0){
            errors.monto = "Debe ser un valor igual o mayor a 0"
        }
        return errors;
    }
})(CierreVentaForm)


const selector = formValueSelector('cierreVenta');
CierreVentaForm = connect((state) => {
    const cant = selector(state, 'cant');
    const monto = selector(state, 'monto');
    return {
        cant,
        monto,
    };
})(CierreVentaForm);

export default CierreVentaForm;
