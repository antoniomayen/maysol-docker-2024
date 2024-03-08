import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'
import login from './modules/login';
import compras from './modules/Compras/compras';
import cuentas from './modules/Cuentas/cuentas';
import usuarios from './modules/Usuarios/usuarios';
import gastos from './modules/Cuentas/gastos';
import estadocuentas from './modules/Cuentas/estadocuentas';
import proyectos from './modules/Proyectos/proyectos';
import estadoproyectos from './modules/Proyectos/estadoproyecto';
import prestamos from './modules/Prestamos/prestamos';
import estadoprestamos from './modules/Prestamos/estadoprestamo';
import cajas from './modules/cajas/cajas';
import categorias from './modules/Categorias/categorias';
import proveedores from './modules/Proveedores/proveedores';
import reportecf from './modules/Reportes/reportecf';
import bodegas from './modules/Bodegas/bodegas';
import productos from './modules/Productos/productos';
import lineaproduccion from './modules/Linea/lineaproduccion';
import ingreso from './modules/Bodegas/ingreso';
import despacho from './modules/Bodegas/despacho';
import estadobodega from './modules/Bodegas/EstadoBodega';
import maysol from "./modules/Maysol/maysol";
import estadogallinero from './modules/Maysol/estadogallinero';
import ventas from './modules/Ventas/ventas';
import clientes from './modules/Clientes/clientes';

import reportegastos from './modules/Reportes/reportegastos';
import reporteproduccion from './modules/Reportes/reporteproduccion';
import reportecostos from './modules/Reportes/reportecostos';
import reporteCobrosVentas from './modules/Reportes/reporteCobrosVentas';

export default combineReducers({
    form: formReducer,
    login,
    routing,
    compras,
    cuentas,
    usuarios,
    gastos,
    estadocuentas,
    proyectos,
    estadoproyectos,
    prestamos,
    estadoprestamos,
    cajas,
    categorias,
    proveedores,
    reportecf,
    bodegas,
    ingreso,
    productos,
    lineaproduccion,
    estadobodega,
    despacho,
    maysol,
    estadogallinero,
    ventas,
    clientes,
    reportegastos,
    reporteproduccion,
    reportecostos,
    reporteCobrosVentas,
});
