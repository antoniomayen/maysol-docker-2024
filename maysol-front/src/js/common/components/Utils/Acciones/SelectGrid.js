import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './acciones.css';
import Swal from 'sweetalert2';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';


class SelectInGrid extends Component {

    constructor(props) {
        super(props);
        this.state = { categoria: props.contenido.idcategoria};

    }
    onChangeValueInput = (ev) => {
        const { editable, contenido } = this.props;
        this.setState({ categoria: ev.currentTarget.value})
        this.props.addComentarios({id: contenido.id, categoria: ev.currentTarget.value})
    }
    componentDidUpdate(prevProps, prevState){
        const { contenido } = this.props;
        if(this.props.editable !== prevProps.editable){

            if (this.props.editable) {
                this.setState({categoria: contenido.idcategoria})
            }
        }
    }
    render() {
        const { editable, contenido, rowIndex } = this.props;
        return (
            <div>
                {
                    editable && rowIndex > 0 ? (
                        <select
                            ref='inputRef'
                            className={  ' col-md-12 form-control editor edit-text' }
                            style={ { display: 'block', width: '100%' } }
                            value={ this.state.categoria }
                            onKeyDown={ this.props.onKeyDown }
                            onChange={ this.onChangeValueInput}
                            style={{ resize: "none" }}
                        >
                                <option value="">Seleccione.</option>
                                {this.props.categorias.map((opcion) => {
                                    return (<option
                                        key={typeof (opcion) === "string" ? opcion : opcion.id}
                                        value={typeof (opcion) === "string" ? opcion : opcion.id}>
                                        {typeof (opcion) === "string" ? opcion : opcion.nombre}
                                    </option>);
                                })}
                            </select>

                    ) : (
                        <span>{contenido.categoria}</span>
                    )
                }
            </div>
        )
    }
}
SelectInGrid.propTypes = {
};

export function selectFormater(acciones) {
    return ( cell, row, columnIndex,rowIndex) => {
        return (<SelectInGrid id={cell} contenido={row} rowIndex={rowIndex}  {...acciones} />)
    };
}
