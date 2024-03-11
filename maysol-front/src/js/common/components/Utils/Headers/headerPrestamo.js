import React, { Component } from 'react';
import { renderSelectField } from '../renderField';
import { RenderCurrency } from '../renderField/renderReadField'
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

class HeaderPrestamo extends Component {
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
    const { buscar, buscador, me } = this.props;
    return (
        <div className="grid-title d-flex flex-row borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pl-3">
                <div className="col-md-4">
                    <div>
                        {this.props.proyecto1} presta a {this.props.proyecto2}
                    </div>
                    <div>
                        {this.props.descripcion}
                    </div>
                </div>
                <div className="col-md-2 d-flex justify-content-center align-items-center ver-escritorio">
                    <div className="img-borderless" />
                </div>
                {
                    this.props.saldo.registro ?
                    <div className="col-md-3 d-flex justify-content-center align-items-center">
                        <div className="col-12">
                            <h2 className="no-registros">
                                No hay registros.
                            </h2>
                        </div>
                    </div>
                :
                    <div className="col-md-3 ">
                                <div className="row col-md-12 p-0 m-0">
                                    <div className="col-4 col-md-2 text-center text-md-right d-md-flex align-items-center justify-content-end pr-0">
                                            <span className="text-uppercase text-gris font-italic font-weight-bold">Inicio:</span>
                                    </div>
                                    <div className="col-8 col-md-9 d-flex align-items-center text-center text-md-right">
                                        <RenderCurrency value={this.props.saldo.inicio} className={'text-primary h4 font-weight-bold'}/>
                                    </div>
                                </div>


                                <div className="row col-md-12  p-0  m-0">
                                    <div className="col-4 col-md-2 text-center text-md-right d-md-flex align-items-center justify-content-end pr-0">
                                        {
                                            this.props.saldo.saldo ?
                                                <span className="text-uppercase text-gris font-italic font-weight-bold">Saldo:</span> :
                                                <span className="text-uppercase text-gris font-italic font-weight-bold">Fin:</span>
                                        }

                                    </div>
                                    <div className="col-8 col-md-9 d-flex align-items-center text-center text-md-right">
                                        {
                                            this.props.saldo.saldo ?
                                            <RenderCurrency value={this.props.saldo.saldo} className={'text-secondary h2 font-weight-bold'}/>:
                                            <RenderCurrency value={this.props.saldo.cierre} className={'text-secondary h2 font-weight-bold'}/>
                                        }

                                    </div>
                                </div>
                    </div>
                }


                {
                    me.proyecto.toUpperCase() === this.props.proyecto1.toUpperCase() && this.props.saldo.saldo && (
                        <div className="col-md-3 d-flex justify-content-end ">
                            <div className="row col-12 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
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
                    )
                }
            </div>

        </div>
    );
  }
}

export default HeaderPrestamo;
