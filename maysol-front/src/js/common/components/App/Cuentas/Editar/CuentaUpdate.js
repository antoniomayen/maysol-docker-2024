import React from 'react'
import PropTypes from 'prop-types'
import {CuentaUpdateForm} from '../Crear/CuentaForm'
import Card from '../../../Utils/Cards/cardFormulario';
import LoadMask from '../../../Utils/LoadMask';

export default class Update extends React.Component {


  componentWillMount() {
    this.props.getCuenta(this.props.match.params.id);

  }

  render() {
    const { editarCuenta, loader } = this.props;

    return (
        <Card titulo="Cuenta" >
                <LoadMask loading={loader}  blur_1>
                 <CuentaUpdateForm onSubmit={editarCuenta}  />
                </LoadMask>

        </Card>
    )
  }
}
