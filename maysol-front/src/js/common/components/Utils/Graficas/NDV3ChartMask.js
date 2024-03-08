import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';

class NVD3ChartMask extends Component {
  render() {
    const datum = this.props.datum;
    if (datum.length > 0) {
      return (<NVD3Chart {...this.props} />);
    }
    let altura = 280;
    if (this.props.height !== undefined) {
      altura = this.props.height;
    }
    const height = { height: `${altura}px` };
    const anchor = { lineHeight: `${altura}px` };
    return (<div className="nv-chart text-center" style={height}><span style={anchor}>{'No hay datos disponibles'}</span></div>);
  }
}

NVD3ChartMask.propTypes = { };

export default NVD3ChartMask;
