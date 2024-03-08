import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { dateFormatter, cellTachado } from 'Utils/renderField/renderReadField';
import HeaderReporteCF from '../../../Utils/Headers/headerReportcf'
import GraficascfContainer from './graficascf';
import DetallecfGrid from './detallecfGrid';
import ResumencfGrid from './resumencfGrid';
import Modal from 'react-responsive-modal';
import Select from 'react-select';
import {Meses} from 'Utils/formatos'
import LoadMask from '../../../Utils/LoadMask';
import HeaderReporte from 'Utils/Headers/HeaderReporte';
import { api } from 'api/api';

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

export default class ReportecfContainer extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'CF',
            parametro:null,
            saldo: 0,
            open_modal: false
        };
    }

    // eslint-disable-next-line react/sort-comp
    componentDidMount() {
        getCategorias('');
    }

    componentWillMount(){
        this.props.listarReportecf(this.state.activeTab)
        this.props.getEmpresas();
    }

    componentDidUpdate(prevProps, prevState){
        if(this.state.activeTab !== prevState.activeTab){
            this.props.listarReportecf(this.state.activeTab)
        }
        // if(this.props.match.path !== prevProps.match.path){
        //     this.setState({parametro: this.props.match.params.id});
        // }
        // if(this.props.miscajas !== prevProps.miscajas){

        //     try {
        //         if(this.props.miscajas.length ==0){
        //             this.setState({
        //                 activeTab: 'H'
        //               });
        //         }else{

        //         }

        //     } catch (error) {

        //     }

        // }
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {

            this.setState({
                activeTab: tab
            });
            this.props.listarReportecf(this.state.activeTab)
            this.props.graficaLinear(this.state.activeTab)
        }
    }
    recargar = () => {
        this.props.listarReportecf(this.state.activeTab)
    };
    openModal = () => {
        this.setState({open_modal: true})
    };
    closeModal = () => {
        this.setState({open_modal: false})
    };
    verificar_filtros = () => {
        if(this.props.idioma && this.props.moneda){
            this.props.exportarExcel()
        }
    };

    render() {
        const { empresasEstables, mesRepo, anioRepo, empresaRepo, dataResumencf,dataDetallecf,
            loaderReportecf, usuariosEmpresa, categoriaFiltro, usuarioFiltro,
        } = this.props;

        return (
            <div className="d-flex justify-content-center index--padding bgr--street">
                <div className="col-md-12 ">
                        <HeaderReporte subtitulo='Gastos generales' />
                    <div className="col-md-12 p-0">
                        <Nav tabs className="col-12 px-3">
                            <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                                <NavLink
                                    className={classNames('py-2 text-center',{ active: this.props.monedaTab === 'GTQ' })}
                                    onClick={() => { this.props.set_moneda_tab('GTQ'); }}>
                                    <h5>Quetzales</h5>
                                </NavLink>
                            </NavItem>
                            <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                                <NavLink
                                    className={classNames('py-2 text-center',{ active: this.props.monedaTab === 'USD' })}
                                    onClick={() => { this.props.set_moneda_tab('USD'); }}>
                                    <h5>Dólares</h5>
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <HeaderReporteCF
                            titulo=""
                            texto="Exportar excel"
                            funcion={this.openModal}
                            empresas={empresasEstables}
                            cambiarMes={this.props.cambiarMes}
                            cambiarAnio={this.props.cambiarAnio}
                            cambiarEmpresa={this.props.cambiarEmpresa}
                            cambiarCategoria={this.props.setCategoriaFiltro}
                            cambiarUsuario={this.props.setUsuarioFiltro}
                            categoria={categoriaFiltro}
                            usuario={usuarioFiltro}
                            usuarios={usuariosEmpresa}
                            categorias={categorias}
                            mes={mesRepo}
                            anio={anioRepo}
                            empresa={empresaRepo}
                        />
                    </div>
                    <Nav tabs className="col-12 px-3">
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'CF' })}
                                onClick={() => { this.toggle('CF'); }}>
                                <h5>CF</h5>
                            </NavLink>
                        </NavItem>
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'PL' })}
                                onClick={() => { this.toggle('PL'); }}>
                                <h5>PL</h5>
                            </NavLink>
                        </NavItem>
                    </Nav>

                    <TabContent activeTab={this.state.activeTab} className="mt-0">
                        <TabPane  tabId={this.state.activeTab}>
                            <div className="col-md-12 p-0">
                                <div className="col-md-12 row m-0 px-0">
                                    <div className="col-md-6 px-1 px-md-0 mb-2">
                                        <LoadMask loading={loaderReportecf}  blur_1>
                                            <GraficascfContainer
                                                loader={loaderReportecf}
                                                tipo={this.state.activeTab}
                                                {...this.props}
                                            />
                                        </LoadMask>
                                    </div>
                                    <div className="col-md-6 pr-1 sin-padding pr-md-0 mb-2 pl-0">
                                        <LoadMask loading={loaderReportecf}  blur_1>
                                            <ResumencfGrid
                                                loader={loaderReportecf}
                                                data={dataResumencf}
                                                tipo={this.state.activeTab}
                                                {...this.props}
                                            />
                                        </LoadMask>
                                    </div>
                                </div>
                                <div className="col-md-12 mt-2 px-1 px-md-0">
                                    <LoadMask loading={loaderReportecf}  blur_1>
                                        <DetallecfGrid
                                            {...this.props}
                                            loader={loaderReportecf}
                                            tipo={this.state.activeTab}
                                            data={this.props.detalleReporte}/>
                                    </LoadMask>
                                </div>
                            </div>
                        </TabPane>

                    </TabContent>
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
                                        <label >Idioma:</label>
                                        <Select
                                            name="estado"
                                            onChange={this.props.set_idioma}
                                            value={this.props.idioma}
                                            searchPromptText="Seleccione mes inicial"
                                            placeholder={"Seleccione el idioma"}
                                            options={[
                                                { value: 'es', label: 'Español' },
                                                { value: 'jp', label: 'Japonés' },
                                            ]}
                                        />
                                        {!this.props.idioma && (
                                            <div className="required-text">Campo requerido.</div>)}
                                    </div>
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
