import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { slide as Slide } from 'react-burger-menu';
import DropdownMenu from 'react-dd-menu';
import { Menu } from '../Menu';

import './navbar.css';
import './burger-sidebar.css';
import './dd-menu.css';
import { dominios } from '../../utility/constants';

class Navbar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            verMenu: false,
            opened: false,
            expand: false,
            round: '0 0 0 0',
            color: 'linear-gradient(to right, #45315D, #1489A9)',
            logo: require('../../../../assets/img/logoBorderless1.png'),
        };
    }

    componentWillMount() {
        this.logOut = this.logOut.bind(this);
        const dominio = window.location.host;
        const item = _.find(dominios, { dominio });
        if (item) {
            this.setState({
                color: item.colorNv,
                logo: item.logoNv,
                round: '0 30px 30px 0',
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.setState({ verMenu: false });
        }
    }

  toggleMenu = (e) => {
      this.setState({ verMenu: !this.state.verMenu });
      return (<Redirect to="/page" />);
  }

  logOut(event) {
      this.props.logOut();
  }

  handleStateChange = (e) => {
      this.setState({ verMenu: e.isOpen });
  }

  close = () => {
      this.setState({ opened: !this.state.opened });
  }

  toggle = () => {
      this.setState({ opened: !this.state.opened });
  }

  toggleExpand = () => {
      const sidebar = document.getElementById('sidebar');
      const content = document.getElementById('content-wrapper');
      if (sidebar && content) {
          if (this.state.expand) {
              sidebar.classList.remove('sidebar-small');
              content.classList.remove('menu-small-content-wrapper');
              this.setState({ expand: false });
          } else {
              sidebar.classList.add('sidebar-small');
              content.classList.add('menu-small-content-wrapper');
              this.setState({ expand: true });
          }
      }
  }

  render() {
      const { color, logo, round } = this.state;
      const { me } = this.props;
      const username = me ? me.nombreCompleto : 'Perfil';
      const proyecto = me.proyecto ? me.proyecto : null;
      const menuOptions = {
          isOpen: this.state.opened,
          close: this.close,
          closeOnInsideClick: false,
          toggle: <li>
              <a onClick={this.toggle}>
                  {username}
                  <em className="fa fa-user-circle" />
                  <em className="fa fa-chevron-right" />
              </a>
          </li>,
          align: 'right',
      };
      return (
          <div>
              <header
                  className="topnavbar-wrapper"
                  ref={(el) => {
                      if (el) {
                          el.style.setProperty('padding', round === '0 0 0 0' ? round : '0 125px 0 0', 'important');
                      }
                  }}
              >

                  <nav
                      className="navbar topnavbar"
                      ref={(el) => {
                          if (el) {
                              el.style.setProperty('background-image', color, 'important');
                              el.style.setProperty('border-radius', round, 'important');
                          }
                      }}
                  >
                      <div className="ver-escritorio" onClick={this.toggleExpand} style={{ zIndex: 50, position: 'absolute', left: 25, cursor: 'pointer' }}>
                          <img src={require('../../../../assets/img/login/menu.png')} />
                      </div>
                      <div className="nav-wrapper">
                          <ul className="nav navbar-nav">
                              <li>
                                  <a href="#/" style={{ padding: 0 }}>
                                      <img className="nav-logo" src={logo} alt="Logo" />
                                  </a>
                              </li>

                          </ul>
                          {
                              !me.accesos.administrador && (
                                  <div className="ver-escritorio">
                                      <ul className="nav navbar-nav perfil ml-3">
                                          <li className="font-italic text-uppercase">
                                            Empresa
                                              {proyecto}
                                          </li>
                                      </ul>
                                  </div>
                              )
                          }
                      </div>


                      <div className="ver-escritorio">
                          <ul className="nav navbar-nav perfil">
                              <DropdownMenu {...menuOptions}>
                                  <li>
                                      <a href="/#/login" onClick={this.logOut} className="menu-item">
                                          <em className="fa fa-sign-out" />
                                          Cerrar Sesión
                                      </a>
                                  </li>
                              </DropdownMenu>
                          </ul>
                      </div>
                  </nav>
              </header>

              <Slide
                  id="bubble"
                  isOpen={this.state.verMenu}
                  pageWrapId="page-wrap"
                  onStateChange={state => this.handleStateChange(state)}
                  outerContainerId="outer-container"
              >
                  <Menu {...this.props} toggleMenu={this.toggleMenu} />

              </Slide>
          </div>
      );
  }
}
Navbar.propTypes = {};

export default Navbar;
