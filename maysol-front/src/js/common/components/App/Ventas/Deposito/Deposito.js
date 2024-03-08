import React from 'react'
import LoadMask from 'Utils/LoadMask';
import Table from 'Utils/Grid'
import { TableHeaderColumn } from 'react-bootstrap-table';
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import Form from './Formularios/cierreVenta';
import CardGrandeForm from '../../../Utils/Cards/cardGrande';
import CardRed from '../../../Utils/Cards/cardGrandeRed';
import { BreakLine } from '../../../Utils/tableOptions';


export default class Create extends React.Component{

    state = { editar: false };

    componentWillMount() {
        this.props.listarMovimientos();
    }

    render() {
        const { loader_v, cierreCajaVenta, loaderModal } = this.props;
        return (
            <div>
                <LoadMask loading={loader_v} blur_1>
                    <Form
                        {...this.props}
                        onSubmit={cierreCajaVenta}
                        loaderModal={loaderModal}
                    />
                </LoadMask>
            </div>
        );
    }
}
