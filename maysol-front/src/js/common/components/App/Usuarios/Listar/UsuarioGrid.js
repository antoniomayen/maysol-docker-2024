import React from 'react';
import PropTypes from 'prop-types';
import { TableHeaderColumn } from 'react-bootstrap-table';
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom';
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid';
import ToolbarUsuario from '../../../Utils/Toolbar/ToolbarUsuarios';
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';

export default class UsuariosGrid extends React.Component {
    componentWillMount(){
        this.props.listarUsuarios();
    }
    render(){
        const {data, cargando, page } = this.props;
        const { listarUsuarios, borrarUsuario, buscarUsuarios} = this.props;

        return(
            <div className="row d-flex justify-content-center">
                <div className="col-sm-12 pt-2">


                    <HeaderSimple
                        instruccion="¡Ingresa un usuario!"
                        texto="Agregar Usuario"
                        ruta="/admin_usuario/crear"
                        />
                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarUsuario
                                buscar={buscarUsuarios}
                                titulo={"usuarios"}
                                buscador={this.props.buscador}/>
                        </div>

                        <Table
                            onPageChange={listarUsuarios}
                            data={data}
                            loading={cargando}
                            page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ editar: '/admin_usuario', eliminar: borrarUsuario })}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombreCompleto" dataSort>Nombre</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="username" dataSort>Usuario</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="cargo" dataSort>Cargo</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="proyecto" dataSort>Proyecto</TableHeaderColumn>
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
