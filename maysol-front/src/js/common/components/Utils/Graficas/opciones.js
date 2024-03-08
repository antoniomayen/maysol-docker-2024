import d3 from 'd3';
import { createTooltip } from './tooltip';
import moment from "moment/moment";
import  { dateFormatter } from '../renderField/renderReadField';

export function hideTooltip() {
  d3.selectAll('.nvtooltip').style('opacity', 0);
}

const request = require('superagent');

function getMes(numero) {
  switch (numero) {
    case 0:
      return "Enero";
    case 1:
      return "Febrero";
    case 2:
      return "Marzo";
    case 3:
      return "Abril";
    case 4:
      return "Mayo";
    case 5:
      return "Junio";
    case 6:
      return "Julio";
    case 7:
      return "Agosto";
    case 8:
      return "Septiembre";
    case 9:
      return "Octubre";
    case 10:
      return "Noviembre";
    case 11:
      return "Diciembre";
  }
}
function getFecha(numero) {
  const n = numero.toString();
  if (n.length === 7){
    return `${n.substring(5,7)}-${n.substring(4,6)}-${n.substring(0,4)}`;
  } else
    return `${n.substring(6,8)}-${n.substring(4,6)}-${n.substring(0,4)}`;
}
// -----------
// FORMATOS
// -----------
const valueFormat1f = (d) => {
  return d3.format(',1.f')(d);
};
const valueFormat1fQ = (d) => {
  return `Q. ${d3.format(',1.f')(d)}`;
};
const valueFormat1fUSD = (d) => {
    return `$. ${d3.format(',1.f')(d)}`;
  };
const valueFormat2f = (d) => {
  return d3.format(',2.f')(d);
};
export const formatos = { valueFormat2f , valueFormat1fQ, valueFormat1fUSD };
// -----------
// TOOLTIPS
// -----------
const tooltip1f = {
  contentGenerator: (d) => {
    return createTooltip(d, d.data.base, 1);
  },
};
const tooltip2f = {
  contentGenerator: (d) => {
    return createTooltip(d, d.data.base, 2);
  },
};
const tooltip2fQ = {
  contentGenerator: (d) => {
    if (!d.data){
      d.data = d.point
    }
    return createTooltip(d, d.data.base, 2, 'Q');
  },
};
const tooltip2fUSD = {
    contentGenerator: (d) => {
      if (!d.data){
        d.data = d.point
      }
      return createTooltip(d, d.data.base, 2, '$');
    },
  };
const tooltipNoHeader = {
  contentGenerator: (d) => {
    return createTooltip(d, d.data.base, 1, '', false);
  },
};
export const tooltips = { tooltip1f, tooltip2fQ,tooltip2fUSD, tooltip2f, tooltipNoHeader };
// -----------
// OPCIONES G1
// -----------

const optionsMedia = {
  type: 'multiBarChart',
  callback(chart) {
    setTimeout(hideTooltip, 100);
  },
  noData: 'No hay datos disponibles',
  height: 450,
  x: (d) => { return d.label; },
  y: (d) => { return d.value; },
  showControls: false,
  showLegend: false,
  showValues: true,
  width: undefined,
  stacked: false,
  transitionDuration: 500,
  forceY: [0, 10],
  reduceXTicks: false,
  yAxis: {
    // axisLabel: 'Values',
    tickFormat: (d) => {
      return d3.format('d')(d);
    },
  },
  margin: {
    top: 25,
    right: 30,
    bottom: 65,
    left: 55,
  },
};

const optionsMedia2 = {
  type: 'lineChart',
  callback(chart) {
    setTimeout(hideTooltip, 100);
  },
  noData: 'No hay datos disponibles',
  height: 450,
  showControls: false,
  showLegend: false,
  showValues: true,
  useInteractiveGuideline:true,
  transitionDuration: 500,
  xAxis: {
    tickFormat: (d) => {
      return getMes(d);
    }
  },
  yAxis: {
    // axisLabel: 'Values',
    tickFormat: (d) => {
      try{
        return d3.format('d')(d);
      } catch (e) {
        return 0;
      }
    },
  },
  margin: {
    top: 25,
    right: 30,
    bottom: 45,
    left: 55,
  },
};

