import React, { Component } from 'react';
import { renderSelectField } from 'Utils/renderField';
import { RenderCurrency } from 'Utils/renderField/renderReadField'
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import classNames from 'classnames'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize';
import moment from 'moment';
import es from 'moment/locale/es';
import 'react-dates/lib/css/_datepicker.css';

class FiltroProduccion extends Component {
    state = {
        dateStart: moment.now(),
        focusedStart: false,

        dateEnd: moment.now(),
        focusedEnd: false,
    }
  constructor(props){
    super(props);

  }

  render() {
    return (
        <div className=" borde-superior border-completo mb-3">
            <div className="col-12 row pb-2 pt-3 pl-3 m-0">
                <div className="col-md-2 form-group">
                        <label className="m-0">Empresa</label>
                        <Select
                            value={this.props.empresa}
                            onChange={this.props.setEmpresa}
                            placeholder="todos"
                            options={this.props.empresas}
                        />
                </div>
                <div className="col-md-2 form-group">
                    <label className="m-0">Fecha Inicial</label>

                    <SingleDatePicker
                        placeholder={"Fecha Inicio"}
                        date={this.props.dateStart ? moment(this.props.dateStart ) : null}
                        focused={this.state.focusedStart}
                        isOutsideRange={() => false}
                        onDateChange={(value) => {
                           this.setState({dateStart:value})
                           this.props.setDateStart(value)
                        }}

                        onFocusChange={({ focused }) => this.setState({ focusedStart: focused })}
                        numberOfMonths={1}
                        id={"dateStart"}
                    />
                </div>
                <div className="col-md-2 form-group">
                    <label className="m-0">Fecha Final</label>
                    <SingleDatePicker
                        placeholder={"Fecha Inicio"}
                        date={this.props.dateEnd ? moment(this.props.dateEnd ) : null}
                        focused={this.state.focusedEnd}
                        isOutsideRange={() => false}
                        onDateChange={(value) => {
                           this.setState({dateEnd:value})
                           this.props.setDateEnd(value);
                        }}

                        onFocusChange={({ focused }) => this.setState({ focusedEnd: focused })}
                        numberOfMonths={1}
                        id={"dateStart"}
                    />
                </div>

                <div className="col-md-2 form-group">
                        <label className="m-0">Vendedor</label>
                        <Select
                            value={this.props.vendedor}
                            onChange={this.props.setVendedor}
                            placeholder="todos"
                            options={this.props.vendedores}
                        />
                </div>
                <div className="col-md-2 form-group">
                        <label className="m-0">No. Boleta</label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.props.noBoleta}
                            onChange={this.props.setNoBoleta}
                            placeholder="No. Boleta"
                        />
                </div>
                <div className="col-md-2 form-group align-self-center">
                    <button onClick={this.props.exportarExcel} type="button"
                        className="btn btn-rosado m-1 d-flex align-items-center text-center justify-content-center">
                        Exportar excel
                    </button>
                </div>
            </div>

        </div>

    );
  }
}

export default FiltroProduccion;
