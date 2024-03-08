import React, { Component } from 'react';
import { renderSelectField } from '../../Utils/renderField';
import { RenderCurrency } from '../../Utils/renderField/renderReadField'
import {ROLES}  from '../../../utility/constants';
import { Field } from 'redux-form';

import './header.css';
let options= [
    {id:1,value:1,label:"Enero"},
    {id:2,value:2,label:"Febrero"},
    {id:3,value:3,label:"Marzo"},
    {id:4,value:4,label:"Abril"},
    {id:5,value:5,label:"Mayo"},
    {id:6,value:6,label:"Junio"},
    {id:7,value:7,label:"Julio"},
    {id:8,value:8,label:"Agosto"},
    {id:9,value:9,label:"Septiembre"},
    {id:10,value:10,label:"Octubre"},
    {id:11,value:11,label:"Noviembre"},
    {id:12,value:12,label:"Diciembre"}
]
let years = []
function getYears(){
    years=[];
    let date = new Date();
    let year = date.getFullYear();
    for(let i=year; i>=2017; i--){
        years.push({id:i, value:i, label: i})
    }
}

class HeaderCaja extends Component {
  constructor(props){
    super(props);
    getYears();
    const fecha = new Date()
    const anio = fecha.getFullYear();
    const mes = fecha.getMonth() + 1;
    this.state = {anio: anio, mes: mes};
  }
  cambiarAnio = (e) =>{
    this.setState({anio: e.target.value});
    this.props.cambiarAnio(e.target.value);
  }
  cambiarMes = (e) =>{
    this.setState({mes: e.target.value})
    this.props.cambiarMes(e.target.value);
  }
  render() {
    const { buscar, buscador } = this.props;
    return (
        <div className="grid-title d-flex flex-row borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pl-3">
                <div className="col-md-2 d-flex align-items-center justify-content-center justify-content-md-start">
                    <div className="gradient-block-vertical">
                        <div className="titulo-caja">
                            <h3 className="ml-0 text-uppercase "><strong>caja</strong></h3>
                        </div>
                    </div>
                </div>
                {
                    this.props.saldo.registro ?
                    (
                        <div className="col-md-6 centro">
                            <div className="col-12">
                                <h2 className="no-registros">
                                    No hay registros.
                                </h2>
                            </div>
                        </div>
                    ):
                    (
                        <div className="col-md-6 centro">
                            <div className="row">
                                <div className="row col-md-6 p-0">
                                    <div className="col-md-auto  text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                            <span className="text-uppercase text-gris font-italic"><strong>Anterior:</strong></span>
                                    </div>
                                    <div className="col d-flex align-items-center justify-content-center justify-content-md-start">
                                        <RenderCurrency value={this.props.saldo.anterior || 0} className={'text-gris h4  font-weight-bold'}/>
                                    </div>
                                </div>
                                <div className="row col-md-6 p-0">
                                    <div className="col-md-auto text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                            <span className="text-uppercase text-gris font-italic"><strong>Inicio:</strong></span>
                                    </div>
                                    <div className="col d-flex align-items-center justify-content-center justify-content-md-start">
                                        <RenderCurrency value={this.props.saldo.inicio} className={'text-primary h4 font-weight-bold'}/>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="row col-md-6 p-0">
                                    <div className="col-md-auto  text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                            <span className="text-uppercase text-gris font-italic">
                                                <strong>
                                                    {
                                                        this.props.saldo.cierre ? "Fin" : "Saldo"
                                                    }
                                                </strong>

                                            </span>
                                    </div>
                                    <div className="col d-flex align-items-center justify-content-center justify-content-md-start">
                                            {
                                                this.props.saldo.cierre ? (
                                                    <RenderCurrency value={this.props.saldo.cierre || 0} className={'text-secondary h2 font-weight-bold'}/>

                                                ): (
                                                    <RenderCurrency value={this.props.saldo.saldo || 0} className={'text-secondary h2 font-weight-bold'}/>
                                                )
                                            }
                                    </div>
                                </div>


                            </div>

                        </div>
                    )
                }


                <div className="col-md-4 d-flex justify-content-end ">
                    <div className="row col-12 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                    {
                                         this.props.texto1 && (this.props.me.accesos.administrador || this.props.me.accesos.supervisor) && (
                                            <button onClick={this.props.funcion1} type="button" className="btn btn-rosado m-1 d-flex align-items-center">
                                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image1} alt="Ver"/>
                                                {this.props.texto1}
                                            </button>
                                        )
                                    }
                                    {
                                        this.props.texto2 && (
                                            <button onClick={this.props.funcion2} type="button" className="btn btn-secondary m-1 d-flex align-items-center">
                                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image2} alt="Ver"/>
                                                {this.props.texto2}
                                            </button>
                                        )
                                    }
                                    {
                                        this.props.texto3 && (
                                            <button type="button" onClick={this.props.funcion3} className="btn btn-primary m-1 d-flex align-items-center">
                                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image3} alt="Ver"/>
                                                {this.props.texto3}
                                            </button>
                                        )
                                    }




                    </div>
                </div>
            </div>

        </div>
    );
  }
}

export default HeaderCaja;
