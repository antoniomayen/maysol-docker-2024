import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import ToolbarBodega from '../../../Utils/Toolbar/ToolbarBodega';
import { dateFormatter, formatoMoneda, formatoFraccion } from '../../../Utils/renderField/renderReadField'
import { BootstrapTable } from 'react-bootstrap-table';
import Modal from 'react-responsive-modal';
import LoadMask from 'Utils/LoadMask';
import ReajusteForm from './ReajusteInventario';
import "./estado.css";

const   isExpandableRow=()=> {
    return true;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

export default class EstadoBodegaGrid extends React.Component {
    state = {
        idBodega: 0,
        movimiento: {},
        modal_f: false,
        fracciones: {},
        producto:{
            nombre:''
        }
    };

    componentWillMount() {

    }
    reajuste = () =>{

    }
    abrirReajuste = (id, row) => {

        this.props.setFormReajuste(row);
        this.setState({  movimiento:row });
        this.openModal();
    }
    //****Manejo de modal */
    openModal = () => {
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }

    openModalFracciones = () => {
        this.setState({modal_f: true});
    }
    closeModalFracciones = () => {
       this.setState({modal_f: false});
    }

    botonModal = (id, row) => {
        return (<img className="action-img" title="Abonar" src={require("../../../../../../assets/img/icons/detalle_inventario.png")}
                     onClick={(e)=>{
                         e.preventDefault();
                         this.setState({fracciones: id, producto:row});
                         this.openModalFracciones()
                     }}
                      alt="Ver fracciones" />)
    }

    expandComponent = (row) => {
        let data = row && row.lotes ? row.lotes : [];
        let lotes = _.cloneDeep(data)

        return(
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ lotes }>
                    <TableHeaderColumn
                        dataField="id"
                        isKey={true}
                        dataAlign="center"
                        dataFormat={activeFormatter({ reajuste:this.abrirReajuste })}>Acciones</TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        dataFormat={dateFormatter}
                        dataAlign={"center"}
                        dataField="fecha" dataSort>Lote</TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={BreakLine}
                        thStyle={BreakLine}
                        width={'90px'}
                        columnClassName={'text-derecha'}
                        className={'text-derecha'}
                        dataField="cantidad" dataSort>Cantidad</TableHeaderColumn>
                </BootstrapTable>
            </div>

        )
    }

    render(){
        // const { data, loading, cargandoMovimiento, page, me,empresasSelect, detalleBodega } = this.props;
        // const { listar, search, filtro, destroy } = this.props;
        return(

            <div className="row d-flex justify-content-center">
                { this.props.toggleModal && (
                    <Modal open={this.props.toggleModal} onClose={this.closeModal} >
                        <div  style={{ Width: '100%' }}>
                            <div className="modal-header">
                            </div>
                            <div className="modal-body">

                                <LoadMask loading={this.props.cargandoMovimiento} blur_1>
                                    <ReajusteForm
                                        onSubmit={this.props.reajuste}
                                        closeModal={this.closeModal}
                                        valores={this.state.movimiento} />
                                </LoadMask>
                            </div>
                        </div>
                    </Modal>
                )
                }
                <Modal open={this.state.modal_f} onClose={this.closeModalFracciones} >
                    <div  style={{ Width: '100%' }}>
                        <div className="modal-header">
                            <div className="panel-body">
                                <span className="reset-caption">Reajuste de producto</span>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="col-12 mb-4 d-flex flex-column align-items-center bd-highlight">
                                <strong className="text-m violeta">Existencias en presentaciones</strong>
                                <strong className="rojo">{this.state.producto.nombre}</strong>
                            </div>
                            {Object.size(this.state.fracciones) <= 0 && (
                                <div className="col-12 mb-4 d-flex flex-column align-items-center bd-highlight">
                                    <p className="rojo">No existen fracciones para este producto</p>
                                </div>
                            )}
                            {Object.keys(this.state.fracciones).map((key, index)=>{
                                return (<div key={key}>
                                <div className="col-12 d-flex justify-content-center bd-highlight">
                                    <div className="col-5 col-sm-2">
                                        <strong className="text-gris">{this.state.fracciones[key]['presentacion']}</strong>
                                    </div>
                                    <div className="col-6 col-sm-2">
                                        <input type="text" className="form-control" disabled
                                               value={this.state.fracciones[key]['existencias']}/>
                                    </div>
                                </div>
                                {((Object.size(this.state.fracciones) -1) !== index) && (<div className="col-12 d-flex justify-content-center bd-highlight">
                                    <img className="flecha_fracciones" title="Abonar"
                                         src={require("../../../../../../assets/img/icons/flecha_fracciones.png")}
                                    />
                                </div>)}
                            </div>)
                            })  }
                            {Object.size(this.state.fracciones) > 0 &&(<div className="col-12 mt-3 mb-2 d-flex flex-column align-items-center bd-highlight">
                                <p className="rojo">LAS PRESENTACIONES SE BASAN EN UNIDADES CONTENIDAS!</p>
                            </div>)}
                        </div>
                    </div>
                </Modal>

                <div className="col-sm-12">



                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarBodega
                                {...this.props}
                                buscar={this.props.search}
                                titulo={'Inventario'}
                                subtitulo={''}
                                usuario={this.props.me}
                                empresas={this.props.tipoMovimientoBodega}
                                buscador={this.props.buscador}/>
                        </div>

                        <Table onPageChange={this.props.listar}
                               data={this.props.data}
                               loading={this.props.loading}
                               expandableRow={isExpandableRow}
                               expandComponent={this.expandComponent}
                               page={this.props.page}>
                            <TableHeaderColumn
                                dataField="fracciones"
                                isKey={true}
                                width={'60px'}
                                dataFormat={activeFormatter({ adicional:this.botonModal })}
                                dataAlign="center"> Fracciones </TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign={"center"}
                                dataField="nombre" dataSort>Producto</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                width={'60px'}
                                dataAlign={'right'}
                                dataField="cantidad" dataSort>Total</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                width={'60px'}
                                dataAlign={'right'}
                                dataFormat={formatoFraccion}
                                dataField="cantidad" dataSort>Fracciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                width={'60px'}
                                dataAlign={'right'}
                                dataField="cantidadss" dataSort></TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
