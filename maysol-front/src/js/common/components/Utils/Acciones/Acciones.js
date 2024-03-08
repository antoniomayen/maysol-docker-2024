import React, { Component, Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './acciones.css';
import Swal from 'sweetalert2';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';


class Acciones extends Component {

    constructor(props) {
        super(props);
        this.state = { redirect: false, url: '' , popoverOpen: false};
        this.redirect = this.redirect.bind(this);
        this.eliminar = this.eliminar.bind(this);
        this.editar = this.editar.bind(this);
        this.popover = this.popover.bind(this);
    }
    togglePop = () => {
        this.setState({popoverOpen: !this.state.popoverOpen})
    }
    redirect(url) {
        return () => {
            this.setState({ url });
            this.setState({ redirect: true });
        };
    }
    popover(row){
        return "hola esto es el popover"
    }
    eliminar(id) {
        return () => {
            Swal({
                title: '¿Está seguro de la acción?',
                text: '¡Ya no podrá deshacer la operación!',
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: 'btn-force btn-primary m-1',
                cancelButtonClass: 'btn-force btn-secondary m-1',
                confirmButtonText: 'Sí, ¡Borrar!',
                cancelButtonText: 'No, cancelar.',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.props.eliminar(id);
                }
            });
        }
    }
    editar(id, contenido) {
        return () => {
            this.props.editar(id, contenido);
        }
    }
    reajuste(id, contenido) {
        return () => {
            this.props.reajuste(id, contenido);
        }
    }
    agregar(id, contenido) {
        return () => {
            this.props.agregar(id, contenido);
        }
    }
    eliminarModal(id){
        return () => {
            this.props.eliminarModal(id)
        }
    }

    render() {
        const { id,
                ver,
                editar,
                editarModal,
                eliminar,
                adicional,
                cuenta,
                estadobodega,
                agregar,
                detallebodega,
                reajuste,
                popoverbodega,
                gallineros,
                eliminarModal, popover, contenido, cajas } = this.props;
        if (this.state.redirect) {
            return (<Redirect to={`${this.state.url}/${id}`} />);
        }
        let offset = 0;
        if (ver !== undefined) {
            offset += 1;
        }
        if (editar !== undefined) {
            offset += 1;
        }
        if (gallineros !== undefined) {
            offset += 1;
        }
        if (eliminar !== undefined) {
            offset += 1;
        }
        if(popover !== undefined){
            offset += 1;
        }
        if(popoverbodega !== undefined){
            offset += 1;
        }
        if(cajas !== undefined){
            offset += 1;
        }
        if(editarModal !== undefined){
            offset += 1;
        }
        if(reajuste !== undefined){
            offset += 1;
        }
        return (
            <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                    {(adicional !== undefined) && adicional(id, contenido)}
                    {(ver !== undefined) && (
                        <Link to={`${ver}/${id}/`} ><img className="action-img" title="Ver" src={require("../../../../../assets/img/icons/watch.png")} alt="Watch" /></Link>
                    )}
                    {(editar !== undefined) && ((typeof editar) === "string") && (
                        <Link to={`${editar}/${id}/`} ><img className="action-img" title="Editar" src={require("../../../../../assets/img/icons/edit.png")} alt="Editar" /></Link>
                    )}
                    {(editar !== undefined) && ((typeof editar) !== "string") && (
                        <img onClick={this.editar(id, contenido)} className="action-img" title="Editar" src={require("../../../../../assets/img/icons/edit.png")} alt="Editar" />
                    )}
                    {(agregar !== undefined) && (
                        <img onClick={this.agregar(id, contenido)} className="action-img" title="Editar" src={require("../../../../../assets/img/icons/agregar.png")} alt="Agregar" />
                    )}
                    {(cuenta !== undefined) && (
                        <Link to={`${cuenta}/${id}/`} ><img className="action-img" title="Cuenta" src={require("../../../../../assets/img/icons/escuenta.png")} alt="Cuenta" /></Link>
                    )}
                    {(gallineros !== undefined) && (
                        <Link to={`${gallineros}/${id}/`} ><img className="action-img" title="Gallineros" src={require("../../../../../assets/img/icons/gallineros.png")} alt="Gallineros" /></Link>
                    )}
                    {(estadobodega !== undefined) && (
                        <Link to={`${estadobodega}/${id}/`} ><img className="action-img" title="Estado de bodega" src={require("../../../../../assets/img/icons/estadobodega.png")} alt="Cuenta" /></Link>
                    )}
                    {(detallebodega !== undefined) && (
                        <Link to={`${detallebodega}/${id}/`} ><img className="action-img" title="Detalle de bodega" src={require("../../../../../assets/img/icons/detallebodega.png")} alt="Cuenta" /></Link>
                    )}
                    {(eliminar !== undefined) && (
                        <img onClick={this.eliminar(id)} className="action-img" title="Eliminar" src={require("../../../../../assets/img/icons/delete.png")} alt="Delete" />
                    )}
                    {(cajas !== undefined) && (
                        <Link to={`${cajas}/${id}/`} ><img className="action-img" title="Cajas" src={require("../../../../../assets/img/icons/cajasasignadas.png")} alt="Cajas asignadas" /></Link>
                    )}
                    {(eliminarModal !== undefined && !contenido.anulado) && (
                        <img onClick={this.eliminarModal(id)} className="action-img" title="Eliminar" src={require("../../../../../assets/img/icons/delete.png")} alt="Delete" />
                    )}

                    {
                        (popover !== undefined && contenido.anulado) && (
                            <Fragment>
                                <img id={`popover${id}`} className="action-img"  onClick={this.togglePop}  title="Ver" src={require("../../../../../assets/img/icons/flecha.png")} alt="Delete" />

                                <Popover placement="bottom" isOpen={this.state.popoverOpen} target={`popover${id}`} toggle={this.togglePop}>
                                <PopoverHeader>Justificación de Anulación</PopoverHeader>
                                <PopoverBody>{contenido.justificacion}.</PopoverBody>
                                </Popover>
                            </Fragment>
                        )
                    }
                    {
                        (popoverbodega !== undefined && !contenido.activo) && (
                            <Fragment>
                                <img id={`popover${id}`} className="action-img"  onClick={this.togglePop}  title="Ver" src={require("../../../../../assets/img/icons/flecha.png")} alt="Delete" />

                                <Popover placement="bottom" isOpen={this.state.popoverOpen} target={`popover${id}`} toggle={this.togglePop}>
                                <PopoverHeader>Justificación de Anulación</PopoverHeader>
                                <PopoverBody>{contenido.justificacionAnulacion}.</PopoverBody>
                                </Popover>
                            </Fragment>
                        )
                    }
                    {(reajuste !== undefined) && ((typeof reajuste) !== "string") && (
                        <img onClick={this.reajuste(id, contenido)} className="action-img" title="Reajuste" src={require("../../../../../assets/img/icons/reajuste.png")} alt="Reajuste" />
                    )}
                </div>
            </div>
        );
    }
}
Acciones.propTypes = {
};

export function activeFormatter(acciones) {
    return (cell, row) => {
        return (<Acciones id={cell} contenido={row} {...acciones} />)
    };
}
export function activeFormatter2(acciones) {
    return (<Acciones id={acciones.cell} {...acciones} row={acciones.row} contenido={acciones.row} />)
}
