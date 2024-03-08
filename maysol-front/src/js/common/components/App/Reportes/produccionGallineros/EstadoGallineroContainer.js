import React from 'react'
import HeaderReporte from '../../../Utils/Headers/HeaderReporte';
import { RenderCurrency } from '../../../Utils/renderField/renderReadField';
import FiltroProduccion from './filtros';
import DetalleGrid from './detalleGrid';
import LoadMask from '../../../Utils/LoadMask';
import ProduccionGrafica from './produccionGrafica';

export default class EstadoGallineroContainer extends React.Component {
    state = {
        opcion: 1
    }
    componentWillMount() {
        //this.props.detail(this.props.match.params.id)
        this.props.listarEmpresasGallineros();
        this.props.setEsReporte();
    }

    render(){
        const { updateData, cargando } = this.props;
        return(

            <div className="row d-flex justify-content-center">
                <div className="col-sm-12">
                    <HeaderReporte
                        subtitulo="Rentabilidad de Produccion"
                    />
                </div>
                <div className="col-sm-12">
                    <FiltroProduccion {...this.props} />
                </div>
                <div className="col-sm-12">
                    <div className="grid-container borde-superior border-completo mb-3">
                        <div className="form-row m-0 py-3 px-3">
                            <div className="col-sm-12 col-md-3 text-uppercase m-0 p-0 align-self-center px-3">
                                <h3 style={{ fontSize: 16 }} className="m-0 p-0 text-md-left text-sm-center">
                                    <strong className="m-0 p-0">TOTAL</strong>
                                </h3>
                            </div>
                            <div className="col-sm-12 col-md-3 m-0 p-0 text-center align-self-center text-uppercase">
                                <span className="text-uppercase text-gris font-italic">
                                    <strong>produccion&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                </span>
                                <RenderCurrency value={this.props.data ? this.props.dataGallineros.produccion : 0} simbolo="Q" className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                            <div className="col-sm-12 col-md-3 m-0 p-0 text-center align-self-center text-uppercase">
                                <span className="text-uppercase text-gris font-italic">
                                    <strong>rentabilidad&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                </span>
                                <RenderCurrency value={this.props.data ? this.props.dataGallineros.rentabilidad : 0} simbolo="Q" className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12">
                    <ProduccionGrafica {...this.props} />
                </div>
                <div className="col-md-12">
                    <LoadMask loading={cargando} dark blur>
                        <DetalleGrid {...this.props} />
                    </LoadMask>
                </div>
            </div>
        )
    }
}
