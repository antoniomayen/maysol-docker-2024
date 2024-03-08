import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import ControlPesoGrid  from './controlpesoGrid';
import DetalleGrid from './detalleGrid';
import LoadMask from 'Utils/LoadMask';
import { dateFormatter, cellTachado } from '../../../Utils/renderField/renderReadField'

export default class tabsInfo extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: 'D',
      tabCaja: 'D'
    };
  }
  componentWillMount(){
    // this.props.getMisCajas(this.props.match.params.id);
    this.props.listarReajuste(1)

  }
  componenteDidMount(){


  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
      if (tab === 'P'){
          this.props.listar(1)
      }else{
        this.props.listarReajuste(1);
      }
    }
  }
  recargar = () => {
    // this.props.getMisCajas(this.props.match.params.id);
  }
  render() {
      const { miscajas, cargando } = this.props;
  	return (

            <div className="d-flex justify-content-center index--padding bgr--street">
	            <div className="col-md-12 p-0">
			        {/*<Nav tabs className="col-12  px-0 ">
                        <NavItem  className="col-3 col-md-3 pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'D' })}
                                onClick={() => { this.toggle('D'); }}>
                                <h5>Detalle Gallinero</h5>
                            </NavLink>
                        </NavItem>
                        <NavItem  className="col-3 col-md-3 pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'P' })}
                                onClick={() => { this.toggle('P'); }}>
                                <h5>Control Peso</h5>
                            </NavLink>
                        </NavItem>



			        </Nav>
			        <TabContent activeTab={this.state.activeTab} className="mt-0">

                        <TabPane  tabId={"P"}>
                            <LoadMask loading={cargando} dark blur>
                                <ControlPesoGrid {...this.props} />
                            </LoadMask>
                        </TabPane>

                       <TabPane  tabId={"D"}>
                            <LoadMask loading={cargando} dark blur>
                                <DetalleGrid {...this.props} />
                            </LoadMask>
                        </TabPane>

			        </TabContent>*/}
                    <LoadMask loading={cargando} dark blur>
                        <DetalleGrid {...this.props} />
                    </LoadMask>
			    </div>
	        </div>


		)
  }
}
