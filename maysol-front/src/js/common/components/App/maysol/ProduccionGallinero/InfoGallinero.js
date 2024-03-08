import React from 'react'
import PropTypes from 'prop-types'
import logoGallina from '../../../../../../assets/img/icons/iconoGallinero.png';
import LoadMask from 'Utils/LoadMask';
import { dateFormatter } from 'Utils/renderField/renderReadField';
import NumberFormat from "react-number-format";

export const RenderCurrency = ({value, className, simbolo='Q'}) => {
    return (
        <NumberFormat
            className={className}
            decimalScale={2}
            fixedDecimalScale={true}
            value={value? value.toFixed(2): 0}
            thousandSeparator={true}
            prefix={simbolo} displayType={"text"}
        />
    )
};

export default class InfoGallinero extends React.Component {

    componentWillMount() {

    }
    decimalFormater = (value) =>{
        let peso= 0;
        try {
            peso = Number((value).toFixed(2))
        } catch (error) {

        }
        return(
            <span> {peso}</span>
        )
    }
    alimentoTotal = (row) =>{
        let libras = 0.00220462;
        let cantidadtotal = 0
        try {
            cantidadtotal = libras * row.cantidad_alimento * row.no_gallinas;
            cantidadtotal = Number((cantidadtotal).toFixed(2));
        } catch (error) {

        }

        return(
            <span>{cantidadtotal}lb </span>
        )
    }
    aguaTotal = (row) =>{
        let cantidadtotal = 0
        try {
            cantidadtotal = row.cantidad_agua * row.no_gallinas;
            cantidadtotal = Number((cantidadtotal).toFixed(2));
        } catch (error) {

        }

        return(
            <span>{cantidadtotal}l</span>
        )
    }
    render(){
        const {updateData} = this.props;
        return(

            <div className="border-completo mb-3">
                <div className="row col-md-12">
                    <div className="col-12 col-md-auto fondo-iconogallinero borde-radius p-5 d-flex justify-content-center">
                        <img src={logoGallina} width={130} height={130} alt="logo gallinas"/>
                    </div>
                    <div className="col p-3 tabla-margen">
                        <LoadMask loading={this.props.cargando}  blur_1>
                            {/* primer bloque */}
                            <div className="row p-3 m-0">
                                <div className="col-md-4 p-0 align-items-cente font-weight-bold">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">SEMANA: </span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;{updateData.semana}</td>
                                            </tr>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">No Gallinas:</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;{updateData.no_gallinas} </td>
                                            </tr>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">Peso:</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;{updateData.peso_promedio} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4 p-0 align-items-cente font-weight-bold">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">Grs. alimento :</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;{updateData.gramos} grs.</td>
                                            </tr>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">Salario:</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;<RenderCurrency value={updateData.salario} /></td>
                                            </tr>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">Medicina:</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;<RenderCurrency value={updateData.medicina} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4 p-0 align-items-cente font-weight-bold">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">Precio de cartones :</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;<RenderCurrency value={updateData.cartonP} /></td>
                                            </tr>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">Precio de concentrado:</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;<RenderCurrency value={updateData.concentradoP} /></td>
                                            </tr>
                                            <tr>
                                                <td><span className="text-gris font-italic d-inline mr-2">Insumos:</span></td>
                                                <td>&nbsp;&nbsp;&nbsp;&nbsp;<RenderCurrency value={updateData.insumos} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </LoadMask>
                    </div>
                </div>

            </div>
        )
    }
}
