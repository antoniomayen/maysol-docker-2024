import React, { Component } from 'react';
import './toolbar.css';

class Search extends Component {
  constructor(props){
    super(props);
  }
  render() {
    const { buscar, buscador } = this.props;
    return (
      <div className="col-12 pull-right toolbar-search p-0">
        {(buscador !== undefined && buscar !== undefined) && (
          <div className="contenedor-search">
            <input id="buscar" type="text" name="buscar" placeholder="Buscar..."
                   ref={node => {
                     this.buscar = node;
                     if (this.buscar) {
                       this.buscar.value = buscador;
                     }
                   }}
                   onKeyPress={(event) => {
                     if (event.key === 'Enter') {
                       this.props.buscar(this.buscar.value);
                     }
                   }}
                   autoComplete="off" className="form-control"/>
            <button
                className="form-control-feedback"
                onClick={(event) => {
                    event.preventDefault();
                    this.props.buscar(this.buscar.value);
                  }}>
                  <img src={require("../../../../../assets/img/icons/buscar.png")} alt=""/>
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Search;
