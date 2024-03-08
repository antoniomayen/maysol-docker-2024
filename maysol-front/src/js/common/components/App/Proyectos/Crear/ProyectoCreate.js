import React from 'react'
import Card from '../../../Utils/Cards/cardGrande';
import Form from './ProyectosForm';
import { ProyectoUpdateForm } from './ProyectosForm';
import { api } from '../../../../../api/api';
import LoadMask from 'Utils/LoadMask';


let cuentas = []


const getCuentas = (search) => {

    return api.get(`cuentas/getSelectCuenta`, {search}).catch((error) => {
    }).then((data) => {
        cuentas = []
        data.forEach(item => {
            if(!_.find(cuentas, {id: item.id})) {
                cuentas.push(item);
            }
        });
        return { options: cuentas}
    })
}
export default class Create extends React.Component{
    state = {
        editar: false
    }
    componentWillMount(){
        getCuentas('');
        if(this.props.match.params.id){
            this.props.getProyecto(this.props.match.params.id);
            this.setState({editar: true})
        }

    }
    render() {
        const { create, update } = this.props;
        const { updateData, loader } = this.props;
        return(
            <Card titulo="Empresa">
                <LoadMask loading={loader} blur_1>
                {
                    this.state.editar ?
                        <ProyectoUpdateForm editar={true} updateData={updateData} cuentas={cuentas} onSubmit={update}/>
                    :
                        <Form onSubmit={create} cuentas={cuentas}/>
                }
                </LoadMask>
            </Card>
        )

    }
}
