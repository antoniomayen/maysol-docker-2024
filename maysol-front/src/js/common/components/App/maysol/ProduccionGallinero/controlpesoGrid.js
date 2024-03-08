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



export default class ControlPesoGrid extends React.Component {


    componentWillMount() {

    }



    componentDidUpdate(prevProps, prevState){

    }
    formatGallina = (cell, row, index, i) => (
        <span>Galllina {i + 1}</span>
    )
    expandComponent = (row) => {
        let data = row && row.pesos ? row.pesos : [];
        let movimientos = _.cloneDeep(data)

        const { me } = this.props
        return(
            <div className=" tabla-adentro ">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ movimientos }>

                    <TableHeaderColumn
                        tdStyle={cellTachado}
                        thStyle={cellTachado}
                        dataFormat={this.formatGallina}
                        isKey={true}
                        dataField="gallina" dataSort>Gallinas</TableHeaderColumn>

                    <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={cellTachado}
                                dataFormat={this.formatoPeso}
                                dataField="peso" dataSort>Peso</TableHeaderColumn>

                </BootstrapTable>
            </div>

        )
    }
    formatoPeso = (cell) => {
        let peso= 0;
        try {
            peso = Number((cell).toFixed(2))
        } catch (error) {}
        return(<span>{peso} lb</span>)
    };
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
        const {dataPeso,page, cargando } = this.props;
        const { listar } = this.props;
        return(
            <div className="row d-flex justify-content-center">

                <div className="col-sm-12 pt-0 px-0 px-md-3 ">
                    <div className="grid-container borde-derecho">
                        <Table
                            onPageChange={listar}
                            data={dataPeso}
                            loading={cargando}
                            expandableRow={isExpandableRow}
                            expandComponent={this.expandComponent}
                            page={page}
                            >
                            <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={{width:85, padding:5}}
                                width={'85px'}
                                dataFormat={this.formatHour}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={{width:85, padding:5}}
                                width={'85px'}
                                dataFormat={this.formatSemana}
                                dataField="edad" dataSort>Edad</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={BreakLine}
                                dataAlign="right"
                                dataFormat={this.formatoPeso}
                                dataField="promedio" dataSort>Peso promedio</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="usuario" dataSort>Técnico control</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="nota" dataSort>Comentario</TableHeaderColumn>
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}



