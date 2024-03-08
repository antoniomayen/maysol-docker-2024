import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { initialize as initializeForm } from 'redux-form'

import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import Modal from 'react-responsive-modal';
import NumberFormat from "react-number-format";
import FormGasto from '../Crear/GastoForm';
import GastoUpdateForm from '../Update/EditarGastoCaja';
import FormDeposito from '../../Cuentas/Listar/DepositoForm';
import AnulacionForm from '../../Gastos/Crear/formanulacion';
import ReintegroForm from './reintegro';
import HeaderGasto from '../../../Utils/Headers/headerCaja';
import ToolbarCaja from '../../../Utils/Toolbar/ToolbarCaja';
import Swal from 'sweetalert2';
import { dateFormatter, cellTachado } from '../../../Utils/renderField/renderReadField'
import CierreCaja from './CierreCaja';
import { descripcionFormater } from 'Utils/Acciones/descripcionGrid';
import LoadMask from 'Utils/LoadMask';
import { api } from 'api/api';


function formatoMoneda(cell, row) {
    return <NumberFormat decimalScale={2} fixedDecimalScale={true} value={cell !== null ? cell : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />
}
function cellStyleFormat(cell, row) {
    return {color: row.color}
}

let empresas = [];
let categorias = [];
const getCategorias = (search) => {

    return api.get(`categorias/getTodasCategorias`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.forEach(item => {
            if(!_.find(categorias, {id: item.id})) {
                categorias.push(item);
            }
        });
        return { options: categorias}
    })
};

export default class GastoGrid extends React.Component {
    state = {
        modal: 0,
        idMovimiento: null,
        saldo: 0,
        proveedor: 0,
        movimiento:{}
    }
    componentWillMount() {
        this.getEmpresas('');
        getCategorias('');
    }
    openModal = () => {
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }
    enviarData = () =>{
        if(this.state.modal == 1){
            this.props.crearGasto(this.props.cierre,10)
        }
        else if(this.state.modal === 5){
            this.props.reintegro(this.props.cierre)
        }
    }


