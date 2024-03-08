import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Search from './Search';
import Select from 'react-select';
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

class ToolbarHistoriaB extends Component  {
    state = {
        dateStart: moment.now(),
        focusedStart: false,

        dateEnd: moment.now(),
        focusedEnd: false,
    }
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex justify-content-md-end justify-content-center">
                {/* <div className="col-md-12 row align-items-center mb-3">
                    <div className="titulo">
                        <h3 className="m-0 text-uppercase "><strong>{this.props.titulo}</strong></h3>
                    </div>
                </div> */}
                <div className="col-md-2 form-group">
                    <label className="m-0">Fecha Inicial</label>

                    <SingleDatePicker
                        placeholder={"Fecha Inicio"}
                        date={this.props.dateStart ? moment(this.props.dateStart ) : null}
                        focused={this.state.focusedStart}
                        isOutsideRange={() => false}
                        onDateChange={(value) => {
                           this.setState({dateStart:value})
                           this.props.setDateStart(value)
                        }}

                        onFocusChange={({ focused }) => this.setState({ focusedStart: focused })}
                        numberOfMonths={1}
                        id={"dateStart"}
                    />
                </div>
                <div className="col-md-2 form-group">
                    <label className="m-0">Fecha Final</label>
                    <SingleDatePicker
                        placeholder={"Fecha Inicio"}
                        date={this.props.dateEnd ? moment(this.props.dateEnd ) : null}
                        focused={this.state.focusedEnd}
                        isOutsideRange={() => false}
                        onDateChange={(value) => {
                           this.setState({dateEnd:value})
                           this.props.setDateEnd(value);
                        }}

                        onFocusChange={({ focused }) => this.setState({ focusedEnd: focused })}
                        numberOfMonths={1}
                        id={"dateStart"}
                    />
                </div>
                <div className="col-md-2 row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                    <div className="col-md-10 p-0">
                        <label className="m-0">Acciones</label>
                        <Select
                            value={this.props.filtro_movimiento}
                            onChange={this.props.cambiarMovimiento}
                            placeholder="todos"
                            options={[
                                {value: 10, label: 'Ingresos'},
                                {value: 30, label: 'Despachos'},
                                {value: 40, label: 'Reajustes'}
                            ]}
                        />
                    </div>
                </div>
                {
                    this.props.data.results && (this.props.usuario.accesos.administrador || this.props.usuario.accesos.supervisor ) && (
                        <div className="col-md-2 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                            <div className="col-md-10 p-0">
                                <label className="m-0">Productos</label>
                                <Select
                                    valueKey="stock"
                                    labelKey="nombre"
                                    value={this.props.filtro_producto}
                                    onChange={e => {this.props.setFiltroProducto(e, true)}}
                                    placeholder="todos"
                                    options={this.props.data.results}
                                />
                            </div>
                        </div>
                    )
                }
                <div className="col-lg-4 col-md-3 text-right search  ml-0 ml-md-4">
                    <label htmlFor="fecha" className="m-0">&nbsp;</label>
                    {(this.props.buscar !== undefined) && (
                    <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                    )}
                </div>
            </div>

        )
    }
}
//INGRESO = 10 #(+)
//DESPACHO = 30 #(-)
//REAJUSTE = 40 #(-)
export default ToolbarHistoriaB;
