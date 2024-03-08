import React, { Component } from 'react';
import ImageZoom from 'react-medium-image-zoom';
import PDFViewer from 'mgr-pdf-viewer-react';
import Modal from 'react-responsive-modal';
import _ from 'lodash';

class VerDocumentos extends Component {
    constructor(props) {
        super(props);
        this.onCloseModal = this.onCloseModal.bind(this);
        this.onOpenModal = this.onOpenModal.bind(this);
        this.onOpenModalUrl = this.onOpenModalUrl.bind(this);
        this.onCloseModalUrl = this.onCloseModalUrl.bind(this);
        this.state = {
          numPages: null,
          open: false,
          urlpdf:"",
          openurl:false,
        }
      }
      onOpenModal = () => {
        this.setState({ open: true });
      };
      onCloseModal = () => {
        this.setState({ open: false });
      };
      onOpenModalUrl = () => {
        this.setState({ openurl: true });
      };
      onCloseModalUrl = () => {
        this.setState({ openurl: false });
      };
      render(){
          const { cierre } = this.props;
          console.log(cierre, 'cierre')
          return (
            <div>
              <div>

                <div>

                  <div className="row d-flex justify-content-center">
                    <div >
                              {(cierre.ext === "img") && (
                                <div className="">
                                  <div className="img-container">
                                    <ImageZoom
                                      image={{
                                        src: cierre.documento,
                                        alt: 'Avatar',
                                        className: "docs",
                                      }}
                                      zoomImage={{
                                        src: cierre.documento,
                                        alt: 'Avatar',
                                        className: "prueba"
                                      }}
                                      shouldReplaceImage={false}
                                    />
                                  </div>
                                  <div className="text-center">
                                    <p><a href={cierre.documento} download target="_blank">Descargar</a></p>
                                  </div>
                                </div>
                              )}
                              {(cierre.ext === "pdf") && (
                                <div className="">
                                  <div className="img-container">
                                    <button className="docs" onClick={(e) => {
                                      e.preventDefault();
                                      this.setState({urlpdf:cierre.documento});
                                      this.onOpenModalUrl()
                                    }}>
                                      <img className="zoom" src={require('../../../../../../assets/img/icons/Adobe_Reader_PDF.png')} alt=""/>
                                    </button>
                                  </div>
                                  <div className="text-center">
                                     <p><a href={cierre.documento} download target="_blank">Descargar</a></p>
                                  </div>
                                </div>
                              )}
                              {(cierre.ext === "doc") && (
                                <div className="">
                                  <div className="img-container">
                                    <button className="docs">
                                      <img className="" src={require('../../../../../../assets/img/icons/word_doc.png')} alt=""/>
                                    </button>
                                  </div>
                                  <div className="text-center">
                                     <p className="text-center"><a href={cierre.documento} download target="_blank">Descargar</a></p>
                                  </div>
                                </div>
                              )}
                            </div>
                  </div>
                </div>

              </div>
              {/*Modal PDF url*/}
              {this.state.openurl && (
                <Modal open={this.state.openurl} onClose={this.onCloseModalUrl} little >
                  <br/><br/>
                  <div>
                    <PDFViewer document={{
                      url: this.state.urlpdf,
                    }} />
                  </div>
                </Modal>
              )}
            </div>
          );
      }
}

export default VerDocumentos;
