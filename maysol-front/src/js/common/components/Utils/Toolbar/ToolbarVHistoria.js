import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Select from 'react-select';
import Search from './Search';
import classNames from 'classnames';
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize';
import moment from 'moment';
import es from 'moment/locale/es';
import 'react-dates/lib/css/_datepicker.css';

class ToolbarVentaHistoria extends Component  {
    state = {
        dateStart: moment.now(),
        focusedStart: false,

        dateEnd: moment.now(),
        focusedEnd: false,
    }
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex">
                <div className="col-md-auto row align-items-center">
                    <div className="titulo">
                        <h3 className="m-0 text-uppercase "><strong>{this.props.titulo}</strong></h3>
                    </div>
                </div>
                <div className="col p-0 row d-flex justify-content-md-start justify-content-center">
                    {
                        this.props.ventas && this.props.usuario.accesos.administrador && (
                            <div className="col-md-4 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                                <div className="col-md-10 p-0">
                                    <label className="m-0">Vendedores</label>
                                    <Select
                                        value={this.props.filtro_vendedores}
                                        onChange={this.props.cambiarVendedores}
                                        placeholder="todos"
                                        options={this.props.vendedores}
                                    />
                                </div>
                                <div className="col-md-10 p-0">
                                    <label className="m-0">Bancos</label>
                                    <Select
                                        value={this.props.filtro_cuenta}
                                        onChange={this.props.cambiarCuenta}
                                        placeholder="todos"
                                        options={this.props.cuentasBancarias}
                                    />
                                </div>
                            </div>
                        )
                    }
                    {/* Inicio de fechas */}
                    <div className="col-md-4 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                        <div className="col-md-10 p-0">
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
                    </div>
                    <div className="col-md-4 p-0 row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                        <div className="col-md-10 p-0">
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
                    </div>
                    {/* fin filtro de fechas */}
                </div>

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

export default ToolbarVentaHistoria;

