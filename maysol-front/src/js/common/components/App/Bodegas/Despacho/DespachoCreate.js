import React from 'react'
import HeaderIngreso from 'Utils/Headers/headerIngreso';
import SeleccionarOpciones from '../Ingreso/SeleccionarOpciones';
import DespachoVenta from '../Despacho/OrdenVenta/DespachoVenta';
import DespachoLinea from './LineaProduccion/DespachoLinea';
import DespachoBodega from './DespachoBodega/DespachoBodega';
import DespachosPentientes from './DespachosPentientes'

export default class DespachoCreate extends React.Component{

    state = {
        bodega: 0,
        paso: 1,
        opcion:null
    };

    componentWillMount(){
        this.props.getDespachosPendientes(this.props.match.params.id);
        if(this.props.match.params.id){
            this.props.detail(this.props.match.params.id);
            this.setState({bodega: this.props.match.params.id})
        }

    }
    cambiarOpcion = (opcion) =>{
        this.setState({
            paso:2,
            opcion:opcion
        })
    }
    setInicio = () =>{
        this.setState({
            paso: 1,
            opcion:null
        })
    }
    getDespachosPendientes = (page=1) =>{
        console.log("Get Despachos page", page)
        this.props.getDespachosPendientes(this.props.match.params.id, page);
    }

    render() {
        const { create, loader, anularDespacho} = this.props;
        const { updateData, detalleBodega } = this.props;
        return(
            <div>
                <HeaderIngreso
                    instruccion="Realiza un despacho"
                    tipo={"Despacho"}
                    irInicio={this.setInicio}
                    paso={this.state.paso}
                    idbodega={this.state.bodega}
                    bodega={detalleBodega.nombre}
                    empresa={detalleBodega.empresa ? detalleBodega.empresa.nombre: ''}
                    texto="Agregar bodega"
                    ruta="/bodega/crear"
                    />

                {
                    this.state.paso === 1 && (
                        <div>
                        <SeleccionarOpciones
                            tipo={"Despacho"}
                            texto1={"De orden de venta"}
                            texto2={"A línea de producción"}
                            texto3={"A otra bodega"}
                            cambiarOpcion={this.cambiarOpcion}/>
                         <DespachosPentientes
                            {...this.props}
                            bodega={this.props.match.params.id}
                            data={this.props.despachos_pendientes}
                            loader={loader}
                            anular={anularDespacho}/>
                        </div>
                    )
                }
                {
                    this.state.paso === 2 && (
                        <div>
                            {
                                this.state.opcion === 1 && (
                                    <DespachoVenta
                                        {...this.props}/>
                                )
                            }
                            {
                                this.state.opcion === 2 && (
                                    <DespachoLinea {...this.props} />
                                )
                            }
                            {
                                this.state.opcion === 3 && (
                                    <DespachoBodega {...this.props} />
                                )
                            }
                        </div>


                    )
                }

            </div>
        )

    }
}
