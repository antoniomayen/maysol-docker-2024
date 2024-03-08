import React from 'react'
import PropTypes from 'prop-types'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import NumberFormat from "react-number-format";
import ToolbarCuenta from '../../../Utils/Toolbar/ToolbarSelect';
import {  formatoMoneda } from '../../../Utils/renderField/renderReadField'
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';
import { BootstrapTable } from 'react-bootstrap-table';
import { Monedas } from '../../../../utility/constants'
function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}
function formatoPrecios1(cell, row){
    return (
        <div>
            {
                row.precios.map(e =>{
                    let simbolo = Monedas.find(x => x.value === e.moneda)
                    return <div>{formatoMoneda(e.precio, simbolo.simbolo)}</div>

                    // <div key={e}>{e.precio}</div>
                })
            }
        </div>

    )
}
function formatoPrecios2(cell, row){
    return (
        <div>
            {
                row.precios.map(e =>{
                    let simbolo = Monedas.find(x => x.value === e.moneda)
                    return <div>{formatoMoneda(e.precio2, simbolo.simbolo)}</div>

                    // <div key={e}>{e.precio}</div>
                })
            }
        </div>

    )
}
function formatoPrecios3(cell, row){
    return (
        <div>
            {
                row.precios.map(e =>{
                    let simbolo = Monedas.find(x => x.value === e.moneda)
                    return <div>{formatoMoneda(e.precio3, simbolo.simbolo)}</div>

                    // <div key={e}>{e.precio}</div>
                })
            }
        </div>

    )
}
const   isExpandableRow=()=> {
    return true;
};

export default class ProductosGrid extends React.Component {

    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();
    }
    expandComponent = (row) => {
        let data = row && row.fracciones ? row.fracciones : [];
        let multiplo = _.cloneDeep(data);
        multiplo.forEach(item => {
            item.simbolo=row.simbolo
        });
        // multiplo.splice(0,1);
        return(
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ multiplo }>
                    <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={{minWidth:300, padding:5}}
                        editable={ false }
                        dataField="presentacion" dataSort>Presentación</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        width={85}
                        dataFormat={formatoPrecios1}
                        dataField="precios" dataSort>Precio 1</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        width={85}
                        dataFormat={formatoPrecios2}
                        dataField="precios" dataSort>Precio 2</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        width={85}
                        dataFormat={formatoPrecios3}
                        dataField="precios" dataSort>Precio 3</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        width={85}
                        dataField="capacidad_maxima" dataSort>Capacidad máxima</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    };
    render(){
        const { data, cargando, page, me,empresasSelect } = this.props;
        const { listar, search, filtro, borrar } = this.props;
        return(

            <div className="row d-flex justify-content-center">


                <div className="col-sm-12">

                    <HeaderSimple
                                instruccion="¡Ingresa un producto!"
                                texto="Agregar productos"
                                ruta="/producto/crear"
                                />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    buscar={search}
                                    titulo={"Productos"}
                                    usuario={me}
                                    empresas={empresasSelect}
                                    cambiarFiltro={filtro}
                                    filtro={this.props.filtro_producto}
                                    buscador={this.props.buscador}/>
                        </div>

                        <Table onPageChange={listar}
                                data={data}
                                loading={cargando}
                                expandableRow={isExpandableRow}
                                expandComponent={this.expandComponent}
                                page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ editar: '/producto', eliminar: borrar})}>Acciones</TableHeaderColumn>
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