const optionsMedia3 = {
  type: 'lineChart',
  callback(chart) {
    setTimeout(hideTooltip, 100);
  },
  noData: 'No hay datos disponibles',
  height: 210,
  showControls: false,
  showLegend: false,
  showValues: true,
  // useInteractiveGuideline:true,
  transitionDuration: 500,
  xAxis: {
    tickFormat: (d) => {
      return getFecha(d);
    }
  },
  yAxis: {
    // axisLabel: 'Values',
    tickFormat: (d) => {
      return d3.format('d')(d);
    },
  },
  margin: {
    top: 15,
    right: 30,
    bottom: 15,
    left: 50,
  },
};
export const opcionesG1 = { optionsMedia, optionsMedia2, optionsMedia3 };
// -----------
// FUNCIONES DE ETIQUETADOS
// -----------

function valueFormatter(d, v = 1, unidad = '%') {
  const formatoV = `,.${v}f`;
  return d3.format(formatoV)(d) + unidad;
}

function addHorizontalLabels(graphId) {
  const svg = d3.selectAll(`#${graphId} .nv-group`);
  svg.each(function (upbar) {
    const g = d3.select(this);
    // Remover los labels anteriores si existian
    g.selectAll('text.bar-values').remove();
    g.selectAll('.nv-bar').each(function (bar) {
      const b = d3.select(this);
      const barWidth = b.node().getBBox().width;
      const barHeight = b.node().getBBox().height;

      if (barWidth > 20) {
        g.append('text')
        // Transforms shift the origin point then the x and y of the bar
        // is altered by this transform. In order to align the labels
        // we need to apply this transform to those.
          .attr('transform', b.attr('transform'))
          .text(() => {
            const v = parseFloat(bar.y);
            if (v === v) {
              return valueFormatter(v);
            }
          })
          .attr('y', function () {
            // Center label vertically
            const height = this.getBBox().height;
            return (parseFloat(barHeight) / 2) + (height / 2);
          })
          .attr('x', function () {
            // Center label horizontally
            const width = this.getBBox().width;
            return (parseFloat(barWidth) / 2) - (width / 2);
          })
          .attr('class', 'bar-values');
      }
    });
  });
}

function addVerticalLabels(graphId) {
  const svg = d3.selectAll(`#${graphId} .nv-group`);
  svg.each(function (upbar) {
    const g = d3.select(this);
    // Remover los labels anteriores si existian
    g.selectAll('text.bar-values').remove();
    g.selectAll('.nv-bar').each(function (bar) {
      const b = d3.select(this);
      const barWidth = b.node().getBBox().width;
      const barHeight = b.node().getBBox().height;
      const barX = parseFloat(b.attr('x'));
      const barY = parseFloat(b.attr('y'));

      if (barWidth > 33) {
        g.append('text')
        // Transforms shift the origin point then the x and y of the bar
        // is altered by this transform. In order to align the labels
        // we need to apply this transform to those.
          .attr('transform', b.attr('transform'))
          .text(() => {
            const v = parseFloat(bar.y);
            return valueFormatter(v);
          })
          .attr('y', function () {
            // Center label vertically
            const height = parseFloat(this.getBBox().height);
            return barY + (barHeight / 2) + (height / 2);
          })
          .attr('x', function () {
            // Center label horizontally
            const width = parseFloat(this.getBBox().width);
            return (barX + (barWidth / 2)) - (width / 2);
          })
          .attr('class', 'bar-values');
      }
    });
  });
}
export function addHideTooltip() {
  const svg = d3.selectAll('.nv-group');
  svg.selectAll('.nv-bar').on('mouseout', (d) => {
    d3.selectAll('.nvtooltip').style('opacity', 0);
  });
}
export const funciones = {
  addHorizontalLabels,
  addVerticalLabels,
};
export const colores = ['rgba(69, 49, 93, 0.80)',
'rgba(226, 70, 71, 0.80)',
'rgba(35, 112, 160,0.80)',
'rgba(80, 154, 174, 0.8)',
'rgba(235, 235, 235,0.9)'];
export const grises = ['#7C7C7C', '#8C8C8C', '#9C9C9C'];
