import React, { Component } from 'react'
import VentasGrid from './VentasGrid';
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
                <VentasGrid {...this.props} />
            </div>
        )
    }
}
