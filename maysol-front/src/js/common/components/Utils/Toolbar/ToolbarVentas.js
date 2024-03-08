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

class ToolbarVenta extends Component  {
    state = {
        dateStart: moment.now(),
        focusedStart: false,

        dateEnd: moment.now(),
        focusedEnd: false,
    }
    render() {
        const { usuario } = this.props;
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex">
                <div className="col-md-auto row align-items-center">
                    <div className="titulo">
                        <h3 className="m-0 text-uppercase "><strong>{this.props.titulo}</strong></h3>
                    </div>
                </div>
                <div className="col p-0 row d-flex justify-content-md-start justify-content-center">
                    <div className="col-md-4 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                        <div className="col-md-10 p-0">
                            <label className="m-0">Pendientes</label>
                            <Select
                                value={this.props.filtro_pendientes}
                                onChange={this.props.cambiarPendientes}
                                placeholder="todos"
                                options={[
                                    {value: 'pendiente_entrega', label: 'De entrega'},
                                    {value: 'pago_pendiente', label: 'De pago '}
                                ]}
                            />
                        </div>
                    </div>
                    <div className="col-md-4 p-0 row form-group mb-1 d-flex justify-content-center justify-content-md-end">

                        <div className="col-md-10 p-0">
                            <label htmlFor="fecha" className="m-0"> {this.props.tituloSelect ? this.props.tituloSelect : "Empresas"} </label>
                            <select className={classNames('form-control')} value={this.props.filtro} onChange={ (e) =>{
                                this.props.cambiarFiltro(e.target.value.toString())
                            }}>
                                {(usuario && usuario.is_superuser == false) ? this.props.empresas.filter(item => item.id == usuario.idProyecto).map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id.toString()}
                                        value={typeof (opcion) === "string" ? opcion : opcion.id.toString()}>
                                        {typeof (opcion) === "string" ? opcion : opcion.nombre}
                                    </option>);
                                }) : this.props.empresas.map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id.toString()}
                                        value={typeof (opcion) === "string" ? opcion : opcion.id.toString()}>
                                        {typeof (opcion) === "string" ? opcion : opcion.nombre}
                                    </option>);
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-4 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                        <div className="col-md-10 p-0">
                            <label className="m-0">Vendedores</label>
                            <Select
                                value={this.props.filtro_vendedores}
                                onChange={this.props.cambiarVendedores}
                                placeholder="todos"
                                options={this.props.vendedores.filter(item => usuario.is_superuser == true || item.value == usuario.id)}
                            />
                        </div>
                    </div>
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

                    <div className="col-md-4 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                        <div className="col-md-10 p-0">
                            <label className="m-0">Productos</label>
                            <Select
                                multi
                                value={this.props.filtro_producto}
                                onChange={this.props.set_filtro_producto}
                                placeholder="todos"
                                options={this.props.productos}
                            />
                        </div>
                    </div>

                    <div className="col-md-4 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                        <div className="col-md-10 p-0">
                            <label className="m-0">Clientes</label>
                            <Select
                                valueKey="id"
                                labelKey="nombre"
                                value={this.props.filtro_cliente}
                                onChange={this.props.set_filtro_cliente}
                                placeholder="todos"
                                options={this.props.proveedores}
                            />
                        </div>
                    </div>
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

export default ToolbarVenta;

