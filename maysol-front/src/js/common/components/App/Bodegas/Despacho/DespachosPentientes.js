import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import ToolbarCuenta from '../../../Utils/Toolbar/ToolbarUsuarios';
import Table from 'Utils/Grid'
import { BreakLine } from '../../../Utils/tableOptions';
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import {push} from "react-router-redux";
import Swal from 'sweetalert2';
import { dateFormatter, formatoMoneda } from 'Utils/renderField/renderReadField'
function formatoLote(cell, row){
    return <span> {dateFormatter(cell.lote)}</span>
}
const   isExpandableRow=()=> {
    return true;
}

export default class DespachosPentientes extends React.Component {
    abrirDialog = (id) => {

        Swal({
            title: 'Anular despacho',
            text: 'Justifique la anulación',
            input: 'text',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn-force btn-primary m-1',
            cancelButtonClass: 'btn-force btn-secondary m-1',
            confirmButtonText: 'Sí, Anular',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                const justificacion = result.value;
                this.props.anular(id, justificacion, this.props.bodega);
            }
        });
    };
    pendientesPage = (page=1) => {
        console.log("pendientes:", page)
        this.props.getDespachosPendientes(this.props.bodega, page)
    }
    expandComponent = (row) => {
        let data = row && row.detalle_movimiento ? row.detalle_movimiento : [];
        let lotes = _.cloneDeep(data)

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
                                dataField="producto" dataSort>Producto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                width={'90px'}
                                columnClassName={'text-derecha'}
                                className={'text-derecha'}
                                dataField="cantidad" dataSort>Cantidad</TableHeaderColumn>



                </BootstrapTable>
            </div>

        )
    }
    render(){
        const {data, loader, pagePendientes} = this.props;
        return(
            <div className="grid-container mt-3">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    titulo={"Despachos pendientes"}/>
                        </div>

                        <Table
                            onPageChange={this.pendientesPage}
                            data={data}
                            loading={loader}
                            expandableRow={isExpandableRow}
                            expandComponent={this.expandComponent}
                            page={pagePendientes}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({eliminarModal: this.abrirDialog})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="no_movimiento" dataSort>No. Despacho</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataFormat={dateFormatter}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="justificacion" dataSort>Justificación</TableHeaderColumn>
                        </Table>
                    </div>
        )
    }
}
