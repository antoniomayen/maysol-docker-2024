import React from 'react'
import CardGrandeForm from '../../../Utils/Cards/cardGrande';
import Form from './ComprasForm';
import { CompraUpdateForm } from './ComprasForm';
import LoadMask from 'Utils/LoadMask';

export default class Create extends React.Component{

    state = {
        editar: false
    };
    componentWillMount(){
        this.props.getProveedores();
        this.props.getProductos();
        if(this.props.match.params.id){
            this.props.detail(this.props.match.params.id);
            this.setState({editar: true});
             this.props.set_step(2)
        }
    }
    componentWillUnmount(){
        this.props.set_step(0);
        this.setState({editar: false})
    }
    render() {
        const { create, update, anularPago, set_step, step_compras, loader_c } = this.props;
        const { updateData } = this.props;
        return(
            <CardGrandeForm titulo="Compras">
                <LoadMask loading={loader_c} blur_1>
                    {
                        this.state.editar ?
                            <CompraUpdateForm editar={true} updateData={updateData} onSubmit={update} {...this.props}
                                              orden_id={this.props.match.params.id} anularPago={anularPago} set_step={set_step} step={step_compras}/>
                            :
                            <Form onSubmit={create} step={step_compras} {...this.props}/>
                    }
                </LoadMask>
            </CardGrandeForm>
        )

    }
}
