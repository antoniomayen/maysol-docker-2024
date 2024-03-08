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
import {CF, PL} from '../../../../utility/constants';

export default class CategoriasGrid extends React.Component {
    componentWillMount() {
        this.props.listarCategoria()
    }
    getCf = (cell, row, columnIndex,rowIndex) =>{

        let gasto = CF.find(x => x.id === cell);
        if (gasto){
            return gasto.japones + "-" +gasto.espaniol
        }
        return "--";
    }
    getPL = (cell, row, columnIndex,rowIndex) =>{
        let gasto = PL.find(x => x.id === cell);
        if(gasto){
            return gasto.japones + "-"+ gasto.espaniol
        }
        return "--";
    };
    renderRecuperacion = (cell, row, columnIndex,rowIndex) =>{
        let gasto = PL.find(x => x.id === cell);
        if(gasto){
            return <span>Si</span>
        }
        return <span>No</span>
    }
    render(){
        const { dataCategoria, loaderCategoria, pageCategoria } = this.props;
        const { listarCategoria, borrarCategorias, searchCategoria } = this.props;
        return(

            <div className="row d-flex justify-content-center">

                        <div className="col-sm-12 pt-2">

                            <HeaderSimple
                                instruccion="¡Ingresa una Categoria!"
                                texto="Agregar Categoria"
                                ruta="/admin_categoria/crear"
                                />

                            <div className="grid-container">
                                <div className="grid-title d-flex flex-row borde-superior">
                                    <Toolbar
                                            buscar={searchCategoria}
                                            titulo={"Categoria de gastos"}
                                            buscador={this.props.buscadorCategorias}/>
                                </div>

                            <Table onPageChange={listarCategoria} data={dataCategoria} loading={loaderCategoria} page={pageCategoria}>
                                <TableHeaderColumn
                                    dataField="id"
                                    isKey={true}
                                    dataAlign="center"
                                    dataFormat={activeFormatter({ editar: '/admin_categoria', eliminar: borrarCategorias})}>Acciones</TableHeaderColumn>
                                <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataField="nombre" dataSort>Nombre</TableHeaderColumn>
                                    <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataField="nombrejapones" dataSort>Japonés</TableHeaderColumn>
                                    <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataFormat={this.getCf}
                                        dataField="cf" dataSort>CF</TableHeaderColumn>
                                    <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataFormat={this.getPL}
                                        dataField="pl" dataSort>PL</TableHeaderColumn>
                                <TableHeaderColumn
                                        tdStyle={BreakLine}
                                        thStyle={BreakLine}
                                        dataFormat={this.renderRecuperacion}
                                        dataField="categoria_recuperacion" dataSort>Recuperación</TableHeaderColumn>

                                </Table>
                            </div>
                        </div>
            </div>
        )
    }
}
