import React from 'react'
import Form from './CuentaForm'
import Card from '../../../Utils/Cards/cardFormulario';
import LoadMask from '../../../Utils/LoadMask';
export default class Create extends React.Component {
  render() {
    const { crearCuenta, loader } = this.props
    return (
        <Card titulo="Cuenta">
            <LoadMask loading={loader} blur_1>
                <Form onSubmit={crearCuenta} />
            </LoadMask>
        </Card>
    )
  }
}
