import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";

// maquetado base
import Navbar from "./common/components/Navbar/NavbarContainer";
import Sidebar from "./common/components/Sidebar/Sidebar";
import { getMe } from "./redux/modules/login";
import { connect } from "react-redux";


// funciona para determinar si puede acceder a la vista
function isAuthenticated() {
    return sessionStorage.getItem("token");
}

class PrivateRouteBase extends Component {
    componentWillMount(props) {
        //this.props.setRuta(window.location.href);
        //OBTENER LOS DATOS DEL USUARIOS LOGUEADO
        this.props.getMe();
    }
    render() {
        const { component: Component, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={props =>
                    isAuthenticated() ? (
                        <div>
                            <Navbar />
                            <Sidebar {...this.props} />
                            <div id="content-wrapper" className="content-wrapper">
                                <Component {...props} />
                            </div>
                        </div>
                    ) : (
                            <Redirect
                                to={{
                                    pathname: "/login",
                                    state: { from: props.location }
                                }}
                            />
                        )
                }
            />
        );
    }
}

const mstp = state => ({});

const mdtp = { getMe };

const ProtectedRoute = connect(mstp, mdtp)(PrivateRouteBase);

export default ProtectedRoute;
