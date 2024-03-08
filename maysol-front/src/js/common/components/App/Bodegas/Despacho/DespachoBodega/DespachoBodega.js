import React from 'react'
import FormProductos from './ProductosForm'
import Form from './DespachoDatosForm';
import { api } from 'api/api';
import LoadMask from "Utils/LoadMask";

let empresas = [];
let productos = [];
export default class DespachoBodega extends React.Component{

    state = {
        editar: false,
        detalleCompra: {},
        bodegas: [],
        empresaSeleccionada:null
    };
    cancelar = ()  =>{
        this.props.resetBodegaEmpresa()
        this.setState(
            {
                detalleCompra: null,
            }
        );
    }
    componentWillMount(){
        this.props.resetBodegaEmpresa();
        this.getProyectos();
        if(this.props.match.params.id){
            this.props.detail(this.props.match.params.id);
            this.setState({editar: true})
        }

    }

    getProyectos = () =>{
        empresas = [];
        const { me } = this.props;
        return api.get(`proyectos/getEmpresasBodega`).catch((error) => {

        }).then((data) => {
            data.forEach(item => {
                if (!_.find(empresas, { id: item.id })) {
                    empresas.push(item);
                }
            });
            this.props.setFormularioCabezaBodega({empresa: me.idProyecto});

            //Obtener la empresa actual y setear las bodegas de esa empresa
            const empresa = _.find(empresas, {'id': me.idProyecto});
            let bodegas = [];
            empresa.bodegas.forEach(item => {
                if(item.id != this.props.match.params.id){
                    bodegas.push({value: item.id, label: item.nombre})
                }
            });
            this.setState({
                empresaSeleccionada: me.idProyecto,
                bodegas
            });
            return { options: empresas }
        })
    };
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
    despacho = () => {
        this.props.despacho(this.props.match.params.id, 3);
    }
    handleEmpresaChange = (e) => {
        if(e.id != this.state.empresaSeleccionada){
            console.log(e);
            let bodegas = []
            e.bodegas.forEach(item => {
                    if(item.id != this.props.match.params.id){
                        bodegas.push({value: item.id, label: item.nombre})
                    }
            });

            this.setState({
                empresaSeleccionada: e.id,
                bodegas: bodegas
            });
        }
    }
    render() {
        const { create, ingresoCompra, getDataBodegaEmpresa, resetLineaEmpresa } = this.props;
        const { cargando, dataBodega, idBodegaEmpresa } = this.props;

        return(
            <div>
                {
                    idBodegaEmpresa.bodega ? (
                        <LoadMask loading={cargando} dark blur>
                            <div className="d-flex justify-content-center mt-3">
                                <div className="border-completo card col-12 ">
                                    <div className=" card-header  d-flex justify-content-center text-left">
                                        <div className="col-md-12 d-flex flex-row mt-2 ">
                                            <h5><strong>Productos a despachar</strong></h5>
                                        </div>
                                    </div>
                                    <div className="card-body p-0">

                                        <div className="col-md-12 mt-3 p-0">
                                            <FormProductos
                                                        productos={productos}
                                                        getProductos={this.getProductos}
                                                        onSubmit={this.despacho}
                                                        cancelar={this.cancelar}
                                                        dataLinea={dataBodega}
                                                        original={idBodegaEmpresa}/>
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
                                        <h5><strong>Despacho a bodega:</strong></h5>
                                    </div>
                                </div>
                                <div className="card-body p-0">

                                    <div className="col-md-12 mt-3 p-0">
                                        <LoadMask loading={cargando} dark blur>
                                            <Form
                                                    handleEmpresaChange={this.handleEmpresaChange}
                                                    bodegas={this.state.bodegas}
                                                    getEmpresas={this.getProyectos}
                                                    empresas={empresas}
                                                    onSubmit={getDataBodegaEmpresa}
                                                    setValores={this.setData}/>
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
