import React from 'react';
import classNames from 'classnames'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize';
import moment from 'moment';
import es from 'moment/locale/es';
import 'react-dates/lib/css/_datepicker.css';

export default class renderDatePicker extends React.Component {
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
      const { input, disabled, className, numberOfMonths, placeholder, id, meta: { touched, error } } = this.props;
      const invalid = touched && error;
        moment.locale('es')
      return (
          <div className={classNames(`${className}`, { 'is-invalid': invalid })}>
              <SingleDatePicker
                  disabled={disabled}
                    placeholder={placeholder}
                    date={input.value ? moment(input.value) : null}
                    focused={this.state.dpFocused}
                    isOutsideRange={() => false}
                    onDateChange={(value) => {
                        input.onChange( value );
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

// Datepicker con  condiciones
{/* <SingleDatePicker
                  disabled={disabled}
                    placeholder={placeholder}
                    date={input.value ? moment(input.value) : null}
                    focused={this.state.dpFocused}
                    isOutsideRange={() => false}
                    onDateChange={(value) => {
                        input.onChange( value );
                    }}
                    isDayBlocked={(day) => {
                        let today = new Date();
                        let mesAntes = moment().subtract(1,'months');
                        today = moment();
                        let hoy = new Date(new Date().getFullYear(), new Date().getMonth()  , new Date().getDate(),0,0,0,0);
                        let actual = new Date(day._d.getFullYear(), day._d.getMonth(), day._d.getDay(),0,0,0,0)
                        mesAntes = new Date(mesAntes._d.getFullYear(), mesAntes._d.getMonth(), "1");

                        if ( new Date(day) < mesAntes )
                            return true;


                    }}
                    onFocusChange={this.onFocusChange}
                    numberOfMonths={numberOfMonths}
                    id={id ? id : "unique"}
                /> */}
