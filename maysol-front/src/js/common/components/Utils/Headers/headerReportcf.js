import React, { Component } from 'react';
import { renderSelectField } from '../renderField';
import { RenderCurrency } from '../renderField/renderReadField'
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { Meses } from '../../../utility/constants';

import './header.css';

let years = []
function getYears(){
    years=[];
    let date = new Date();
    let year = date.getFullYear();
    for(let i=year; i>=2017; i--){
        years.push({id:i, value:i, label: i})
    }
}
export default class HeaderReporteCF extends Component {
    constructor(props){
        super(props);
        getYears();
        const fecha = new Date()
        const anio = fecha.getFullYear();
        const mes = fecha.getMonth() + 1;
      }
      cambiarAnio = (e) =>{
        this.props.cambiarAnio(e.target.value);
      }
      cambiarMes = (e) =>{
        this.props.cambiarMes(e.target.value);
      }
      cambiarEmpresa = (e) => {
          this.props.cambiarEmpresa(e.target.value);
      }

  render() {
    const { buscar, buscador, anio, mes, empresa, empresas } = this.props;
    return (
        <div className="grid-title d-flex flex-row borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-2 pb-1 pl-3 ">
                <div className="col-md-10 row">
                    <div className="col-md-4 form-group mb-1">
                        <div className="col-md-12 text-center text-md-left">
                            <label htmlFor="fecha" className="m-0">Empresa:</label>
                        </div>
                        <div className="col-md-12 p-0">
                            <select onChange={this.cambiarEmpresa}  className={'form-control'} value={empresa}>
                                {empresas.map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id}
                                        value={typeof (opcion) === "string" ? opcion : opcion.id}>
                                        {typeof (opcion) === "string" ? opcion : opcion.nombre}
                                    </option>);
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4 form-group mb-1">
                        <div className="col-md-12 text-center text-md-left">
                            <label htmlFor="fecha" className="m-0">Mes:</label>
                        </div>
                        <div className="col-md-12 p-0">
                            <select onChange={this.cambiarMes}  className={'form-control'} value={mes}>
                                {Meses.map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id}
                                        value={typeof (opcion) === "string" ? opcion : opcion.value}>
                                        {typeof (opcion) === "string" ? opcion : opcion.label}
                                    </option>);
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-4 form-group mb-1">
                        <div className="col-md-12 text-center text-md-left">
                            <label htmlFor="fecha"className="m-0">Año:</label>
                        </div>
                        <div className="col-md-12 p-0">
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
                    </div>
                    <div className="col-md-4 form-group mb-1">
                        <div className="col-md-12 text-center text-md-left">
                            <label htmlFor="fecha" className="m-0">Tipo Gasto:</label>
                        </div>
                        <div className="col-md-12 p-0">
                            <select className={'form-control'} value={this.props.categoria} onChange={ (e) =>{
                                this.props.cambiarCategoria(e.target.value)
                            }}>
                                <option value={0}>Todos.</option>
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
                    <div className="col-md-4 form-group mb-1">
                        <div className="col-md-12 text-center text-md-left">
                            <label htmlFor="fecha" className="m-0">Usuarios:</label>
                        </div>
                        <div className="col-md-12 p-0">
                            <select className={'form-control'} value={this.props.usuario} onChange={ (e) =>{
                                this.props.cambiarUsuario(e.target.value)
                            }}>
                                <option value={0}>Todos.</option>
                                {this.props.usuarios.map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id}
                                        value={typeof (opcion) === "string" ? opcion : opcion.id}>
                                        {typeof (opcion) === "string" ? opcion : opcion.nombreCompleto}
                                    </option>);
                                })}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="col d-flex justify-content-end ">
                    <div className="row col-12 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                        {
                            this.props.texto && (
                                <button onClick={this.props.funcion} type="button" className="btn btn-rosado  m-1 d-flex align-items-center">
                                    {this.props.texto}
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
