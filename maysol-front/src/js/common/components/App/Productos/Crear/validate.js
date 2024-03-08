import _ from "lodash";
import Swal from 'sweetalert2';

 const validador = values => {
    const errors = {};

    if(!values.nombre){
        errors.nombre = 'Campo requerido.'
    }
    if(!values.presentacion){
        errors.presentacion = 'Campo requerido.'
    }
    if(!values.empresa){
        errors.empresa = 'Campo requerido.'
    }


    if(!values.precios){
        errors.precios = 'Se debe de agregar al menos un precio.'
    }else{
        const preciosArrayError = [];
        values.precios.forEach((precio, precioIndex) => {

            const precioErrors = {}
            if(!precio.moneda){
                precioErrors.moneda = 'Campo requerido.';
                preciosArrayError[precioIndex] = precioErrors
            }
            if(!precio.precio){
                precioErrors.precio = 'Precio requerido'
                preciosArrayError[precioIndex] = precioErrors
            }
            if( Number(precio.precio) <= 0){
                precioErrors.precio = 'El precio tiene que ser mayor a 0'
                preciosArrayError[precioIndex] = precioErrors
            }
            if( Number(precio.precio2) < 0){
                precioErrors.precio2 = 'El precio tiene que ser mayor a 0'
                preciosArrayError[precioIndex] = precioErrors
            }
            if( Number(precio.precio3) < 0){
                precioErrors.precio3 = 'El precio tiene que ser mayor a 0'
                preciosArrayError[precioIndex] = precioErrors
            }

            //Validacion para el preci dinamico, nueva funcinalidad agregada
            if(!precio.precioD || precio.precioD.length <= 0) {
                precioErrors.precioD = { _error: 'Se debe de agregar al menos un precio.' };
                preciosArrayError[precioIndex] = precioErrors;
            } else {
                const errorrr = [];
                precio.precioD.forEach((val, index) => {
                    if (!val.precio || Number(val.precio) <= 0) { errorrr[index] = { precio: "Ingrese un valor"}; }
                });
                if (errorrr.length>0) {
                    preciosArrayError[precioIndex].precioD = errorrr;
                }
            }
            // Evitar selecionar la misma moneda
            if ((values.precios[0] && values.precios[1]) && values.precios[0].moneda == values.precios[1].moneda) {
                precioErrors.moneda = 'Campos Duplicados.';
                preciosArrayError[0] = precioErrors;
                preciosArrayError[1] = precioErrors;
            }
        });
        if (preciosArrayError.length) {
            errors.precios = preciosArrayError
        }
    }



    if(values.multiplos){
        if(!values.fracciones){
            errors.multiplos = 'Se debe de agregar por lo menos un múltiplo.'
        }
        else{
            const FraccionesArrayErrors = [];
            values.fracciones.forEach((fraccion, fraccionIndex) => {
                const fraccionErrors = {};
                if ( !fraccion.presentacion) {
                    fraccionErrors.presentacion = 'Campo requerido';
                    FraccionesArrayErrors[fraccionIndex] = fraccionErrors
                }
                if(!fraccion.capacidad_maxima){
                    fraccionErrors.capacidad_maxima = 'Campo requerido.'
                    FraccionesArrayErrors[fraccionIndex] = fraccionErrors
                }
                if(Number(fraccion.capacidad_maxima) <= 0){
                    fraccionErrors.capacidad_maxima = "Debe ser una cantidad mayor a 0."
                    FraccionesArrayErrors[fraccionIndex] = fraccionErrors
                }
                if(!fraccion.precios){

                    fraccionErrors.precios = 'Campo requerido.'
                    FraccionesArrayErrors[fraccionIndex] = fraccionErrors

                }else{
                    const preciosArrayFraccionError = [];
                    fraccion.precios.forEach((precio, precioIndex) => {

                        const precioErrors = {}
                        //Validacion para el preci dinamico, nueva funcinalidad agregada
                        if(!precio.precio || precio.precio.length < 0) { precioErrors.precio = 'Precio requerido' }

                        if(!precio.moneda){
                            precioErrors.moneda = 'Campo requerido.'
                            preciosArrayFraccionError[precioIndex] = precioErrors
                        }
                        if(!precio.precio){
                            precioErrors.precio = 'Precio requerido'
                            preciosArrayFraccionError[precioIndex] = precioErrors
                        }
                        if( Number(precio.precio) <= 0){
                            precioErrors.precio = 'El precio tiene que ser mayor a 0'
                            preciosArrayFraccionError[precioIndex] = precioErrors
                        }
                        if( Number(precio.precio2) < 0){
                            precioErrors.precio2 = 'El precio tiene que ser mayor a 0'
                            preciosArrayFraccionError[precioIndex] = precioErrors
                        }
                        if( Number(precio.precio3) < 0){
                            precioErrors.precio3 = 'El precio tiene que ser mayor a 0'
                            preciosArrayFraccionError[precioIndex] = precioErrors
                        }

                        //Validacion para el preci dinamico, nueva funcinalidad agregada
                        if(!precio.precioD || precio.precioD.length <= 0) {
                            precioErrors.precioD = { _error: 'Se debe de agregar al menos un precio.' };
                            preciosArrayFraccionError[precioIndex] = precioErrors;
                        } else {
                            const errorrr = [];
                            precio.precioD.forEach((val, index) => {
                                if (!val.precio || Number(val.precio) <= 0) { errorrr[index] = { precio: "Ingrese un valor"}; }
                            });
                            if (errorrr.length>0) {
                                preciosArrayFraccionError[precioIndex].precioD = errorrr;
                            }
                        }
                        // Evitar selecionar la misma moneda
                        if ((fraccion.precios[0] && fraccion.precios[1]) && fraccion.precios[0].moneda == fraccion.precios[1].moneda) {
                            precioErrors.moneda = 'Campos Duplicados.';
                            preciosArrayFraccionError[0] = precioErrors;
                            preciosArrayFraccionError[1] = precioErrors;
                        }
                    });
                    if (preciosArrayFraccionError.length) {
                        fraccionErrors.precios = preciosArrayFraccionError
                        FraccionesArrayErrors[fraccionIndex] = fraccionErrors
                    }

                }



            });
            if (FraccionesArrayErrors.length) {
                errors.fracciones = FraccionesArrayErrors
            }
        }
    }


    return errors;
}

export default validador
