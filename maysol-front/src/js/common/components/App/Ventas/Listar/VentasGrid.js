import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import Toolbar from '../../../Utils/Toolbar/ToolbarUsuarios';
import ToolbarVenta from '../../../Utils/Toolbar/ToolbarVentas';

import {  formatoMoneda, dateFormatter } from '../../../Utils/renderField/renderReadField'
import HeaderVenta from '../../../Utils/Headers/headerVenta';
import { BootstrapTable } from 'react-bootstrap-table';
import Modal from 'react-responsive-modal';
import LoadMask from 'Utils/LoadMask';
import Form from './Formularios/cierreVenta';
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize';
import moment from 'moment';
import es from 'moment/locale/es';
import 'react-dates/lib/css/_datepicker.css';
import Swal from 'sweetalert2';

// Configuración para el módulo de ventas
const STORAGE_KEY = 'ventas_current_page';
const MODULE_KEY = 'current_module';
const VENTAS_MODULE = 'ventas_module';

// Utilidad para detectar si estamos en el módulo de ventas
const isInVentasModule = () => {
    const path = window.location.hash || window.location.pathname;
    return path.includes('/venta'); // Detecta /ventas, /venta/123, /venta/crear, etc.
};

function formatoAbonos(cell, row) {
    const pagos_monedas = {};
    row.pagos.forEach((pago) => {
        if (!isNaN(pago.monto)){
            // No sumar si esta anulado
            if (!pago.anulado){
                if(pagos_monedas.hasOwnProperty(pago.simbolo)){
                    pagos_monedas[pago.simbolo] = pagos_monedas[pago.simbolo] + parseFloat(pago.monto);
                } else {
                    pagos_monedas[pago.simbolo] = parseFloat(pago.monto);
                }
            }
        }
    });
    return <div>{Object.keys(pagos_monedas).map((key) => {
        return <div key={key}>{formatoMoneda(pagos_monedas[key], key)}</div>
    })}</div>
}

function formatoSaldo(cell, row) {
    const pagos_monedas = {};
    row.pagos.forEach((pago) => {
        if (!isNaN(pago.monto)){
            // No sumar si esta anulado
            if (!pago.anulado){
                if(pagos_monedas.hasOwnProperty(pago.simbolo)){
                    pagos_monedas[pago.simbolo] = pagos_monedas[pago.simbolo] + parseFloat(pago.monto);
                } else {
                    pagos_monedas[pago.simbolo] = parseFloat(pago.monto);
                }
            }
        }
    });
    return <div>{Object.keys(pagos_monedas).map((key) => {
        return <div key={key}>{formatoMoneda(Number(cell) - pagos_monedas[key], key)}</div>
    })}</div>
}

const isExpandableRow = () => {
    return true;
};

function clienteFormatter(cell, row) {
    if (row.cliente !== null){
        return <div>{row.cliente.nombre}</div>
    }
}

function montoFormater(cell, row) {
    if (row.monto !== null && row.simbolo !== null){
        return <div>{formatoMoneda(row.monto, row.simbolo)}</div>
    }
}

function pagoFormater(cell) {
    return <div>{cell ? 'Pago inmediato' : 'Pago al crédito'}</div>
}

function entregadaFormater(cell) {
    return cell ? <i className="icons-oc text-verde-claro fa fa-check-circle" aria-hidden="true" /> :
        <i className="icons-oc text-celeste fa fa-times-circle"/>
}

function pago_completoFormater(cell) {
    return cell ? <i className="icons-oc text-verde-claro fa fa-check-circle" aria-hidden="true" /> :
        <i className="icons-oc text-celeste fa fa-times-circle"/>
}

function formatoOrden(cell, row){
    if(cell){
        return(
            <div>
                <p className="m-0">{cell}</p>
                <p className="m-0">Hecho por:</p>
                <p className="m-0">{row.usuario}</p>
            </div>
        )
    }
}

function cellTachado(cell, row) {
    if(row.anulado){
        return {textDecoration: "line-through", whiteSpace: 'normal', }
    }
    return {whiteSpace: 'normal'}
}

export default class VentasGrid extends React.Component {

    state = { user: false };

