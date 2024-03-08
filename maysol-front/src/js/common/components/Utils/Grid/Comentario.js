import React, { Component } from 'react';
export default  class ComentarioEditor extends React.Component {
    constructor(props) {
      super(props);
      this.updateData = this.updateData.bind(this);
      this.state = { comentario: props.defaultValue };
    }

    updateData() {
        const {row} = this.props;
        this.props.guardarCelda(row.id, { comentario: this.state.comentario });
        this.props.onUpdate(row.id, { comentario: this.state.comentario });
    }
    render() {
      return (
        <div className="col-md-12 p-0">


        <textarea
                ref='inputRef'
                className={  ' col-md-12 form-control editor edit-text' }
                style={ { display: 'block', width: '100%' } }
                value={ this.state.comentario }
                onKeyDown={ this.props.onKeyDown }
                onChange={ (ev) => { this.setState({ comentario: ev.currentTarget.value}); } }
                style={{ resize: "none" }}
                rows={ 3}
                className={'col-md-12 form-control editor edit-text'}
                />


          <button
            className='btn btn-info btn-xs col-md12 mt-1 textarea-save-btn'
            onClick={ this.updateData }>
            Guardar
          </button>
        </div>
      );
    }
  }
