import _ from "lodash";
import Swal from 'sweetalert2';
import { ROLES} from '../../../../utility/constants';

const validador = values => {
    const errors = {};
    if(!values.username){
        errors.username = 'Campo requerido'
    }
    if(!values.first_name){
        errors.first_name = 'Campo requerido.'
    }
    if(!values.last_name){
        errors.last_name = 'Campo requerido.'
    }
    if(!values.telefono){
        errors.telefono = 'Campo requerido.'
    }
    if(!values.permisos){
        errors.permisos = 'Campo requerido.'
    }
    if(!values.password){
        errors.password = 'Campo requerido.'
    }
    if(!values.puestos){
        errors.puestos = 'Campo requerido.'
    }
    if(!values.proyecto){
        errors.proyecto = 'Campo requerido.'
    }
    if(values.puestos == ROLES.COLABORADOR){
        if(!values.accesos){
            errors.errorPermisos = "Debe seleccionar por lo menos un permiso para el puesto Colaborador"
        }
        if(values.accesos){
            if(!values.accesos.supervisor && !values.accesos.vendedor && !values.accesos.bodeguero &&
                !values.accesos.compras && !values.accesos.sin_acceso)
            errors.errorPermisos = "Debe seleccionar por lo menos un permiso para el puesto Colaborador"
        }
    }
    return errors;
};

export default validador
