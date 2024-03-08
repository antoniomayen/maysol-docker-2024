import _ from "lodash";
import Swal from 'sweetalert2';

 const validador = values => {
    const errors = {};
    console.log('Validador')
    if(!values.reajuste){
        errors.reajuste = 'Campo requerido.'
        return errors;
    }
    if(Number(values.reajuste) < 0){
        errors.reajuste = "Debe de ingresar un valor positivo."
    }
    if(!Number.isInteger(Number(values.reajuste))){
        errors.reajuste = "Debe de ser un valor entero."
    }

    return errors;
};

export default validador
