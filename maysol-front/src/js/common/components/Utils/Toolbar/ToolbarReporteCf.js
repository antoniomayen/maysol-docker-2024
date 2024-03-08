import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Select from 'react-select';
import Search from './Search';
import classNames from 'classnames';

class ToolbarReporteCF extends Component  {
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 ">
                <div className="col-md-2 titulo d-flex align-items-center">
                    <h3 className="m-0 text-uppercase text-center text-md-left"><strong>{this.props.titulo}</strong></h3>
                </div>

                <div className="col-md-5 row">
                    {(this.props.buscar !== undefined) && (
                        <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                    )}
                    {/*
                        <div className="col-md-3 form-group mb-1">
                            <div className="col-md-12 text-center text-md-left">
                                <label htmlFor="fecha" className="m-0">Tipo Gasto:</label>
                            </div>
                            <div className="col-md-12 p-0">
                                <select className={'form-control'} value={this.props.categoria} onChange={ (e) =>{
                                    this.props.cambiarCategoria(e.target.value)
                                }}>
                                    <option value={0}>Todos.</option>
                                    {this.props.categorias.map((opcion) => {
                                        return (<option
                                            key={typeof (opcion) === "string" ? opcion : opcion.id}
                                            value={typeof (opcion) === "string" ? opcion : opcion.id}>
                                            {typeof (opcion) === "string" ? opcion : opcion.nombre}
                                        </option>);
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3 form-group mb-1">
                            <div className="col-md-12 text-center text-md-left">
                                <label htmlFor="fecha" className="m-0">Usuarios:</label>
                            </div>
                            <div className="col-md-12 p-0">
                                <select className={'form-control'} value={this.props.usuario} onChange={ (e) =>{
                                    this.props.cambiarUsuario(e.target.value)
                                }}>
                                    <option value={0}>Todos.</option>
                                    {this.props.usuarios.map((opcion) => {
                                        return (<option
                                            key={typeof (opcion) === "string" ? opcion : opcion.id}
                                            value={typeof (opcion) === "string" ? opcion : opcion.id}>
                                            {typeof (opcion) === "string" ? opcion : opcion.nombreCompleto}
                                        </option>);
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6 form-group mt-4 mb-0">
                            {(this.props.buscar !== undefined) && (
                                <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                            )}
                        </div>
                    */}
                </div>
                <div className="col d-flex justify-content-end ">
                    <div className="row col-12 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                        {
                            this.props.texto && (
                                <button onClick={this.props.funcion} type="button" className="btn btn-rosado  m-1 d-flex align-items-center">
                                    {this.props.texto}
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>

        )
    }
}

export default ToolbarReporteCF;
