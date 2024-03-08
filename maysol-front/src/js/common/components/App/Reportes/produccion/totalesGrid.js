import React, { Component } from 'react';
import { renderSelectField } from 'Utils/renderField';
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import 'react-dates/lib/css/_datepicker.css';
import { TableHeaderColumn } from 'react-bootstrap-table'
import ToolbarCuenta from 'Utils/Toolbar/ToolbarUsuarios';
import Table from 'Utils/Grid'
import { BreakLine } from 'Utils/tableOptions';
import { dateFormatter, formatoMoneda } from 'Utils/renderField/renderReadField';
import { activeFormatter }  from 'Utils/Acciones/Acciones';
class TotalesGrid extends Component {

  constructor(props){
    super(props);

  }

  render() {
    const { dataTotales, page, loading} = this.props;
    const { listarTotales } = this.props;
    const data = {
        results: dataTotales,
        count: 1
    }
    return (
        <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    titulo={"Detalle producción"}/>
                        </div>

                        <Table
                            data={data}
                            loading={loading}>

                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                isKey={true}
                                thStyle={BreakLine}
                                dataField="nombre" dataSort>Producto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign={'right'}
                                dataField="cantidad" dataSort>Cantidad</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                width={'10%'}
                                dataAlign={'right'}
                                dataField="a" dataSort></TableHeaderColumn>
                        </Table>

                    </div>

    );
  }
}

export default TotalesGrid;
