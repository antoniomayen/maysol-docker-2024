import React, { Component } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import _ from 'lodash';
import { dominios } from '../../utility/constants';

class Privado extends Component {
    state = { styleDiv: { backgroundImage: `url(${require('../../../../assets/img/backdashboard.png')})` } };

    componentDidMount() {
        const dominio = window.location.host;
        const item = _.find(dominios, { dominio });
        if (item) {
            document.title = item.nombre;
            this.setState({
                styleDiv: {
                    backgroundImage: `url(${item.logoDv})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right top',
                    backgroundSize: 'auto',
                },
            });
        }
    }

    render() {
        const { styleDiv } = this.state;
        return (
            <div className="imagen-inicio  d-flex align-items-center justify-content-around" style={styleDiv}>
                <div className="   pb-3">
                    <div className="p-2 bd-highlight text-center img-cont">
                        <img
                            className="inicio-logo img-responsive"
                            src={require('../../../../assets/img/logodashboard.png')}
                            alt="Bienvenida"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Privado;
