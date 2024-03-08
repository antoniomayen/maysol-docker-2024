import React from 'react';
import PropTypes from 'prop-types';
import { UsuarioUpdateForm } from '../Crear/UsuarioForm';
import LoadMask from 'Utils/LoadMask';
export default class Update extends React.Component {
    cambiarEstado = () => {
        const { mostrar_pass } = this.props;
        this.props.cambiarEstadoPass(!mostrar_pass);
    }
    componentWillMount(){
        this.props.getUsuario(this.props.match.params.id);
        this.props.cambiarEstadoPass(false);
    }
    render() {
        const { editarUsuario, mostrar_pass, nuevo_usuario, cargando } = this.props;
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
                                <UsuarioUpdateForm
                                    onSubmit= {editarUsuario}
                                    mostrar_pass={mostrar_pass}
                                    cambiarEstado = {this.cambiarEstado}
                                    usuario = {nuevo_usuario}
                                    editando= {true}/>
                            </LoadMask>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
