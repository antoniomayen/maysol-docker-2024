import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BootstrapTable } from 'react-bootstrap-table';
import { dateFormatter, cellTachado, formatoMoneda } from 'Utils/renderField/renderReadField'
import LoadMask from "Utils/LoadMask";
function ingresadosFormater(cell) {
    return <b className="rojo">{cell}</b>
}


function proveedorFormater(cell, row) {
    if (row.proveedor !== null){
      return <div>{row.proveedor.nombre}</div>
    }
  }

export default class DepachoListar extends React.Component{

    componentWillMount(){
        this.props.getDespachosIngreso(this.props.match.params.id);
    }
    setDetalle = (row) => {
        this.props.set_detalleIngreso(row);
        this.props.setDetalle(row);
    }
    accionFormater = (cell, row) => {
        return (
            <button className="btn btn-secondary btn-normal" onClick={() => {
                this.props.set_detalleIngreso(row);
                this.props.setDetalle(row)
            }}>
                <i className="fa fa-file-text" aria-hidden="true"/>
            </button>
        );
    }

    render() {
        const { create, update } = this.props;
        const { updateData, despachosBodega, cargando } = this.props;
        const options = {
            noDataText: cargando ? 'Cargando...' : 'No hay datos'
        };
        return(
            <div className="border-completo  resumen-cf" style={{height: '100%'}}>
                <LoadMask loading={cargando} dark blur>
                    <BootstrapTable
                        options={options}
                        data={cargando ? [] : despachosBodega}
                        >
                        <TableHeaderColumn
                            tdStyle={cellTachado}
                            dataFormat={this.accionFormater}
                            dataAlign="center"
                            dataField="id" dataSort></TableHeaderColumn>
                        <TableHeaderColumn
                            tdStyle={cellTachado}
                            isKey={true}
                            dataField="no_movimiento" dataSort>OD</TableHeaderColumn>
                        <TableHeaderColumn
                            tdStyle={cellTachado}
                            dataField="bodega" dataSort>Bodega</TableHeaderColumn>
                        <TableHeaderColumn
                            tdStyle={cellTachado}
                            dataFormat={dateFormatter}
                            dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                    </BootstrapTable>
                </LoadMask>

            </div>
        )

    }
}
