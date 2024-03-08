import React from 'react'
import HeaderReporte from 'Utils/Headers/HeaderReporte';
import FiltroProduccion from './filtros';
import ProduccionGrafica from './produccionGrafica';
import ProduccionGrid from './produccionGrid';
import TotalesGrid from './totalesGrid';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';

function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}

export default class ProduccionContainer extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: 'T'
        };
    }
    componentWillMount() {
        const { me } = this.props;
        this.props.listarEmpresas()

    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
            if(tab === 'T'){
                this.props.listarTotales(1);
            }else{
                this.props.listar(1);
            }
        }
    }


    render(){
        const { data, cargando, page, me } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return(
            <div className="row d-flex justify-content-center">
                <div className="col-sm-12">
                    <HeaderReporte
                        subtitulo='Producción'
                        />
                </div>

                <div className="col-sm-12">
                    <FiltroProduccion {...this.props} />
                </div>
                <div className="col-sm-12">
                    <ProduccionGrafica {...this.props}/>
                </div>
                <div className="col-sm-12">
                    <Nav tabs className="col-12 px-3">
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'T' })}
                                onClick={() => { this.toggle('T'); }}>
                                <h5>Totales</h5>
                            </NavLink>
                        </NavItem>
                        <NavItem  className="col-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'D' })}
                                onClick={() => { this.toggle('D'); }}>
                                <h5>Detalle</h5>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.activeTab} className="mt-0">
                        <TabPane  tabId={'T'}>
                            <TotalesGrid {...this.props} />
                        </TabPane>
                    <TabPane  tabId={"D"}>
                            <ProduccionGrid {...this.props} />
                        </TabPane>
                    </TabContent>
                </div>


            </div>
        )
    }
}
