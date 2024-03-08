import React from 'react';
import classNames from 'classnames';

import Select from 'react-select-plus';
import 'react-select-plus/dist/react-select-plus.css';

export const renderSelectPlusField = ({ input,  clearable, disabled, options, valueKey,isMulti, labelKey, styles, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
             <Select

                    value={input.value}
                    className={classNames('form-control p-0 select-reset', { 'is-invalid': invalid })}
                   onChange={(e) => {
                        input.onChange(e ? e.value : null);
                    }}
                   classNamePrefix="react-select"
                   placeholder="Escriba para buscar"
                   key={valueKey}
                   defaultOptions
                   options={ options }
                   styles={{
                       color: "gray"
                   }}
                   searchPromptText="Escriba para buscar"
                   />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};
