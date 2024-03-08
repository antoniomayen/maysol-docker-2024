import React from 'react';
import classNames from 'classnames'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize';
import moment from 'moment';
import es from 'moment/locale/es';
import 'react-dates/lib/css/_datepicker.css';

export default class renderDatePickerDepositos extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          dpFocused: false
      };

      this.onFocusChange = this.onFocusChange.bind(this)
  }

  onFocusChange({ focused }) {
      this.setState({ dpFocused: focused })
  }

  render() {
      const { input, className, numberOfMonths, placeholder, id, meta: { touched, error }, month, anio } = this.props;
      const invalid = touched && error;
        moment.locale('es');
        const _mes = month > 9 ? month : `0${month}`;
      return (
          <div className={classNames(`${className}`, { 'is-invalid': invalid })}>
              <SingleDatePicker
                    placeholder={placeholder}
                    initialVisibleMonth={() => moment(`${anio}-${_mes}-01`)}
                    date={input.value ? moment(input.value) : null }
                    focused={this.state.dpFocused}
                    isOutsideRange={() => false}
                    onDateChange={(value) => {
                        input.onChange( value );
                    }}
                    isDayBlocked={(day) => {
                        let fecha= `${anio}-${month}-${1}`;
                        let anterior = moment(fecha);
                        let siguiente =  moment(anterior).add(1,'months');
                        if ( new Date(day) < new Date(anterior._d) || new Date(siguiente) < new Date(day))
                            return true;
                    }}
                    onFocusChange={this.onFocusChange}
                    numberOfMonths={numberOfMonths}
                    id={id ? id : "unique"}
                />
              {invalid && <div className="invalid-feedback">
                  {error}
              </div>}
          </div>
      )
  }
}
