import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import ToolbarVenta from '../../../Utils/Toolbar/ToolbarVentas';
import {
    formatoMoneda,
    dateFormatter,
    RenderCurrency, dateFormatterTimeZone,
} from '../../../Utils/renderField/renderReadField';
import { BootstrapTable } from 'react-bootstrap-table';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import Swal from 'sweetalert2';
import HeaderReporte from 'Utils/Headers/HeaderReporte';

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
const isExpandableRow=()=> {
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

    abrirDialog = (id) => {
        Swal({
            title: 'Anular compra',
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
        this.props.getProductos(false);
        this.props.getProveedores();
        this.props.listar();
        this.props.getEmpresasSelect();
        this.props.getVendedoresSelect();
        if (this.props.me.id && this.props.me.is_superuser == false) {
            this.setState({ user: true });
            const user = { label: this.props.me.nombreCompleto, value: this.props.me.id };
            this.props.set_filtro_vendedores(user);
        }
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
    };

    expandComponent = (row) => {
        let data = row && row.productos ? row.productos : [];
        let multiplo = _.cloneDeep(data);
        return (
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={{ backgroundColor: '#e24647' }}
                    data={ multiplo }
                >
                    <TableHeaderColumn
                        hidden
                        isKey={true}
                        dataField="id"
                        dataSort
                    >
                        Id
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        editable={false}
                        dataFormat={this.nombreMultiplo}
                        dataField="producto_nombre"
                        dataSort
                    >
                        Producto
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        columnClassName="text-derecha"
                        className="text-center"
                        dataField="cantidad"
                        dataSort
                    >
                        Cantidad
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={BreakLine}
                        dataFormat={formatoMoneda}
                        columnClassName="text-derecha"
                        className="text-center"
                        dataField="precio_costo"
                        dataSort
                    >
                        Costo
                    </TableHeaderColumn>
                    <TableHeaderColumn
                        dataAlign="right"
                        thStyle={BreakLine}
                        dataFormat={formatoMoneda}
                        columnClassName="text-derecha"
                        className="text-center"
                        dataField="subtotal"
                        dataSort
                    >
                        Subtotal
                    </TableHeaderColumn>
                </BootstrapTable>
            </div>
        );
    };

    openModal = () => {
        const { cajaVenta } = this.props;
        this.props.setFormCierreVenta({
            monto: cajaVenta.saldo,
            nombreFormulario:'apertura'
        });
        this.props.openModalCierre();
    };

    render() {
        const { page, me,empresasSelect, data, loader_v } = this.props;
        const { listar, search, filtro } = this.props;

        return (
            <div className="row d-flex justify-content-center">
                <div className="col-sm-12">
                    <HeaderReporte
                        subtitulo="Ventas"
                    />
                </div>

                <div className="col-sm-12">
                    <div className="grid-container borde-superior border-completo mb-3">
                        <ToolbarVenta
                            {...this.props}
                            buscar={search}
                            titulo="Ventas"
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
                            buscador={this.props.buscador}
                        />
                    </div>
                </div>
                <div className="col-sm-12">
                    <div className="grid-container borde-superior border-completo mb-3">
                        <div className="row m-0 py-3 px-3">
                            <div className="col-3 text-uppercase m-0 p-0 align-self-center px-3">
                                <h3 style={{ fontSize: 16 }} className="m-0 p-0 text-left">
                                    <strong className="m-0 p-0">ventas</strong>
                                </h3>
                            </div>
                            <div className="col-3 m-0 p-0 text-center align-self-center text-uppercase">
                                <span className="text-uppercase text-gris font-italic">
                                    <strong>Total montos&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                </span>
                                <RenderCurrency value={this.props.data.tMonto || 0} simbolo="Q" className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                            <div className="col-3 m-0 p-0 text-center align-self-center text-uppercase">
                                <span className="text-uppercase text-gris font-italic">
                                    <strong>Total pagos&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                </span>
                                <RenderCurrency value={this.props.data.tPagos || 0} simbolo="Q" className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                            <div className="col-3 m-0 p-0 text-center align-self-center text-uppercase">
                                <span className="text-uppercase text-gris font-italic">
                                    <strong>Total saldo&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                </span>
                                <RenderCurrency value={this.props.data.tSaldo || 0} simbolo="Q" className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <Table
                        onPageChange={listar}
                        data={data}
                        loading={loader_v}
                        expandableRow={isExpandableRow}
                        expandComponent={this.expandComponent}
                        page={page}
                    >
                        <TableHeaderColumn
                            dataField="id"
                            isKey={true}
                            hidden
                            dataAlign="center"
                            dataFormat={activeFormatter({ editar: '/venta', eliminarModal: this.abrirDialog, popover:'getRow'})}>Acciones</TableHeaderColumn>
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
                            dataFormat={dateFormatterTimeZone}
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
        );
    }
}
