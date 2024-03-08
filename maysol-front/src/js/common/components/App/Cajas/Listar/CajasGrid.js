import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import Modal from 'react-responsive-modal';
import NumberFormat from "react-number-format";
import Swal from 'sweetalert2';
import Toolbar from '../../../Utils/Toolbar/ToolbarSelect';
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';


export default class CajasGrid extends React.Component {
    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();
    }
    render(){
        const { dataCajaUsuarios, loader, page, dataempresas, filtroEmpresas, me } = this.props;
        const { listar,  search, cambiarFiltro } = this.props;
        return(

            <div className="row d-flex justify-content-center">

                        <div className="col-sm-12 pt-2">

                            <HeaderSimple
                                instruccion="¡Cajas asignadas!"
                                />

                            <div className="grid-container">
                                <div className="grid-title d-flex flex-row borde-superior">
                                    <Toolbar
                                            buscar={search}
                                            titulo={"Cajas"}
                                            usuario={me}
                                            empresas={dataempresas}
                                            cambiarFiltro={cambiarFiltro}
                                            filtro={filtroEmpresas}
                                            buscador={this.props.buscador}/>
                                </div>

                            <Table onPageChange={listar} data={dataCajaUsuarios} loading={loader} page={page}>
                                    <TableHeaderColumn
                                        dataField="id"
                                        isKey={true}
                                        dataAlign="center"
                                        dataFormat={activeFormatter({ cajas: '/cajas/empleado'})}>Acciones</TableHeaderColumn>
                                    <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataField="nombreCompleto" dataSort>Nombre</TableHeaderColumn>
                                    <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataField="cargo" dataSort>Puesto</TableHeaderColumn>
                                    <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataField="proyecto" dataSort>Proyecto</TableHeaderColumn>
                                </Table>
                            </div>
                        </div>
            </div>
        )
    }
}
