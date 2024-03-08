import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import NumberFormat from "react-number-format";

import { dateFormatter, cellTachado } from '../../../Utils/renderField/renderReadField';
import moment from 'moment';

function formatoMoneda(cell, row) {
    return <NumberFormat decimalScale={2} fixedDecimalScale={true} value={cell !== null ? cell : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />
}

export const RenderNumber = (value) => {
    return (
        <NumberFormat
            decimalScale={2}
            fixedDecimalScale={true}
            value={value}
            thousandSeparator={true}
            prefix={''}
            displayType={"text"}
        />
    )
};

function cellStyleFormat(cell, row) {
    return {color: row.color}
}
const   isExpandableRow=()=> {
    return true;
}
const cellEditProp = {
    mode: 'click'
};



export default class DetalleGrid extends React.Component {


    componentWillMount() {

    }



    componentDidUpdate(prevProps, prevState){

    }

    formatHour = (cell, row) => {
        let hora = null;

        if(row.hora){
            hora = moment(row.hora, ["h:mm:ss"]).format("h:mm A")
        }

        return (<span>{dateFormatter(row.fInicio)}  -  {dateFormatter(row.fFin)}</span>)

    }

    formatSemana = (cell) =>(
        <span>{cell} Semanas</span>
    )


    render() {

        const { dataGallineros, pageGallineros, cargando } = this.props;
        const { listarGallinero } = this.props;
        return(
            <div className="row d-flex justify-content-center">
                <div className="col-sm-12 pt-0 px-0 px-md-3 ">
                    <div className="grid-container borde-derecho">
                        <Table
                            onPageChange={listarGallinero}
                            data={dataGallineros}
                            loading={cargando}
                            page={pageGallineros}
                        >
                            <TableHeaderColumn
                                isKey={true}
                                thStyle={BreakLine}
                                dataAlign="center"
                                dataFormat={activeFormatter({ editar: `/maysol_gallineroCrearProduccion/${this.props.idGallinero}` })}
                                dataField="id" dataSort
                            />
                            <TableHeaderColumn
                                thStyle={BreakLine}
                                width="175px"
                                dataAlign="center"
                                dataFormat={this.formatHour}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={BreakLine}
                                dataAlign="center"
                                width="100px"
                                dataField="edad" dataSort>Semana</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={BreakLine}
                                dataField="raza" dataSort>Gallinas</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={BreakLine}
                                dataAlign="right"
                                //dataFormat={this.formatSemana}
                                dataField="porcion_alimento" dataSort>GRS. Alimentos</TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign="right"
                                thStyle={BreakLine}
                                dataFormat={RenderNumber}
                                dataField="postura" dataSort>Postura</TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign="right"
                                thStyle={BreakLine}
                                dataFormat={RenderNumber}
                                dataField="posturaA" dataSort>P.Anterior</TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign="right"
                                thStyle={BreakLine}
                                dataFormat={RenderNumber}
                                dataField="posturaG" dataSort>P.Guía</TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign="right"
                                thStyle={BreakLine}
                                dataField="produccion" dataSort>Producción</TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign="right"
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                dataField="venta" dataSort>Venta</TableHeaderColumn>
                            <TableHeaderColumn
                                dataAlign="right"
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                dataField="rentabilidad" dataSort>Rentabilidad</TableHeaderColumn>
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}



