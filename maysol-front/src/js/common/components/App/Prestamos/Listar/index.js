import { connect } from 'react-redux';
import {actions} from '../../../../../redux/modules/Prestamos/prestamos';
import PrestamosContainer from './PrestamosContainer';

const mstp = (state) => {
  return {
    ...state.prestamos,
  };
};
const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(PrestamosContainer)
