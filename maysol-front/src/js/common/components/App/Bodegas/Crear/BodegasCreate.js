import React from 'react'
import Card from '../../../Utils/Cards/cardFormulario';
import Form from './BodegasForm';
import { BodegaUpdateForm } from './BodegasForm';
import LoadMask from '../../../Utils/LoadMask';

export default class Create extends React.Component{

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
            <Card titulo="Bodega">
                <LoadMask loading={cargando}  blur_1>
                    {
                        this.state.editar ?
                            <BodegaUpdateForm editar={true} updateData={updateData} onSubmit={update}/>
                        :
                            <Form onSubmit={create}/>
                    }
                </LoadMask>


            </Card>
        )

    }
}
