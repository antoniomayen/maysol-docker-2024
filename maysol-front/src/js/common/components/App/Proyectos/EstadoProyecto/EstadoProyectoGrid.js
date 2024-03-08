import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import Modal from 'react-responsive-modal';
import NumberFormat from "react-number-format";

import FormDeposito from '../../Cuentas/Listar/DepositoForm'
import AnulacionForm from '../../Gastos/Crear/formanulacion';
import ToolbarEstado from '../../../Utils/Toolbar/ToolbarEstado';
import HeaderEstado from '../../../Utils/Headers/headergastos';
import Swal from 'sweetalert2';
import { dateFormatter } from '../../../Utils/renderField/renderReadField';

function formatoMoneda(cell, row) {
    return <NumberFormat decimalScale={2} fixedDecimalScale={true} value={cell !== null ? cell : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />
}
function cellStyleFormat(cell, row) {
    return {color: row.color}
}
function cellTachado(cell, row) {
    if(row.anulado){
        return {textDecoration: "line-through"}
    }
    return {}
}
function getRow(cell, row){
    if(row.anulado){
        return row.justificacion;
    }
    return null
}

export default class EstadoProyectoGrid extends React.Component {
    state = {
        deposito: 1,
        idMovimiento: null
    }
    componentWillMount() {
        this.props.listar(1,this.props.match.params.id);
        this.props.getProyecto(this.props.match.params.id);
    }
    openModal = () => {
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }
    enviarDataDeposito = () =>{
        this.props.movimiento(this.props.match.params.id, 10);
    }
    enviarDataRetiro = () => {
        this.props.movimiento(this.props.match.params.id, 30);
    }
    enviarAnulacion = (id) => {
        this.props.anular(this.state.idMovimiento)
    }
    abrirRetiro = () =>{
        this.setState({ deposito: 1 })
        this.openModal()
    }
    abrirDeposito = () => {
        this.setState({ deposito: 2 })
        this.openModal()
    }
    abrirAnulacion = (id) => {
        this.setState({deposito:3});
        this.setState({idMovimiento: id});
        this.openModal();
    }
    cambiarMes = (e) => {
        this.props.cambiarMes(e);
    }
    cambiarAnio = (e) => {
       this.props.cambiarAnio(e);
    }
    cierrecuenta = () => {
        Swal({
            title: '¿Desea cerrar el periodo?',
            text: '¡Ya no podrá agregar más movimientos en el periodo!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, ¡Borrar!',
            cancelButtonText: 'No, cancelar.',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                this.props.cierreEstado()
            }
        });
    }

    render() {
        const { data, loader, toggleModal, page, activo, saldo, updateData } = this.props;
        const { listar, destroy, search, cambiarFiltro } = this.props;

        return(
            <div className="row d-flex justify-content-center">
                { this.props.toggleModal && (
                    <Modal open={this.props.toggleModal} onClose={this.closeModal} classNames={{modal:"modal-lg"}}>
                        <div style={{ maxWidth: '850px' }}>
                            <div className="modal-header">
                                <div className="panel-body">

                                    {
                                        this.state.deposito === 1 &&
                                        <span className="reset-caption">Depósito</span>
                                    }

                                    {
                                        this.state.deposito === 3 &&
                                        <span className="reset-caption">Anulación</span>
                                    }
                                </div>
                            </div>
                            <div className="modal-body">
                                    {
                                        this.state.deposito === 1 &&
                                        <FormDeposito onSubmit={this.enviarDataDeposito} closeModal={this.closeModal} />
                                    }
                                    {
                                        this.state.deposito === 3 &&
                                        <AnulacionForm onSubmit={this.enviarAnulacion} closeModal={this.closeModal} />

                                    }

                            </div>
                        </div>
                    </Modal>
                )}

                <div className="col-sm-12 pt-2">


                    <div className="grid-container">

                        <HeaderEstado
                            cambiarMes={this.cambiarMes}
                            cambiarAnio={this.cambiarAnio}
                            saldo={{inicio:30, saldo:10}}
                            texto1={"Cierre"}
                            image1={require("../../../../../../assets/img/buttons/cierre_estado_cuenta.png")}
                            texto2={"Retiro"}
                            funcion1={this.cierrecuenta}
                            funcion2={this.abrirRetiro}
                            image2={require('../../../../../../assets/img/buttons/retiro_estado_cuenta.png')}
                            texto3={"Depósito"}
                            image3={require('../../../../../../assets/img/buttons/deposito_estado_cuenta.png')}
                            funcion3={this.abrirDeposito}
                            />

                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarEstado
                                buscar={search}
                                titulo={updateData.nombre}
                                filtro={activo}
                                subtitulo={"estado de empresa"}
                                buscador={this.props.buscador}
                                cambiarFiltro={cambiarFiltro}
                                opcion1={"Retiro"}
                                opcion2={"Depósito"}
                                />
                        </div>
                        <Table onPageChange={listar} data={data} loading={loader} trClassName={this.rowClassNameFormat}  page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ eliminarModal: this.abrirAnulacion, popover:getRow })}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                dataFormat={dateFormatter}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                dataField="depositante" dataSort>Depositante</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                dataField="proveedor" dataSort>Proveedor</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                dataField="formaPago" dataSort>Forma de Pago</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                dataField="noDocumento" dataSort>Comprobante</TableHeaderColumn>
                            <TableHeaderColumn
                               tdStyle={cellTachado}
                               thStyle={{minWidth:300}}
                                dataField="concepto" dataSort>Descripción</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                dataField="destino" dataSort>Destino</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                dataField="debe" dataSort>Debe</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                dataField="haber" dataSort>Haber</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                dataField="saldo" dataSort>Saldo</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
