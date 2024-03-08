import { connect } from 'react-redux';
import {
    actions
} from '../../../../../redux/modules/Maysol/maysol';
import GrallineroCrear from './GrallineroCrear';
import { initialize as initializeForm } from 'redux-form'


const mstp = state => {
    return {...state.maysol,  ...state.login}
};

const mdtp = {
    ...actions,
    setFormIngresoBodega:(data) => dispatch => dispatch(initializeForm('ingresobodega', data))
};

export default connect(mstp, mdtp)(GrallineroCrear)
