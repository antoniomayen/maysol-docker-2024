import React, { Component } from "react";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";
import classnames from "classnames";
require("./LoadMask.css");

class LoadMask extends Component {
    static propTypes = {
        radius: PropTypes.bool,
        loading: PropTypes.bool.isRequired,
        dark: PropTypes.bool,
        blur: PropTypes.bool,
        light: PropTypes.bool,
        blur_1: PropTypes.bool
    };

    static defaultProps = {
        radius: false,
        dark: false,
        blur: false,
        light: false,
        blur_1: false
    };

    render() {
        const { children, radius, dark, light, blur, loading, blur_1 } = this.props;
        return (
            <div className="load-mask">
                {loading && (
                    <div
                            className={classnames("loader-container d-flex flex-column", {
                                radius,
                                dark,
                                light
                            })}
                        >

                            <Loader
                                type="Rings"
                                color="#e24647"
                                height="100"
                                width="100"
                            />
                            <p>Espere un momento</p>



                        </div>



                )}
                <div
                    className={classnames("load-mask-content", {
                        loading,
                        blur,
                        blur_1
                    })}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export default LoadMask;
