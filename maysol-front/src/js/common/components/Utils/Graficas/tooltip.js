import  { dateFormatter } from '../renderField/renderReadField';
function createTooltip(d, base, decimales = 1, moneda = '', header = true, absolute = false) {
    const headerhtml = '<thead><tr><td colspan="3"><strong class="x-value">' + d.data.label + '</strong></td></tr></thead>';
    let bodyhtml = '<tbody>';
    let series = d.series;
    series.forEach(function(c) {
      if (absolute) {
        c.value = Math.abs(c.value);
      }
      const value = `${moneda} ${c.value.toFixed(decimales)}`;
      bodyhtml = bodyhtml + '<tr>' +
        '<td class="legend-color-guide">' +
        '<div style="background-color: ' + c.color + ';"></div>' +
        '</td>' +
        '<td class="key">' + c.key + '</td>' +
        '<td class="value">' + value + '</td>' +
        '</tr>';
    });
    // bodyhtml = bodyhtml + '<tr><td></td><td>Base: ' + base + '</td></tr>';
    bodyhtml = bodyhtml + '</tbody>';
    if (header) {
      return '<table>' + headerhtml + bodyhtml + '</table>';
    }
    return '<table>' + bodyhtml + '</table>';
  }

  export { createTooltip };
