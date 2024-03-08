import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import './accordion.css';
import './menu.css';
import { icons } from "icons";
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router';


class Menu extends Component {
    static propTypes = {
        logOut: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
    }
    componentWillMount(){

    }
    toggleMenu = (e) => {
        try {
            this.props.toggleMenu(e);
        } catch (error) {

        }

    }

    render() {
        const { logOut, url, isOpen, me} = this.props;
        const {
            ver_usuarios,
            ver_cuentas,
            ver_cuenta,
            ver_gastos,
            ver_proyectos,
            ver_prestamos,
            ver_cajas,
            ver_categorias,
            ver_reportecf,
            ver_proveedores,
            ver_bodegas,
            ver_productos,
            ver_compras,
            ver_linea_produccion,
            ver_maysol,
            ver_padre_caja,
            ver_ventas,
            ver_granjas,
            ver_admin,
            ver
        } = this.props;
        const username = me ? me.nombreCompleto: 'Perfil';
        const proyecto = me ? me.proyecto : false;


        return (
            <div style={{ position: "relative" }}>
                <div className="v-menu v-menu-front">
                    <Accordion>
                        <AccordionItem className="ver-movil">
                                <AccordionItemTitle className={`profile-item ${url.includes("/perfil")  ? "activo " : ""}`}>
                                <div className="menu-item mb-0 sidebar-item mt-5 ">
                                        <img className="img-inactivo" src={icons.usuarios1} alt="" />
                                        <img className="img-activo" src={icons.usuarios2} alt="" />

                                        <div className="pl-3 text-capitalize">{ username }</div>
                                    </div>
                                </AccordionItemTitle>
                                <div className="list-items">
                                {
                                    proyecto && (
                                        <AccordionItemBody>
                                            <a   href="" onClick={ (e) => {
                                                e.preventDefault()
                                            }} >
                                                    Proyecto {proyecto}
                                            </a>
                                        </AccordionItemBody>
                                    )
                                }



                                </div>
                        </AccordionItem>
                    </Accordion>

                    {
                        ver_cuentas && (
                            <Link onClick={this.toggleMenu} className={`sidebar-item menu-item ${url.includes("/cuenta") || url.includes("/estadocuenta") ? "activo" : ""}`} to={"/cuentas"}>
                                <img className="img-inactivo" src={icons.cuenta1} alt="" />
                                <img className="img-activo" src={icons.cuenta2} alt="" />
                                <div className="pl-3">Cuentas</div>
                            </Link>
                        )
                    }
                    {
                        ver_padre_caja && (
                            <Accordion className={`text-center menu-item `}>
                                <AccordionItem>
                                    <AccordionItemTitle>
                                        <a href="#" className={`blue-hover ${url.includes("/caja") ? "activo no-border-sidebar" : ""}`}
                                            onClick={(e) => { e.preventDefault() }}>
                                            <img className="img-inactivo" src={icons.caja1} alt="" />
                                            <img className="img-activo" src={icons.caja2} alt="" />
                                            <div className="text-left pl-3">Caja</div>
                                        </a>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        {
                                            ver_gastos && (
                                                <Link onClick={this.toggleMenu} className={`sidebar-item menu-item ${url.includes("/caja_gasto") ? "activo-subitem" : ""}`} to={"/caja_gasto"}>
                                                        <img className="sub-item img-inactivo align-self-center" src={icons.mi_caja1} alt="" />
                                                        <img className="sub-item img-activo align-self-center" src={icons.mi_caja2} alt="" />
                                                        <div className="pl-3">Mi caja</div>
                                                </Link>
                                            )
                                        }
                                        {
                                            ver_gastos && (
                                                <Link onClick={this.toggleMenu} className={`sidebar-item menu-item ${url.includes("/cajas") ? "activo-subitem" : ""}`} to={"/cajas"}>
                                                        <img className="sub-item img-inactivo align-self-center" src={icons.otrascajas1} alt="" />
                                                        <img className="sub-item img-activo align-self-center" src={icons.otrascajas2} alt="" />
                                                        <div className="pl-3">Cajas</div>
                                                </Link>
                                            )
                                        }

                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accordion>
                        )
                    }



                    {
                        ver_bodegas && (
                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/bodegas") ? "activo" : ""}`} to={"/bodegas"}>
                                <img className="img-inactivo" src={icons.bodega1} alt="" />
                                <img className="img-activo" src={icons.bodega2} alt="" />
                                <div className="pl-3">Bodegas</div>
                            </Link>
                        )
                    }

                    {
                        ver_reportecf && (
                            <Accordion className={`text-center menu-item `}>
                                <AccordionItem>

                                    <AccordionItemTitle>
                                        <a href="#" className={`blue-hover ${url.includes("/reporte") ? "activo no-border-sidebar" : ""}`}
                                            onClick={(e) => { e.preventDefault() }}>
                                            <img className="img-inactivo" src={icons.reporte1} alt="" />
                                            <img className="img-activo" src={icons.reporte2} alt="" />
                                            <div className="text-left pl-3">Reporte</div>
                                        </a>
                                    </AccordionItemTitle>
                                    <AccordionItemBody>
                                        {
                                            ver_reportecf && (
                                                <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/reporte_reportecf") ? "activo-subitem" : ""}`} to={"/reporte_reportecf"}>
                                                    <img className="img-inactivo" src={icons.reporteCFPL1} alt="" />
                                                    <img className="img-activo" src={icons.reporteCFPL2} alt="" />
                                                    <div className="pl-3">Reporte CF</div>
                                                </Link>
                                            )
                                        }
                                        <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/reporte_reporteproduccion") ? "activo-subitem" : ""}`} to={"/reporte_reporteproduccion"}>
                                            <img className="img-inactivo" src={icons.reporteproduccion1} alt="" />
                                            <img className="img-activo" src={icons.reporteproduccion2} alt="" />
                                            <div className="pl-3">Producción</div>
                                        </Link>
                                        <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/reporte_reportproduccion_gallineros") ? "activo-subitem" : ""}`} to={"/reporte_reportproduccion_gallineros"}>
                                            <img className="img-inactivo" src={icons.reporte01} alt="" />
                                            <img className="img-activo" src={icons.reporte02} alt="" />
                                            <div className="pl-3">Produccion Gallineros</div>
                                        </Link>
                                        <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/reporte_reportcobroventas") ? "activo-subitem" : ""}`} to={"/reporte_reportcobroventas"}>
                                            <img className="img-inactivo" src={icons.reporteventas1} alt="" />
                                            <img className="img-activo" src={icons.reporteventas2} alt="" />
                                            <div className="pl-3">Cobros de Ventas</div>
                                        </Link>
                                        <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/reporte_reportventas") ? "activo-subitem" : ""}`} to={"/reporte_reportventas"}>
                                            <img className="img-inactivo" src={icons.reporteVen01} alt="" />
                                            <img className="img-activo" src={icons.reporteVen02} alt="" />
                                            <div className="pl-3">Consolidado de Ventas</div>
                                        </Link>
                                        <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/reporte_reportegasto") ? "activo-subitem" : ""}`} to={"/reporte_reportegasto"}>
                                            <img className="img-inactivo" src={icons.reporteganancias1} alt="" />
                                            <img className="img-activo" src={icons.reporteganancias2} alt="" />
                                            <div className="pl-3">Gastos</div>
                                        </Link>

                                    </AccordionItemBody>
                                </AccordionItem>
                            </Accordion>
                        )
                    }





                    {
                        ver_compras && (
                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/compra") ? "activo" : ""}`} to={"/compras"}>
                                <img className="img-inactivo" src={icons.compras1} alt="" />
                                <img className="img-activo" src={icons.compras2} alt="" />
                                <div className="pl-3">Compras</div>
                            </Link>
                        )
                    }
                    {
                        ver_ventas && (
                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/venta") ? "activo" : ""}`} to={"/ventas"}>
                                <img className="img-inactivo" src={icons.ventas1} alt="" />
                                <img className="img-activo" src={icons.ventas2} alt="" />
                                <div className="pl-3">Ventas</div>
                            </Link>
                        )
                    }
                    {
                        ver_productos && (
                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/productos") ? "activo" : ""}`} to={"/productos"}>
                                <img className="img-inactivo" src={icons.productos1} alt="" />
                                <img className="img-activo" src={icons.productos2} alt="" />
                                <div className="pl-3">Productos</div>
                            </Link>
                        )
                    }
                    {
                        ver_granjas && (
                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/maysol") ? "activo" : ""}`} to={"/maysol_gallineros"}>
                                <img className="img-inactivo" src={icons.maysol1} alt="" />
                                <img className="img-activo" src={icons.maysol2} alt="" />
                                <div className="pl-3">Maysol</div>
                            </Link>
                        )
                    }
                    {
                        ver_admin && (
                        <Accordion className={`text-center menu-item `}>
                            <AccordionItem>
                                <AccordionItemTitle>
                                    <a href="#"  className={`blue-hover ${url.includes("/admin") ? "activo no-border-sidebar" : ""}`}
                                        onClick={(e) => { e.preventDefault() }}>
                                        <img className="img-inactivo" src={icons.configuracion1} alt="" />
                                        <img className="img-activo" src={icons.configuracion2} alt="" />
                                        <div className="text-left pl-3">Admin</div>
                                    </a>
                                </AccordionItemTitle>
                                <AccordionItemBody>
                                    {
                                        ver_usuarios && (
                                            <Link onClick={this.toggleMenu} className={` sidebar-item menu-item ${url.includes("/admin_usuario") ? "activo-subitem" : ""}`} to={"/admin_usuarios"}>
                                                    <img className="sub-item img-inactivo align-self-center" src={icons.usuarios1} alt="" />
                                                    <img className="sub-item img-activo align-self-center" src={icons.usuarios2} alt="" />
                                                    <div className="pl-3">Usuarios</div>
                                            </Link>
                                        )
                                    }
                                    {
                                        ver_prestamos && (
                                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/admin_prestamo") ? "activo-subitem" : ""}`} to={"/admin_prestamos"}>
                                                <img className="img-inactivo" src={icons.prestamos1} alt="" />
                                                <img className="img-activo" src={icons.prestamos2} alt="" />
                                                <div className="pl-3">Prestamos</div>
                                            </Link>
                                        )
                                    }
                                    {
                                        ver_proyectos && (
                                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/admin_empresa") ? "activo-subitem" : ""}`} to={"/admin_empresas"}>
                                                <img className="img-inactivo" src={icons.proyectos1} alt="" />
                                                <img className="img-activo" src={icons.proyectos2} alt="" />
                                                <div className="pl-3">Empresas</div>
                                            </Link>
                                        )
                                    }
                                    {
                                        ver_categorias && (
                                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/admin_categoria") ? "activo-subitem" : ""}`} to={"/admin_categorias"}>
                                                <img className="img-inactivo" src={icons.categorias1} alt="" />
                                                <img className="img-activo" src={icons.categorias2} alt="" />
                                                <div className="pl-3">Categorias de Gastos</div>
                                            </Link>
                                        )
                                    }
                                    {
                                        ver_proveedores && (
                                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/admin_proveedores") ? "activo-subitem" : ""}`} to={"/admin_proveedores"}>
                                                <img className="img-inactivo" src={icons.proveedores1} alt="" />
                                                <img className="img-activo" src={icons.proveedores2} alt="" />
                                                <div className="pl-3">Proveedores</div>
                                            </Link>
                                        )
                                    }
                                    {
                                        ver_proveedores && (
                                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/admin_clientes") ? "activo-subitem" : ""}`} to={"/admin_clientes"}>
                                                <img className="img-inactivo" src={icons.clientes1} alt="" />
                                                <img className="img-activo" src={icons.clientes2} alt="" />
                                                <div className="pl-3">Clientes</div>
                                            </Link>
                                        )
                                    }

                                    {
                                        ver_linea_produccion && (
                                            <Link onClick={this.toggleMenu}  className={`sidebar-item menu-item ${url.includes("/admin_lineaproducciones") ? "activo-subitem" : ""}`} to={"/admin_lineaproducciones"}>
                                                <img className="img-inactivo" src={icons.lineaproduccion1} alt="" />
                                                <img className="img-activo" src={icons.lineaproduccion2} alt="" />
                                                <div className="pl-3">Linea producción</div>
                                            </Link>
                                        )
                                    }
                                </AccordionItemBody>
                            </AccordionItem>
                        </Accordion>

                        )
                    }


                    <a className="sidebar-item menu-item display-grid " href="#" onClick={logOut}>
                        <img className="img-inactivo" src={icons.usuarios1} alt="" />
                        <div className="pl-3">Salir</div>
                    </a>
                </div>
            </div>
        );
    }
}

export default Menu;

