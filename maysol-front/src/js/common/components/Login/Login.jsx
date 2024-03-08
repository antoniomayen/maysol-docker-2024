import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Layout } from './layout';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm';
import './login.css';
import { dominios } from '../../utility/constants';

class Login extends PureComponent {
    static propTypes = {
        nameError: PropTypes.bool.isRequired,
        passError: PropTypes.bool.isRequired,
        onSubmit: PropTypes.func.isRequired,
        hasNameError: PropTypes.func.isRequired,
        hasPassError: PropTypes.func.isRequired,
    };

    state = {
        expanded: false,
        logo: require('assets/img/logoBorderless.png'),
        fondo: require('assets/img/login/bakground.png'),
        color: '#45315d',
        colorH: '#e24647',
        nombre: 'Bordeless',
    };

    componentDidMount() {
        this.state = { prueba: true };
        setTimeout(() => {
            this.setState({ expanded: !this.state.expanded });
        }, 900);
        const dominio = window.location.host;
        const item = _.find(dominios, { dominio });
        if (item) {
            this.setState({
                logo: item.logo,
                fondo: item.fondo,
                color: item.color,
                colorH: item.colorH,
                nombre: item.nombre,
            });
        }
    }

    toogleExpanded = () => {
        setTimeout(() => {
            this.setState({ expanded: !this.state.expanded });
        }, 300);
    };

    render() {
        const { onSubmit, submitError } = this.props;
        const { mensajeLogin, loader } = this.props;
        const { logo, fondo, color, colorH, nombre  } = this.state;
        if (sessionStorage.getItem('token')) {
            return (<Redirect to="/page" />);
        }
        return (
            <Layout
                logo={logo}
                fondo={fondo}
                toogleExpanded={this.toogleExpanded}
                expanded={this.state.expanded}
            >
                <div>
                    { submitError && (
                        <div className="text-danger text-center">
                            { mensajeLogin }
                        </div>)
                    }
                    { loader ? (
                        <div className="d-flex justify-content-center text-gris">
                            <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />
                            <span className="sr-only">Loading...</span>
                        </div>
                    ) : (
                        <LoginForm
                            color={color}
                            colorH={colorH}
                            onSubmit={onSubmit}
                        />
                    )}
                </div>
            </Layout>

        );
    }
}

export default Login;
