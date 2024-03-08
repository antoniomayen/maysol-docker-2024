import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import { editableFormater } from 'Utils/Acciones/InputGrid';
import { selectFormater } from 'Utils/Acciones/SelectGrid';
import NumberFormat from "react-number-format";
import FormGastoCuenta from '../Crear/GastoCuentaForm'
import AnulacionForm from '../Crear/formanulacion';
import HeaderGasto from '../../../Utils/Headers/headerCaja';
import Toolbar from '../../../Utils/Toolbar/ToolbarHistorico';
import Swal from 'sweetalert2';
import { timingSafeEqual } from 'crypto';
import { BootstrapTable } from 'react-bootstrap-table';
import { dateFormatter, cellTachado, dateTimeFormatter } from '../../../Utils/renderField/renderReadField';
import _ from 'lodash';
import { descripcionFormater } from 'Utils/Acciones/descripcionGrid';
import Modal from 'react-responsive-modal';
import FormDeposito from '../../Cuentas/Listar/DepositoForm';
import GastoUpdateForm from '../Update/EditarGastoCaja';
import { api } from '../../../../../api/api';
import moment from 'moment';

function formatoMoneda(cell, row) {
    return <NumberFormat decimalScale={2} fixedDecimalScale={true} value={cell !== null ? cell : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />
}
function formatFechaHora(cell, row){
    let value = cell;
    if (value) {
        const fecha = new Date(value);
        return (
            <span >{moment(value).format('DD/MM/YYYY')} {fecha.toLocaleTimeString()}</span>
        );
    }
    return (<span>{value}</span>);
}
function cellStyleFormat(cell, row) {
    return {color: row.color}
}
const   isExpandableRow=()=> {
    return true;
}
const cellEditProp = {
    mode: 'click'
};

function formatDescripcion(cell, row){
    if(cell){
        return(
            <div>
                <p className="m-0 text-capitalize">{row.noDocumento}</p>
                <p className="m-0">Hecho por: {cell}</p>
            </div>
        )
    }
}

let categorias = [];
const getCategorias = (search) => {

    return api.get(`categorias`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.results.forEach(item => {
            if(!_.find(categorias, {id: item.id})) {
                categorias.push(item);
            }
        });
        return { options: categorias}
    })
}
let empresas = [];


export default class HistoricoGrid extends React.Component {

    state = {
        deposito: 1,
        idMovimiento: null,
        editable: false,
        comentarios:[],
        proveedor: 0,
        movimiento:{},
        mes: null,
        anio: null,
        cerrado: false
    }
    componentWillMount() {
        // this.props.listarGastosCuenta(1,this.props.match.params.id);
        getCategorias('');
        this.getEmpresas('');
    }
    calcularSaldo = ( cell, row, columnIndex,rowIndex) => {
        let saldo = 0;
        let movimientos = _.cloneDeep(row.data)
        let movimientos_calc = []
        movimientos_calc = movimientos.slice(0, rowIndex+1)

        let noAnulados = [];
        movimientos_calc.forEach(row => {
            if(row.anulado){

            }else{
                noAnulados.push(row)
            }
        })
        let debe = 0;
        let haber = 0;
        noAnulados.forEach(row => {
            debe += row.debe;
            haber += row.haber;
        });


        saldo = debe -haber;
        return <NumberFormat decimalScale={2} fixedDecimalScale={true}
        value={saldo !== null ? saldo.toFixed(2) : 0} displayType={'text'} thousandSeparator={true} prefix={'Q'} />

    }
    handleEditar = () => {
        this.setState({editable: !this.state.editable})
    }
    enviarUpdateData = () => {
        this.props.editarMovimiento(this.props.cierre)
    }
    abrirUpdateGasto = (id, row) => {
        this.props.setFormGasto(row);
        let fecha = new Date(row.fechaInicio);
        let mes = fecha.getMonth() + 1;
        let anio = fecha.getFullYear();
        this.setState({
            modal: 6,
            movimiento: row,
            proveedor: row.proveedor,
            mes: mes,
            anio: anio,
            cerrado: row.cerrado
        });
        this.openModal();
    }

