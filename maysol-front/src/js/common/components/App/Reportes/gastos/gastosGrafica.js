import React, { Component } from 'react';
import { renderSelectField } from 'Utils/renderField';
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import 'react-dates/lib/css/_datepicker.css';
// import { Multi } from 'react-chartjs-2';
import NVD3ChartMask from "../../../Utils/Graficas/NDV3ChartMask";
import {formatos, opcionesG1, sinTitulos, tooltips, colores, addHideTooltip, funciones} from 'Utils/Graficas/opciones';
import LoadMask from 'Utils/LoadMask';
class CostosGananciasGrafica extends Component {

  constructor(props){
    super(props);

  }


  render() {
      const { datum_gastos, ganancia, costo } = this.props;

    let options2 = _.cloneDeep(opcionesG1.optionsMedia);
    options2.width = 1500;
    options2.rotateLabels = -70;
    if (this.props.moneda === 'GTQ'){
        options2.valueFormat = formatos.valueFormat1fQ
        options2.tooltip = tooltips.tooltip2fQ
    }else{
        options2.valueFormat = formatos.valueFormat1fUSD
        options2.tooltip = tooltips.tooltip2fUSD
    }
    setTimeout( funciones.addVerticalLabels , 800, 'Costo')
    // setTimeout(funciones.changeLabels, 800, pais, bancos);
    return (
        <div className=" borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pl-3 m-0">
                <div className="col-md-12">
                    <div className="titulo p-0">
                        <h5 className="m-0 text-uppercase text-center text-md-left text-rosado"><strong>Gráfica Costos y Ganancias </strong></h5>
                    </div>
                </div>


                <div className="col-sm-12 col-centered">

                        <div className="row">

                                <div className="horizontal-scroll">
                                    <LoadMask loading={this.props.loadingGrafica}  blur_1>
                                        <NVD3ChartMask id="gananciaGrafica" {...options2} datum={datum_gastos} height={500} />
                                    </LoadMask>
                                </div>

                        </div>
                    {/* <Line data={this.props.grafica}
                        height={500}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                        }}/> */}

                </div>
                <div className="col-12 py-3 d-flex justify-content-center bd-highlight">
                    <div className="col-12 col-md-10 col-lg-4">
                        <div className="row">
                            <div className="d-flex justify-content-center align-content-center col-6 col-md-6 px-0">
                                <span className="fixed-size-square-ganancias"></span>&nbsp;<span>Ganancias</span>
                            </div>
                            <div className="d-flex justify-content-center align-content-center col-6 col-md-6 px-0">
                                <span className="fixed-size-square-costos"></span>&nbsp;<span>Costos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
  }
}

export default CostosGananciasGrafica;


