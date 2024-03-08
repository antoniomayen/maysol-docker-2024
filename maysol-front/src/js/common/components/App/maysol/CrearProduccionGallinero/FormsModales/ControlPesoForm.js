import React from 'react';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { validate, validators } from 'validate-redux-form';
import { renderField, renderTextArea, renderTimeField } from 'Utils/renderField/renderField';
import renderDatePicker from 'Utils/renderField/renderDatePicker';
import { api } from 'api/api';
import _ from 'lodash';
import { Accordion } from 'react-accessible-accordion';
import { Card, CardBody, Collapse } from 'reactstrap';
import { renderNumber, renderSelectField } from '../../../../Utils/renderField';
import CardGrandeForm from '../../../../Utils/Cards/cardGrande';
import { RazaGallina } from '../../../../../utility/constants';
import { Link } from 'react-router-dom';

const cuentas = [];
const empleados = [];


const renderPesos = ({ fields, meta: { error, submitFailed } }) => (
    <div className=" col-sm-12 p-0">
        <div className="col-md-12 p-0 text-center text-primary font-italic">
            <strong>Ingrese peso actual </strong>
        </div>
        <div className="col-sm-12 p-0 form-group np-r">
            <table className="table table-sm  m-0">
                <tbody>
                    {fields.map((peso, index) => (
                        <tr key={index}>
                            <td className="sin-borde-top text-center">
                                Gallina
                                {' '}
                                {index + 1}
                            </td>
                            <td className="sin-borde-top">
                                <Field
                                    name={`${peso}.peso`}
                                    type="number"
                                    component={renderField}
                                    placeholder="peso"
                                />
                            </td>
                            <td className="text-center sin-borde-top" style={{ width: '10%' }}>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-normal "
                                    onClick={() => {
                                        fields.remove(index);
                                    }}
                                >
X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-center mt-2">
                <button type="button" className="btn btn-secondary" onClick={() => fields.push({})}>
                        Agregar gallina
                </button>
            </div>
        </div>
    </div>
);

class PesoForm extends React.Component {
    state = {
        isOpen: false,
        isOpenP: false,
        isOpenG: false,
        disable: false,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps !== nextContext) {
            if (nextProps.updateData.ultimoRegistro && !this.props.editar) {
                this.setState({ disable: true });
            }
        }
    }

    componentWillUnmount() {
        this.props.resetData();
    }

    render() {
        const { handleSubmit, editar } = this.props;
        const { isOpen, isOpenP, isOpenG, disable } = this.state;
        const toggle = () => this.setState({ isOpen: !isOpen });
        const toggleP = () => this.setState({ isOpenP: !isOpenP });
        const toggleG = () => this.setState({ isOpenG: !isOpenG });
        const toggleEstado = () => this.setState({ disable: false });

        return (
            <CardGrandeForm titulo="Control Semanal">
                <form onSubmit={handleSubmit} className="m-0 p-0" style={{ width: '100%' }}>
                    <div className="w-75 m-auto">
                        <button onClick={toggleG} type="button" className="btn btn-borde w-100 d-flex align-items-center">
                            Datos Generales del Gallinero
                        </button>
                        <Collapse isOpen={isOpenG}>
                            <Card>
                                <CardBody className="div-borde align-items-center ">
                                    <div className="row w-75 m-auto">
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Fecha inicial(Gallinero):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="fecha_inicial"
                                                    className=""
                                                    component={renderDatePicker}
                                                    placeholder="Fecha"
                                                    numberOfMonths={1}
                                                    disabled={disable}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Raza gallinas:
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="raza"
                                                    component={renderSelectField}
                                                    key
                                                    type="select"
                                                    labelKey="label"
                                                    valueKey="value"
                                                    options={RazaGallina}
                                                    disabled={disable}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Edad Inicial Gallinas / Semanas:
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="edad_inicial"
                                                    type="number"
                                                    component={renderField}
                                                    disabled={disable}
                                                />
                                            </div>
                                        </div>
                                        { (!editar && disable) && (
                                            <div className="col-md-6">
                                                <div className="h-100 d-flex justify-content-center align-items-center">
                                                    <button type="button" onClick={toggleEstado} className="btn btn-secondary m-1 w-75">
                                                        Nuevo lote
                                                    </button>
                                                </div>
                                            </div>)
                                        }
                                    </div>
                                </CardBody>
                            </Card>
                        </Collapse>
                        <br />
                        <br />
                        <button onClick={toggle} type="button" className="btn btn-borde w-100 d-flex align-items-center">
                            Agregar control semanal
                        </button>
                        <Collapse isOpen={isOpen}>
                            <Card>
                                <CardBody className="div-borde align-items-center ">
                                    <div className="row w-75 m-auto">
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Fecha Registro:
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="fecha"
                                                    className=""
                                                    component={renderDatePicker}
                                                    placeholder="Fecha"
                                                    numberOfMonths={1}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                cantidad de aves:
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="cantidad_gallinas"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                salario (Q.):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="salario"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                porción alimentos(g):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="porcion_alimento"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Porción agua (l):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="porcion_agua"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Precio cartón (Q.):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="precio_carton"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Precio concentrado(Quintal):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="precio_concentrado"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Medicina (Q.):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="medicina"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Insumos (Q.):
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="insumos"
                                                    type="number"
                                                    component={renderField}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="col-12 col-md-auto text-uppercase">
                                                <label htmlFor="fecha">
                                                Observaciones:
                                                </label>
                                            </div>
                                            <div className="col-md-12">
                                                <Field
                                                    name="nota"
                                                    className=""
                                                    component={renderTextArea}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Collapse>
                        <br />
                        <br />
                        <button onClick={toggleP} type="button" className="btn btn-borde w-100 d-flex align-items-center">
                            Agregar control de peso
                        </button>
                        <Collapse isOpen={isOpenP}>
                            <Card>
                                <CardBody className="div-borde align-items-center ">
                                    <div className="form-group grid-container w-75 m-auto">
                                        <div className="padding-15 p-sm-0 pt-sm-1 pb-sm-1">
                                            <div className="row col-md-12">
                                                <div className="col-md-6">
                                                </div>
                                            </div>
                                            <div className="pb-1 pt-4 my-4 d-flex justify-content-center">
                                                <div className="col-md-8 border-naranja">
                                                    <FieldArray name="pesos" component={renderPesos} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Collapse>
                        <br />
                        <br />
                        <br />
                        <div className="row">
                            <div className="col-12 d-flex justify-content-center">
                                <Link
                                    to={`/maysol_gallineroestado/${this.props.idGallinero}`}
                                    type="button"
                                    className="btn btn-secondary m-1">
                                    <span>Cancelar</span>
                                </Link>
                                <button type="submit" className="btn btn-primary m-1">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </CardGrandeForm>
        );
    }
}

PesoForm = reduxForm({
    form: 'movimiento',
    validate: (data) => {
        return validate(data, {
            fecha_inicial: validators.exists()('Campo requerido.'),
            raza: validators.exists()('Campo requerido.'),
            edad_inicial: validators.exists()('Campo requerido.'),

            fecha: validators.exists()('Campo requerido.'),
            cantidad_gallinas: validators.exists()('Campo requerido.'),
            salario: validators.exists()('Campo requerido.'),
            porcion_alimento: validators.exists()('Campo requerido.'),
            precio_carton: validators.exists()('Campo requerido.'),
            precio_concentrado: validators.exists()('Campo requerido.'),

            // hora: validators.exists()('Campo requerido'),
            // comentario: validators.exists()('Campo requerido.'),
        });
    },
    initialValues: {
        pesos: [
            {},
        ],
    },
})(PesoForm);

export default PesoForm;
