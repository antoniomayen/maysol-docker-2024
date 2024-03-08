import React from 'react'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { BreakLine } from '../../../Utils/tableOptions';
import Table from 'Utils/Grid'
import ToolbarPrestamos from '../../../Utils/Toolbar/ToolbarPrestamos';
import {cellTachado, dateFormatter, formatoMoneda} from '../../../Utils/renderField/renderReadField'
import { activeFormatter }  from 'Utils/Acciones/Acciones'

const   isExpandableRow=()=> {
    return true;
};
const texto_verde = () => {
    return {color: '#659b4d'}
};

export default class HistorialPrestamosGrid extends React.Component {

    expandComponent = (row) => {
        let data = row && row.movimientos ? row.movimientos : [];
        let movimientos = _.cloneDeep(data);
        movimientos.splice(0,1);
        return(
            <div className=" tabla-adentro">
                <BootstrapTable
                    headerStyle={ { backgroundColor: '#e24647' } }
                    data={ movimientos }>
                    <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={cellTachado}
                        thStyle={{minWidth:300, padding:5}}
                        dataFormat={dateFormatter}
                        editable={ false }
                        dataField="fecha" dataSort>Fecha</TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={cellTachado}
                        thStyle={BreakLine}
                        dataField="nombrePago" dataSort>Forma de pago</TableHeaderColumn>
                    <TableHeaderColumn
                        tdStyle={cellTachado}
                        thStyle={BreakLine}
                        columnClassName='text-derecha'
                        className='text-center'
                        dataField="noDocumento" dataSort>Comprobante</TableHeaderColumn>
                    <TableHeaderColumn
                        thStyle={cellTachado}
                        tdStyle={texto_verde}
                        width="10%"
                        dataFormat={formatoMoneda}
                        editable={ false }
                        columnClassName='text-derecha'
                        className='text-center'
                        dataField="monto" dataSort>Saldo</TableHeaderColumn>
                </BootstrapTable>
            </div>
        )
    };

    componentWillMount() {
        this.props.getHistorial()
    }

    render(){
        const { changeSearchHistorial, data_historial, page_historial, loader_historial, getHistorial } = this.props;
        const { listar, search } = this.props;
        return(
            <div className="row d-flex justify-content-center">
                <div className="col-sm-12">
                    <div className="grid-container">
                        <div className="grid-title d-flex flex-row borde-superior">
                            <ToolbarPrestamos
                                    {...this.props}
                                    buscar={changeSearchHistorial}
                                    titulo={"Historial Prestamos"}
                                    buscador={this.props.search_historial}/>
                        </div>
                        <Table
                            trClassName={'clickable'}
                            onPageChange={getHistorial}
                            data={data_historial}
                            loading={loader_historial}
                            page={page_historial}
                            expandableRow={isExpandableRow}
                            expandComponent={this.expandComponent}>
                            <TableHeaderColumn
                                dataField="id"
                                isKey={true}
                                dataAlign="center"
                                dataFormat={activeFormatter({ popover:'getRow' })}
                                editable={ false }>Acciones</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="acreedor" dataSort>Acreedor</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataField="deudor" dataSort>Deudor</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={dateFormatter}
                                dataField="fechaInicio" dataSort>Fecha inicio</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={formatoMoneda}
                                columnClassName='text-derecha'
                                className='text-center'
                                dataField="inicio" dataSort>Monto</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={dateFormatter}
                                dataField="fechaCierre" dataSort>Fecha cierre</TableHeaderColumn>

                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}
