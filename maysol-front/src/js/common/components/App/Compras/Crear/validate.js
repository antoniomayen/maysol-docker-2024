import _ from "lodash";
import Swal from 'sweetalert2';

 const validador = values => {
    const errors = {};

    if(!values.proveedor){
        errors.proveedor = 'Proveedor requerido.'
    }
    if(!values.moneda){
        errors.moneda = 'Campo requerido.'
    }
    if(!values.fecha){
        errors.fecha = 'Campo requerido.'
    }
    if(!values.descripcion){
        errors.descripcion = 'Campo requerido.'
    }
    if(values.pago_automatico === "true"){
        if(!values.noDocumento){
            errors.noDocumento = 'Campo requerido'
        }
        if(!values.cuenta){
            errors.cuenta = 'Campo requerido'
        }
        if(!values.formaPago){
            errors.formaPago = 'Campo requerido'
        }
        if(!values.noComprobante){
            errors.noComprobante = 'Campo requerido'
        }
    } else {
        if(values.pago_completo){
            if(!values.pagos || values.pagos.length <= 0){
                errors.errorPagoCompleto = "Se debe registrar por lo menos un pago para marcar el pago completo"
            }
        }
        if(!values.pagos || values.pagos.length <= 0){
                errors.errorPago = "Se debe registrar por lo menos un pago"
            }
        if(values.pagos){
            const PagosArrayErrors = [];
            values.pagos.forEach((pago, pagoIndex) => {
                const pagoErrors = {};
                // console.log("Producto", pago);
                if ( !pago.monto) {
                    pagoErrors.monto = 'Campo requerido';
                    PagosArrayErrors[pagoIndex] = pagoErrors
                }
                if(Number(pago.monto) <= 0){
                    pagoErrors.monto = "Debe ser una cantidad mayor a 0.";
                    PagosArrayErrors[pagoIndex] = pagoErrors
                }
                if(!pago.fecha){
                    pagoErrors.fecha = 'Campo requerido.';
                    PagosArrayErrors[pagoIndex] = pagoErrors
                }
                 if(!pago.cuenta){
                    pagoErrors.cuenta = 'Campo requerido.';
                    PagosArrayErrors[pagoIndex] = pagoErrors
                }
                if(!pago.noComprobante){
                   pagoErrors.noComprobante = 'Campo requerido.';
                    PagosArrayErrors[pagoIndex] = pagoErrors
                }
                if(!pago.noDocumento){
                    pagoErrors.noDocumento = 'Campo requerido.';
                    PagosArrayErrors[pagoIndex] = pagoErrors
                }
                if( !pago.formaPago){
                    pagoErrors.formaPago = 'Campo requerido';
                    PagosArrayErrors[pagoIndex] = pagoErrors
                }
            });
            if (PagosArrayErrors.length) {
                errors.pagos = PagosArrayErrors
            }
        }
    }

     const ProductosArrayErrors = [];
     if(!values.productos || values.productos.length <= 0){
         errors.errorProd = 'Se debe de agregar por lo menos un producto.'
     }else {
         values.productos.forEach((producto, productoIndex) => {
             const productoErrors = {};
             if(producto.producto){
                 const existe = _.find(values.productos, (p) => { return p.producto === producto.producto && p.index !== productoIndex });
                 if(existe){
                     productoErrors.producto = 'El producto ya fue seleccionado en otra fila';
                     ProductosArrayErrors[productoIndex] = productoErrors
                 }
             }
             // console.log("Producto", producto);
             if ( !producto.cantidad) {
                 productoErrors.cantidad = 'Campo requerido';
                 ProductosArrayErrors[productoIndex] = productoErrors
             }
             if(Number(producto.cantidad) <= 0){
                 productoErrors.cantidad = "Debe ser una cantidad mayor a 0.";
                 ProductosArrayErrors[productoIndex] = productoErrors
             }
             if(!producto.precio_costo){
                 productoErrors.precio_costo = 'Campo requerido.';
                 ProductosArrayErrors[productoIndex] = productoErrors
             }
             if(Number(producto.precio_costo) <= 0){
                 productoErrors.precio_costo = "Debe ser una cantidad mayor a 0.";
                 ProductosArrayErrors[productoIndex] = productoErrors
             }
             if( !producto.producto){
                 productoErrors.producto = 'Campo requerido';
                 ProductosArrayErrors[productoIndex] = productoErrors
             }
         });
         if (ProductosArrayErrors.length) {
             errors.productos = ProductosArrayErrors
         }
     }

    return errors;
};

export default validador
