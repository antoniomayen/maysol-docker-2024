import React from 'react'
import PropTypes from 'prop-types'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import NumberFormat from "react-number-format";
import ToolbarPrestamos from '../../../Utils/Toolbar/ToolbarPrestamos';
import { dateFormatter, formatoMoneda } from '../../../Utils/renderField/renderReadField'
import HeaderPrestamo from '../../../Utils/Headers/HeaderPrestamo';
import AnulacionForm from '../../Gastos/Crear/formanulacion';
import Modal from 'react-responsive-modal';
import LoadMask from 'Utils/LoadMask';

export default class prestamosGrid extends React.Component {
    state = {
        toggleModal: false,
        initialValues: {}
    }
    componentWillMount() {
        this.props.listar();
    }
    closeModal =() => {
        this.props.setToggleModal(false);
        this.setState({toogleModal: false})
    }
    openModal = (cell, row) => {
        this.setState({initialValues: {id:cell}})
        this.props.setToggleModal(true)
        this.setState({toogleModal: true})
    }

    render(){
        const { data, loader, toggleModal, page } = this.props;
        const { listar, search, cambiarFiltro, destroy, totales } = this.props;
        return(

            <div className="row d-flex justify-content-center">

            { this.props.toggleModal && (
                    <Modal open={this.props.toggleModal} onClose={this.closeModal}>
                        <div style={{maxWidth: '100%'}}>
                            <div className="modal-header">
                                <div className="panel-body">
                                        <span className="reset-caption">Anular Préstamo</span>

                                </div>
                            </div>
                            <div className="modal-body">
                                        <LoadMask loading={loader} blur_1>
                                            <AnulacionForm
                                                initialValues={this.state.initialValues}
                                                onSubmit={this.props.destroy} closeModal={this.closeModal} />
                                        </LoadMask>
                            </div>
                        </div>
                    </Modal>
                )}
                <div className="col-sm-12">

                    <HeaderPrestamo
                                totales={totales}
                                instruccion="¡Ingresa un prestamo!"
                                texto="Agregar Prestamo"
                                ruta="/admin_prestamo/crear"
                                />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarPrestamos
                                    {...this.props}
                                    buscar={search}
                                    titulo={"Prestamos"}
                                    buscador={this.props.buscador}/>
                        </div>

                        <Table onPageChange={listar} data={data} loading={loader} page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({cuenta: '/admin_prestamo/estado', eliminar: this.openModal})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="acreedor" dataSort>Acreedor</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="deudor" dataSort>Deudor</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataFormat={dateFormatter}
                                dataField="fechaInicio" dataSort>fecha</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                columnClassName={'text-derecha'}
                                dataFormat={formatoMoneda}
                                dataField="inicio" dataSort>monto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                columnClassName={'text-derecha'}
                                dataFormat={formatoMoneda}
                                dataField="saldo" dataSort>saldo</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
