import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import { editableFormater } from 'Utils/Acciones/InputGrid';
import { selectFormater } from 'Utils/Acciones/SelectGrid';
import NumberFormat from "react-number-format";

import Swal from 'sweetalert2';
import { BootstrapTable } from 'react-bootstrap-table';
import { dateFormatter, cellTachado } from '../../../Utils/renderField/renderReadField';
import _ from 'lodash';
import moment from 'moment';

function formatoMoneda(cell, row) {
    return <NumberFormat decimalScale={2} fixedDecimalScale={true} value={cell !== null ? cell : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />
}
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

        return (<span>{dateFormatter(row.fecha)} {hora}</span>)

    }
    formatSemana = (cell) =>(
        <span>{cell} Semanas</span>
    )


    render() {

        const {dataReajuste,page, cargando } = this.props;
        const { listarReajuste } = this.props;
        return(
            <div className="row d-flex justify-content-center">

                <div className="col-sm-12 pt-0 px-0 px-md-3 ">
                    <div className="grid-container borde-derecho">
                        <Table
                            onPageChange={listarReajuste}
                            data={dataReajuste}
                            loading={cargando}
                            page={page}
                            >
                            <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={this.formatHour}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                width={"100px"}
                                dataAlign="right"
                                dataField="cantidad_gallinas" dataSort>No. de Gallinas</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="raza" dataSort>Raza</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                width={"100px"}
                                dataAlign="right"
                                dataFormat={this.formatSemana}
                                dataField="edad" dataSort>Edad</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="usuario" dataSort>Técnico control</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="justificacion" dataSort>Comentario</TableHeaderColumn>
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}



