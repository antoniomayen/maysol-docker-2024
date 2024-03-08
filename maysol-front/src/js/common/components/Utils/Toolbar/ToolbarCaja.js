import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Select from 'react-select';
import Search from './Search';

class ToolbarCaja extends Component  {
    cambiarFiltro = (event)=> {
        this.props.cambiarFiltro(event.target.value);
    }
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex justify-content-between">
                <div className="col-md-4 row">
                    <div className="titulo">
                        <h3 className="ml-0 text-uppercase "><strong>{this.props.titulo}</strong></h3>
                    </div>
                    <div className="subtitulo">
                        <span className="text-primary">{this.props.duenio}</span>
                    </div>
                </div>
                <div className="col-md-3 form-group">
                        <label className="m-0">Filtrar por categorías</label>
                        <select className={'form-control'} value={this.props.filtro_categoria} onChange={ (e) =>{
                                this.props.cambiarFiltroCategoria(e.target.value)
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
                <div className="col-md-2 d-flex flex-column">
                    <label className="m-0">&nbsp;</label>
                    {
                        this.props.texto && (
                            <button onClick={this.props.funcion} type="button" className="btn btn-secondary m-1 d-flex align-items-center">
                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image} alt="Ver"/>
                                {this.props.texto}
                            </button>
                        )
                    }
                </div>
                <div className="col-lg-3 col-md-4 text-right search">
                    <label className="m-0">&nbsp;</label>
                    {(this.props.buscar !== undefined) && (
                    <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                    )}
                </div>
            </div>

        )
    }
}

export default ToolbarCaja;
