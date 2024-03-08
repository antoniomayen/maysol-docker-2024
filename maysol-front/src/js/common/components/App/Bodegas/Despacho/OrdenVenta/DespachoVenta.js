import React from 'react'
import VentasListar from './VentasListar';
import Form from './OrdenForm';
import { dateFormatter, formatoMoneda } from 'Utils/renderField/renderReadField'
import classNames from 'classnames';
import LoadMask from 'Utils/LoadMask';

export default class DespachoVenta extends React.Component{

    state = {
        bodega: 0,
        detalleCompra: null,
        aingresar:[]
    }
    setDetalleCompra = (row) => {
        this.setState({
            detalleCompra: row,
            aingresar: []
        });
        this.props.setFormDespachoVenta({
            movimiento: row.id,
            bodega: this.state.bodega,
            productos: row.detalle_movimiento
        })

    }

    cancelar = ()  =>{
        this.setState(
            {
                detalleCompra: null,
                aingresar:[]
            }
        );
    }
    componentWillMount(){
        this.setState({
            bodega: this.props.match.params.id
        })
    }
    despacho = () =>{
        this.props.despacho(this.props.match.params.id,1)
    }
    render() {
        const { create, update } = this.props;
        const { updateData, cargando } = this.props;
        return(
            <div>

                {
                    this.state.detalleCompra ? (
                        <div>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="border-completo card col-12 ">
                                    <div className=" card-header  d-flex justify-content-center text-left">
                                        <div className="col-md-12 d-flex flex-row mt-2 ">
                                            <h5><strong>Detalle orden de venta</strong></h5>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="col-md-11 mt-3">
                                            <div className="row">
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center"><label className="my-auto">NO.{this.state.detalleCompra.numero_oc}</label></div>
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center">{this.state.detalleCompra.cliente.nombre}</div>
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center">{dateFormatter(this.state.detalleCompra.fecha)}</div>
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center"><span className="text-gris font-italic my-auto mr-2">Hecho por:</span> {this.state.detalleCompra.usuario}</div>
                                                <div className="row col-md-12 mt-3  form-group m-0">
                                                    <div className="col-md-auto">
                                                        <label htmlFor="concepto" className="m-0">DESCRIPCIÓN:</label>
                                                    </div>
                                                    <div className="col">
                                                        <p>{this.state.detalleCompra.descripcion}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 mt-3 p-0">
                                            <LoadMask loading={cargando} dark blur>
                                                <Form
                                                    linea={true}
                                                    onSubmit={this.despacho}
                                                    borrarProducto={this.deleteProducto}
                                                    cancelar={this.cancelar}/>
                                            </LoadMask>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <VentasListar {...this.props} setDetalle={this.setDetalleCompra}/>
                    )
                }

            </div>
        )

    }
}
