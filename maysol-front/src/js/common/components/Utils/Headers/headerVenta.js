import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RenderCurrency } from 'Utils/renderField/renderReadField'

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

class HeaderVenta extends Component {
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
    let deshabilitar = false;
    if (this.props.saldo <= 0){
        deshabilitar = true
    }
    return (
        <div
            className="mb-3 d-inline-block d-flex card-ventas"
            style={{ width: '100%', paddingLeft: 15, paddingRight: 5 }}
        >
            <div
                className="float-left mb-3"
                style={{ width: '80%' }}
            >
                <div className="col-12 row pb-2 pt-3 pl-3 borde-superior border-completo">
                    <div className="col-md-2 d-flex align-items-center justify-content-center justify-content-md-start">
                        <div className="gradient-block-vertical">
                            <div className="titulo-caja">
                                <h3 className="ml-0 text-uppercase "><strong>Caja</strong></h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-10 centro p0 m0" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                        <div className="row p0 m0" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                            <div className="row col-4 p-0" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                                <div className="col-12  text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                    <span className="text-uppercase text-gris font-italic" style={{ fontSize: 12 }}>
                                        <strong>CRÉDITO 7 DÍAS</strong>
                                    </span>
                                </div>
                                <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-start">
                                    <RenderCurrency value={this.props.dias7 || 0} simbolo={this.props.simbolo} className={'text-gris h6 font-weight-bold'}/>
                                </div>
                            </div>
                            <div className="row col-4 p-0" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                                <div className="col-12  text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                    <span className="text-uppercase text-gris font-italic" style={{ fontSize: 12 }}>
                                        <strong>CRÉDITO 15 DÍAS</strong>
                                    </span>
                                </div>
                                <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-start">
                                    <RenderCurrency value={this.props.dias15 || 0} simbolo={this.props.simbolo} className={'text-gris h6 font-weight-bold'}/>
                                </div>
                            </div>
                            <div className="row col-4 p-0" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                                <div className="col-12  text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                    <span className="text-uppercase text-gris font-italic" style={{ fontSize: 12 }}>
                                        <strong>CRÉDITO 1 MES</strong>
                                    </span>
                                </div>
                                <div className="col-12 d-flex align-items-center justify-content-center justify-content-md-start">
                                    <RenderCurrency value={this.props.mes || 0} simbolo={this.props.simbolo} className={'text-gris h6 font-weight-bold'}/>
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                            <div className="row col-md-4 p-0" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                                <div className="col-md-auto  text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                    <span className="text-uppercase text-gris font-italic">
                                        <strong>TOTAL A COBRAR</strong>
                                    </span>
                                </div>
                                <div className="col d-flex align-items-center justify-content-center justify-content-md-start">
                                    <RenderCurrency value={(this.props.total) || 0} simbolo={this.props.simbolo} className={'text-secondary h5 font-weight-bold'}/>
                                </div>
                            </div>
                            <div className="row col-md-5 p-0" style={{ marginRight: 'initial', marginLeft: 'initial' }}>
                                {this.props.admin && (
                                    <React.Fragment>
                                        <div className="col-md-auto  text-center  d-flex align-items-center justify-content-center justify-content-md-start p-0">
                                            <span className="text-uppercase text-gris font-italic">
                                                <strong>pendientes de deposito</strong>
                                            </span>
                                        </div>
                                        <div className="col d-flex align-items-center justify-content-center justify-content-md-start">
                                            <RenderCurrency value={(this.props.saldoUser) || 0} simbolo={this.props.simbolo} className={'text-secondary h5 font-weight-bold'}/>
                                        </div>
                                    </React.Fragment>
                                )}
                            </div>
                            <div
                                className="row col-md-3 text-right align-items-center justify-content-center"
                                style={{ marginRight: 'initial', marginLeft: 'initial' }}
                            >
                                <p className="text-right w-100 p-0 m-0">
                                    <Link to="/venta/crear" className="btn btn-primary m-1 d-flex align-items-center justify-content-center text-center float-right">
                                        Realizar ventas
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="d-flex align-items-center borde-superior border-completo float-left p-3"
                 style={{ width: '20%' }}
            >
                <div className="row p-0 m-0 col-12 d-flex align-items-center">
                    {/*this.props.funcion1*/}
                    {/*() => window.location.href = '#/ventas/deposito'*/}

                    <div className="col-md-12 p-0 m-auto text-center">
                        <span className="text-uppercase text-gris font-italic">
                            <strong>SALDO ACTUAL</strong>
                        </span>
                    </div>
                    <div className="col-md-12 p-0 m-auto text-center">
                        <RenderCurrency value={this.props.saldo || 0} simbolo={this.props.simbolo} className={'text-secondary h5 font-weight-bold'}/>
                    </div>
                    <div className="col-md-12 p-0 m-auto text-center">
                        <button onClick={() => window.location.href = '#/ventas/deposito'} type="button"
                            disabled={deshabilitar}
                            className="btn btn-rosado mt-3">
                            Hacer Deposito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default HeaderVenta;
