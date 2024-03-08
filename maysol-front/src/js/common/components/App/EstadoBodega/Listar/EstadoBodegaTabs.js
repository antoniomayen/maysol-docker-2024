import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import { browserHistory } from 'react-router';
import { dateFormatter, cellTachado } from 'Utils/renderField/renderReadField';
import Modal from 'react-responsive-modal';
import LoadMask from 'Utils/LoadMask';
import HeaderBodega from 'Utils/Headers/headerBodega';
import EstadoBodegaGrid from './EstadoBodega';
import HistoricoBodegaGrid from './HistoricoBodega';

export default class EstadoBodegaTabs extends React.Component {
    state = {
        idBodega: 0,
        movimiento: {}
    }

    componentWillMount() {
        this.props.setIdBodega(this.props.match.params.id);
        this.props.listar(1);
        this.props.getEmpresasSelect();
        this.props.detailBodega(this.props.match.params.id)
        this.setState(
            {
                idBodega: this.props.match.params.id
            }
        )
    }
    reajuste = () =>{

    }
    abrirReajuste = (id, row) => {

        this.props.setFormReajuste(row);
        this.setState({  movimiento:row });
        this.openModal();
    }
    //****Manejo de modal */
    openModal = () => {
        this.props.setToggleModal(true);
    }
    closeModal = () => {
        this.props.setToggleModal(false);
    }
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'e',

        };
    }



    componentDidUpdate(prevProps, prevState){
        // if(this.state.activeTab !== prevState.activeTab){
        //     this.props.listarReportecf(this.state.activeTab)
        // }

    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
            if(tab === 'e'){
                this.props.listar(1);
            }else{
                this.props.listarHistorico(1);
                this.props.getGrafica();
            }
        }
    }



    render() {
        const { data, loading, cargandoMovimiento, page, me,empresasSelect, detalleBodega } = this.props;
        const { listar, search, filtro, destroy } = this.props;

        return (
            <div className="d-flex justify-content-center index--padding bgr--street">

                <div className="col-md-12 px-0">
                    <div className="col-sm-12 p-0">
                    <HeaderBodega
                                idBodega= {this.state.idBodega}
                                bodega={detalleBodega.nombre}
                                empresa={detalleBodega.empresa ? detalleBodega.empresa.nombre: ''}
                                instruccion="¡Movimiento bodega!"
                                texto="¡Movimiento bodega!"
                                ruta="/bodega/crear"
                                />
                    </div>
                    <Nav tabs className="col-12 px-3">
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'e' })}
                                onClick={() => { this.toggle('e'); }}>
                                <h5>Existencias</h5>
                            </NavLink>
                        </NavItem>
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'h' })}
                                onClick={() => { this.toggle('h'); }}>
                                <h5>Historico</h5>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} className="mt-0">

                        <TabPane  tabId={'e'}>
                            <EstadoBodegaGrid
                                {...this.props} />
                        </TabPane>

                       <TabPane  tabId={"h"}>
                            <HistoricoBodegaGrid {...this.props} />
                        </TabPane>

			        </TabContent>

                </div>

            </div>

        )
    }
}
