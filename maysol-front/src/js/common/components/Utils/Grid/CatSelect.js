import React, { Component } from 'react';
export default  class CategoriaEdit extends React.Component {
    constructor(props) {
      super(props);
      this.updateData = this.updateData.bind(this);
      this.state = { categoria: props.defaultValue };
    }

    updateData() {
        const {row} = this.props;
        this.props.guardarCelda(row.id, { categoria: this.state.categoria });
        this.props.onUpdate(row.id, { categoria: this.state.categoria });
    }
    render() {
      return (
        <div className="col-md-12 p-0">



        <select
            ref='inputRef'
            className={  ' col-md-12 form-control editor edit-text' }
            style={ { display: 'block', width: '100%' } }
            value={ this.state.categoria }
            onKeyDown={ this.props.onKeyDown }
            onChange={ (ev) => { this.setState({ categoria: ev.currentTarget.value}); } }
            style={{ resize: "none" }}
            className={'col-md-12 form-control editor edit-text'}
        >
                <option value="">Seleccione una opción.</option>
                {this.props.categorias.map((opcion) => {
                    return (<option
                        key={typeof (opcion) === "string" ? opcion : opcion.id}
                        value={typeof (opcion) === "string" ? opcion : opcion.id}>
                        {typeof (opcion) === "string" ? opcion : opcion.nombre}
                    </option>);
                })}
            </select>

          <button
            className='btn btn-info btn-xs mt-2 col-md12 textarea-save-btn'
            onClick={ this.updateData }>
            Guardar
          </button>
        </div>
      );
    }
  }
