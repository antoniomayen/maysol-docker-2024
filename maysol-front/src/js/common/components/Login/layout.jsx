import React from 'react';
import './login.css';

export const Layout = (props) => {
    const { logo, fondo, expanded, children } = props;
    const styleBack = {
        background: `url(${fondo})`,
        position: 'fixed',
        backgroundSize: 'cover',
    };

    return (
        <div className="login w-100 h-100 d-flex align-items-center" style={styleBack}>
            <div className="row login-wrapper col-12" style={{ justifyContent: 'center' }}>
                <div className="login-container">
                    <div className="login_logo text-center">
                        <img title="Ver" src={logo} alt="Borderless" />
                    </div>
                    <div className={`login-form ${expanded ? 'expand' : 'invisible'} `}>
                        <div className="panel-body visible">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
