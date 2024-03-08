import React, { Component } from 'react';
import { renderSelectField } from '../renderField';
import { RenderCurrency } from '../renderField/renderReadField'
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import './header.css';
import { timingSafeEqual } from 'crypto';

const opciones = [
        {id:1,value:1,label:"Compra"},
        {id:2,value:2,label:"Despacho"},
]
class HeaderEstadoGallinero extends Component {
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
                        <span className="text-primary">{this.props.empresa}</span>
                    </div>
                </div>
                <div className="col d-flex align-items-center ver-escritorio">
                    <div className="barra-horizontal"></div>
                </div>



                <div className= {`col-md-6 d-flex justify-content-end `} >
                    {

                            <div className="col-md-12 p-0">
                                <div className="row col-12 p-0 m-0 d-flex justify-content-center  justify-content-md-end">
                                    {
                                        this.props.texto1 && (
                                            <Link
                                                to={`/maysol_gallineroCrearProduccion/${this.props.idGallinero}`}
                                                type="button" className="btn btn-naranja btn-estadocuenta text-center m-1 ">
                                                <span>{this.props.texto1}</span>
                                            </Link>
                                        )
                                    }

                                    {
                                        this.props.texto4  && (
                                            <button type="button" onClick={this.props.funcion4} className="btn btn-celeste btn-estadocuenta text-center m-1 ">
                                                <span> {this.props.texto4} </span>
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="row col-12 p-0 m-0 d-flex justify-content-center  justify-content-md-end">

                                    {
                                        this.props.texto2 && (
                                            <button onClick={this.props.funcion2} type="button" className="btn btn-secondary btn-estadocuenta text-center m-1 ">
                                               <span>{this.props.texto2}</span>
                                            </button>
                                        )
                                    }
                                    {
                                        this.props.texto3  && (
                                            <button type="button" onClick={this.props.funcion3} className="btn btn-primary btn-estadocuenta text-center m-1 ">
                                                <span>{this.props.texto3}</span>
                                            </button>
                                        )
                                    }
                                </div>
                            </div>

                    }

                </div>
            </div>

        </div>
    );
  }
}

export default HeaderEstadoGallinero;
