import React, { Component } from 'react';
import { renderSelectField } from '../renderField';
import { RenderCurrency } from '../renderField/renderReadField'
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import './header.css';

class HeaderBodega extends Component {
  constructor(props){
    super(props);

  }

  render() {
    return (
        <div className=" borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pl-3 m-0 fondo-simple">
                <div className="col-md-3 p-0 ">
                    <div className="titulo p-0">
                        <h3 className="m-0 text-uppercase text-center text-md-left"><strong>{this.props.bodega}</strong></h3>
                    </div>
                    <div className="subtitulo p-0">
                        <span className="text-primary"> {this.props.empresa}</span>
                    </div>
                </div>
                <div className="col d-flex align-items-center ver-escritorio">
                    <div className="barra-horizontal"></div>
                </div>


                <div className="col-md-6 d-flex justify-content-end ">
                    <div className="row col-12 d-flex justify-content-center justify-content-md-end">
                        <Link className="btn btn-primary btn-estadocuenta m-1 " to={`/bodega_ingreso/${this.props.idBodega}/`}> INGRESAR </Link>
                        <Link className="btn btn-secondary btn-estadocuenta m-1 " to={`/bodega_despacho/${this.props.idBodega}/`}>DESPACHAR </Link>
                    </div>
                </div>
            </div>

        </div>

    );
  }
}

export default HeaderBodega;
