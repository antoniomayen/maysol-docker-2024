import _ from "lodash";
import moment from 'moment';

 const validador = values => {
    const errors = {};

    if(!values.empresa){
        errors.empresa = 'Proveedor requerido.'
    }
    if(!values.fechaProduccion){
        errors.fechaProduccion = 'Campo requerido.'
    }
    if(values.fechaProduccion){
        try{
             moment(values.fechaProduccion).format('DD/MM/YYYY');
            console.log(moment(values.fechaProduccion).format('DD/MM/YYYY'))
        }catch (e) {
            errors.fechaProduccion = 'Fecha invalida'
        }
    }
    return errors;
};

export default validador
