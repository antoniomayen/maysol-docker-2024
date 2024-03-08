import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import Modal from 'react-responsive-modal';
import NumberFormat from "react-number-format";
import Swal from 'sweetalert2';
import Toolbar from '../../../Utils/Toolbar/ToolbarUsuarios';
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';
import { BootstrapTable } from 'react-bootstrap-table';
import {formatoMoneda} from "../../../Utils/renderField/renderReadField";

const   isExpandableRow=()=> {
    return true;
}
function formatocuentas(cell, row) {
    if(row.cuentas){
        return <div>{row.cuentas.map((cuenta, index) => {
            return <div key={index}>{cuenta.nombre}</div>
        })}</div>

    }
}
export default class ProyectosGrid extends React.Component {
    componentWillMount() {
        this.props.listar()
    }
    expandComponent = (row) => {
        let data = row && row.empresas ? row.empresas : [];
        const options = {
            noDataText: 'No hay datos'
        };
        return (
            <div className=" tabla-adentro">
                <BootstrapTable
                        headerStyle={ { backgroundColor: '#e24647' } }
                        options={options}
                        data={ data }>
                        <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>
                        <TableHeaderColumn
                            tdStyle={BreakLine}
                            thStyle={BreakLine}
                            dataField="nombre" dataSort>Nombre</TableHeaderColumn>
                        <TableHeaderColumn
                            tdStyle={BreakLine}
                            thStyle={BreakLine}
                            dataField="representante" dataSort>Representante</TableHeaderColumn>


                </BootstrapTable>
            </div>
        )
    }
    render(){
        const { data, loader, page } = this.props;
        const { listar, destroy, search } = this.props;
        return(

            <div className="row d-flex justify-content-center">

                        <div className="col-sm-12 pt-2">

                            <HeaderSimple
                                instruccion="¡Ingresa una empresa!"
                                texto="Agregar Empresa"
                                ruta="/admin_empresa/crear"
                                />

                            <div className="grid-container">
                                <div className="grid-title d-flex flex-row borde-superior">
                                    <Toolbar
                                            buscar={search}
                                            titulo={"Empresas"}
                                            buscador={this.props.buscador}/>
                                </div>

                            <Table
                                expandableRow={isExpandableRow}
                                expandComponent={this.expandComponent}
                                onPageChange={listar}
                                data={data}
                                loading={loader}
                                page={page}>
                                <TableHeaderColumn
                                    dataField="id"
                                    isKey={true}
                                    dataAlign="center"
                                    dataFormat={activeFormatter({ editar: '/admin_empresa', eliminar: destroy})}>Acciones</TableHeaderColumn>
                                <TableHeaderColumn
                                    tdStyle={BreakLine}
                                    thStyle={BreakLine}
                                    dataField="nombre" dataSort>Nombre</TableHeaderColumn>
                                <TableHeaderColumn
                                    tdStyle={BreakLine}
                                    thStyle={BreakLine}
                                    dataField="representante" dataSort>Representante</TableHeaderColumn>
                                <TableHeaderColumn
                                    tdStyle={BreakLine}
                                    thStyle={BreakLine}
                                    className='text-center'
                                    dataFormat={formatocuentas}
                                    dataField="cuenta" dataSort>Cuentas</TableHeaderColumn>
                                <TableHeaderColumn
                                    tdStyle={BreakLine}
                                    thStyle={BreakLine}
                                    dataField="nombreFase" dataSort>Fase</TableHeaderColumn>
                            </Table>
                            </div>
                        </div>
            </div>
        )
    }
}
