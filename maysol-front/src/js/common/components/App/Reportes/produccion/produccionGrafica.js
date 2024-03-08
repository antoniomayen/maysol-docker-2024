import React, { Component } from 'react';
import { renderSelectField } from 'Utils/renderField';
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import 'react-dates/lib/css/_datepicker.css';
import { Line } from 'react-chartjs-2';
import LoadMask from 'Utils/LoadMask';

class ProduccionGrafica extends Component {

  constructor(props){
    super(props);

  }


  render() {
    return (
        <div className=" borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pl-3 m-0">
                <div className="col-md-12">
                    <div className="titulo p-0">
                        <h5 className="m-0 text-uppercase text-center text-md-left text-rosado"><strong>Gráfica de producción</strong></h5>
                    </div>
                </div>


                <div className="col-md-12">
                    <LoadMask loading={this.props.loadingGrafica}  blur_1>
                        <Line data={this.props.grafica}
                            height={500}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                            }}/>
                    </LoadMask>

                </div>
            </div>

        </div>

    );
  }
}

export default ProduccionGrafica;
