import React from 'react'
import Form from './PrestamoForm'
import Card from '../../../Utils/Cards/cardFormulario';
import { api } from '../../../../../api/api';

let proyectos = [];

export default class Create extends React.Component {
    state = {
        deudor: [],
        acreedor: [],
        cuentasDeudor:[],
        cuentasAcreedor: [],
        seleccionado:null
    }
    getProyectos = () =>{
        const {  me } = this.props
        proyectos = [];
        this.setState({
            deudor: [],
            acreedor: []
        })
        return api.get("proyectos/getEmpresaCuentasSelect").catch((error) => {})
                .then((data) => {
                    data.forEach(item => {
                        
                            proyectos.push({value: item.id, label: item.nombre, cuentas: item.cuentas});
                        
                    })
                    this.setState({
                        deudor: proyectos,
                        acreedor: proyectos
                    })
                    return {options: proyectos}
                })
    }
    componentWillMount(){
        this.getProyectos();

    }
    handleSeleccionadoAcreedor = (seleccionado) =>  {
        let cuentas = []
        seleccionado.cuentas.forEach(item => {
            cuentas.push({value: item.id, label: item.nombre})
        })
        this.setState({cuentasAcreedor: cuentas})
    }
    handleSeleccionadoDeudor = (seleccionado) => {
        let cuentas = []
        seleccionado.cuentas.forEach(item => {
            cuentas.push({value: item.id, label: item.nombre})
        })
        this.setState({cuentasDeudor: cuentas})
    }
    handleAcreedorChange = (anterior, seleccionado) =>{
          //REMOVER EL PREREQUISITO ANTERIOR
    //    let temp =  _.cloneDeep(this.state.acreedor);
    //    let temp_deudor = _.cloneDeep(this.state.deudor);
    //    //ELIMINAR DE LA LISTA DE PREREQUSITOS Y AÑADIR A CURSOS LA SELECCIÓN ANTERIOR
    //    if(anterior)
    //    {
    //        let cuenta_anterior = _.find(temp, {value: anterior});
    //         temp_deudor.push(cuenta_anterior);
    //    }
    //    if(seleccionado){
    //        //Añadir el nuevo prerequisito y eliminar de lista de cursos
    //            let value = _.find(temp_deudor, {value: seleccionado})
    //            if(value){

    //                //AGREGAR EL VALOR A LOS PRE REQUISITOS, SI NO ESTÁ PREREQUISITOS
    //                 if(!_.find(temp, {value: seleccionado}))
    //                {
    //                    temp.push(value)
    //                }
    //                // REMOVER EL ITEM DEL ARRAY TEMPORAL DE CURSOS
    //                 _.remove(temp_deudor, (currentObject)=> {
    //                    return currentObject.value ===  value.value;
    //                });

    //            }

    //    }
    //     //AGREGAR EL NUEVO ARRAY DE CURSOS A STATE
    //        temp_deudor = _.orderBy(temp_deudor, ['label'],['asc']);
    //        temp = _.orderBy(temp, ['label'],['asc']);
    //       this.setState({acreedor: temp})
    //       this.setState({deudor: temp_deudor})
    }
  render() {
    const { create, me } = this.props
    return (
        <Card titulo="Préstamo">
            <Form
                onSubmit={create}
                me={me}
                handleSeleccionadoAcreedor={this.handleSeleccionadoAcreedor}
                handleSeleccionadoDeudor={this.handleSeleccionadoDeudor}
                seleccionado={this.state.seleccionado}
                deudores={this.state.deudor}
                acreedores={this.state.acreedor}
                cuentasAcreedor={this.state.cuentasAcreedor}
                cuentasDeudor={this.state.cuentasDeudor}
                getProyectos={this.getProyectos}/>
        </Card>
    )
  }
}
