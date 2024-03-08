import React from 'react'
import PropTypes from 'prop-types'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import Modal from 'react-responsive-modal';
import FormDeposito from './DepositoForm';
import { formatoMoneda } from 'Utils/renderField/renderReadField'

import NumberFormat from "react-number-format";
import ToolbarCuenta from '../../../Utils/Toolbar/ToolbarUsuarios';
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';

export default class CuentasGrid extends React.Component {
    state = {
        toggleModal: false
    }
    componentWillMount() {
        this.props.listarCuenta()
    }
    closeModal =() => {
        this.props.setToggleModal(false);
        this.setState({toogleModal: false})
    }
    openModal = () => {
        this.props.setToggleModal(true)
        this.setState({toogleModal: true})
    }
    formatoMoneda = (cell, row) => {
        let moneda = row.simbolo || 'Q';
        return <span>{formatoMoneda(cell, moneda)}</span>
    };
    render(){
        const { data, loader, toggleModal, page } = this.props;
        const { listarCuenta, borrarCuenta, crearDeposito, buscarCuenta } = this.props;
        return(

            <div className="row d-flex justify-content-center">
                { this.props.toggleModal && (
                    <Modal open={this.props.toggleModal} onClose={this.closeModal} classNames={{modal:"modal-lg"}}>
                        <div style={{padding:'1.2rem', maxWidth: '850px'}}>
                            <div className="row">
                                <div className="col-12 grid-titulo">
                                    <h3>Depósito</h3>
                                </div>
                            </div>
                            <div>
                                <FormDeposito onSubmit={crearDeposito} closeModal= {this.closeModal}/>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="col-sm-12 pt-2">

                    <HeaderSimple
                        instruccion="¡Ingresa una cuenta!"
                        texto="Agregar Cuenta"
                        ruta="/cuenta/crear"
                        />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    buscar={buscarCuenta}
                                    titulo={"Cuentas"}
                                    buscador={this.props.buscador}/>
                        </div>

                        <Table onPageChange={listarCuenta} data={data} loading={loader} page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ editar: '/cuenta',cuenta: '/estadocuenta', eliminar: borrarCuenta})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="banco" dataSort>Banco</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="numero" dataSort>Numero</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombre" dataSort>Nombre</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                columnClassName='text-center'
                                className='text-center'
                                dataField="moneda" dataSort>Moneda</TableHeaderColumn>
                             <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataFormat={this.formatoMoneda}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="saldo" dataSort>Saldo</TableHeaderColumn>
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}
