import React, { Component } from 'react';
import { renderSelectField } from '../../Utils/renderField';
import { RenderCurrency } from '../../Utils/renderField/renderReadField'
import { Field } from 'redux-form';
import { dateFormatter } from 'Utils/renderField/renderReadField';

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

class HeaderGastos extends Component {
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
    const { buscar, buscador, anio, mes, simbolo } = this.props;
    return (
        <div className=" borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pl-3 m-0">
                <div className="col-md-2">
                        <div className="col-md-12 form-group p-0 mb-1">
                            <select onChange={this.cambiarAnio} className={'form-control'} value={anio}>
                                {years.map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id}
                                        value={typeof (opcion) === "string" ? opcion : opcion.value}>
                                        {typeof (opcion) === "string" ? opcion : opcion.label}
                                    </option>);
                                })}
                            </select>
                        </div>
                        <div className="col-md-12 form-group p-0">
                            <select onChange={this.cambiarMes}  className={'form-control'} value={mes}>
                                {options.map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id}
                                        value={typeof (opcion) === "string" ? opcion : opcion.value}>
                                        {typeof (opcion) === "string" ? opcion : opcion.label}
                                    </option>);
                                })}
                            </select>
                        </div>
                </div>
                <div className="col-md-4 row d-flex align-items-center">
                    {
                        this.props.saldo.registro ?
                            <div className="row col-12">
                                <h2 className="no-registros">
                                    No hay registros.
                                </h2>
                            </div>

                        :
                        <div className="col-12 p-0 m-0">
                            <div className="row col-12">

                                <div className="col text-center text-md-right d-md-flex align-items-center justify-content-end pr-0">
                                        <span className="text-uppercase text-gris font-italic"> <strong>Inicio:</strong></span>
                                </div>
                                <div className="col-md-9 d-flex align-items-center justify-content-center justify-content-md-start">
                                    <RenderCurrency value={this.props.saldo.inicio} simbolo={simbolo}  className={'text-primary h4 font-weight-bold'}/>
                                </div>
                            </div>
                            <div className="row col-12">
                                <div className="col text-center text-md-right d-md-flex align-items-center justify-content-end pr-0">
                                    {
                                        this.props.saldo.saldo !== undefined ?
                                        <span className="text-uppercase text-gris font-italic"><strong>Saldo:</strong></span>:
                                        <span className="text-uppercase text-gris font-italic"><strong>Fin:</strong></span>
                                    }

                                </div>
                                <div className="col-md-9 d-flex align-items-center justify-content-center justify-content-md-start">
                                    {
                                        this.props.saldo.saldo !== undefined ?
                                        <RenderCurrency value={this.props.saldo.saldo} simbolo={this.props.simbolo} className={'text-secondary h2 font-weight-bold'}/>:
                                        <RenderCurrency value={this.props.saldo.cierre} simbolo={this.props.simbolo}  className={'text-secondary h2 font-weight-bold'}/>
                                    }
                                </div>
                            </div>
                        </div>

                    }


                </div>
                {
                    this.props.cierre.cerrado && (
                        <div className="col-md-3">
                            <div className="col-md-12 text-center text-md-left">
                                <span className="text-danger-dark  h4 font-italic">Cerrado</span>
                            </div>
                            <div className="col-md-12 text-center text-md-left font-italic">
                                <span>{this.props.cierre.usuarioCierre}</span>
                            </div>
                            <div className="col-md-12 text-center text-md-left font-italic ">
                                <span>{dateFormatter(this.props.cierre.fechaCierre)}</span>
                            </div>
                        </div>
                    )
                }

                <div className= {`${this.props.cierre.cerrado ? 'col-md-3' : 'col-md-6'}  d-flex justify-content-end `} >
                    {
                        this.props.cierre.cerrado ?
                            <div className="row col-12 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                <button type="button" onClick={this.props.abrirComprobante} className="btn btn-primary m-1 d-flex align-items-center">
                                    <img style={{maxWidth: "25px"}} title="Ver" src={require('../../../../../assets/img/buttons/verdocumentocierre.png')} alt="Ver"/>
                                    Comprobante cierre
                                </button>
                            </div>
                        :
                            <div className="col-md-12 p-0">
                                <div className="row col-12 p-0 m-0 d-flex justify-content-center  justify-content-md-end">
                                    {
                                        this.props.texto1 && (
                                            <button onClick={this.props.funcion1} type="button" className="btn btn-rosado btn-estadocuenta m-1 d-flex align-items-center">
                                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image1} alt="Ver"/>
                                                {this.props.texto1}
                                            </button>
                                        )
                                    }

                                    {
                                        this.props.texto3  && (
                                            <button type="button" onClick={this.props.funcion3} className="btn btn-primary btn-estadocuenta m-1 d-flex align-items-center">
                                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image3} alt="Ver"/>
                                                {this.props.texto3}
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="row col-12 p-0 m-0 d-flex justify-content-center  justify-content-md-end">

                                    {
                                        this.props.texto2 && (
                                            <button onClick={this.props.funcion2} type="button" className="btn btn-secondary btn-estadocuenta m-1 d-flex align-items-center">
                                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image2} alt="Ver"/>
                                                {this.props.texto2}
                                            </button>
                                        )
                                    }
                                    {
                                        this.props.texto3  && (
                                            <button type="button" onClick={this.props.funcion4} className="btn btn-celeste btn-estadocuenta m-1 d-flex align-items-center">
                                                <img style={{maxWidth: "25px"}} title="Ver" src={this.props.image4} alt="Ver"/>
                                                {this.props.texto4}
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

export default HeaderGastos;
