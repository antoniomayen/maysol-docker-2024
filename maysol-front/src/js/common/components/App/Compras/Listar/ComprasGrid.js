import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import ToolbarCompras from '../../../Utils/Toolbar/ToolbarCompras';
import {formatoMoneda, dateFormatter, dateFormatterTimeZone} from '../../../Utils/renderField/renderReadField'
import HeaderSimple from '../../../Utils/Headers/HeaderSimple';
import { BootstrapTable } from 'react-bootstrap-table';
import Swal from 'sweetalert2';

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
function montoFormater(cell, row) {
    
    const pagos_monedas = {};
    row.detalle_movimiento.forEach((pago) => {
      
        if(pagos_monedas.hasOwnProperty(pago.simbolo)){
            pagos_monedas[pago.simbolo] = pagos_monedas[pago.simbolo] + (parseFloat(pago.cantidad) * parseFloat(pago.precio_costo));
        } else {
            pagos_monedas[pago.simbolo] = (parseFloat(pago.cantidad) * parseFloat(pago.precio_costo));
        }
  
    });
    return <div>{Object.keys(pagos_monedas).map((key) => {
        return <div key={key}>{formatoMoneda(pagos_monedas[key], key)}</div>
    })}</div>
}

const   isExpandableRow=()=> {
    return true;
};
function proveedorFormater(cell, row) {
  if (row.proveedor !== null){
    return <div>{row.proveedor.nombre}</div>
  }
}
function categoriaFormater(cell, row) {
  if (row.categoria !== null){
    return <div>{row.categoria.nombre}</div>
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
function cellTachado(cell, row) {
    if(row.anulado){
        return {textDecoration: "line-through", whiteSpace: 'normal', }
    }
    return {whiteSpace: 'normal'}
}

export default class ComprasGrid extends React.Component {
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

    componentWillMount() {
        this.props.listar();
        this.props.getEmpresasSelect();
    }
    expandComponent = (row) => {
        let data = row && row.productos ? row.productos : [];
        let multiplo = _.cloneDeep(data);
        function subtotal(cell, row) {
            const sub = parseInt(row.cantidad) * parseFloat(row.precio_costo);
            return  <div>{formatoMoneda(sub, row.simbolo)}</div>
        };
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
                        editable={ false }
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
                        dataField="subtotal" dataSort dataFormat={subtotal}>Subtotal</TableHeaderColumn>

                </BootstrapTable>
            </div>
        )
    };
    render(){
        const { data, page, me,empresasSelect, loader_c } = this.props;
        const { listar, search, filtro, borrar } = this.props;
        return(

            <div className="row d-flex justify-content-center">


                <div className="col-sm-12">

                    <HeaderSimple
                                instruccion="¡Ingresa una compra!"
                                texto="Agregar compra"
                                ruta="/compra/crear"
                                />

                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarCompras
                                    buscar={search}
                                    titulo={"Compras"}
                                    usuario={me}
                                    empresas={empresasSelect}
                                    cambiarFiltro={filtro}
                                    cambiarPendientes={this.props.set_filtro_pendites}
                                    filtro_pendientes={this.props.filtro_pendientes}
                                    filtro={this.props.filtro_producto}
                                    buscador={this.props.buscador}
                                    total={data.tTotal}
                                    pagos={data.tPagos}
                                    />
                        </div>

                        <Table onPageChange={listar}
                                data={data}
                                loading={loader_c}
                                expandableRow={isExpandableRow}
                                expandComponent={this.expandComponent}
                                page={page}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ editar: '/compra', eliminarModal: this.abrirDialog, popover:'getRow'})}>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                dataField="numero_oc" dataSort>No. Orden</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                dataField="categoria" dataAlign="center"
                                dataFormat={categoriaFormater}>Categoria</TableHeaderColumn>
                             <TableHeaderColumn
                                tdStyle={cellTachado} thStyle={BreakLine}
                                dataFormat={proveedorFormater}
                                dataField="proveedor" dataSort>Proveedor</TableHeaderColumn>
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
                                dataAlign="center"
                                dataFormat={entregadaFormater}
                                dataField="ingresado" dataSort>Entregada</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
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
