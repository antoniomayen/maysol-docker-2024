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

class CostosGrid extends Component {

  constructor(props){
    super(props);

  }
  formatoMoneda = (cell) => {
    return(
      <RenderCurrency value={cell | 0} simbolo={this.props.simbolo}/>
    )
}

  render() {
    const { page, data, loading} = this.props
    const { listar } = this.props;
    return (
        <div className="grid-container ">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    titulo={"Detalle de costos"}/>
                        </div>

                        <Table
                            onPageChange={listar}
                            data={data}
                            loading={loading}
                            page={page}>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                isKey={true}
                                dataFormat={dateFormatter}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="empresa" dataSort>Empresa/Subempresa</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="linea" dataSort>Linea</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataFormat={this.formatoMoneda}
                                dataAlign={'right'}
                                dataField="cantidad" dataSort>Cantidad</TableHeaderColumn>
                        </Table>

                    </div>

    );
  }
}

export default CostosGrid;
