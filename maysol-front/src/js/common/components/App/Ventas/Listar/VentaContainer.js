import React, { Component } from 'react'
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import VentasGrid from './VentasGrid';
import LoadMask from 'Utils/LoadMask';
import VentaHistoria from './VentaHistoria';
export default class VentaContainer extends Component {
    state = {
        activeTab: 'Ventas'
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }
    render() {
        const { cargando, loader_v } = this.props;
        return (
            <div>
                <Nav tabs className="col-12  px-3 ">
                    <NavItem className="col-3 col-md-2 pl-0 pr-0">
                        <NavLink
                            className={classNames('py-2 text-center', { active: this.state.activeTab === 'Ventas' })}
                            onClick={() => { this.toggle('Ventas'); }}>
                            <h5>Ventas</h5>
                        </NavLink>
                    </NavItem>
                    <NavItem className="col-3 col-md-2 pl-0 pr-0">
                        <NavLink
                            className={classNames('py-2 text-center', { active: this.state.activeTab === 'Historia' })}
                            onClick={() => { this.toggle('Historia'); }}>
                            <h5>Cajas histórico</h5>
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab} className="mt-0">
                    <TabPane tabId={"Ventas"}>
                        <LoadMask loading={loader_v} dark blur>
                            {
                                this.state.activeTab =='Ventas' && (
                                    <VentasGrid {...this.props} />
                                )
                            }
                        </LoadMask>
                    </TabPane>
                    <TabPane tabId={"Historia"}>
                        <LoadMask loading={loader_v} dark blur>
                            {
                                this.state.activeTab == 'Historia' && (
                                    <VentaHistoria {...this.props} />
                                )
                            }
                        </LoadMask>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}
