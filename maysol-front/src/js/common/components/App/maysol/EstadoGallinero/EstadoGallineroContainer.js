import React from 'react'
import PropTypes from 'prop-types'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import HeaderGallineros from '../../../Utils/Headers/headerEstadoGallinero';
import { BootstrapTable } from 'react-bootstrap-table';
import InfoGallinero from './InfoGallinero';
import TabsInfo from './tabsInfo';
import Modal from 'react-responsive-modal';
import FormPeso from './FormsModales/ControlPesoForm';
import FormRegistro from './FormsModales/ActualizarForm';
import FormAlimento from './FormsModales/alimentoForm';
import FormCosto from './FormsModales/costoGranja';
import LoadMask from 'Utils/LoadMask';
function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}

export default class EstadoGallineroContainer extends React.Component {
    state = {
        opcion: 1
    }
    componentWillMount() {
        this.props.setIdGallinero(this.props.match.params.id)
        this.props.detail(this.props.match.params.id)

    }
    funcion1 = () => {

    }
    funcion2 = () => {

    }
    openModal = () =>{
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }
    abrirAlimento = () =>{
        const { updateData } = this.props
        this.props.setFormAlimentos({
            cantidad_alimento:  updateData.cantidad_alimento,
            cantidad_agua: updateData.cantidad_agua
        })

        this.setState({opcion: 3});
        this.openModal();
    }
    abrirPeso = () => {
        this.setState({opcion: 1})
        this.openModal();
    }
    abrirCosto = () =>{
        const { updateData } = this.props;
        this.props.setFormCostos({
            fecha_inicio_costo: updateData.fechaInicioCosto,
            plazo: updateData.plazo,
            monto: updateData.monto,
            categoria_recuperacion: updateData.categoria_recuperacion,
        })
        this.setState({opcion: 4});
        this.openModal();
    }
    abrirReajuste = () => {
        const { updateData } = this.props;
        this.props.setFormCantidad({
            noGallinas: updateData.no_gallinas,
            raza: updateData.raza,
            edad: updateData.edad,
            fechaInicio: updateData.fechaInicio
        })
        this.setState({opcion: 2});
        this.openModal();
    }
    enviarPeso = () => {
        this.props.movimientoBodega(1);
    }
    enviarGallinero = () => {
        this.props.hacerPeticion(2);

    }

    render(){
        const { updateData } = this.props
        return(

            <div className="row d-flex justify-content-center">
                { this.props.toggleModal && (
                    <Modal open={this.props.toggleModal} onClose={this.closeModal} >
                        <div  style={{ Width: '100%' }}>
                            <div className="modal-header">
                                {
                                    this.state.opcion === 1 && (
                                        <div className="panel-body">
                                            <span className="reset-caption">Control de peso</span>
                                        </div>
                                    )
                                }
                                {
                                    this.state.opcion === 2 && (
                                        <div className="panel-body">
                                            <span className="reset-caption">Detalle Gallinero</span>
                                        </div>
                                    )
                                }
                                {
                                    this.state.opcion === 3 && (
                                        <div className="panel-body">
                                            <span className="reset-caption">Control alimentos</span>
                                        </div>
                                    )
                                }
                                {
                                    this.state.opcion === 4 && (
                                        <div className="panel-body">
                                            <span className="reset-caption">Costo de recuperación</span>
                                        </div>
                                    )
                                }

                            </div>
                            <div className="modal-body">
                                <LoadMask loading={this.props.cargandoModal}>
                                    {
                                     this.state.opcion === 1 && (
                                         <FormPeso {...this.props}
                                            onSubmit={this.enviarPeso}
                                            closeModal={this.closeModal} />
                                     )
                                    }
                                    {
                                        this.state.opcion === 2 && (
                                            <FormRegistro {...this.props}
                                                onSubmit={this.enviarGallinero}
                                                closeModal={this.closeModal} />
                                        )
                                    }
                                    {
                                        this.state.opcion === 3 && (
                                            <FormAlimento {...this.props}
                                                onSubmit={this.enviarGallinero}
                                                closeModal={this.closeModal} />
                                        )
                                    }
                                    {
                                        this.state.opcion === 4 && (
                                            <FormCosto {...this.props}
                                                onSubmit={this.props.costosGranja}
                                                closeModal={this.closeModal} />
                                        )
                                    }
                                </LoadMask>
                            </div>
                        </div>
                    </Modal>
                )}

                <div className="col-sm-12">
                    <HeaderGallineros
                        instruccion="Bienvenido"
                        bodega={updateData.nombre}
                        empresa={updateData.empresa}
                        funcion1={this.abrirAlimento}
                        texto1={"Alimentación"}
                        funcion2={this.abrirPeso}
                        texto2={'Control peso'}
                        funcion3={this.abrirReajuste}
                        texto3={'Detalle gallinero'}
                        funcion4={this.abrirCosto}
                        texto4={'Recuperación'}
                        />
                </div>
                <div className="col-md-12">
                    <InfoGallinero gallinero={updateData.nombre} {...this.props}/>
                </div>
                <div className="col-md-12">
                    <TabsInfo {...this.props}/>
                </div>
            </div>
        )
    }
}
