import React, { Component } from 'react';
import MultipleFileUploader from "./MultipleFileUploader";
import ImageZoom from 'react-medium-image-zoom';
import PDFViewer from 'mgr-pdf-viewer-react';
import Modal from 'react-responsive-modal';

class ContainerMultiArchivos extends Component {
  constructor(props) {
    super(props);
    this.onCloseModal = this.onCloseModal.bind(this);
    this.onOpenModal = this.onOpenModal.bind(this);
    this.state = {
      open: false,
      pdfselect: 0,
    }
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };
  onCloseModal = () => {
    this.setState({ open: false });
  };
  setpdf(index){
    const _base64 = this.props.documentos[index].reader;
    const realData =_base64.split('base64,')[1];
    this.setState({pdfselect:realData});
    this.onOpenModal()
  }
  render () {
    const { documentos } = this.props;
    const { solicitud } = this.props;
    const { loader } = this.props;
    return (
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12">
          <div className="row d-flex justify-content-center" >
            {documentos.map((documento, index) => {
              if (documento.tipo === "Cierre"){
                if (documento.ext === "img"){
                  return (
                    <div key={index} className="">
                      <div className="img-container">
                        <ImageZoom
                          image={{
                            src: documento.reader,
                            alt: 'Avatar',
                            className: "docs",
                          }}
                          zoomImage={{
                            src: documento.reader,
                            alt: 'Avatar',
                            className: "prueba"
                          }}
                          shouldReplaceImage={false}
                        />
                        <div className="middle">
                          <button className="icon-delete"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.props.deletedocument(index)
                                  }}>
                            <em className="fa fa-times-circle-o" style={{fontSize: '1.3em'}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
                if (documento.ext === "pdf"){
                  return (
                    <div key={index} className="">
                      <div className="img-container">
                        <button className="docs" onClick={(e) => {
                          e.preventDefault();
                          this.setpdf(index);
                        }}>
                          <img className="zoom" src={require('../../../../../assets/img/icons/Adobe_Reader_PDF.png')} alt=""/>
                        </button>
                        <div className="middle">
                          <button className="icon-delete"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.props.deletedocument(index)
                                  }}>
                            <em className="fa fa-times-circle-o" style={{fontSize: '1.3em'}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
                if (documento.ext === "doc"){
                  return (
                    <div key={index} className="">
                      <div className="img-container">
                        <button className="docs">
                          <img className="" src={require('../../../../../assets/img/icons/word_doc.png')} alt=""/>
                        </button>
                        <div className="middle">
                          <button className="icon-delete"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.props.deletedocument(index)
                                  }}>
                            <em className="fa fa-times-circle-o" style={{fontSize: '1.3em'}} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                }
              }
            })}
            { documentos.length == 0 &&
                <div className="">
                    <MultipleFileUploader onFileChange={this.props.onFileChangeContrato}
                    icono={'cliente'}
                    frase={'perfil'}
                    clave={'foto'}
                    {...this.props}/>
                </div>
            }

            {/*Modal PDF base64*/}
            {this.state.open && (
              <Modal open={this.state.open} onClose={this.onCloseModal} little >
                <br/><br/>
                <div>
                  <PDFViewer document={{
                    base64: this.state.pdfselect,
                  }} />
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ContainerMultiArchivos;
