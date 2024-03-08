import React from 'react'
import Card from 'Utils/Cards/cardFormulario';
import HeaderIngreso from 'Utils/Headers/headerIngreso';
import DespachoListar from './DespachoListar';
import Form from './ProductosForm';
import { dateFormatter, formatoMoneda } from 'Utils/renderField/renderReadField'
import classNames from 'classnames';
import LoadMask from 'Utils/LoadMask';

export default class IngresoDespacho extends React.Component{

    state = {
        bodega: 1,
        detalleCompra: null,
        aingresar:[]
    }
    setDetalleCompra = (row) => {
        this.setState({
            detalleCompra: row,
            aingresar: []
        });
        this.props.setFormIngresoBodega({
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
    ingreso = () =>{
        this.props.ingreso(this.props.match.params.id, 3)
    }
    render() {
        const { create, update, ingreso } = this.props;
        const { updateData, cargando, detalle_ingreso } = this.props;
        console.log('Detalle de ingreso ', detalle_ingreso)
        return(
            <div>

                {
                    this.state.detalleCompra ? (
                        <div>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="border-completo card col-12 ">
                                    <div className=" card-header  d-flex justify-content-center text-left">
                                        <div className="col-md-12 d-flex flex-row mt-2 ">
                                            <h5><strong>Detalle Despacho</strong></h5>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">
                                        <div className="col-md-11 mt-3">
                                            <div className="row">
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center"><label className="my-auto">{this.state.detalleCompra.no_movimiento}</label></div>
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center">{this.state.detalleCompra.bodega}</div>
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center">{dateFormatter(this.state.detalleCompra.fecha)}</div>
                                                <div className="col-md-3 text-primary font-weight-bold d-flex align-items-center"><span className="text-gris font-italic my-auto mr-2">Hecho por:</span> {this.state.detalleCompra.usuario} </div>

                                            </div>
                                        </div>
                                        <div className="col-md-12 mt-3 p-0">
                                            <LoadMask loading={cargando} blur_1 >
                                                <Form
                                                    resumen={detalle_ingreso && detalle_ingreso.detalle_presentacion ? detalle_ingreso.detalle_presentacion : []}
                                                    onSubmit={this.ingreso}
                                                    borrarProducto={this.deleteProducto}
                                                    cancelar={this.cancelar}/>
                                            </LoadMask>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <DespachoListar {...this.props} setDetalle={this.setDetalleCompra}/>
                    )
                }

            </div>
        )

    }
}
