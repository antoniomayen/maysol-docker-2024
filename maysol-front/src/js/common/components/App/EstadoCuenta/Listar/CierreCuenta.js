import React, { Component } from 'react';
import _ from 'lodash';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { api } from "../../../../../api/api";
import ContainerMultiArchivos from '../../../Utils/FileUploader/ContainerMultiArchivos';
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import moment from 'moment';
import es from 'moment/locale/es'
import LoadMask from 'Utils/LoadMask'

class CierreCuenta extends Component {
    status = {
        cargando: false
    }
  constructor(props) {
    super(props);
    this.state = { documentos: [], fotos: []};
    this.onFileChangeContrato = this.onFileChangeContrato.bind(this);
    this.deletedocument = this.deletedocument.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
  }
  onFileChange(e, file, key) {
    file = file || e.target.files[0];
    const pattern = /image-*/;
    const reader = new FileReader();
    if (file){
      if (!file.type.match(pattern)) {
        alert('Formato inválido');
        return;
      }
      reader.onload = (e) => {
        this.setState({foto: {name:file.name, file}});
      };
      reader.readAsDataURL(file);
    }
  }


  componentWillMount() {

  }

  deletedocument = (index) => {
    const documentos = _.cloneDeep(this.state.documentos);
    documentos.splice(index,1);
    this.setState({documentos:documentos})
  };

  onFileChangeContrato(files){
    const pattern_image = /image-*/;
    const pattern_pdf = /pdf/;
    const pattern_doc = /officedocument/ || /wordprocessingml/ || /document/;
    files = _.values(files);
    files.map((archivo) => {
      const reader = new FileReader();
      if (archivo.type.match(pattern_image)){
        reader.onload = (e) => {
          this.setState({documentos: [{file:archivo, reader:reader.result, tipo:"Cierre", ext:"img", solicitud_id:this.props.id_solicitud} ]});
        };
        reader.readAsDataURL(archivo);
      }
      else if (archivo.type.match(pattern_pdf)){
        reader.onload = (e) => {
          this.setState({documentos: [{file:archivo, reader:reader.result, tipo:"Cierre", ext:"pdf", solicitud_id:this.props.id_solicitud}]});
        };
        reader.readAsDataURL(archivo);
      }
      else if (archivo.type.match(pattern_doc)){
        reader.onload = (e) => {
          this.setState({documentos: [{file:archivo, tipo:"Cierre", ext:"doc", solicitud_id:this.props.id_solicitud}]});
        };
        reader.readAsDataURL(archivo);
      }
      else{
        Swal(
          'Formato incorrecto',
          'El formato del archivo no es aceptado',
          'error'
        );
      }
    });
  }


  crearCierre() {
    const documentos = this.state.documentos;
    const postDocuments = [];
    const docs = [];
    let extension = '';
    if (documentos.length == 0){
        Swal(
            'Error',
            'Debe subir un documento para realizar el cierre.',
            'error'
          );
        return;
    }
    documentos.forEach((documento, index) => {
      postDocuments.push({name:index.toString(), file:documento.file});
      docs.push(index.toString());
      extension = documento.ext;
      documento.reader = "";
    });
    Swal({
        title: '¿Está seguro de cerrar el periodo?',
        text: '¡Al realizar el cierre ya no podrá agregar más movimientos al periodo!',
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
                    this.setState({
                        cargando: true
                    });
                    api.postAttachments(`cierre/cierreCuenta/${this.props.cuenta.id}`,
                    {documentos:docs[0], ext: extension},postDocuments).catch((error)=>{
                    Swal(
                        'Error',
                         (error && error.detail) ? error.detail : 'Ocurrio un error, intente de nuevo',
                        'error'
                    );
                    this.setState({
                        cargando:false
                    });
                    }).then((data) => {
                    if (data){
                        Swal(
                        'Éxito',
                        'Se ha cerrado el periodo corretamente',
                        'success'
                        );
                        this.props.recargarData();
                        this.props.closeModal();
                        this.setState({
                            cargando:false
                        });
                    }
                    })
                }

            });
        }

    });


  }

  getFecha= () =>{
    const { anio, mes } = this.props;
    let fechaString = `${anio}-${mes}-${1}`;
    let fecha = moment(fechaString);
    let nombreMes = fecha.format('MMMM')

    return `${nombreMes} ${anio}`;
  }

  render() {
    const { loader} = this.props;
    const { cuenta, simbolo } = this.props;
    const { anio, mes} = this.props
    return (
        <LoadMask loading={this.state.cargando} blur_1>
            <div className="col-md-12">
                <div className="col-md-12">
                    <h3 className="ml-0 text-uppercase "><strong>{this.getFecha()}</strong></h3>
                </div>
                <div className="col-md-12">
                    <ContainerMultiArchivos {...this.props}
                            onFileChangeContrato={this.onFileChangeContrato}
                            documentos={this.state.documentos}
                            deletedocument={this.deletedocument}
                            />
                </div>
                <div className="col-md-12 row border-naranja">
                    <div className="col-md-6">
                        <div className="">
                            <div className="col-md-12 text-center  d-md-flex align-items-center justify-content-center pr-0">
                                    <span className="text-uppercase">Saldo inicial:</span>
                            </div>
                            <div className="col-md-12 d-flex align-items-center justify-content-center text-center ">
                                <RenderCurrency value={cuenta.inicio} simbolo={simbolo} className={'text-primary h5 font-weight-bold'}/>
                            </div>
                        </div>
                        <div className="">
                            <div className="col-md-12 text-center  d-md-flex align-items-center justify-content-center pr-0">
                                <span className="text-uppercase">Saldo final:</span>
                            </div>
                            <div className="col-md-12 text-center  d-flex align-items-center justify-content-center">
                                <RenderCurrency value={cuenta.saldo} simbolo={simbolo} className={'text-secondary h4 font-weight-bold'}/>
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
                            Cerrar cuenta
                            </button>
                </div>
            </div>
        </LoadMask>

    );
  }
}

export default CierreCuenta;
