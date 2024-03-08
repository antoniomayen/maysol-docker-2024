import React from 'react'
import FormProductos from './DespachoForm'
import Form from './DespachoDatosForm';
import { api } from 'api/api';
import LoadMask from "Utils/LoadMask";

let empresas = [];
let productos = [];
let lineaproduccion=[]
export default class DespachoLinea extends React.Component{

    state = {
        editar: false,
        detalleCompra: {},
        id: null,
        lineasProduccion: [],
    };

    setId = (id) => this.setState({ id }, this.getLineaProduccion);

    cancelar = ()  =>{
        this.props.resetLineaEmpresa()
        this.setState(
            {
                detalleCompra: null,
            }
        );
    }
    componentWillMount(){
        this.props.resetLineaEmpresa();
        this.getProyectos();
        if(this.props.match.params.id){
            this.props.detail(this.props.match.params.id);
            this.setState({editar: true})
        }

    }
    getProductos = (search) => {
        productos = [];
        return api.get(`inventario/getProductosDespacho/${this.props.match.params.id}`, {search}).catch((error) => {

        }).then((data) => {
            data.forEach(item => {
                if (!_.find(productos, { id: item.id })) {
                    productos.push(item);
                }
            });
            return { options: productos }
        })
    }
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
    getProyectos = () =>{
        empresas = [];
        const { me } = this.props;
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
            this.props.setFormularioCabezaLinea({empresa: me.idProyecto});
            this.setId(me.idProyecto);
            return { options: empresas }
        })
    };
    despacho = () => {
        this.props.despacho(this.props.match.params.id, 2);
    }
    render() {
        const { create, ingresoCompra, getDataLineaEmpresa, resetLineaEmpresa } = this.props;
        const { cargando, dataLinea, idLineaEmpresa } = this.props;
        return(
            <div>
                {
                    idLineaEmpresa.linea ? (
                        <LoadMask loading={cargando} dark blur>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="border-completo card col-12 ">
                                    <div className=" card-header  d-flex justify-content-center text-left">
                                        <div className="col-md-12 d-flex flex-row mt-2 ">
                                            <h5><strong>Seleccionar productos</strong></h5>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">

                                        <div className="col-md-12 mt-3 p-0">
                                            <FormProductos
                                                        getProductos={this.getProductos}
                                                        onSubmit={this.despacho}
                                                        cancelar={this.cancelar}
                                                        dataLinea={dataLinea}
                                                        original={idLineaEmpresa}/>
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
                                        <h5><strong>Ingresar datos de línea</strong></h5>
                                    </div>
                                </div>
                                <div className="card-body p-0">

                                    <div className="col-md-12 mt-3 p-0">
                                        <LoadMask loading={cargando} dark blur>
                                            <Form
                                                setId={this.setId}
                                                lineaProduccion={this.state.lineasProduccion}
                                                empresas={empresas}
                                                onSubmit={getDataLineaEmpresa}
                                                setValores={this.setData}
                                            />
                                        </LoadMask>
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
