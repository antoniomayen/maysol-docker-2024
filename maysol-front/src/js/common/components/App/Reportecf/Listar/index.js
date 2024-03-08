import { connect } from 'react-redux';
import reportecfContainer from './reportecfContainer';
import {actions} from '../../../../../redux/modules/Reportes/reportecf';

const mstp = state =>  state.reportecf;

const mdtp = {
    ...actions
};

export default connect(mstp, mdtp)(reportecfContainer)
