import React from 'react'
import Form from './IngresoProdForm'
import FormProductos from './IngresoProductos';
import { api } from '../../../../../api/api';
import LoadMask from "../../../Utils/LoadMask";

let empresas = [];
let lineaproduccion = [];
export default class IngresoLineaProdCreate extends React.Component{

    state = {
        editar: false,
        detalleCompra: {},
        lineasProduccion: [],
        id: null,
    };

    setId = (id) => this.setState({ id }, this.getLineaProduccion);

    componentWillMount(){
        this.props.resetLineaEmpresa();
        this.getProyectos();
        if(this.props.match.params.id){
            this.props.detail(this.props.match.params.id);
            this.setState({editar: true})
        }
    }

    getProyectos = () =>{
        const { me } = this.props;
        empresas = [];
        return api.get(`proyectos/getEmpresaPorIdBodega/${this.props.match.params.id}`).catch((error) => {
            console.log("Error al leer cuentas.");
        }).then((data) => {
            data.forEach(item => {
                if (!_.find(empresas, { value: item.id })) {
                    empresas.push({value: item.id, label: item.nombre, empresaId: item.idEmpresas, style:{fontWeight: 'bold'}})
                }
                item.empresas.forEach(subempresa => {
                    if (!_.find(empresas, { value: subempresa.id })) {
                        empresas.push({value: subempresa.id, label: subempresa.nombre, empresaId: item.idEmpresas, subempresa: subempresa.subempresa,style: { paddingLeft: '2em' } });
                    }
                })
            });
            this.props.setFormularioCabeza({empresa: me.idProyecto});
            this.setId(me.idProyecto);
            return { options: empresas }
        })
    };
    getLineaProduccion = (search) => {
        lineaproduccion=[];
        return api.get(`lineaproduccion/getLineaBodega/${this.state.id}`,{search}).catch((error) => {
            console.log("Error al leer cuentas.");
        }).then((data) => {
            data.forEach(item => {
                if (!_.find(lineaproduccion, { id: item.id })) {
                    lineaproduccion.push({ ...item, value: item.id, label: item.nombre });
                }
            });
            //return { options: lineaproduccion }
            this.setState({ lineasProduccion: lineaproduccion });
        })
    };
    ingresoCompra = () => {
        this.props.ingreso(this.props.match.params.id, 2, this.props.detalleBodega.empresa.id);
    }
    render() {
        const { create, ingresoCompra, getDataLineaEmpresa, resetLineaEmpresa } = this.props;
        const { cargando, dataLinea, idLineaEmpresa } = this.props;
        return(
            <div>
                {
                    idLineaEmpresa.linea ? (
                        <LoadMask loading={cargando} blur_1>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="border-completo card col-12 ">
                                    <div className=" card-header  d-flex justify-content-center text-left">
                                        <div className="col-md-12 d-flex flex-row mt-2 ">
                                            <h5><strong>Ingresar productos</strong></h5>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">

                                        <div className="col-md-12 mt-3 p-0">
                                            <FormProductos
                                                onSubmit={this.ingresoCompra}
                                                cancelar={resetLineaEmpresa}
                                                dataLinea={dataLinea}
                                                original={idLineaEmpresa}
                                                empresa={this.state.id}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </LoadMask>

                    ): (
                        <div className="d-flex justify-content-center mt-3">
                            <div className="border-completo card col-12 ">
                                <div className=" card-header  d-flex justify-content-center text-left">
                                    <div className="col-md-12 d-flex flex-row mt-2 ">
                                        <h5><strong>Datos línea de producción</strong></h5>
                                    </div>
                                </div>
                                <div className="card-body p-0">

                                    <div className="col-md-12 mt-3 p-0">
                                        <Form
                                                setId={this.setId}
                                                lineaProduccion={this.state.lineasProduccion}
                                                empresas={empresas}
                                                onSubmit={getDataLineaEmpresa}
                                                setValores={this.setData}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )

    }
}
