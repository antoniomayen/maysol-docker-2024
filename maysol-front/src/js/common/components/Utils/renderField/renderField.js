import React from 'react';
import { AsyncCreatable, Async } from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import Select, { components } from 'react-select';


import NumberFormat from 'react-number-format';
import classNames from 'classnames';
import Switch from "react-switch";
import FileUploader from '../FileUploader/FileUploader';
import TimePicker from 'react-time-picker';
import { find } from 'lodash';


export const renderField = ({ input, disabled, addClass, label, type, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
            <input {...input} placeholder={label} type={type} disabled={disabled}
                step={0.01}
                className={classNames('form-control', { 'is-invalid': invalid }, addClass)} />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};

export const renderTextArea = ({ input, disabled, label, rows, type, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
            <textarea disabled={disabled} {...input} placeholder={label} style={{ resize: "none" }} rows={rows ? rows : 3}
                className={classNames('form-control', { 'is-invalid': invalid })} />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};
export const renderSearchSelect = ({ input, disabled, loadOptions, onCambio, valueKey, labelKey, meta: { touched, error, dirty } }) => {
    const invalid = Boolean((dirty && error) || (touched && error));
    return (
        <div>
            <Async
                disabled={disabled}
                value={input.value}
                placeholder="Buscar..."
                className={classNames('', { 'is-invalid': invalid })}
                onChange={(e) => {
                        input.onChange(e?e[valueKey]:null);
                        if(onCambio){
                            onCambio(e)
                        }
                    }
                }
                searchPromptText="Escriba para buscar" valueKey={valueKey} labelKey={labelKey}
                loadOptions={loadOptions} />
            {invalid && <div className="required-text">
                {error}
            </div>}
        </div>
    )
};
export const renderCreateSelect = ({ input, disabled, opciones, onCambio, valueKey, labelKey, meta: { touched, error, dirty } }) => {
    const invalid = Boolean((dirty && error) || (touched && error));
    let _opciones = []
    if (opciones.length > 0){
        opciones.forEach((opcion) => {
            _opciones.push({value: opcion[valueKey], label: opcion[labelKey]})
        })
    }
    return (
        <div>
            <CreatableSelect
                isClearable
                disabled={disabled}
                value={input.value}
                placeholder="Buscar o Crear..."
                className={classNames('', { 'is-invalid': invalid }, {'disabled': disabled})}
                onChange={(e) => {
                    input.onChange(e ? e : null);
                }}
                searchPromptText="Escriba para buscar"
                options={_opciones }
            promptTextCreator={(label) => { return `Crear opción: ${label}` }}
            />
            {invalid && <div className="required-text">
                {error}
            </div>}
        </div>
    )
};

export const renderSearchCreateSelect = ({ input, disabled, loadOptions, valueKey, labelKey, meta: { touched, error, dirty } }) => {
    const invalid = Boolean((dirty && error) || (touched && error));
    return (
        <div>
            <AsyncCreatable disabled={disabled} placeholder="Buscar o Crear..." value={input.value}
                            className={classNames('', { 'is-invalid': invalid })}
                            onChange={(e) => { input.onChange(e[valueKey]); }}
                            searchPromptText="Escriba para buscar" valueKey={valueKey} labelKey={labelKey}
                            loadOptions={loadOptions} promptTextCreator={(label) => { return `Crear opción: ${label}` }} />
            {invalid && <div className="required-text">
                {error}
            </div>}
        </div>
    )
};

export const renderSelectField = ({ input, disabled, options, onCambio, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
            <select {...input} disabled={disabled} className={classNames('form-control', { 'is-invalid': invalid })}
                    onChange={(e) => {
                        input.onChange(e?e: null);
                        if(onCambio){
                            onCambio(e?e.target.value:null)
                        }
                    }
                    }>
                <option value=""  style={{color:'#aaaaaa !important'}}>Seleccione una opción.

                </option>
                {options.map((opcion, index) => {
                    return (<option
                        key={index}
                        value={typeof (opcion) === "string" ? opcion : opcion.value}>
                        {typeof (opcion) === "string" ? opcion : opcion.label}
                    </option>);
                })}
            </select>
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};

export const renderNumber = ({ input, label, type, decimalScale, simbolo,addClass, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
            <NumberFormat className={classNames('form-control', { 'is-invalid': invalid}, addClass)}
                          disabled={true}
                decimalScale={decimalScale ? decimalScale : 0} fixedDecimalScale={true}
                value={input.value} thousandSeparator={true} prefix={simbolo?simbolo: ''}
                onValueChange={(values) => {
                    input.onChange(values.value);
                }}
            />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};

export const renderCurrency = ({ input, _onChange, label, type, disabled, addClass, meta: { touched, error }, simbolo='Q ' }) => {
    const invalid = touched && error;
    return (
        <div>
            <NumberFormat className={classNames('form-control', { 'is-invalid': invalid }, addClass)}
                decimalScale={2} fixedDecimalScale={true}
                disabled={disabled}
                value={input.value} thousandSeparator={true} prefix={simbolo}
                onValueChange={(values) => {
                    input.onChange(values.value);
                    if (!!_onChange) {
                        _onChange(values.floatValue);
                    }
                }}
            />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};
export const renderPercentage = ({ input, _onChange, type, disabled, addClass, meta: { touched, error }, simbolo=' %' }) => {
    const invalid = touched && error;
    return (
        <div>
            <NumberFormat className={classNames('form-control', { 'is-invalid': invalid }, addClass)}
                          decimalScale={2} fixedDecimalScale={true}
                          disabled={disabled}
                          value={input.value} thousandSeparator={true} suffix={simbolo}
                          onValueChange={(values) => {
                              input.onChange(values.value);
                              if (!!_onChange) {
                                  _onChange(values.floatValue);
                              }
                          }}
            />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};
export const renderSwitch = ({ input, label, type, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
            <Switch
                onColor="#45315d"
                onChange={(value) => {
                    input.onChange(value);
                }}
                checked={input.value ? input.value : false}
                id="normal-switch"
            />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};


export const renderNoAsyncSelectField = ({ input,searchable,  clearable, disabled, options,onCambio, valueKey,isMulti, labelKey,
                                             styles, addClass, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
            <Select clearable={clearable}
                    searchable={searchable}
                    disabled={disabled}
                    value={ options.find(o => o.value  === input.value)}
                    className={classNames('form-control p-0 select-reset', { 'is-invalid': invalid }, addClass,
                        {'disabled': disabled})}
                    isMulti={ isMulti }
                    onChange={(e) => {
                        input.onChange(e ? e.value : null);
                        if(onCambio){
                            onCambio(e)
                        }
                    }}
                    defaultMenuIsOpen={true}
                    classNamePrefix="react-select"
                    cache={false}
                    placeholder="Escriba para buscar"
                    key={valueKey}
                    defaultOptions
                    options={ options }
                    styles={{
                        color: "gray"
                    }}
                    searchPromptText="Escriba para buscar"
                    getOptionValue={(option) => (option[valueKey])}
                    getOptionLabel={(option) => (option[labelKey])}/>
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};

export const renderImagePicker = ({photo, className, placeholder, input, label, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div className={classNames(`${className}`, { 'is-invalid': invalid })}>
            <FileUploader
            img= {photo?`/static/uploads/vehicles/${photo}`:null}
            onFileChange={(e, file) => {
                file = file || e.target.files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    input.onChange(reader.result);
                };

                reader.readAsDataURL(file);
            }} />
            {invalid && <div className="invalid-feedback">
                {error}
            </div>}
        </div>
    )
};

export const renderFieldCheck = ({ input, label, value, onChangeBe, disabled, type, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div>
            <input {...input} placeholder={label} type={type}
                disabled={disabled?'disabled':''}
                onChange={(valu) => {
                    if (onChangeBe) onChangeBe(valu.target.value);
                    input.onChange(valu);
                }}
                className={classNames('form-check-input', { 'is-invalid': invalid })} />
            {invalid && <div className="invalid-feedback" >
                {error}
            </div>}
        </div>
    )
};
export const renderTimeField = ({ required, name, className, input, label, disabled, type, meta: { touched, error } }) => {
    const invalid = touched && error;
    return (
        <div className={classNames( { 'is-invalid': invalid })}>
            <TimePicker
                maxDetail="minute"
                locale="en-US"
                disableClock={ true }
                clearIcon={ null }
                name={ name }
                value={ input.value }
                onChange={(value) => {
                    input.onChange(value);
                }}/>
            {invalid && <div className="invalid-feedback" >
                {error}
            </div>}
        </div>
    )
};


export const RenderField = {
    renderField,
    renderTextArea,
    renderSearchSelect,
    renderSearchCreateSelect,
    renderSelectField,
    renderNumber,
    renderCurrency,
    renderSwitch,
    renderFieldCheck,
    renderTimeField,
    renderCreateSelect
};