    componentDidUpdate(prevProps, prevState){

    }
    handleEditar = () => {
        this.setState({editable: !this.state.editable})
    }
    openModal = () => {
        this.props.setToggleModalHistoria(true);
    }
    closeModal = () => {
        this.props.setToggleModalHistoria(false);
    }
    getEmpresas = (search) => {
        empresas = [];
        return api.get(`proyectos/getEmpresas/`).catch((error) => {
            console.log("Error al leer cuentas.");
        }).then((data) => {
            data.forEach(item => {
                if (!_.find(empresas, { value: item.id })) {
                    empresas.push({value: item.id, label: item.nombre, style:{fontWeight: 'bold'}})
                }
                item.empresas.forEach(subempresa => {
                    if (!_.find(empresas, { value: subempresa.id })) {
                        empresas.push({value: subempresa.id, label: subempresa.nombre, subempresa: subempresa.subempresa,style: { paddingLeft: '2em' } });
                    }
                })
            });

            return { options: empresas }
        })
    }
    expandComponent = (row) => {
        let data = row && row.movimientos ? row.movimientos : [];
        let movimientos = _.cloneDeep(data);
        let copia_movimiento = _.cloneDeep(movimientos)
        movimientos.forEach( movimiento =>{
            movimiento.inicio = row.inicio
            movimiento.data = copia_movimiento
            movimiento.cerrado = row.cerrado;
            movimiento.fechaInicio = row.fechaInicio
        })
        // const movimientos = []
        const { me } = this.props
        return(
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ movimientos }>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                width={'90px'}
                                dataFormat={activeFormatter({  editar: this.abrirUpdateGasto })}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300, padding:5}}
                                width={85}
                                dataFormat={dateFormatter}
                                editable={ false }
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                               tdStyle={{whiteSpace: 'normal', padding: 5, minWidth:450}}
                               thStyle={{minWidth:450}}
                               columnClassName='td-column-string-example'
                               className='td-header-string-example'
                               dataFormat={descripcionFormater({})}
                                dataField="descripcion" dataSort>Descripción</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                editable={ false }
                                dataField="descDestino" dataSort>Destino</TableHeaderColumn>
                            {
                                me.accesos.administrador && (
                                    <TableHeaderColumn
                                    dataField="comentario"
                                    tdStyle={cellTachado}
                                    columnClassName='td-column-string-example'
                                    className='td-header-string-example'
                                    thStyle={{minWidth:300}}
                                     dataSort>Comentario</TableHeaderColumn>

                                )
                            }
                           {
                               me.accesos.administrador &&(
                                <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                editable={ false }
                                dataField="nombreCategoria" dataSort>Categoria</TableHeaderColumn>
                               )
                           }
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                editable={ false }
                                width={90}
                                columnClassName={'text-derecha'}
                                dataField="debe" dataSort>Debe</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                editable={ false }
                                width={90}
                                columnClassName={'text-derecha'}
                                dataField="haber" dataSort>Haber</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={this.calcularSaldo}
                                editable={ false }
                                width={90}
                                columnClassName={'text-derecha'}
                                dataField="saldo" dataSort>Saldo</TableHeaderColumn>
                </BootstrapTable>
            </div>

        )
    }
    guardarCelda = (id, data) =>{
        this.props.editarComentario(id, data);
    }

    render() {
        const {  dataHistorico, loader, pageHistorico, infoCierre, duenioGastos, me, idcaja } = this.props;
        const {
            getHistorico,
            buscarEstado
        } = this.props;
        let data = {
            count: 0,
            results: []
        }
        return(
            <div className="row d-flex justify-content-center">

                { this.props.toggleModalHistoria && (
                    <Modal open={this.props.toggleModalHistoria} onClose={this.closeModal}>
                        <div style={{maxWidth: '100%'}}>
                            <div className="modal-header">
                                <div className="panel-body">
                                        <span className="reset-caption">Editar Movimiento</span>
                                </div>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.proveedor ? (
                                        <GastoUpdateForm
                                            usuario={me}
                                            empresas={empresas}
                                            cerrado={this.state.cerrado}
                                            onSubmit={this.enviarUpdateData}
                                            movimiento={this.state.movimiento}
                                            closeModal= {this.closeModal}/>
                                    ): (
                                        <FormDeposito
                                            anio={this.state.anio}
                                            month={this.state.mes}
                                            usuario={me}
                                            editar={true}
                                            cerrado={this.state.cerrado}
                                            movimiento={this.state.movimiento}
                                            onSubmit={this.enviarUpdateData} closeModal={this.closeModal} />
                                    )
                                }

                            </div>
                        </div>
                    </Modal>
                )}
                <div className="col-sm-12 p-0">
                    <div className="grid-container">

                        <div className="grid-title d-flex flex-row borde-superior">
                        <Toolbar
                                buscar={buscarEstado}
                                titulo={duenioGastos.nombre}
                                subtitulo={"Historia"}
                                handleEditar={this.handleEditar}
                                usuario={me}
                                editable={this.state.editable}
                                buscador={this.props.buscadorHistorico}/>
                        </div>
                        <Table
                            onPageChange={(page) =>{getHistorico(page, idcaja)}}
                            data={dataHistorico}
                            loading={loader}
                            expandableRow={isExpandableRow}
                            expandComponent={this.expandComponent}
                            page={pageHistorico}>
                            <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatFechaHora}
                                dataField="fechaInicio" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatDescripcion}
                                dataField="deposita" dataSort>Descripcion</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="anterior" dataSort>Monto anterior</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="inicio" dataSort>Monto inicial</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="fin" dataSort>Monto Final</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="usuario" dataSort>Cierra</TableHeaderColumn>


                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}



