import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { descripcionFormater } from 'Utils/Acciones/descripcionGrid';
import { categoriaFormater } from 'Utils/Acciones/comentarioGrid';
import { Link } from 'react-router-dom'
import { BreakLine } from 'Utils/tableOptions';
import { BootstrapTable } from 'react-bootstrap-table';
import NumberFormat from "react-number-format";
import { dateFormatter, cellTachado, formatoMoneda } from 'Utils/renderField/renderReadField';
import ToolbarReporteCF from 'Utils/Toolbar/ToolbarReporteCf'
import { api } from 'api/api';
import Modal from 'react-responsive-modal';
import Select from 'react-select';


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
};

let usuarios = [];

function formatoDescripcion(cell, row) {
  return <div>{row.concepto}</div>
}
export default class DetallecfGrid extends React.Component {
    componentDidMount(){
        getCategorias('');
        this.getUsuarios('');
    }
    constructor(props) {
        super(props);

       
        this.state = {
            open_modal: false
        };
    }
    formatoMoneda = (cell) =>{
        let simbolo = this.props.simbolo
        return(formatoMoneda(cell, simbolo))
    }
    getUsuarios = (search) => {

        return api.get(`users/getTodosUsuarios`, {search}).catch((error) => {
            console.log("Error al leer cuentas.");
        }).then((data) => {
            data.forEach(item => {
                if(!_.find(usuarios, {id: item.id})) {
                    usuarios.push(item);
                }
            });
            return { options: usuarios}
        })
    }
    openModal = () => {
        this.setState({open_modal: true})
    };
    closeModal = () => {
        this.setState({open_modal: false})
    };
    verificar_filtros = () => {
        if(this.props.moneda){
            console.log("entra en verificar filstros")
            this.props.exportarExcelDetalle()
        }
    };
    render(){
        const { listarDetalle, dataDetalleRepo, loader, data, tipo,usuariosEmpresa } = this.props;
        return (
            <div >
                    <div className=" borde-superior row col-12 m-0 ">
                        <ToolbarReporteCF
                            titulo="Detalle"
                            texto="Exportar excel"
                            funcion={this.openModal}
                            usuarios={usuariosEmpresa}
                            categorias={categorias}
                            cambiarCategoria={this.props.setCategoriaFiltro}
                            cambiarUsuario={this.props.setUsuarioFiltro}
                            categoria={this.props.categoriaFiltro}
                            usuario={this.props.usuarioFiltro}
                            buscar={this.props.searchGastos}
                            buscador={this.props.search_gastos}
                            />
                    </div>
                    <div className="tabla-70">
                    <BootstrapTable
                                data={ data }>
                            <TableHeaderColumn
                                hidden
                                isKey={true}
                                dataField="id" dataSort>Id</TableHeaderColumn>
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
                                dataFormat={formatoDescripcion}
                                dataField="descripcion" dataSort>Descripción</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                editable={ false }
                                dataField="destino" dataSort>Destino</TableHeaderColumn>
                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={BreakLine}
                                dataFormat={this.formatoMoneda}
                                editable={ false }
                                width={'90px'}
                                columnClassName={'text-derecha'}
                                dataField="monto" dataSort>Monto</TableHeaderColumn>

                            <TableHeaderColumn
                                tdStyle={cellTachado}
                                thStyle={{minWidth:300}}
                                editable={ false }
                                dataFormat={categoriaFormater({tipo:tipo})}
                                dataField="categoria" dataSort>Categoria</TableHeaderColumn>
                            <TableHeaderColumn
                                    dataField="comentario"
                                    tdStyle={cellTachado}
                                    columnClassName='td-column-string-example'
                                    className='td-header-string-example'
                                    thStyle={{minWidth:300}}
                                     dataSort>Comentario</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                { this.state.open_modal && (
                    <Modal open={this.state.open_modal} onClose={this.closeModal}>
                        <div style={{maxWidth: '100%'}}>
                            <div className="modal-header">
                                <div className="panel-body">
                                    <span className="reset-caption">Opciones de descarga</span>
                                </div>
                            </div>
                            <div className="modal-body px-0 px-sm-5 form-group">

                                <div className="row pt-3 pb-3">
                                    <div className="col-12 col-md-6 mx-0">
                                        <label >Moneda:</label>
                                        <Select
                                            name="estado"
                                            onChange={this.props.set_moneda_reporte}
                                            value={this.props.moneda}
                                            searchPromptText="Seleccione la moneda"
                                            placeholder={"Seleccione la moneda"}
                                            options={[
                                                { value: 'USD', label: 'Dolares' },
                                                { value: 'GTQ', label: 'Quetzales' },
                                                { value: 'YEN', label: 'Yenes' },
                                            ]}
                                        />
                                        {!this.props.moneda && (
                                            <div className="required-text">Campo requerido.</div>)}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12 d-flex justify-content-center">
                                        <div className="col-md-6 d-flex justify-content-end flex-column flex-sm-row align-items-stretch align-items-sm-center">
                                            <button type="button" onClick={this.closeModal} className="btn btn-secondary m-1">Cancelar</button>
                                            <button type="submit" onClick={this.verificar_filtros} className="btn btn-primary m-1">Descargar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        )
    }
}
