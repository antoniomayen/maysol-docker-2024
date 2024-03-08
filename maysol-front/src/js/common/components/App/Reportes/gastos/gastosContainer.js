import React from 'react'

import GananciaGrid from './gananciasGrid';
import CostosGrid from './costosGrid';
import CostosGananciasGrafica from './gastosGrafica';
import FiltroCostos from '../produccion/filtros';
import HeaderReporte from 'Utils/Headers/HeaderReporte';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import { RenderCurrency } from 'Utils/renderField/renderReadField'

function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}

export default class GastosContainer extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'T',
            monedaTab: 'GTQ'
        };
    }
    componentWillMount() {
        const { me } = this.props;
        this.props.listarEmpresas()

    }
    componentDidUpdate(prevProps){


    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
            if(tab === 'T'){
                this.props.listarGanancia(1);
            }else{
                this.props.listar(1);
            }
        }
    }
    toggleMoneda = (tab) => {
        if(this.state.monedaTab !== tab){
            this.setState({
                monedaTab:tab
            })
        }
    }
    render(){
        const { data, cargando, page, me, costo, ganancia } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return(
            <div className="row d-flex justify-content-center">
                <div className="col-sm-12">
                    <HeaderReporte
                        subtitulo='Costos y Ganancias'
                        />
                </div>

                <div className="col-sm-12">
                <Nav tabs className="col-12 px-3">
                    <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                        <NavLink
                            className={classNames('py-2 text-center',{ active: this.props.moneda === 'GTQ' })}
                            onClick={() => { this.props.setMoneda('GTQ'); }}>
                            <h5>Quetzales</h5>
                        </NavLink>
                    </NavItem>
                    <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                        <NavLink
                            className={classNames('py-2 text-center',{ active: this.props.moneda === 'USD' })}
                            onClick={() => { this.props.setMoneda('USD'); }}>
                            <h5>Dólares</h5>
                        </NavLink>
                    </NavItem>
                </Nav>
                    <FiltroCostos {...this.props} />
                </div>
                <div className="col-sm-12">
                    <div className=" borde-superior border-completo mb-3">
                    <div className="col-md-12 row d-flex justify-content-center">
                            <div className="col-md-3 d-flex align-items-center">
                                <h5 className="m-0 text-uppercase  text-rosado text-right"><strong>Totales de producción </strong></h5>
                            </div>
                            <div className="col-md-3">
                                <h5 className="text-gris font-italic text-center text-md-right">Ganancias</h5>
                                <h3 className="text-primary text-center text-md-right"><RenderCurrency value={ganancia | 0} simbolo={this.props.simbolo}  className={'text-primary h3 font-weight-bold'}/></h3>
                            </div>
                            <div className="col-md-3">
                                <h5 className="text-gris font-italic text-center text-md-right">Costos</h5>
                                <h3 className="text-secondary text-center text-md-right"><RenderCurrency value={costo | 0} simbolo={this.props.simbolo}  className={'text-secondary h3 font-weight-bold'}/> </h3>
                            </div>
                        </div>
                    </div>
                    <CostosGananciasGrafica {...this.props}/>
                </div>
                <div className="col-sm-12">
                    <Nav tabs className="col-12 px-3">
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'T' })}
                                onClick={() => { this.toggle('T'); }}>
                                <h5>Costos</h5>
                            </NavLink>
                        </NavItem>
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'D' })}
                                onClick={() => { this.toggle('D'); }}>
                                <h5>Ganancias</h5>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} className="mt-0">
                        <TabPane  tabId={'T'}>
                            <CostosGrid {...this.props} />
                        </TabPane>
                    <TabPane  tabId={"D"}>
                            <GananciaGrid {...this.props} />
                        </TabPane>
                    </TabContent>
                </div>


            </div>
        )
    }
}

