import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './toolbar.css';
import Select from 'react-select';
import Search from './Search';

class ToolbarUsuario extends Component  {
    render() {
        return(
            <div className="col-12 row pb-2 pt-3 pl-3 d-flex justify-content-between">
                <div className="col-md-6 row">
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
                <div className="col-md-4 text-right search">
                    {(this.props.buscar !== undefined) && (
                    <Search buscar={this.props.buscar} buscador={this.props.buscador}/>
                    )}
                </div>
            </div>

        )
    }
}

export default ToolbarUsuario;
