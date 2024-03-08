import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import PrestamosGrid from './PrestamosGrid';
import HistorialPrestamosGrid from './HistorialPrestamosGrid';
import { browserHistory } from 'react-router';
import { dateFormatter, cellTachado } from '../../../Utils/renderField/renderReadField'

export default class PrestamosContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { active_tab, changeTab } = this.props;
        return (
            <div className="d-flex justify-content-center index--padding bgr--street">
                <div className="col-md-12">
                    <Nav tabs className="col-12 px-2 pl-4 pl-sm-2 px-0 mb-0 pb-0 ml-2">
                        <NavItem key={1} className="col-4 col-sm-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: active_tab === 'activos' })}
                                onClick={() => {changeTab('activos')}}>
                                <h5>Activos</h5>
                            </NavLink>
                        </NavItem>
                        <NavItem key={2} className="col-4 col-sm-3 col-md-2  pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: active_tab === 'historial' })}
                                onClick={() => {changeTab('historial')}}>
                                <h5>Historial</h5>
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={active_tab} className="mt-0 mb-0">
                        <TabPane tabId={'activos'}>
                            <PrestamosGrid {...this.props} />
                        </TabPane>

                        <TabPane tabId={'historial'}>
                            <HistorialPrestamosGrid {...this.props} />
                        </TabPane>

                    </TabContent>
                </div>
            </div>

        )
    }
}
