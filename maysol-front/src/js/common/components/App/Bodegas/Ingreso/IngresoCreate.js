import React from 'react'
import Card from 'Utils/Cards/cardFormulario';
import HeaderIngreso from 'Utils/Headers/headerIngreso';
import IngresoCompra from './IngresoCompra'
import Form from './IngresoForm';
import SeleccionarOpciones from './SeleccionarOpciones';
import IngresoLineaProdCreate from '../IngresoProduccion/IngresoProdCreate';
import IngresoDespacho from '../IngresoDespacho/IngresoDespacho';

export default class IngresoCreate extends React.Component{

    state = {
        bodega: 0,
        editar: false,
        detalleCompra: [],
        aingresar:[],
        paso: 1,
        opcion:null
    };
    componentWillMount(){
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
            detalleCompra: [],
            aingresar:[],
            paso: 1,
            opcion:null
        })
    }
    render() {
        const { create, update } = this.props;
        const { updateData, detalleBodega } = this.props;
        return(
            <div className="col-sm-12">
                <HeaderIngreso
                    tipo={"Ingreso"}
                    instruccion="Realiza un ingreso"
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
                        <SeleccionarOpciones
                            tipo={"ingreso"}
                            texto1={"Desde orden de compra"}
                            texto2={"Desde línea de producción"}
                            texto3={"Desde otra bodega"}
                            cambiarOpcion={this.cambiarOpcion}/>
                    )
                }
                {
                    this.state.paso === 2 && (
                        <div>
                            {
                                this.state.opcion === 1 && (
                                    <IngresoCompra {...this.props}/>
                                )
                            }
                            {
                                this.state.opcion === 2 && (
                                    <IngresoLineaProdCreate {...this.props}/>
                                )
                            }
                            {
                                this.state.opcion === 3 && (
                                    <IngresoDespacho {...this.props}/>
                                )
                            }
                        </div>


                    )
                }
            </div>
        )

    }
}