    getEmpresas = (search) => {
        empresas = [];
        return api.get(`proyectos/getEmpresas/`).catch((error) => {
            console.log("Error al leer cuentas.");
        }).then((data) => {
            data.forEach(item => {
                if (!_.find(empresas, { value: item.id })) {
                    empresas.push({value: item.id, label: item.nombre, style:{fontWeight: 'bold'}})
                }
                item.empresas.forEach(subempresa => {
                    if (!_.find(empresas, { value: subempresa.id })) {
                        empresas.push({value: subempresa.id, label: subempresa.nombre, subempresa: subempresa.subempresa,style: { paddingLeft: '2em' } });
                    }
                })
            });

            return { options: empresas }
        })
    }
    enviarAnulacion = (id) => {
        this.props.anular(this.state.idMovimiento)
    }
    enviarReintegro = () => {
        this.props.reintegro();
    }
    cambiarMes = (e) => {
        this.props.cambiarMes(e);
    }
    cambiarAnio = (e) => {
        this.props.cambiarAnio(e);
    }
    abrirGasto = () => {
        const {me, infoCierre} = this.props;
        let retiro={
            proyecto: me.idProyecto,
            persona: me.id,
            fecha: `${infoCierre.fechaInicio}`
        }
        this.props.setFormulario(retiro);
        this.setState({modal:1});
        this.openModal();
    }
    abrirUpdateGasto = (id, row) => {
        this.props.setFormGasto(row);
        this.setState({modal: 6, movimiento: row, proveedor: row.proveedor });
        this.openModal();
    }
    abrirAnulacion = (id) => {
        this.setState({modal:3});
        this.setState({idMovimiento: id});
        this.openModal();
    }
    abrirReintegro = () => {
        this.props.setFormReintegro();
        this.setState({modal: 5});
        this.openModal();
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
        let debe = 0;
        let haber = 0;
        noAnulados.forEach(row => {
            haber += row.haber;
            debe += row.debe;
        });


        saldo = debe -haber;
        return <NumberFormat decimalScale={2}
            fixedDecimalScale={true} value={saldo !== null ? saldo.toFixed(2) : 0}
            displayType={'text'} thousandSeparator={true} prefix={'Q'} />

    }
    cierrecuenta = () => {
        this.setState({modal:4});
        this.openModal();
    }
    enviarUpdateData = () => {
        this.props.editarMovimiento(this.props.cierre)
    }
    render() {
        const { data, loader, cargandoMovimiento, toggleModalCaja, page, activo, duenioGastos, saldocaja, infoCierre,
            me, filtro_categoria} = this.props;
        const {listarGastos, buscarEstado, cambiarFiltroCategoria} = this.props;
        let fecha = new Date(infoCierre.fechaInicio);
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();

        return(
            <div className="row d-flex justify-content-center">
                { this.props.toggleModalCaja && (
                    <Modal open={this.props.toggleModalCaja} onClose={this.closeModal}>
                        <div style={{maxWidth: '100%'}}>
                            <div className="modal-header">
                                <div className="panel-body">
                                    {
                                        this.state.modal === 1 &&
                                        <span className="reset-caption">Gasto Caja</span>

                                    }

                                    {
                                        this.state.modal === 3 &&
                                        <span className="reset-caption">Anulación</span>
                                    }
                                    {
                                        this.state.modal === 4 &&
                                        <span className="reset-caption">Cierre de caja</span>
                                    }
                                    {
                                        this.state.modal === 5 &&
                                        <span className="reset-caption">Reintegro</span>
                                    }
                                    {
                                        this.state.modal === 6 &&
                                        <span className="reset-caption">Editar Gasto</span>
                                    }
                                </div>
                            </div>
                            <div className="modal-body">


                                {
                                    this.state.modal === 1 && (
                                        <LoadMask loading={cargandoMovimiento} blur_1>
                                            <FormGasto
                                                usuario={me}
                                                empresas={empresas}
                                                onSubmit={this.enviarData}
                                                closeModal= {this.closeModal}/>
                                        </LoadMask>
                                    )

                                }
                                {
                                    this.state.modal === 3 && (
                                        <LoadMask loading={cargandoMovimiento} blur_1>
                                            <AnulacionForm onSubmit={this.enviarAnulacion} closeModal={this.closeModal} />
                                        </LoadMask>
                                    )
                                }
                                {
                                    this.state.modal === 4 && (
                                        <LoadMask loading={cargandoMovimiento} blur_1>
                                            <CierreCaja {...this.props}
                                                cuenta={infoCierre}
                                                closeModal={this.closeModal}
                                                recargarData={this.recargar} />
                                        </LoadMask>
                                    )
                                }
                                {
                                    this.state.modal === 5 && (
                                        <LoadMask loading={cargandoMovimiento} blur_1>
                                            <ReintegroForm onSubmit={this.enviarData} saldo={this.props.saldocaja.saldo} closeModal={this.closeModal} />
                                        </LoadMask>
                                    )
                                }
                                 {
                                    this.state.modal === 6 && (
                                        <div>
                                            {

                                                this.state.proveedor ? (
                                                    <LoadMask loading={cargandoMovimiento} blur_1>
                                                        <GastoUpdateForm
                                                        usuario={me}
                                                        empresas={empresas}
                                                        onSubmit={this.enviarUpdateData}
                                                        movimiento={this.state.movimiento}
                                                        closeModal= {this.closeModal}/>
                                                    </LoadMask>
                                                ): (
                                                    <LoadMask loading={cargandoMovimiento} blur_1>
                                                        <FormDeposito
                                                        anio={anio}
                                                        month={mes}
                                                        usuario={me}
                                                        editar={true}
                                                        cerrado={infoCierre.cerrado}
                                                        movimiento={this.state.movimiento}
                                                        onSubmit={this.enviarUpdateData} closeModal={this.closeModal} />
                                                    </LoadMask>

                                                )
                                            }
                                        </div>
                                    )

                                }
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="col-sm-12 p-0">
                    <div className="grid-container">
                        <HeaderGasto
                                cambiarMes={this.cambiarMes}
                                cambiarAnio={this.cambiarAnio}
                                saldo={saldocaja}
                                me={me}
                                texto1={"Cierre Caja"}
                                image1={require("../../../../../../assets/img/buttons/cierre_estado_cuenta.png")}
                                funcion1={this.cierrecuenta}
                                texto3={"Reportar gasto"}
                                image3={require('../../../../../../assets/img/buttons/retiro_estado_cuenta.png')}
                                funcion3={this.abrirGasto}
                                />
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCaja
                                buscar={buscarEstado}
                                titulo={duenioGastos.nombre}
                                duenio={"Gastos"}
                                texto={"Reintegro"}
                                categorias={categorias}
                                cambiarFiltroCategoria={cambiarFiltroCategoria}
                                filtro_categoria={filtro_categoria}
                                image={require('../../../../../../assets/img/buttons/ingresar_gasto.png')}
                                funcion={this.abrirReintegro}
                                buscador={this.props.buscador}/>
                        </div>
                        <Table onPageChange={listarGastos} pagination={false} data={data} loading={loader} page={page}>
                             <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                width={'90px'}
                                dataFormat={activeFormatter({ eliminarModal: this.abrirAnulacion, popover:'getRow', editar: this.abrirUpdateGasto })}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                width={'90px'}
                                dataFormat={dateFormatter}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                columnClassName='td-column-descripcion-gastos'
                                className='td-column-descripcion-gastos'
                                dataFormat={descripcionFormater({})}
                                dataField="descripcion" dataSort>Descripción</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="nombreCategoria" dataSort>Categoria</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                width={'90px'}
                                columnClassName={'text-derecha'}
                                dataFormat={formatoMoneda}
                                dataField="debe" dataSort>Debe</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                width={'90px'}
                                columnClassName={'text-derecha'}
                                dataField="haber" dataSort>Haber</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                width={'90px'}
                                dataFormat={this.calcularSaldo}
                                columnClassName={'text-derecha'}
                                dataField="saldo" dataSort>Saldo</TableHeaderColumn>
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}
