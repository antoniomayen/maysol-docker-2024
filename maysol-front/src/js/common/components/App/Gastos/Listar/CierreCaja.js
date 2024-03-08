import React, { Component } from 'react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { api } from "../../../../../api/api";
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import { dateFormatter } from '../../../Utils/renderField/renderReadField';


class CierreCaja extends Component {
  constructor(props) {
    super(props);
    this.state = { documentos: [], fotos: []};
  }


  componentWillMount() {

  }





  crearCierre = () => {
    const documentos = this.state.documentos;
    const postDocuments = [];
    const docs = [];
    let params = {caja: 'caja'}
    Swal({
        title: '¿Está seguro de cerrar la caja?',
        text: '¡Al realizar el cierre ya no podrá agregar más movimientos a la caja!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true
    }).then((result) => {
        if(result.value){
            Swal({
                title: '¿Está seguro?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí',
                cancelButtonText: 'No',
                reverseButtons: true
            }).then((result) => {
                if(result.value){
                    api.post(`cierre/cierreCuenta/${this.props.cuenta.id}`,{ motivo: 40}, params).catch((error)=>{
                        Swal(
                            'Error',
                             (error && error.detail) ? error.detail : 'Ocurrio un error, intente de nuevo',
                            'error'
                        );
                        }).then((data) => {
                        if (data){
                            Swal(
                            'Éxito',
                            'Se ha cerrado la caja corretamente',
                            'success'
                            );
                            this.props.recargar();
                            this.props.closeModal();
                        }
                        })
                }

            });
        }

    });


  }



  render() {
    const { loader} = this.props;
    const { cuenta } = this.props;

    return (
      <div className="col-md-12">
        <div className="col-md-12">
            <h3 className="ml-0 text-uppercase text-primary "><strong>{dateFormatter(cuenta.fechaInicio)}</strong></h3>
        </div>

        <div className="col-md-12 row border-naranja">
            <div className="col-md-6">
                <div className="">
                    <div className="col-md-12 text-center  d-md-flex align-items-center justify-content-center pr-0">
                            <span className="text-uppercase">Saldo inicial:</span>
                    </div>
                    <div className="col-md-12 d-flex align-items-center justify-content-center text-center ">
                        <RenderCurrency value={cuenta.inicio} className={'text-primary h5 font-weight-bold'}/>
                    </div>
                </div>
                <div className="">
                    <div className="col-md-12 text-center  d-md-flex align-items-center justify-content-center pr-0">
                        <span className="text-uppercase">Saldo final:</span>
                    </div>
                    <div className="col-md-12 text-center  d-flex align-items-center justify-content-center">
                        <RenderCurrency value={cuenta.saldo} className={'text-secondary h4 font-weight-bold'}/>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="">
                    <div className="col-md-12 text-center  d-md-flex align-items-center justify-content-center pr-0">
                            <span className="text-uppercase">Depositos:</span>
                    </div>
                    <div className="col-md-12 d-flex align-items-center justify-content-center text-center ">
                        <span className="text-primary h5 font-weight-bold">{cuenta.ingresos}</span>
                    </div>
                </div>
                <div className="">
                    <div className="col-md-12 text-center  d-md-flex align-items-center justify-content-center pr-0">
                        <span className="text-uppercase">Gastos:</span>
                    </div>
                    <div className="col-md-12 text-center  d-flex align-items-center justify-content-center">
                        <span className="text-secondary h4 font-weight-bold">{cuenta.egresos}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-md-12 mt-3 d-flex justify-content-center">
            <button
                      onClick={(e) => {
                        e.preventDefault();
                        this.crearCierre();
                      }}
                      className="btn btn-rosado btn-lg"
                      type={'submit'}
                    >
                      Hacer deposito
                    </button>
        </div>
    </div>
    );
  }
}

export default CierreCaja;
