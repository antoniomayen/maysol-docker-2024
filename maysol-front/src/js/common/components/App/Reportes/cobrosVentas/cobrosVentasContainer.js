import React from 'react'
import HeaderReporte from 'Utils/Headers/HeaderReporte';
import FiltroCobrosVentas from './filtros';
import TotalesGrid from './totalesGrid';
import ToolbarCuenta from 'Utils/Toolbar/ToolbarUsuarios';
import { RenderCurrency } from '../../../Utils/renderField/renderReadField';

function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}

export default class CobrosVentasContainer extends React.Component {

    componentWillMount() {
        const { me, listarEmpresas, getVendedoresSelect } = this.props;
        listarEmpresas();
        getVendedoresSelect();
    }

    render() {
        const { data, cargando, page, me } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return (
            <div className="row d-flex justify-content-center">
                <div className="col-sm-12">
                    <HeaderReporte
                        subtitulo='Cobros de Ventas'
                    />
                </div>

                <div className="col-sm-12">
                    <FiltroCobrosVentas {...this.props} />
                </div>
                <div className="col-sm-12">
                    <div className="grid-container  borde-superior border-completo mb-3">
                        <div className="row m-0 py-3 px-3">
                            <div className="col-3 text-uppercase m-0 p-0 align-self-center px-3">
                                <h3 style={{ fontSize: 16 }} className="m-0 p-0 text-left">
                                    <strong className="m-0 p-0">depósitos de ventas</strong>
                                </h3>
                            </div>
                            <div className="col-9 m-0 p-0 text-center align-self-center text-uppercase">
                                <span className="text-uppercase text-gris font-italic">
                                    <strong>Total depositos&nbsp;&nbsp;&nbsp;&nbsp;</strong>
                                </span>
                                <RenderCurrency value={this.props.data.suma || 0} simbolo="Q" className={'text-secondary h5 font-weight-bold'}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12">
                    <TotalesGrid {...this.props} />
                </div>
            </div>
        );
    }
}
