import React from 'react'
import PropTypes from 'prop-types'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import NumberFormat from "react-number-format";
import ToolbarHistoriaB from '../../../Utils/Toolbar/toolbarHistoriaBodega';
import {dateFormatter, dateFormatterTimeZone, formatoMoneda} from '../../../Utils/renderField/renderReadField'
import { BootstrapTable } from 'react-bootstrap-table';
import LoadMask from 'Utils/LoadMask';
import { Polar } from 'react-chartjs-2';


function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}
function formatoLote(cell, row){
     return <span> {dateFormatter(cell.lote)}</span>
}

function formatoJustificacion(cell, row) {
    return <span> {row.justificacion} {row.destino ? ` - ${row.destino}` : ""}</span>
}

const   isExpandableRow=()=> {
    return true;
}

function cellTachado(cell, row) {
    if(!row.activo){
        return {textDecoration: "line-through", whiteSpace: 'normal'}
    }
    return {whiteSpace: 'normal'}
}
export default class HistoricoBodegaGrid extends React.Component {
    state = {
        idBodega: 0,
        movimiento: {}
    }

    componentWillMount() {

    }
    reajuste = () =>{

    }
    abrirReajuste = (id, row) => {

        this.props.setFormReajuste(row);
        this.setState({  movimiento:row });
        this.openModal();
    }
    //****Manejo de modal */
    openModal = () => {
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }
    formatCantidad = (cell, row) => {
        if(row.tipo == 'Reajuste'){
            return <div>
                <p>Cantidad Anterior: {row.cantidadInicial}</p>
                <p>Cantidad: {row.cantidad}</p>
            </div>
        }
        return <span>{cell}</span>
    }
    expandComponent = (row) => {
        let data = row && row.detalle_movimiento ? row.detalle_movimiento : [];
        let lotes = _.cloneDeep(data);

        return(
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ lotes }>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                hidden={true}
                                isKey={true}
                                dataField="id" dataSort>id</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                dataFormat={formatoLote}
                                dataField="lote" dataSort>Lote</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                dataField="nombreProducto" dataSort>Producto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                width={'90px'}
                                columnClassName={'text-derecha'}
                                className={'text-derecha'}
                                dataFormat={this.formatCantidad}
                                dataField="cantidad" dataSort>Cantidad</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                width={'90px'}
                                columnClassName={'text-derecha'}
                                className={'text-derecha'}
                                dataField="cantidadasas" dataSort></TableHeaderColumn>
                </BootstrapTable>
            </div>

        )
    }

    render(){
        // const { data, loading, cargandoMovimiento, page, me,empresasSelect, detalleBodega } = this.props;
        // const { listar, search, filtro, destroy } = this.props;
return(

            <div className="row d-flex justify-content-center">


                <div className="col-sm-12">

                    <div className="border-completo">
                        <LoadMask loading={this.props.loading} blur_1>


                        <div className="row col-md-12">
                            <div className="col-md-6">
                                <div className="grid-container" >
                                    <div style={{flex: "1"}}>
                                        <h3 className="text-primary"><b>Ingresos</b></h3>
                                        <h5 className="text-rosado text-center"><i>Semanal</i></h5>
                                    </div>
                                    <Polar data={this.props.grafica.ingreso}
                                            height={100}
                                            options={{
                                                responsive: true,
                                                legend: {
                                                    display: true,
                                                    position:'bottom',
                                                    labels: {
                                                        usePointStyle: true,
                                                    }
                                                }
                                            }}/>
                                </div>
                            </div>
                            <div className="col-md-6 borde-lateral">
                                <div className="grid-container" >
                                    <div style={{flex: "1"}}>
                                        <h3 className="text-primary"><b>Despachos</b></h3>
                                        <h5 className="text-rosado text-center"><i>Semanal</i></h5>
                                    </div>
                                    <Polar data={this.props.grafica.despacho}
                                            height={100}
                                            options={{
                                                responsive: true,
                                                legend: {
                                                    display: true,
                                                    position:'bottom',
                                                    labels: {
                                                        usePointStyle: true,
                                                    }
                                                }
                                        }}/>
                                </div>
                            </div>
                        </div>
                        </LoadMask>
                    </div>

                    <div className="grid-container mt-3">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarHistoriaB
                                    buscar={this.props.searchHistora}
                                    titulo={'Historico'}
                                    subtitulo={''}
                                    {...this.props}
                                    usuario={this.props.me}
                                    cambiarMovimiento={this.props.cambiarMovimiento}
                                    filtro_movimiento={this.props.filtro_movimiento}
                                    buscador={this.props.buscarHistoria}/>
                        </div>

                        <Table onPageChange={this.props.listarHistorico}
                                data={this.props.historicoData}
                                loading={this.props.loading}
                                expandableRow={isExpandableRow}
                                expandComponent={this.expandComponent}
                                page={this.props.page}>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                hidden={true}
                                isKey={true}
                                dataField="id" dataSort>id</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                // isKey={true}
                                dataFormat={dateFormatterTimeZone}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="tipoNombre" dataSort>Movimiento</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="usuario" dataSort>Hecho por</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoJustificacion}
                                dataField="justificacion"
                                dataSort
                            >Justificación</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
