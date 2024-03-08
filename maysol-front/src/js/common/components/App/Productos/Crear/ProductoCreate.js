import React from 'react'
import CardGrandeForm from '../../../Utils/Cards/cardGrande';
import Form from './ProductoForm';
import { ProductoUpdateForm } from './ProductoForm';
import LoadMask from 'Utils/LoadMask';

export default class Create extends React.Component {

    state = {
        editar: false
    };

    componentWillMount(){
        if(this.props.match.params.id){
            this.props.detail(this.props.match.params.id);
            this.setState({editar: true})
        }

    }
    render() {
        const { create, update } = this.props;
        const { updateData, cargando } = this.props;
        return(
            <CardGrandeForm titulo="Producto">
                <LoadMask loading={cargando} blur_1>
                {
                    this.state.editar ?
                        <ProductoUpdateForm editar={true} updateData={updateData} onSubmit={update}/>
                    :
                        <Form onSubmit={create}/>
                }
                </LoadMask>
            </CardGrandeForm>
        )

    }
}
