import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './acciones.css';
import Swal from 'sweetalert2';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';


class DescripcionGrid extends Component {

    constructor(props) {
        super(props);

    }
    onChangeValueInput = (ev) => {

    }
    componentDidUpdate(prevProps, prevState){

    }
    render() {
        const { editable, contenido, rowIndex } = this.props;
        return (
            <div>
                {contenido.formaPago && (<p className="m-0">
                    <b>Forma de pago:</b> {contenido.nombrePago} - {contenido.noDocumento}
                </p>)}
                {contenido.proyectoAfectado && (<p className="m-0">
                    <b>Gasto de:</b> {contenido.proyectoAfectado}
                </p>)}
                <p className="m-0">
                    <b>Motivo:</b> {contenido.concepto}
                </p>
            </div>
        )
    }
}
DescripcionGrid.propTypes = {
};

export function descripcionFormater(acciones) {
    return ( cell, row, columnIndex,rowIndex) => {
        return (<DescripcionGrid id={cell} contenido={row} rowIndex={rowIndex} {...acciones} />)
    };
}
