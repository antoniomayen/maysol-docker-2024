import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BootstrapTable } from 'react-bootstrap-table';
import { dateFormatter, cellTachado, formatoMoneda } from 'Utils/renderField/renderReadField'
import LoadMask from "Utils/LoadMask";
import Table from 'Utils/Grid'

function ingresadosFormater(cell) {
    return <b className="rojo">{cell}</b>
}


function proveedorFormater(cell, row) {
    if (row.proveedor !== null){
      return <div>{row.proveedor.nombre}</div>
    }
  }

export default class ComprasListar extends React.Component{

    componentWillMount(){
        this.props.getCompras(1, this.props.match.params.id);
    }
    setDetalle = (row) => {
        this.props.setDetalle(row);
    }
    accionFormater = (cell, row) => {
        return (
            <button className="btn btn-secondary btn-normal" onClick={() => {
                this.props.setDetalle(row)
            }}>
                <i className="fa fa-file-text" aria-hidden="true"/>
            </button>
        );
    }
    getComprasPage = (page=1) => {
        this.props.getCompras(page, this.props.match.params.id);
    }

    render() {
        const { create, update } = this.props;
        const { updateData, compras, cargando, pageCompra } = this.props;
        const options = {
            noDataText: cargando ? 'Cargando...' : 'No hay datos'
        };
        return(
            <div className="grid-container ">
                        <div style={{height:10}} className="grid-title d-flex flex-row borde-superior">
                        </div>
                        <LoadMask loading={cargando} dark blur>
                            <Table
                                onPageChange={this.getVentas}
                                data={compras}
                                loading={cargando}
                                page={pageCompra}>
                                <TableHeaderColumn
                                    tdStyle={cellTachado}
                                    dataFormat={this.accionFormater}
                                    dataAlign="center"
                                    dataField="id" dataSort></TableHeaderColumn>
                                <TableHeaderColumn
                                    tdStyle={cellTachado}
                                    isKey={true}
                                    dataField="numero_oc" dataSort>No. OC</TableHeaderColumn>
                                <TableHeaderColumn
                                    tdStyle={cellTachado}
                                    dataFormat={proveedorFormater}
                                    dataField="proveedor" dataSort>Proveedor</TableHeaderColumn>
                                <TableHeaderColumn
                                    tdStyle={cellTachado}
                                    dataFormat={dateFormatter}
                                    dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            </Table>
                        </LoadMask>
            </div>

        )

    }
}
