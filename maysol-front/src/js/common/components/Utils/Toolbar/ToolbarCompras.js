import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Select from 'react-select';
import Search from './Search';
import { RenderCurrency } from '../../Utils/renderField/renderReadField'
import classNames from 'classnames';

class ToolbarCompras extends Component  {
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex">
                <div className="col-md-auto row align-items-center">
                    <div className="titulo">
                        <h3 className="m-0 text-uppercase "><strong>{this.props.titulo}</strong></h3>
                    </div>
                </div>
                <div className="col p-0 row d-flex justify-content-end">
                    <div className="col-md-4 p-0 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                        <div className="row col-12">
                            <div className="col text-center text-md-right d-md-flex align-items-center justify-content-end pr-0">
                                    <span className="text-uppercase text-gris font-italic"> <strong>TOTAL:</strong>&nbsp;</span>
                                    <RenderCurrency value={this.props.total} simbolo="Q"  className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                            <div className="col text-center text-md-right d-md-flex align-items-center justify-content-end pr-0">
                                    <span className="text-uppercase text-gris font-italic"> <strong>PAGOS:</strong>&nbsp;</span>
                                    <RenderCurrency value={this.props.pagos} simbolo="Q"  className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                        </div>
                    </div>

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
                    {
                        this.props.usuario.accesos.administrador && (
                        <div className="col-md-4 p-0 row form-group mb-1 d-flex justify-content-center justify-content-md-end">

                                    <div className="col-md-10 p-0">
                                        <label htmlFor="fecha" className="m-0"> {this.props.tituloSelect ? this.props.tituloSelect : "Empresas"} </label>
                                        <select className={classNames('form-control')} value={this.props.filtro} onChange={ (e) =>{
                                            this.props.cambiarFiltro(e.target.value.toString())
                                        }}>
                                            {this.props.empresas.map((opcion) => {
                                                return (<option
                                                    key={typeof (opcion) === "string" ? opcion : opcion.id.toString()}
                                                    value={typeof (opcion) === "string" ? opcion : opcion.id.toString()}>
                                                    {typeof (opcion) === "string" ? opcion : opcion.nombre}
                                                </option>);
                                            })}
                                        </select>
                                    </div>
                        </div>
                     )
                    }
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
                            </div>
                        )
                    }

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

export default ToolbarCompras;
