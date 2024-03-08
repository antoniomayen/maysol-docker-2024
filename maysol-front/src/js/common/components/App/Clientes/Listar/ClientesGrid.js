import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import ToolbarCuenta from '../../../Utils/Toolbar/ToolbarSelect';
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';

const   isExpandableRow=()=> {
    return true;
}
export default class ClientesGrid extends React.Component {

    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();
    }
    expandComponent = (row) => {
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
            </div>

        )
    }
    render(){
        const { data, cargando, page, me,empresasSelect } = this.props;
        const { listar, search, filtro_empresa, destroy } = this.props;
        return(

            <div className="row d-flex justify-content-center">


                <div className="col-sm-12">

                    <HeaderSimple
                                instruccion="¡Ingresa un cliente!"
                                texto="Agregar cliente"
                                ruta="/admin_cliente/crear"
                                />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    buscar={search}
                                    titulo={"Clientes"}
                                    usuario={me}
                                    empresas={empresasSelect}
                                    cambiarFiltro={this.props.filtro}
                                    filtro={this.props.filtro_empresa}
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
                                dataFormat={activeFormatter({ editar: '/admin_cliente', eliminar: destroy})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombre" dataSort>Nombre</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="direccion" dataSort>Dirección</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="contacto" dataSort>Contacto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="telefono" dataSort>Teléfono</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
