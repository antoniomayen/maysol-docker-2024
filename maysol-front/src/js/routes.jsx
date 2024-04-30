import React from 'react';
import {
    Route,
    Switch,
    Redirect,
} from 'react-router-dom';
import Login from './common/components/Login/LoginContainer';
import Home from './common/components/Home/Home';

import Privado from './common/components/Privado/Privado';

// Categorias
import {
    Listar as CategoriaGrid,
    Crear as CrearCategoria
} from './common/components/App/Categorias'

// COMPRAS
import {
    Listar as ComprasGrid,
    Crear as CrearCompra
} from './common/components/App/Compras';
// CUENTAS
import { Crear as CCreate, Listar as CuentaGrid, Editar as EditarCuenta } from './common/components/App/Cuentas';

// USUARIOS
import  { Listar as UsuarioGrid, Crear as CrearUsuario, Editar as EditarUsuario } from './common/components/App/Usuarios';


// GASTOS
import { Listar as GastoGrid } from './common/components/App/Gastos';

// Estado de cuenta
import { Listar as EstadoGrid } from './common/components/App/EstadoCuenta';

//Proyecto
import {
    Listar as ProyectoGrid,
    Crear as CrearProyecto,
    Estado as EstadoProyecto
} from './common/components/App/Proyectos';

// Prestamos
import {
    Listar as PrestamoGrid,
    Crear as CrearPrestamo,
    Estado as EstadoPrestamo
} from './common/components/App/Prestamos';

// Visualizar cajas de empleados
import {
    Listar as CajasGrid
} from './common/components/App/Cajas'

// proveedores
import {
    Listar as ProveedorGrid,
    Crear as CrearProveedor
} from './common/components/App/Proveedores';

// clientes
import {
    Listar as ClientesGrid,
    Crear as CrearCliente
} from './common/components/App/Clientes';

// productos
import {
    Listar as ProductoGrid,
    Crear as CrearProducto
} from './common/components/App/Productos'

// Reportes cf y pl
import {
    Listar as ReporteCFGrid
} from './common/components/App/Reportecf';

import ProtectedRoute from './ProtectedRoute'
// Bodegas
import {
    Listar as BodegasGrid,
    Crear as CrearBodegas,
    Ingreso as IngresoBodega,
    Despacho as DespachoBodega,
    IngresoProdCreate
} from "./common/components/App/Bodegas";

// Linea de producción
import {
    Listar as LineapGrid,
    Crear as CrearLineap
} from "./common/components/App/LineaProduccion"

// EStado de bodega
import {
    Listar as ListarEstadoBodegaGrid
} from "./common/components/App/EstadoBodega";

import {
    Listar as GallinerosGrid,
    Crear as CrearGallinero,
    Estado as EstadoGallinero,
    Produccion as ProduccionGallinero,
    CreatProduccion as CrearProduccionGallinero,
} from "./common/components/App/maysol"

// Ventas
import {
    Listar as VentasGrid,
    Crear as CrearVenta,
    Deposito,
} from './common/components/App/Ventas';

import {
    GastosReporte,
    CostosReporte,
    ProduccionReporte,
    CobrosVentasReporte,
    VentasReporte,
    ProduccionGallinerosReporte,
} from './common/components/App/Reportes';

require('../../node_modules/font-awesome/css/font-awesome.css');
require('../../node_modules/bootstrap/dist/css/bootstrap.css');
require('../style/index.css');


