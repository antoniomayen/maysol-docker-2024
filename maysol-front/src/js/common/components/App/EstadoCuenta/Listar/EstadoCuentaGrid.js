import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine, alingMoney } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import { editableFormater } from 'Utils/Acciones/InputGrid';
import { selectFormater } from 'Utils/Acciones/SelectGrid';
import { descripcionFormater } from 'Utils/Acciones/descripcionGrid';
import { inputSimpleFormater } from 'Utils/Acciones/inputSimpleGrid'
import { initialize as initializeForm } from 'redux-form'

import Modal from 'react-responsive-modal';
import NumberFormat from "react-number-format";
import FormDeposito from '../../Cuentas/Listar/DepositoForm';
import FormDepositoCaja from '../Crear/DepositoCajaForm';
import FormRetiro from '../../Gastos/Crear/RetiroForm';
import RetiroUpdateForm from '../Update/EditarGastoCuenta';
import ToolbarEstado from '../../../Utils/Toolbar/ToolbarEstado';
import HeaderEstado from '../../../Utils/Headers/headergastos';
import Swal from 'sweetalert2';
import { dateFormatter } from '../../../Utils/renderField/renderReadField';
import CierreCuenta from './CierreCuenta';
import VerDocumento from './verDocumento';
import AnulacionForm from '../../Gastos/Crear/formanulacion';
import _ from 'lodash';
import { api } from '../../../../../api/api';
import DepositoCajaForm from '../Crear/DepositoCajaForm';
import LoadMask from 'Utils/LoadMask';

function cellStyleFormat(cell, row) {
    return {color: row.color}
}
function cellTachado(cell, row) {
    if(row.anulado){
        return {textDecoration: "line-through", whiteSpace: 'normal', padding: 5}
    }
    return {whiteSpace: 'normal', padding: 5}
}
function formatoDesc(cell, row) {
   return (
       <div>
           {row.formaPago && (<p className="m-0">
               <b>Forma de pago:</b> {row.nombrePago} - {row.noDocumento}
           </p>)}
           {row.proyectoAfectado && (<p className="m-0">
               <b>Gasto de:</b> {row.proyectoAfectado}
           </p>)}
           <p className="m-0">
               <b>Motivo:</b> {row.concepto}
           </p>
       </div>
   )
}

const cellEditProp = {
    mode: 'click'
  };
let categorias = [];
const getCategorias = (search) => {

    return api.get(`categorias/getTodasCategorias`, {search}).catch((error) => {
        console.log("Error al leer cuentas.");
    }).then((data) => {
        data.forEach(item => {
            if(!_.find(categorias, {id: item.id})) {
                categorias.push(item);
            }
        });
        return { options: categorias}
    })
}
let empresas = [];


