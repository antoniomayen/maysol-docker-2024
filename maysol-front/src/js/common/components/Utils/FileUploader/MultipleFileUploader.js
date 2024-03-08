import React,  {Component} from "react";
import './FileUploader.css'

const defaultProps = {
      baseColor: 'gray',
      activeColor: 'green',
      overlayColor: 'rgba(255,255,255,0.3)',
      opacity:0
    };

class MultipleFileUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
            imageSrc: '',
            loaded: false
        };

        this.onDragEnter  = this.onDragEnter.bind(this);
        this.onDragLeave  = this.onDragLeave.bind(this);
        this.onDrop       = this.onDrop.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
    }

    onDragEnter(e) {
        this.setState({ active: true });
    }

    onDragLeave(e) {
        this.setState({ active: false });
    }

    onDragOver(e) {
        e.preventDefault();
    }

    onDrop(e) {
        e.preventDefault();
        this.setState({ active: false });
        this.props.onFileChange(e.dataTransfer.files);
        // this.onFileChange(e);
    }

    onFileChange(e) {
      const files = e.target !== undefined ? e.target.files : e.dataTransfer.files;
      this.props.onFileChange(files);
    }


    render() {
        let state = this.state,
            props = defaultProps,
            labelClass  = `uploaderDocs ${state.loaded && 'loaded'}`,
            borderColor = state.active ? props.activeColor : props.baseColor,
            iconColor   = state.active
                ? props.activeColor
                : (state.loaded)
                    ? props.overlayColor
                    : props.baseColor,
            hideIcon = state.loaded ? 0 : 1;

        return (
            <label
                className={labelClass}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
                style={{outlineColor: borderColor}}>

                <img src={state.imageSrc} className={state.loaded ? 'loaded' : undefined}/>
                <img style={{  opacity: hideIcon }} className="icon icon-upload"
                     src={require(`../../../../../assets/img/icons/upload-docs.png`)} alt=""/>
                <p className="texto-primario text-center" style={{opacity:hideIcon}}>Importar documentos del banco</p>
                <input type="file"
                       accept="image/*, application/pdf, .doc, .docx"
                       onChange={this.onFileChange} ref="input" multiple={true}/>

            </label>
        );
    }
}
export default MultipleFileUploader
