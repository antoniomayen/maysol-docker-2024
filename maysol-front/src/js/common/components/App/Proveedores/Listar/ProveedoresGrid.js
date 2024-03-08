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

const   isExpandableRow=()=> {
    return true;
}
function trClassFormat(row, rowIndex) {
    // row is the current row data
    return rowIndex % 2 === 0
    ? "tr-odd"
    : "tr-even"; // return class name.
    }

export default class ProveedoresGrid extends React.Component {

    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();
    }
    expandComponent = (row) => {

        let cuentas = row && row.cuentas ? row.cuentas : [];
        let contactos = row && row.contactos ? row.contactos : [];

        return(
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ contactos }>
                            <TableHeaderColumn
                                thStyle={{minWidth:300, padding:5}}
                                editable={ false }
                                dataField="nombre" dataSort>Nombre</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={{minWidth:300, padding:5}}
                                editable={ false }
                                dataField="puesto" dataSort>Puesto</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={{minWidth:300, padding:5}}
                                editable={ false }
                                dataField="telefono" dataSort>Teléfono</TableHeaderColumn>

                            <TableHeaderColumn
                                thStyle={{minWidth:300, padding:5}}
                                editable={ false }
                                dataField="correo" dataSort>Correo</TableHeaderColumn>
                            <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>


                </BootstrapTable>
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ cuentas }>
                            <TableHeaderColumn
                                thStyle={{minWidth:300, padding:5}}
                                editable={ false }
                                dataField="banco" dataSort>Banco</TableHeaderColumn>
                            <TableHeaderColumn
                                thStyle={{minWidth:300, padding:5}}
                                editable={ false }
                                dataField="numero" dataSort>No</TableHeaderColumn>

                            <TableHeaderColumn
                                thStyle={{minWidth:300, padding:5}}
                                editable={ false }
                                dataField="tipo" dataSort>Tipo</TableHeaderColumn>
                            <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>


                </BootstrapTable>
            </div>

        )
    }

    render(){
        const { data, cargando, page, me,empresasSelect } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return(

            <div className="row d-flex justify-content-center">


                <div className="col-sm-12">

                    <HeaderSimple
                                instruccion="¡Ingresa un proveedor!"
                                texto="Agregar proveedor"
                                ruta="/admin_proveedor/crear"
                                />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    buscar={search}
                                    titulo={"Proveedores"}
                                    usuario={me}
                                    empresas={empresasSelect}
                                    cambiarFiltro={filtro}
                                    filtro={this.props.filtro_proveedor}
                                    buscador={this.props.buscador}/>
                        </div>

                        <Table onPageChange={listar}
                                expandableRow={isExpandableRow}
                                expandComponent={this.expandComponent}
                                data={data}
                                loading={cargando}
                                trClassName={trClassFormat}
                                page={page}>

                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ editar: '/admin_proveedor', eliminar: destroy})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombre" dataSort>Nombre</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="nit" dataSort>Nit</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="codigo" dataSort>Código</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="correo_caja" dataSort>Correo</TableHeaderColumn>
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}
