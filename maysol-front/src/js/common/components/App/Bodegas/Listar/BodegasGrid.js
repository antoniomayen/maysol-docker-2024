import React from 'react'
import PropTypes from 'prop-types'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter, activeFormatter2 }  from 'Utils/Acciones/Acciones'
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

export default class BodegasGrid extends React.Component {

    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();

    }
    acciones = (cell, row) => {
        const {me} = this.props;
        if(me.is_superuser){
            return activeFormatter2({ editar: '/bodega',estadobodega: '/bodega_estado', eliminar: this.props.destroy, cell, row})
        }
        return activeFormatter2({ estadobodega: '/bodega_estado', cell, row})
    }
    render(){
        const { data, cargando, page, me,empresasSelect } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return(

            <div className="row d-flex justify-content-center">


                <div className="col-sm-12">

                    <HeaderSimple
                                instruccion="¡Ingresa una bodega!"
                                texto="Agregar bodega"
                                ruta="/bodega/crear"
                                />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    buscar={search}
                                    titulo={"Bodegas"}
                                    usuario={me}
                                    empresas={empresasSelect}
                                    cambiarFiltro={filtro}
                                    filtro={this.props.filtro_bodega}
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
                                dataFormat={this.acciones}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombre" dataSort>nombre</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="direccion" dataSort>Dirección</TableHeaderColumn>
                             <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataFormat={formatoEmpresa}
                                dataField="empresa" dataSort>Empresa</TableHeaderColumn>
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}
