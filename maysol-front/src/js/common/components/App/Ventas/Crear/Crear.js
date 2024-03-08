import React from 'react'
import CardGrandeForm from '../../../Utils/Cards/cardGrande';
import Form from './VentasForm';
import { VentaUpdateForm } from './VentasForm';
import LoadMask from 'Utils/LoadMask';

export default class Create extends React.Component{

    state = {
        editar: false
    };
    componentWillMount() {
        this.props.getProveedores();
        this.props.getProductos();
        if(this.props.match.params.id){
            this.props.detail(this.props.match.params.id);
            this.setState({editar: true});
            this.props.set_step(2)
        }
    }
    componentWillUnmount() {
        this.props.set_step(0);
        this.setState({editar: false})
    }

    render() {
        const { create, update, anularPago, set_step, step_ventas, loader_v } = this.props;
        const { updateData } = this.props;
        return(
            <CardGrandeForm titulo="Orden de venta">
                <LoadMask loading={loader_v} blur_1>
                    {
                        this.state.editar ?
                            <VentaUpdateForm editar={true} updateData={updateData} onSubmit={update} {...this.props}
                                 step={step_ventas}
                            orden_id={this.props.match.params.id}/>
                            :
                            <Form onSubmit={create} step={step_ventas} {...this.props}/>
                    }
                </LoadMask>
            </CardGrandeForm>
        )

    }
}