module.exports = (
    <div>
        <div className="container__content">
            <Switch>
                <Route exact path="/login" component={Login} />
                <ProtectedRoute path="/page" component={Privado} />

                <ProtectedRoute path="/admin_categorias" component={CategoriaGrid}/>
                <ProtectedRoute path="/admin_categoria/crear" component={CrearCategoria}/>
                <ProtectedRoute path="/admin_categoria/:id" component={CrearCategoria}/>

                {/* compras */}
                <ProtectedRoute path="/compras" component={ComprasGrid}/>
                <ProtectedRoute path="/compra/crear" component={CrearCompra}/>
                <ProtectedRoute path="/compra/:id" component={CrearCompra}/>

                {/* Ventas */}
                <ProtectedRoute path="/ventas/deposito" component={Deposito}/>
                <ProtectedRoute path="/ventas" component={VentasGrid}/>
                <ProtectedRoute path="/venta/crear" component={CrearVenta}/>
                <ProtectedRoute path="/venta/:id" component={CrearVenta}/>

                <ProtectedRoute path="/cuenta/crear" component={CCreate} />
                <ProtectedRoute path="/cuentas" component={CuentaGrid} />
                <ProtectedRoute path="/cuenta/:id" component={EditarCuenta} />

                <ProtectedRoute path="/admin_usuarios" component={UsuarioGrid} />
                <ProtectedRoute path="/admin_usuario/crear" component={CrearUsuario} />
                <ProtectedRoute path="/admin_usuario/:id" component={EditarUsuario} />


                <ProtectedRoute path="/caja_gasto" component={GastoGrid} />
                <ProtectedRoute path="/cajas/empleado/:id" component={GastoGrid} />

                <ProtectedRoute path="/estadocuenta/:id" component={EstadoGrid} />


                <ProtectedRoute path="/admin_empresas" component={ProyectoGrid}/>
                <ProtectedRoute path="/admin_empresa/crear" component={CrearProyecto}/>
                <ProtectedRoute path="/admin_empresa/:id" component={CrearProyecto}/>

                {/*Proveedores*/}
                <ProtectedRoute path="/admin_proveedores" component={ProveedorGrid}/>
                <ProtectedRoute path="/admin_proveedor/crear" component={CrearProveedor}/>
                <ProtectedRoute path="/admin_proveedor/:id" component={CrearProveedor}/>
                {/*Clientes*/}
                <ProtectedRoute path="/admin_clientes" component={ClientesGrid}/>
                <ProtectedRoute path="/admin_cliente/crear" component={CrearCliente}/>
                <ProtectedRoute path="/admin_cliente/:id" component={CrearCliente}/>
                {/*Prestamos*/}
                <ProtectedRoute path="/admin_prestamos" component={PrestamoGrid}/>
                <ProtectedRoute path="/admin_prestamo/crear" component={CrearPrestamo}/>
                <ProtectedRoute path="/admin_prestamo/estado/:id" component={EstadoPrestamo}/>
                {/* Bodegas */}
                <ProtectedRoute path="/bodegas" component={BodegasGrid}/>
                <ProtectedRoute path="/bodega/crear" component={CrearBodegas}/>
                <ProtectedRoute path="/bodega/:id" component={CrearBodegas}/>

                {/* ingreso bodega */}
                <ProtectedRoute path="/bodega_ingreso/:id" component={IngresoBodega}/>
                <ProtectedRoute path="/bodega_despacho/:id" component={DespachoBodega}/>


                {/* productos */}
                <ProtectedRoute path="/productos" component={ProductoGrid}/>
                <ProtectedRoute path="/producto/crear" component={CrearProducto}/>
                <ProtectedRoute path="/producto/:id" component={CrearProducto}/>

                {/* Linea de producción*/}
                <ProtectedRoute path="/admin_lineaproducciones" component={LineapGrid}/>
                <ProtectedRoute path="/admin_lineaproduccion/crear" component={CrearLineap}/>
                <ProtectedRoute path="/admin_lineaproduccion/:id" component={CrearLineap}/>

                {/* Estado de bodega */}
                <ProtectedRoute path="/bodega_estado/:id" component={ListarEstadoBodegaGrid}/>


                <ProtectedRoute path="/reporte_reportecf" component={ReporteCFGrid}/>
                <ProtectedRoute path="/reporte_reportcobroventas" component={CobrosVentasReporte}/>
                <ProtectedRoute path="/reporte_reportventas" component={VentasReporte}/>
                <ProtectedRoute path="/reporte_reportegasto" component={GastosReporte}/>
                <ProtectedRoute path="/reporte_reportecosto" component={CostosReporte}/>
                <ProtectedRoute path="/reporte_reporteproduccion" component={ProduccionReporte}/>
                <ProtectedRoute path="/reporte_reportproduccion_gallineros" component={ProduccionGallinerosReporte}/>

                <ProtectedRoute path="/cajas" component={CajasGrid} />

                {/*Maysol*/}
                {/*Gallineros*/}
                <ProtectedRoute path="/maysol_gallineros" component={GallinerosGrid}/>
                <ProtectedRoute path="/maysol_gallinero/crear" component={CrearGallinero}/>
                <ProtectedRoute path="/maysol_gallinero/:id" component={CrearGallinero}/>
                <ProtectedRoute path="/maysol_gallineroestado/:id" component={ProduccionGallinero}/>
                {/*
                    <ProtectedRoute path="/maysol_gallineroestado/:id" component={EstadoGallinero}/>
                    <ProtectedRoute path="/maysol_gallineroProduccion/:id" component={ProduccionGallinero}/>
                */}
                <ProtectedRoute path="/maysol_gallineroCrearProduccion/:id/:idS" component={CrearProduccionGallinero}/>
                <ProtectedRoute path="/maysol_gallineroCrearProduccion/:id" component={CrearProduccionGallinero}/>

                <Route path="*" component={Login} />
            </Switch>
        </div>
    </div>
);
