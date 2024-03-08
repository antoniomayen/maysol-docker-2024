import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import { ROLES } from '../../../utility/constants';
import Select from 'react-select';
import Search from './Search';
import classNames from 'classnames';

class ToolbarEstado extends Component  {
    cambiarFiltro = (event)=> {
        this.props.cambiarFiltro(event);
    }
    render() {
        const { usuario } = this.props;
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex justify-content-between">
                <div className="col-md-3">
                    <div className="titulo p-0">
                        <h3 className="ml-0 text-uppercase text-center text-md-left m-0"><strong>{this.props.titulo}</strong></h3>
                    </div>
                    <div className="subtitulo">
                        <span>{this.props.subtitulo}</span>
                    </div>
                </div>
                <div className="col-md-2 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                    <div className="col-md-11 p-0">
                        <label className="m-0">Filtro</label>
                        <Select
                            value={this.props.filtro_anulados}
                            onChange={this.props.cambiarAnulados}
                            placeholder="todos"
                            options={[
                                {value: 'false', label: 'Activos'},
                                {value: 'true', label: 'Anulados'}
                            ]}
                        />
                    </div>
                </div>
                <div className="col-md-3 ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end">
                    <div className="col-md-11 p-0">
                        <label className="m-0">Filtrar por categorías</label>
                        <select className={'form-control'} value={this.props.filtro} onChange={ (e) =>{
                                this.props.cambiarFiltro(e.target.value)
                            }}>
                                <option value={0}>Todos.</option>
                                <option value={-1}>Sin categorias</option>
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


                <div className="col-md-4 p-0  ml-0  row form-group mb-1 d-flex justify-content-center justify-content-md-end align-items-center">

                        {(this.props.buscar !== undefined) && (
                        <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                        )}

                </div>
            </div>

        )
    }
}

export default ToolbarEstado;
