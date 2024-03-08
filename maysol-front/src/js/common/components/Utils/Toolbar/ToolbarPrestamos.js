import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Select from 'react-select';
import Search from './Search';
import { api } from 'api/api';


let proyectos = []

const getProyectos = () => {
    return api.get("proyectos/getProyectoFiltros").catch((error) => { })
        .then((data) => {
            proyectos = [];
            data.forEach(item => {
                if (!_.find(proyectos, { id: item.id })) {
                    proyectos.push(item);
                }
            });
            return proyectos
        })
};
class ToolbarPrestamos extends Component  {
    componentWillMount(){
        getProyectos();
    }
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex justify-content-between">
                <div className="col-md-4 row d-flex align-items-center">
                    <div className="titulo">
                        <h3 className="ml-0 text-uppercase "><strong>{this.props.titulo}</strong></h3>
                    </div>
                    {
                        this.props.subtitulo && (
                            <div className="subtitulo">
                                <span className="text-primary">{this.props.subtitulo}</span>
                            </div>
                        )
                    }

                </div>
                <div className="col-md-2 form-group m-0">
                        <label className="m-0">Acreedor</label>
                        <Select
                            value={this.props.f_acreedor}
                            onChange={this.props.setFiltroAcreedor}
                            placeholder="todos"
                            options={proyectos}
                        />
                </div>
                <div className="col-md-2 form-group m-0">
                        <label className="m-0">Deudor</label>
                        <Select
                            value={this.props.f_deudor}
                            onChange={this.props.setFiltroDeudor}
                            placeholder="todos"
                            options={proyectos}
                        />
                </div>
                <div className="col-md-4 text-right search d-flex align-items-end">
                    {(this.props.buscar !== undefined) && (
                    <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                    )}
                </div>
            </div>

        )
    }
}

export default ToolbarPrestamos;
