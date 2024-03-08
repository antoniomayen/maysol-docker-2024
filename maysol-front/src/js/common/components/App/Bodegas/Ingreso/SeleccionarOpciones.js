import React from 'react'



export default class SeleccionarOpciones extends React.Component{


    componentWillMount(){


    }
    render() {

        return(
            <div className="row col-md-12 border-completo m-0 py-3">
                <div className="col-md-3 d-flex align-items-center">

                    <span className="text-gris font-italic my-auto">Seleccione el tipo de {this.props.tipo}</span>
                </div>
                <div className="col-md-3">
                    <button onClick={() =>{
                            this.props.cambiarOpcion(1)
                        }} type="button" style={{width:'100%'}} className="btn btn-primary  m-1 text-center">
                        {this.props.texto1}
                    </button>
                </div>
                <div className="col-md-3">
                    <button onClick={() =>{
                            this.props.cambiarOpcion(2)
                        }}  type="button" style={{width:'100%'}}  className="btn btn-rosado m-1 text-center">
                        {this.props.texto2}
                    </button>
                </div>
                <div className="col-md-3">
                    <button onClick={() =>{
                            this.props.cambiarOpcion(3)
                        }}  type="button" style={{width:'100%'}}  className="btn btn-secondary  m-1 text-center">
                        {this.props.texto3}
                    </button>
                </div>
            </div>
        )

    }
}