    // Función para gestionar el estado del módulo de ventas
    checkModuleAndResetIfNeeded = () => {
        const lastModule = sessionStorage.getItem(MODULE_KEY);

        // Si estamos en el módulo de ventas
        if (isInVentasModule()) {
            // Si venimos de otro módulo diferente, resetear
            if (lastModule && lastModule !== VENTAS_MODULE) {
                sessionStorage.removeItem(STORAGE_KEY);
                console.log(`Reseteando página de ventas. Venimos de: ${lastModule}`);
            }

            // Marcar que estamos en ventas
            sessionStorage.setItem(MODULE_KEY, VENTAS_MODULE);
        }
    }

    // Función para manejar cambio de página con persistencia
    handlePageChange = (page, sizePerPage) => {
        console.log('Guardando página de ventas:', page);
        sessionStorage.setItem(STORAGE_KEY, page.toString());
        this.props.listar(page, sizePerPage);
    }

    abrirDialog = (id) => {
        // Guardar página antes de abrir el modal
        const currentPage = this.props.page || 1;
        sessionStorage.setItem(STORAGE_KEY, currentPage.toString());

        Swal({
            title: 'Anular venta',
            text: 'Justifique la anulación',
            input: 'text',
            type: 'warning',
            showCancelButton: true,
            confirmButtonClass: 'btn-force btn-primary m-1',
            cancelButtonClass: 'btn-force btn-secondary m-1',
            confirmButtonText: 'Sí, Anular',
            cancelButtonText: 'No, cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                const justificacion = result.value;
                this.props.borrar(id, justificacion);
            }
        });
    };

    constructor(props) {
        super(props);
        this.abonarVenta = this.abonarVenta.bind(this)
    }

    componentWillMount() {
        // Verificar módulo y resetear si es necesario
        this.checkModuleAndResetIfNeeded();

        // Restaurar página guardada (solo si seguimos en ventas)
        const savedPage = sessionStorage.getItem(STORAGE_KEY);
        const pageToLoad = savedPage ? parseInt(savedPage) : 1;

        console.log(`Cargando página ${pageToLoad} de ventas`);

        this.props.getProductos(false);
        this.props.getProveedores();
        this.props.listar(pageToLoad); // Usar página guardada
        this.props.getEmpresasSelect();
        this.props.getVendedoresSelect();

        if( this.props.me.accesos.administrador){
            this.props.getCuentasBancariasSelect();
        }
        if (this.props.me.id && this.props.me.is_superuser == false) {
            this.setState({ user: true });
            const user = { label: this.props.me.nombreCompleto, value: this.props.me.id };
            this.props.set_filtro_vendedores(user);
        }
    }

    componentWillUnmount() {
        // Solo resetear si realmente salimos del módulo de ventas
        setTimeout(() => {
            if (!isInVentasModule()) {
                sessionStorage.setItem(MODULE_KEY, 'other');
                console.log('Salimos del módulo de ventas');
            }
        }, 100);
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.user === false && nextProps.me.id
            && nextProps.me.id && nextProps.me.is_superuser == false) {
            console.log("daaaa", nextProps.me);
            this.setState({ user: true });
            const user = { label: nextProps.me.nombreCompleto, value: nextProps.me.id };
            this.props.set_filtro_vendedores(user);
        }
    }

    // Función para navegar a editar (si necesitas personalizar la navegación)
    navegarAEditar = (id) => {
        const currentPage = this.props.page || 1;
        sessionStorage.setItem(STORAGE_KEY, currentPage.toString());

        if (this.props.history) {
            this.props.history.push(`/venta/editar/${id}`);
        } else {
            window.location.href = `#/venta/${id}/`;
        }
    }

    abonarVenta(id) {
        return (<img onClick={(e)=>{ e.preventDefault(); console.log("ID", id)}} className="action-img" title="Abonar"
                     src={require("../../../../../../assets/img/icons/abonos.png")} alt="Abonar" />)
    }

    nombreMultiplo = (cell, row) => {
        let nombre = cell;
        try {
            nombre = `${cell}-${row.stock.presentacion}`
        } catch (error) {

        }
        return (<span>{nombre}</span>)
    }

    expandComponent = (row) => {
        let data = row && row.productos ? row.productos : [];
        let multiplo = _.cloneDeep(data);

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
                        editable={ false }
                        dataFormat={this.nombreMultiplo}
                        dataField="producto_nombre" dataSort>Producto</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        columnClassName='text-derecha'
                        className='text-center'
                        dataField="cantidad" dataSort>Cantidad</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        dataFormat={formatoMoneda}
                        columnClassName='text-derecha'
                        className='text-center'
                        dataField="precio_costo" dataSort>Costo</TableHeaderColumn>
                    <TableHeaderColumn
                        dataAlign="right"
                        thStyle={BreakLine}
                        dataFormat={formatoMoneda}
                        columnClassName='text-derecha'
                        className='text-center'
                        dataField="subtotal" dataSort>Subtotal</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    };

    openModal = () =>{
        const { cajaVenta } = this.props;
        this.props.setFormCierreVenta({
            monto: cajaVenta.saldo,
            nombreFormulario:'apertura'
        });
        this.props.openModalCierre();
    }

    render(){
        const { page, me,empresasSelect, data, loader_v, loaderModal, cajaVenta, modalCierre } = this.props;
        const { search, filtro, borrar, productos } = this.props;

        return(
            <div className="row d-flex justify-content-center">
                { modalCierre && (
                    <Modal open={modalCierre} onClose={this.props.closeModalCierre} >
                        <div  style={{ Width: '100%' }}>
                            <div className="modal-header">
                                <div className="panel-body">
                                    <span className="reset-caption">CIERRE DE CAJA DE VENTA</span>
                                </div>
                            </div>
                            <div className="modal-body">
                                <LoadMask loading={loaderModal} blur_1>
                                    <Form
                                        {...this.props}
                                        onSubmit={this.props.cierreCajaVenta}
                                        closeModal={this.props.closeModalCierre} />
                                </LoadMask>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="col-sm-12">
                    <HeaderVenta
                        admin={this.props.me.is_superuser}
                        instruccion="¡Ingresa una venta!"
                        texto="Agregar venta"
                        ruta="/venta/crear"
                        funcion1={this.openModal}
                        saldo={cajaVenta.saldo}
                        saldoUser={cajaVenta.saldoUser}
                        inicio={cajaVenta.inicio}
                        simbolo={cajaVenta.simbolo}
                        dias7={cajaVenta.dias7}
                        dias15={cajaVenta.dias15}
                        mes={cajaVenta.mes}
                        total={cajaVenta.dias7 + cajaVenta.dias15 + cajaVenta.mes}
                    />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarVenta
                                {...this.props}
                                buscar={search}
                                titulo={"Ventas"}
                                usuario={me}
                                empresas={empresasSelect}
                                cambiarFiltro={filtro}
                                cambiarPendientes={this.props.set_filtro_pendites}
                                filtro_pendientes={this.props.filtro_pendientes}
                                cambiarVendedores={this.props.set_filtro_vendedores}
                                filtro_vendedores={this.props.filtro_vendedores}
                                filtro={this.props.fitro_ventas}
                                ventas={true}
                                vendedores={this.props.vendedores}
                                cuentasBancarias={this.props.cuentasBancarias}
                                buscador={this.props.buscador}/>
                        </div>

                        <Table
                            onPageChange={this.handlePageChange} // CAMBIO: usar función personalizada
                            data={data}
                            loading={loader_v}
                            expandableRow={isExpandableRow}
                            expandComponent={this.expandComponent}
                            page={page}>

                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({
                                    editar: '/venta',
                                    eliminarModal: this.abrirDialog,
                                    popover:'getRow'
                                })}>
                                Acciones
                            </TableHeaderColumn>

                            <TableHeaderColumn
                                dataFormat={formatoOrden}
                                tdStyle={cellTachado}
                                dataField="numero_oc" dataSort>No. Orden</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={clienteFormatter}
                                dataField="cliente" dataSort>Cliente</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={dateFormatter}
                                dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={pagoFormater}
                                dataField="pago_automatico" dataSort>Tipo de pago</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={montoFormater}
                                dataAlign="right"
                                dataField="monto" dataSort>Monto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoAbonos}
                                dataAlign="right"
                                dataField="monto" dataSort>Pagos</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoSaldo}
                                dataAlign="right"
                                dataField="monto" dataSort>Saldo</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign="center"
                                dataFormat={entregadaFormater}
                                dataField="ingresado" dataSort>Entregada</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={BreakLine}
                                thStyle={BreakLine}
                                dataAlign="center"
                                dataFormat={pago_completoFormater}
                                dataField="pago_completo" dataSort>Pago completo</TableHeaderColumn>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
