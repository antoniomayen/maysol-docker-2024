import React, { Component } from 'react';
import { renderSelectField } from '../renderField';
import { RenderCurrency } from '../renderField/renderReadField'
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import './header.css';

class HeaderGallinero extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
        <div className="grid-title d-flex flex-row borde-superior altura-card border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pb-3 pl-3 fondo-simple">
                <div className="col-md-auto text-center">
                    <img style={{maxWidth: "65px"}} title="Maysol" src={require("../../../../../assets/img/maysol_cabecera.png")} alt="Logo Maysol"/>
                </div>
                <div className="col d-flex align-items-center ver-escritorio">
                    <div className="barra-horizontal"></div>
                </div>
                {
                    this.props.instruccion && (
                        <div className="col-md-3 text-center d-flex align-items-center justify-content-center ">
                            <span className="texto-instruccion">{this.props.instruccion}</span>
                        </div>
                    )
                }

                <div className="col-md-3 d-flex justify-content-end ">
                    <div className="row col-12 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                    </div>
                </div>
            </div>

        </div>
    );
  }
}

export default HeaderGallinero;
