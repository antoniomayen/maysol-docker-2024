import { connect } from 'react-redux';
import { actions } from '../../../../../redux/modules/Bodegas/EstadoBodega';
import EstadoBodegaTabs from './EstadoBodegaTabs';
import { initialize as initializeForm } from 'redux-form'

const mstp = state => {

    return {...state.estadobodega, ...state.login}
};

const mdtp = {
    ...actions,
    setFormReajuste:(data) => dispatch => dispatch(initializeForm('reajuste', data)),
};

export default connect(mstp, mdtp)(EstadoBodegaTabs)
