import React from 'react';
import FormPeso from './FormsModales/ControlPesoForm';
import Form, { ProveedorUpdateForm } from '../../Proveedores/Crear/ProveedoresForm';

export default class EstadoGallineroContainer extends React.Component {

    state = { editar: false };
    componentWillMount() {
        const { setIdGallinero, detail, match, getSemana } = this.props;
        setIdGallinero(match.params.id);
        if (match.params.idS) {
            getSemana(match.params.idS);
            this.setState({editar: true});
        }
        detail(match.params.id);
    }

    enviarPeso = () => {
        const { movimientoBodega, idGallinero } = this.props;
        movimientoBodega(1, `/maysol_gallineroestado/${idGallinero}`);
    };

    actualizarPeso = () => {
        const { updateSemana, idGallinero } = this.props;
        updateSemana(`/maysol_gallineroestado/${idGallinero}`);
    };

    render() {
        return (
            <div className="w-100 m-0 p-4">
                {
                    this.state.editar ? (
                        <FormPeso {...this.props} editar={this.state.editar} onSubmit={this.actualizarPeso} />
                    ) : (
                        <FormPeso {...this.props} onSubmit={this.enviarPeso} />
                    )
                }
            </div>
        );
    }
}
