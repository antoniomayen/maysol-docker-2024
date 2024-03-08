import React from 'react';
import classNames from 'classnames'
import { SingleDatePicker } from 'react-dates'
import 'react-dates/initialize';
import moment from 'moment';
import es from 'moment/locale/es';
import 'react-dates/lib/css/_datepicker.css';

export default class renderDatePickerNoLimit extends React.Component {
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
