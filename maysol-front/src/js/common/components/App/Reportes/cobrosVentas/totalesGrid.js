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
import moment from 'moment';
import {dateFormatterTimeZone} from "../../../Utils/renderField/renderReadField";

class TotalesGrid extends Component {
    render() {
        const { data, page, loading, listar } = this.props;
        return (
            <div className="grid-container">
                <div className="grid-title d-flex flex-row borde-superior">
                    <ToolbarCuenta titulo={'Cobros de ventas'} />
                </div>
                <Table
                    onPageChange={listar}
                    data={data}
                    loading={loading}
                    page={page}
                >
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        isKey
                        thStyle={BreakLine}
                        dataAlign="center"
                        dataField="fecha"
                        dataSort
                        dataFormat={dateFormatterTimeZone}
                    >
                        Fecha
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        thStyle={BreakLine}
                        dataAlign="center"
                        dataField="id"
                        dataSort
                    >
                        Id venta
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        thStyle={BreakLine}
                        dataAlign="left"
                        dataField="cliente"
                        dataSort
                    >
                        cliente
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        thStyle={BreakLine}
                        dataAlign="left"
                        dataField="usuario"
                        dataSort
                        dataFormat={formatoMoneda}
                    >
                        Vendedor
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        thStyle={BreakLine}
                        dataAlign="right"
                        dataField="boleta"
                        dataSort
                    >
                        No. boleta
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        thStyle={BreakLine}
                        dataAlign="left"
                        dataField="empresa"
                        dataSort
                    >
                        Empresa
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        thStyle={BreakLine}
                        dataAlign="right"
                        dataField="monto"
                        dataSort
                        dataFormat={formatoMoneda}
                    >
                        Total
                    </TableHeaderColumn>
                </Table>
            </div>
        );
    }
}

export default TotalesGrid;
