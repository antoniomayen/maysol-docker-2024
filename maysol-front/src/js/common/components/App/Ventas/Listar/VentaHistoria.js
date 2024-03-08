import React, { Component } from 'react'
import { BootstrapTable } from 'react-bootstrap-table';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter } from 'Utils/Acciones/Acciones'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid';
import ToolbarVenta from '../../../Utils/Toolbar/ToolbarVHistoria';
import {
    formatoMoneda,
    dateFormatter,
    cellTachado,
    dateFormatterTimeZone
} from '../../../Utils/renderField/renderReadField'
import Modal from 'react-responsive-modal';
import MovimeintoForm from './Formularios/formMovimiento';

function formatoSaldo(cell, row) {
    const pagos_monedas = {};
    row.pagos.forEach((pago) => {
        if (!isNaN(pago.monto)) {
            // No sumar si esta anulado
            if (!pago.anulado) {
                if (pagos_monedas.hasOwnProperty(pago.simbolo)) {
                    pagos_monedas[pago.simbolo] = pagos_monedas[pago.simbolo] + parseFloat(pago.monto);
                } else {
                    pagos_monedas[pago.simbolo] = parseFloat(pago.monto);
                }
            }
        }
    });
    return <div>{Object.keys(pagos_monedas).map((key) => {
        return <div key={key}>{formatoMoneda(Number(cell) - pagos_monedas[key], key)}</div>
    })}</div>
}
const isExpandableRow = () => {
    return true;
};
export default class VentaHistoria extends Component {

    state = {
        open: false,
        valueForm: { },
    };

    componentWillMount() {
        this.props.listar_historia();
    }

    expandComponent = (row) => {
        let data = row && row.movimientos ? row.movimientos : [];


        // const movimientos = []
        const { me } = this.props
        return(
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ data }>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                hidden={true}
                                dataAlign="center"
                                width={'90px'}
                                dataFormat={activeFormatter({   })}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300, padding:5}}
                                width={85}
                                dataFormat={dateFormatterTimeZone}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="cliente" dataSort>Cliente</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="nombrePago" dataSort>Forma pago</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="concepto" dataSort>Concepto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                editable={ false }
                                width={90}
                                dataAlign={'right'}
                                dataField="monto" dataSort>Monto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                editable={ false }
                                width={90}
                                columnClassName={'text-derecha'}
                                dataField="mon55to" dataSort></TableHeaderColumn>
                </BootstrapTable>
            </div>

        )
    };

    onOpenModal = (row) => {
        this.setState({ valueForm: row });
        this.setState({ open: true });
    };

    onCloseModal = () => this.setState({ open: false });

    noDoc = cell => (<span>{cell.noDocumento}</span>);

    fechaDoc = cell => (<span>{cell.fecha}</span>);

    cellSombreado = (cell, row) => {
        if (row.edit.noDocumento) { return { whiteSpace: 'normal' }; }
        return { backgroundColor: '#e1e1e1', whiteSpace: 'normal' };
    };

    refrescar = () => {
        this.onCloseModal();
        this.props.listar_historia();
    }

    render() {
        const { page, me, empresasSelect, data_historia, loader_v, loaderModal, cajaVenta, modalCierre } = this.props;
        const { listar_historia, search, filtro, borrar, editarMovimiento } = this.props;
        return (
            <div>
                <Modal
                    open={this.state.open}
                    onClose={this.onCloseModal}
                >
                    <MovimeintoForm
                        onSubmit={() => editarMovimiento(this.refrescar)}
                        initialValues={this.state.valueForm}
                    />
                </Modal>
                <div className="grid-title d-flex flex-row borde-superior">
                    <ToolbarVenta
                        {...this.props}
                        buscar={search}
                        titulo={"Cajas"}
                        usuario={me}
                        empresas={empresasSelect}
                        cambiarFiltro={filtro}
                        cambiarPendientes={this.props.set_filtro_pendites}
                        filtro_pendientes={this.props.filtro_pendientes}
                        cambiarVendedores={this.props.set_filtro_vendedores}
                        filtro_vendedores={this.props.filtro_vendedores}
                        filtro={this.props.fitro_ventas}
                        ventas={true}
                        vendedores={this.props.vendedores}
                        cuentasBancarias={this.props.cuentasBancarias}
                        cambiarCuenta={this.props.set_filtro_cuentas}
                        buscador={this.props.buscador} />
                </div>
                <Table onPageChange={listar_historia}
                    data={data_historia}
                    loading={loader_v}
                    expandableRow={isExpandableRow}
                    expandComponent={this.expandComponent}
                    page={page}>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        tdStyle={this.cellSombreado}
                        dataField="edit"
                        isKey={true}
                        dataAlign="center"
                        dataFormat={activeFormatter({ editar: this.onOpenModal })}>Acciones</TableHeaderColumn>
                    {/*
                        <TableHeaderColumn
                        tdStyle={this.cellSombreado}
                        dataFormat={dateFormatter}
                        dataField="creado" dataSort>Fecha inicio</TableHeaderColumn>
                    */}
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        tdStyle={this.cellSombreado}
                        dataFormat={dateFormatterTimeZone}
                        dataField="modificado" dataSort>Fecha deposito</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        tdStyle={this.cellSombreado}
                        dataField="usuario_cuenta" dataSort>Encargado</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        tdStyle={this.cellSombreado}
                        dataField="banco" dataSort>Banco</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        tdStyle={this.cellSombreado}
                        dataFormat={this.noDoc}
                        dataField="edit" dataSort>Boleta</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        tdStyle={this.cellSombreado}
                        dataFormat={this.fechaDoc}
                        dataField="edit" dataSort>Fecha Boleta</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        tdStyle={this.cellSombreado}
                        dataFormat={formatoMoneda}
                        dataAlign={'right'}
                        dataField="cobrado" dataSort>Recaudado</TableHeaderColumn>
                </Table>
            </div>
        )
    }
}