export default class EstadoCuentaGrid extends React.Component {
    state = {
        deposito: 1,
        idMovimiento: null,
        editable: false,
        comentarios:[],
        movimiento: {},
        destino: 20
    }
    formatoMoneda = (cell, row) => {
        let moneda = this.props.simbolo || 'Q'
        return <NumberFormat
            decimalScale={2}
            fixedDecimalScale={true}
            value={cell !== null ? cell.toFixed(2) : 0}
            displayType={'text'}
            thousandSeparator={true}
            prefix={moneda} />
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
    componentWillMount() {
        this.getEmpresas('');
        this.props.getCuenta(this.props.match.params.id);
        getCategorias('');
    }
    recargarData = () =>{
        this.props.getCuenta(this.props.match.params.id);
    }
    guardarCelda = (id, data) =>{
        this.props.editarComentario(id, data);
    }
    componentDidUpdate(prevProps, prevState){
        const { comentariosEstado } = this.props;
        if(this.state.editable !== prevState.editable && prevState.editable !== undefined){

            if (!this.state.editable && comentariosEstado.length > 0) {
                Swal({
                    title: '¿Desea guardar los cambios?',
                    text: 'Se guardará los comentarios y las categorías de cada movimiento.',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No',
                    reverseButtons: true
                }).then((result) => {
                    if(result.value){
                        this.props.editarComentario()
                    }
                })
            }
        }
    }
    handleEditar = () => {
        this.setState({editable: !this.state.editable})
    }

    openModal = () => {
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }
    enviarDataDeposito = () =>{
        this.props.crearMovimiento(this.props.match.params.id, 10);
    }
    enviarDataRetiro = () => {
        this.props.crearMovimiento(this.props.match.params.id, 30);
    }
    enviarAnulacion = (id) => {
        this.props.anular(this.state.idMovimiento)
    }
    abrirReportar = () =>{
        const {me} = this.props;
        let retiro={
            proyecto: me.idProyecto,
            persona: me.id
        }
        this.props.setFormulario(retiro);
        this.setState({ deposito: 2 })
        this.openModal()
    }
    abrirUpdateReportar = (id, row) => {
        this.props.setFormGasto(row);
        // si tiene depositante mostrar la vista de edición de deposito
        // de lo contrario (7) edición de gasto
        const vista = row.depositante ? 8 :  row.destino === 10 ? 9 : 7;
        this.setState({ deposito:vista, movimiento:row, destino: row.destino });
        this.openModal();
    }
    abrirDeposito = () => {
        this.setState({ deposito: 1 })
        this.openModal()
    }
    abrirDepositoCaja = () => {
        this.setState({ deposito: 6 })
        this.openModal()
    }
    abrirAnulacion = (id) => {
        this.setState({deposito:3});
        this.setState({idMovimiento: id});
        this.openModal();
    }
    cambiarMes = (e) => {
        this.props.cambiarMes(e);
    }
    cambiarAnio = (e) => {
       this.props.cambiarAnio(e);
    }
    calcularSaldo = ( cell, row, columnIndex,rowIndex) => {
        let moneda = this.props.simbolo || 'Q'
        let saldo = 0;
        let movimientos = _.cloneDeep(this.props.dataEstadocuenta.results)
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
        return <NumberFormat
            decimalScale={2}
            fixedDecimalScale={true}
            value={saldo !== null ? saldo.toFixed(2) : 0}
            displayType={'text'}
            thousandSeparator={true}
            prefix={moneda} />

    }

    addComentarios = (value) => {
        this.props.verficarDatosComentario(value);
    }
    abrirComprobante = () =>{
        this.setState({deposito:5})
        this.openModal()

    }
    cierrecuenta = () => {
        this.setState({deposito:4});
        this.openModal();
    }

    render() {
        const {
            dataEstadocuenta,
            cargando, toggleModal,
            page, activo,
            meEstadocuenta,
            me, loaderMovimiento,
            saldo, cuenta, anio, mes,simbolo } = this.props;
        const { listarEstado, buscarEstado,cambiarFiltro, editarComentario } = this.props;
        return(
            <div className="row d-flex justify-content-center">
                { this.props.toggleModal && (
                    <Modal open={this.props.toggleModal} onClose={this.closeModal} >
                        <div  style={{ Width: '100%' }}>
                            <div className="modal-header">
                                <div className="panel-body">
                                    {
                                        this.state.deposito === 1 &&
                                        <span className="reset-caption">Depósito Bancario</span>
                                    }
                                    {
                                        this.state.deposito === 2 &&
                                        <span className="reset-caption">Reportar Gasto</span>
                                    }
                                    {
                                        this.state.deposito === 3 &&
                                        <span className="reset-caption">Anulación</span>
                                    }
                                    {
                                        this.state.deposito === 4 &&
                                        <span className="reset-caption">Cierre de cuenta</span>
                                    }
                                    {
                                        this.state.deposito === 5 &&
                                        <span className="reset-caption">Comprobante</span>
                                    }
                                    {
                                        this.state.deposito === 6 &&
                                        <span className="reset-caption">Depósito a caja</span>
                                    }
                                    {
                                        this.state.deposito === 7 &&
                                        <span className="reset-caption">Editar Movimiento</span>
                                    }
                                    {
                                        this.state.deposito === 8 &&
                                        <span className="reset-caption">Editar Depósito</span>
                                    }
                                    {
                                        this.state.deposito === 9 &&
                                        <span className="reset-caption">Editar Depósito a caja</span>
                                    }
                                </div>
                            </div>
                            <div className="modal-body">
                                    {
                                        this.state.deposito === 1 && (
                                            <LoadMask loading={loaderMovimiento} blur_1>
                                                <FormDeposito
                                                    anio={anio}
                                                    month={mes}
                                                    usuario={meEstadocuenta}
                                                    {...this.props}
                                                    onSubmit={this.enviarDataDeposito} closeModal={this.closeModal} />
                                            </LoadMask>
                                        )
                                    }
                                    {
                                        this.state.deposito === 8 && (
                                            <LoadMask loading={loaderMovimiento} blur_1>
                                                <FormDeposito
                                                    anio={anio}
                                                    month={mes}
                                                    cerrado={cuenta.cerrado}
                                                    usuario={meEstadocuenta}
                                                    editar={true}
                                                    {...this.props}
                                                    movimiento={this.state.movimiento}
                                                    onSubmit={this.props.editarMovimiento} closeModal={this.closeModal} />
                                            </LoadMask>
                                        )
                                    }
                                    {
                                        this.state.deposito === 9 && (
                                            <LoadMask loading={loaderMovimiento} blur_1>
                                                <FormDepositoCaja
                                                    anio={anio}
                                                    month={mes}
                                                    cerrado={cuenta.cerrado}
                                                    usuario={meEstadocuenta}
                                                    editar={true}
                                                    {...this.props}
                                                    movimiento={this.state.movimiento}
                                                    onSubmit={this.props.editarMovimiento} closeModal={this.closeModal} />
                                            </LoadMask>
                                        )
                                    }
                                    {
                                        this.state.deposito === 6 && (
                                            <LoadMask loading={loaderMovimiento} blur_1>
                                                <FormDepositoCaja
                                                anio={anio}
                                                month={mes}
                                                usuario={meEstadocuenta}
                                                {...this.props}
                                                onSubmit={this.enviarDataDeposito} closeModal={this.closeModal} />
                                            </LoadMask>
                                        )
                                    }
                                    {
                                        this.state.deposito  === 2 && (
                                            <LoadMask loading={loaderMovimiento} blur_1>
                                                 <FormRetiro
                                                    anio={anio}
                                                    usuario={meEstadocuenta}
                                                    month={mes}
                                                    empresas={empresas}
                                                    {...this.props}
                                                    onSubmit={this.enviarDataRetiro} closeModal={this.closeModal} />
                                            </LoadMask>
                                        )

                                    }
                                    {
                                        this.state.deposito === 3 &&(
                                            <LoadMask loading={loaderMovimiento} blur_1>
                                                <AnulacionForm
                                                    {...this.props}
                                                    onSubmit={this.enviarAnulacion}
                                                    closeModal={this.closeModal} />
                                            </LoadMask>
                                        )
                                    }
                                    {
                                        this.state.deposito === 4 &&
                                        <CierreCuenta {...this.props}
                                        cuenta={cuenta}
                                        {...this.props}
                                        closeModal={this.closeModal}
                                        recargarData={this.recargarData} />

                                    }
                                    {
                                        this.state.deposito === 5 &&
                                        <VerDocumento {...this.props}
                                        cierre={cuenta}
                                        closeModal={this.closeModal}/>
                                    }
                                     {
                                        this.state.deposito  === 7 && (
                                            <div>
                                                {
                                                    this.state.destino === 50 ? (
                                                        <LoadMask loading={loaderMovimiento} blur_1>
                                                            {/* <FormDeposito
                                                            anio={anio}
                                                            month={mes}
                                                            usuario={meEstadocuenta}
                                                            editar={true}
                                                            cerrado={cuenta.cerrado}
                                                            {...this.props}
                                                            movimiento={this.state.movimiento}
                                                            onSubmit={this.props.editarMovimiento} closeModal={this.closeModal} /> */}
                                                            <RetiroUpdateForm
                                                            anio={anio}
                                                            usuario={meEstadocuenta}
                                                            month={mes}
                                                            cerrado={cuenta.cerrado}
                                                            empresas={empresas}
                                                            {...this.props}
                                                            movimiento={this.state.movimiento}
                                                            onSubmit={this.props.editarMovimiento} closeModal={this.closeModal} />
                                                        </LoadMask>
                                                    ) : (
                                                        <LoadMask loading={loaderMovimiento} blur_1>
                                                            <RetiroUpdateForm
                                                            anio={anio}
                                                            usuario={meEstadocuenta}
                                                            month={mes}
                                                            cerrado={cuenta.cerrado}
                                                            empresas={empresas}
                                                            {...this.props}
                                                            movimiento={this.state.movimiento}
                                                            onSubmit={this.props.editarMovimiento} closeModal={this.closeModal} />
                                                        </LoadMask>

                                                    )
                                                }

                                            </div>

                                        )



                                    }
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="col-sm-12 pt-2">


                    <div className="grid-container tabla-70">
                        {
                            !this.state.editable && (
                                <HeaderEstado
                                    cambiarMes={this.cambiarMes}
                                    cambiarAnio={this.cambiarAnio}
                                    anio={anio}
                                    mes={mes}
                                    usuario={meEstadocuenta}
                                    saldo={saldo}
                                    texto1={"Cierre de cuenta"}
                                    image1={require("../../../../../../assets/img/buttons/cierre_estado_cuenta.png")}
                                    funcion1={this.cierrecuenta}
                                    funcion2={this.abrirReportar}
                                    image2={require('../../../../../../assets/img/buttons/retiro_estado_cuenta.png')}
                                    texto2={"Reportar gasto"}
                                    texto3={"Hacer depósito"}
                                    image3={require('../../../../../../assets/img/buttons/deposito_estado_cuenta.png')}
                                    funcion3={this.abrirDeposito}
                                    texto4={"Depósito a caja"}
                                    image4={require('../../../../../../assets/img/buttons/deposito_estado_cuenta.png')}
                                    funcion4={this.abrirDepositoCaja}
                                    cierre={cuenta}
                                    abrirComprobante={this.abrirComprobante}
                                    simbolo={simbolo}
                                    />
                            )
                        }


                        <div className=" borde-superior row col-12 m-0">
                            <ToolbarEstado
                                buscar={buscarEstado}
                                titulo={cuenta.nombre}
                                usuario={meEstadocuenta}
                                filtro={activo}
                                subtitulo={"estado de cuenta"}
                                buscador={this.props.buscador}
                                cambiarFiltro={cambiarFiltro}
                                opcion1={"Retiro"}
                                opcion2={"Depósito"}
                                categorias={categorias}
                                handleEditar={this.handleEditar}
                                editable={this.state.editable}
                                cambiarAnulados={this.props.cambiarActivo}
                                filtro_anulados={this.props.filtroActivo}

                                />
                        </div>
                        <Table onPageChange={listarEstado} data={dataEstadocuenta}
                             pagination={false}
                            loading={cargando} page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                editable={ false }
                                dataFormat={activeFormatter({ editar: this.abrirUpdateReportar, eliminarModal: this.abrirAnulacion, popover:'getRow' })}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300, padding:5}}
                                width={'85px'}
                                dataFormat={dateFormatter}
                                editable={ false }
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>

                            <TableHeaderColumn
                               tdStyle={{whiteSpace: 'normal', padding: 5, minWidth:450}}
                               thStyle={{minWidth:450}}
                               columnClassName='td-column-string-example'
                               className='td-header-string-example'
                               dataFormat={formatoDesc}
                                dataField="descripcion" dataSort>Descripción</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                editable={ false }
                                dataField="descDestino" dataSort>Destino</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={alingMoney}
                                dataFormat={this.formatoMoneda}
                                editable={ false }
                                width={'90px'}
                                columnClassName={'text-derecha'}
                                dataField="debe" dataSort>Debe</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={this.formatoMoneda}
                                editable={ false }
                                width={'90px'}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="haber" dataSort>Haber</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={this.calcularSaldo}
                                editable={ false }
                                width={'90px'}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="saldo" dataSort>Saldo</TableHeaderColumn>


                            {
                               meEstadocuenta.accesos.administrador && (
                                <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                editable={ false }
                                dataField="nombreCategoria" dataSort>Categoria</TableHeaderColumn>
                               )
                           }
                            {
                                meEstadocuenta.accesos.administrador && (
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
                                meEstadocuenta.accesos.administrador && (

                                    <TableHeaderColumn
                                    dataField="plazo"
                                    tdStyle={cellTachado}
                                    thStyle={{minWidth:300}}
                                    width={"150px"}
                                    dataFormat={inputSimpleFormater({ editable: this.state.editable, addComentarios: this.addComentarios })}
                                     dataSort>Plazo</TableHeaderColumn>
                                )
                            }
                        </Table>

                    </div>

                </div>
            </div>
        )
    }
}
