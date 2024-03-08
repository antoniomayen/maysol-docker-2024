import React from 'react'
import Form from './UsuarioForm'
import LoadMask from 'Utils/LoadMask';
export default class Create extends React.Component {
    componentWillMount() {
        this.props.cambiarEstadoPass(true);
    }
    render() {
        const { crearUsuario } = this.props
        const { mostrar_pass, cargando } = this.props;
        return (
            <div className="row d-flex justify-content-center">
                <div className="border-completo card col-11">
                    <div className="card-header d-flex justify-content-center text-left">
                        <div className="col-md-8 d-flex flex-row mt-2">
                            <h3><strong>Datos de usuario</strong></h3>
                        </div>
                    </div>
                    <div className="card-body d-flex justify-content-center">
                        <div className="col-md-8">
                            <LoadMask loading={cargando} blur_1>
                                <Form onSubmit={crearUsuario} mostrar_pass={mostrar_pass} />
                            </LoadMask>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
