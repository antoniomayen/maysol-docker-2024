import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import Modal from 'react-responsive-modal';
import NumberFormat from "react-number-format";
import FormDeposito from '../../Gastos/Crear/DepositoPrestamo';
import FormRetiro from '../../Gastos/Crear/RetiroForm';
import ToolbarUsuario from '../../../Utils/Toolbar/ToolbarUsuarios';
import HeaderPrestamo from '../../../Utils/Headers/headerPrestamo';
import Swal from 'sweetalert2';
import { dateFormatter, cellTachado } from '../../../Utils/renderField/renderReadField'
import AnulacionForm from '../../Gastos/Crear/formanulacion';

function formatoMoneda(cell, row) {
    return <NumberFormat decimalScale={2} fixedDecimalScale={true} value={cell !== null ? cell : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />
}
function cellStyleFormat(cell, row) {
    return {color: row.color}
}
export default class EstadoPrestamoGrid extends React.Component {
    state = {
        deposito: 1,
        idMovimiento: null
    }
    componentWillMount() {
        this.props.getPrestamo(1,this.props.match.params.id);
    }
    openModal = () => {
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }
    enviarDataDeposito = () =>{
        this.props.crearMovimiento(this.props.match.params.id, 10);
    }

    enviarAnulacion = (id) => {
        this.props.anular(this.state.idMovimiento)
    }
    abrirRetiro = () =>{
        this.setState({ deposito: 2 })
        this.openModal()
    }
    abrirDeposito = () => {
        this.setState({ deposito: 1 })
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
    calcularSaldo = ( cell, row, columnIndex,rowIndex) => {
        let saldo = 0;
        let movimientos = _.cloneDeep(this.props.data.results)
        let movimientos_calc = []
        movimientos_calc = movimientos.slice(0, rowIndex+1)

        let noAnulados = [];
        movimientos_calc.forEach(row => {
            if(row.anulado){

            }else{
                noAnulados.push(row)
            }
        })
        let debe = this.props.saldoprestamo.inicio;
        let haber = 0;
        noAnulados.forEach(row => {
            debe += row.debe;
            haber += row.haber;
        });


        saldo = debe -haber;
        return <NumberFormat decimalScale={2} fixedDecimalScale={true} value={saldo !== null ? saldo : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />

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
        const { data, loader, toggleModalPrestamo, page, activo, saldoprestamo, infoProyecto, me } = this.props;
        const { listar, search,cambiarFiltro } = this.props;
        return(
            <div className="row d-flex justify-content-center">
                { this.props.toggleModalPrestamo && (
                    <Modal open={this.props.toggleModalPrestamo} onClose={this.closeModal} classNames={{modal:"modal-lg"}}>
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

                        <HeaderPrestamo
                            descripcion={infoProyecto.descripcion}
                            proyecto1={infoProyecto.acreedor}
                            proyecto2={infoProyecto.deudor}
                            saldo={saldoprestamo}
                            me={me}
                            texto3={"Registrar pago"}
                            image3={require('../../../../../../assets/img/buttons/deposito_estado_cuenta.png')}
                            funcion3={this.abrirDeposito}
                            />

                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarUsuario
                                buscar={search}
                                titulo={"Estado de prestamo"}
                                buscador={this.props.buscador}/>
                        </div>
                        <Table onPageChange={listar} data={data} loading={loader} page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ eliminarModal: this.abrirAnulacion, popover:'getRow' })}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={{minWidth:300}}
                                thStyle={{minWidth:300}}
                                dataFormat={dateFormatter}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={{minWidth:300}}
                                thStyle={{minWidth:300}}
                                dataField="depositante" dataSort>Depositante</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={{minWidth:300}}
                                thStyle={{minWidth:300}}
                                dataField="nombrePago" dataSort>Forma de Pago</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={{minWidth:300}}
                                thStyle={{minWidth:300}}
                                dataField="noDocumento" dataSort>Comprobante</TableHeaderColumn>
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
                                dataFormat={this.calcularSaldo}
                                dataField="saldo" dataSort>Saldo</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
