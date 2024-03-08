import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classNames from 'classnames';
import GastoGrid from './GastoGrid';
import HistoricoGrid from './HistoricoGrid';
import LoadMask from '../../../Utils/LoadMask';
import { dateFormatter, dateTimeFormatter, RenderDateTime } from '../../../Utils/renderField/renderReadField'

export default class GastosContainer extends React.Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1',
      tabCaja: 'C',
      parametro:null,
      saldo: 0
    };
  }
  componentWillMount(){
    this.props.getMisCajas(this.props.match.params.id);

  }
  componenteDidMount(){


  }

  componentDidUpdate(prevProps){

    if(this.props.match.path !== prevProps.match.path){
        this.setState({parametro: this.props.match.params.id});
      this.props.getMisCajas(this.state.parametro);
    }
    if(this.props.miscajas !== prevProps.miscajas){

        try {
            if(this.props.miscajas.length ==0){
                this.setState({
                    activeTab: 'H'
                  });
                this.props.getHistorico(1, this.props.match.params.id);
                this.props.getDuenioCaja(this.props.match.params.id)
            }else{
                let nombre = this.props.miscajas[0].id.toString()
                this.setState({activeTab: nombre, tabCaja: nombre})
                this.props.listarGastos(1,this.props.miscajas[0].id);
                this.props.getDuenioCaja(this.props.match.params.id)
            }

        } catch (error) {

        }

    }
  }
  toggle(tab, caja) {
    if (this.state.activeTab !== tab) {
        let nombre=tab;
        if(caja){
            this.setState({tabCaja:nombre})
        }
      this.setState({
        activeTab: nombre
      });
      if (caja){
          this.props.listarGastos(1, tab)
          this.props.getDuenioCaja(this.props.match.params.id)
      }else{
        this.props.getHistorico(1, this.props.match.params.id);
        this.props.getDuenioCaja(this.props.match.params.id)
      }
    }
  }
  recargar = () => {
    this.props.getMisCajas(this.props.match.params.id);
  }
  render() {
      const { miscajas, cargando } = this.props;
  	return (
        <LoadMask loading={cargando} dark blur>
            <div className="d-flex justify-content-center index--padding bgr--street">
	            <div className="col-md-12">
			        <Nav tabs className="col-12 px-2 px-0 tabs-caja-chica">
                    {
                        miscajas.map(caja  => {

                            return (
                                <NavItem key={caja.id} className="col-3 col-md-2  pl-0 pr-0">
                                    <NavLink

                                        className={classNames('py-2 text-center',{ active: `${this.state.activeTab}` === `${caja.id}` })}
                                        onClick={() => { this.toggle(caja.id.toString(), true); }}>
                                        <h5>
                                            {/* {dateTimeFormatter(caja.fechaInicio)} */}
                                            <RenderDateTime value={caja.fechaInicio} />
                                        </h5>
                                    </NavLink>
                                </NavItem>
                            )
                        })
                    }
                        <NavItem  className="col-3 col-md-2 ml-auto pl-0 pr-0">
                            <NavLink
                                className={classNames('py-2 text-center',{ active: this.state.activeTab === 'H' })}
                                onClick={() => { this.toggle('H', false); }}>
                                <h5>Historial</h5>
                            </NavLink>
                        </NavItem>

			        </Nav>
			        <TabContent activeTab={this.state.activeTab} className="mt-0">

                        <TabPane  tabId={this.state.tabCaja}>
                            {
                                this.state.tabCaja == this.state.activeTab && (
                                    <GastoGrid {...this.props} cierre={this.state.activeTab} recargar={this.recargar}/>
                                )
                            }
                        </TabPane>

                       <TabPane  tabId={"H"}>
                        {
                            this.state.activeTab  == 'H' && (
                                <HistoricoGrid {...this.props} idcaja={this.props.match.params.id} />
                            )
                        }

                        </TabPane>

			        </TabContent>
			    </div>
	        </div>
        </LoadMask>


		)
  }
}
