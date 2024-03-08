import { connect } from 'react-redux'
import Menu from './Menu'
import { logOut } from '../../../redux/modules/login'
import { ROLES } from '../../utility/constants';

const mstp = state => {
    const url = window.location.href;

    let ver_usuarios = false;
    let ver_cuentas = false;
    let ver_cuenta = false; // para visualizar solo el estado de cuenta
    let ver_gastos = false;
    let ver_proyectos = false;
    let ver_prestamos = false
    let ver_cajas = false;
    let ver_categorias = false;
    let ver_reportecf = false;
    let ver_proveedores = false;
    let ver_bodegas = false;
    let ver_productos = false;
    let ver_compras = false;
    let ver_linea_produccion = false;
    let ver_maysol = false;
    let ver_padre_caja = false;
    let ver_ventas = false;
    let ver_granjas = false;
    let ver_admin = false;

    if(state.login.me.is_superuser || state.login.me.accesos.administrador){
        ver_usuarios = true;
        ver_cuentas = true;
        ver_gastos = true;
        ver_proyectos = true
        ver_prestamos = true;
        ver_cajas = true;
        ver_categorias = true;
        ver_reportecf = true;
        ver_proveedores = true;
        ver_bodegas = true;
        ver_productos = true;
        ver_compras = true;
        ver_linea_produccion = true;
        ver_maysol = true;
        ver_padre_caja = true;
        ver_ventas = true;
        ver_granjas = true;
        ver_admin = true;
    }
    if(state.login.me.accesos.supervisor){
        ver_admin = true;
        ver_gastos = true;
        ver_cuentas = true;
        ver_cajas = true;
        ver_prestamos = true;
        ver_proveedores = true;
        ver_bodegas = true;
        ver_productos = true;
        ver_compras = true;
        ver_maysol = true;
        ver_padre_caja = true;
        ver_granjas = state.login.me.es_granja;
    }
    if(state.login.me.accesos.compras){
        ver_compras = true;
    }
    if(state.login.me.accesos.vendedor){
        ver_ventas = true;
    }
    if(state.login.me.accesos.bodeguero){
        ver_bodegas = true;
        ver_productos = true;
    }

    return {
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
        url
    }
}
const mdtp = {
    logOut
}

export default connect(mstp, mdtp)(Menu)
