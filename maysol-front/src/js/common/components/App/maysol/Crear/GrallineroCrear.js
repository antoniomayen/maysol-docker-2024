import React from 'react'
import Card from 'Utils/Cards/cardGrande';
import Form from './GallineroForm';
import { GallineroUpdateForm } from './GallineroForm';
import LoadMask from 'Utils/LoadMask';

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
            <Card titulo="Gallineros Maysol">
                <LoadMask loading={false}  blur_1>
                    {
                        this.state.editar ?
                            <GallineroUpdateForm editar={true} updateData={updateData} onSubmit={update}/>
                        :
                            <Form onSubmit={create}/>
                    }
                </LoadMask>


            </Card>
        )

    }
}
