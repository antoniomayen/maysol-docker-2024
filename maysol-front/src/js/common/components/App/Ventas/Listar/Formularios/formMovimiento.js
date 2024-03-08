import React from 'react';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import { renderField } from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker'
import { dateFormatter } from 'Utils/renderField/renderReadField';
import { Link } from 'react-router-dom';
import CardGrandeForm from '../../../../Utils/Cards/cardGrande';
import { connect } from 'react-redux';

let MovimeintoForm = (props) => {
    const { handleSubmit } = props;

    return <form onSubmit={handleSubmit}>
        <CardGrandeForm titulo="DEPOSITO de CUENTA" col>
            <div className="form-group grid-container row">
                <div className="col-lg-3">
                    <label htmlFor="fecha">Fecha:</label>
                    <Field
                        name="fecha"
                        className=""
                        component={renderDatePicker}
                        placeholder="Fecha"
                        numberOfMonths={1}
                    />
                </div>
                <div className="col-lg-3">
                    <label htmlFor="noDocumento">
                        No. Boleta
                    </label>
                    <Field name="noDocumento" component={renderField} type="text" className="form-control" />
                </div>
                <div className="col-lg-2">
                    <br/>
                    <button type="submit" className="btn btn-rosado w-100">
                        Guardar
                    </button>
                </div>
            </div>
        </CardGrandeForm>
    </form>;
}

MovimeintoForm = reduxForm({
    enableReinitialize: true,
    form: 'movimiento',
    validate: (data) => {
        const errors = {}
        if (!data.fecha) errors.fecha = 'Campo requerido';
        if (!data.noDocumento) errors.noDocumento = 'Campo requerido';
        return errors;
    },
})(MovimeintoForm);

export default MovimeintoForm;
