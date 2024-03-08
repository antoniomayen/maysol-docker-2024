import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Select from 'react-select';
import Search from './Search';
import classNames from 'classnames';

class ToolbarSelect extends Component  {
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex justify-content-between">

                <div className="col-md-4 row">
                    <div className="titulo">
                        <h3 className="m-0 text-uppercase "><strong>{this.props.titulo}</strong></h3>
                    </div>
                    <div className="subtitulo">
                        <span className="text-primary">{this.props.subtitulo? this.props.subtitulo : ''}</span>
                    </div>
                </div>
                <div className="col-md-4 row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                    {
                        this.props.cambiarFiltro && (
                            <div className="col-md-auto text-center text-md-left d-flex align-items-center justify-content-center ">
                                <label htmlFor="fecha" className="m-0"> {this.props.tituloSelect ? this.props.tituloSelect : "Empresas"} </label>
                            </div>
                        )
                    }
                    {
                        this.props.usuario.accesos.administrador && this.props.cambiarFiltro && (
                            <div className="col-md-6 p-0">
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
                        )
                    }

                </div>
                <div className="col-lg-4 col-md-4 text-right search">
                    {(this.props.buscar !== undefined) && (
                    <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                    )}
                </div>
            </div>

        )
    }
}

export default ToolbarSelect;
