import React from 'react'
import PropTypes from 'prop-types'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import NumberFormat from "react-number-format";
import ToolbarCuenta from '../../../Utils/Toolbar/ToolbarSelect';
import { dateFormatter, formatoMoneda } from '../../../Utils/renderField/renderReadField'
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';
import { BootstrapTable } from 'react-bootstrap-table';

function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}

export default class LineaProduccionGrid extends React.Component {

    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();
    }

    render(){
        const { data, cargando, page, me,empresasSelect } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return(

            <div className="row d-flex justify-content-center">


                <div className="col-sm-12">

                    <HeaderSimple
                                instruccion="¡Ingresa una línea!"
                                texto="Agregar Línea"
                                ruta="/admin_lineaproduccion/crear"
                                />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    buscar={search}
                                    titulo={"Línea de producción"}
                                    usuario={me}
                                    empresas={empresasSelect}
                                    cambiarFiltro={filtro}
                                    filtro={this.props.filtro_lineap}
                                    buscador={this.props.buscador}/>
                        </div>

                        <Table onPageChange={listar}
                                data={data}
                                loading={cargando}
                                page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ editar: '/admin_lineaproduccion', eliminar: destroy})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombre" dataSort>nombre</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombreEmpresa" dataSort>Empresa</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
