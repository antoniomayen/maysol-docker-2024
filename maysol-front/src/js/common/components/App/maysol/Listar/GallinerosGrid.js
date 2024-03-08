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
import HeaderGallineros from '../../../Utils/Headers/headerGallineros';
import Form from './EditarTecnicoForm';
import Modal from 'react-responsive-modal';
import LoadMask from 'Utils/LoadMask';

function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}

export default class GallinerosGrid extends React.Component {
    state = {
        granja:{
            nombre:''
        }
    }
    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();

    }
    closeModal = () =>{
        this.props.setToggleModal(false);
    }
    openModal = () =>{
        this.props.setToggleModal(true);
    }
    abrirEditar = (id, row)  =>{
        this.setState({granja:row})
        this.props.setFormularioTecnico(row);
        this.openModal();
    }
    pesoFormater = (cell, row) => {
        let libras = 0.00220462;
        let cantidadtotal = libras * row.cantidad_alimento * row.no_gallinas;
        cantidadtotal = Number((cantidadtotal).toFixed(2));
        return(
            <span>{cantidadtotal} lb</span>
        )
    }
    pesoGallinasFormater = (cell, row) => (
        <span>{Number((cell || 0).toFixed(1))} lb</span>
    )
    render(){
        const { data, cargando, page, me,empresasSelect } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return(

            <div className="row d-flex justify-content-center">
                { this.props.toggleModal && (
                    <Modal open={this.props.toggleModal} onClose={this.closeModal} >
                        <div  style={{ Width: '100%' }}>
                            <div className="modal-header">
                                <div className="panel-body">
                                    <span className="reset-caption">Técnico Gallinero</span>
                                </div>
                            </div>
                            <div className="modal-body">
                                <LoadMask loading={cargando}>
                                    <Form
                                        onSubmit={this.props.updateTecnico}
                                        granja={this.state.granja}
                                        {...this.props}
                                        closeModal={this.closeModal} />
                                </LoadMask>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="col-sm-12">
                    <HeaderGallineros
                                instruccion="¡Contabiliza un Gallinero!"
                                texto="Agregar Gallinero"
                                ruta="/maysol_gallinero/crear"
                                />
                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCuenta
                                    buscar={search}
                                    titulo={"Gallineros"}
                                    usuario={me}
                                    empresas={empresasSelect}
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
                                dataFormat={activeFormatter({ editar: this.abrirEditar ,gallineros: '/maysol_gallineroestado', eliminar: destroy})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombre" dataSort>Gallineros</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign={"right"}
                                dataField="no_gallinas" dataSort>Cantidad</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign={"right"}
                                dataField="edad" dataSort>Edad Semana</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign={"right"}
                                dataFormat={this.pesoGallinasFormater}
                                dataField="peso_promedio" dataSort>Peso</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign={"right"}
                                dataField="raza" dataSort>Raza</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataFormat={this.pesoFormater}
                                dataAlign={"right"}
                                dataField="peso_promedio" dataSort>Alimento total</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataField="nombreTecnico" dataSort>Técnico de control</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
