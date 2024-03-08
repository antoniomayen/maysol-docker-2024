import React from 'react'
import PropTypes from 'prop-types'
import logoGallina from '../../../../../../assets/img/icons/iconoGallinero.png';
import LoadMask from 'Utils/LoadMask';
import { dateFormatter } from 'Utils/renderField/renderReadField';

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
                    <div className="col p-3">
                        <LoadMask loading={this.props.cargando}  blur_1>
                            {/* primer bloque */}
                            <div className="row p-0 m-0">
                            <div className="col-md-4 p-0 ">
                                <div className="titulo p-0">
                                    <h3 className="m-0 text-uppercase text-center text-md-left"><strong>GENERALES</strong></h3>
                                </div>
                                <div className="subtitulo p-0">
                                    <span className="text-primary">{this.props.gallinero}</span>
                                </div>
                            </div>
                            <div className="col-md-4 text-primary font-weight-bold d-flex align-items-end">
                                <span className="text-gris font-italic  mr-2">No Gallinas:</span> {updateData.no_gallinas}
                            </div>
                            <div className="col-md-4 text-primary font-weight-bold d-flex align-items-end">
                                <span className="text-gris font-italic  mr-2">Raza:</span> {updateData.raza}
                            </div>
                        </div>

                            {/* segundo bloque */}
                            <div className="row p-0 m-0 mt-md-4">
                            <div className="col-md-4 text-primary  d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold">Actualizado:</span>  {dateFormatter(updateData.fecha)}
                            </div>
                            <div className="col-md-4 text-primary d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold ">Peso promedio:</span> {this.decimalFormater(updateData.peso_promedio)} &nbsp;lb
                            </div>
                            <div className="col-md-4 text-primary  d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold">Edad (semanas):</span> {updateData.edad}
                            </div>
                        </div>
                            {/* tercer bloque */}
                        <div className="row p-0 m-0 mt-md-4">
                            <div className="col-md-4 text-primary d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold ">Técnico:</span> {updateData.nombreTecnico}
                            </div>
                            <div className="col-md-4 text-primary  d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold">Alimento:</span>
                                {this.alimentoTotal(updateData)}&nbsp;({this.decimalFormater(updateData.cantidad_alimento)}g c/u)
                            </div>
                            <div className="col-md-4 text-primary  d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold">Agua:</span>
                                {this.aguaTotal(updateData)}&nbsp;({this.decimalFormater(updateData.cantidad_agua)}l c/u)
                            </div>
                        </div>
                        {/* cuerto bloque */}
                        <div className="row p-0 m-0 mt-md-4">
                            <div className="col-md-4 text-primary d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold ">Contacto:</span> {updateData.telefono }
                            </div>
                            <div className="col-md-4 text-primary d-flex align-items-center">
                                <span className="text-gris font-italic my-auto mr-2 font-weight-bold ">Dirección:</span> {updateData.direccion}
                            </div>
                        </div>
                        </LoadMask>
                    </div>
                </div>

            </div>
        )
    }
}
