import React from 'react'
import Card from '../../../Utils/Cards/cardFormulario';
import LoadMask from 'Utils/LoadMask';
import Form from './CategoriaForm';
import { CategoriaUpdateForm } from './CategoriaForm';
import { CF, PL } from '../../../../utility/constants';

function concatenar(opcion){
    opcion.map(item => {
        item.label = item.japones + "-" + item.espaniol
    })
    return opcion;
}
export default class Create extends React.Component{
    state = {
        editar: false,
        cf: [],
        pl: []
    }

    componentWillMount(){
        let cf = [
            {label: "営業CF", options:[
                {label: "入金-Depositar", options:[]},
                {label: "出金-Retiro", options:[]},
            ]},

            {label: "投資CF-Inversión", options:[]},
            {label: "財務CF-Finanzas", options:[]},
            {label: "当月純増減-Cambio neto en el mes actual", options:[]}
        ]
        let options1 = CF.slice(0,5);
        options1.map(item => {
            item.label = item.japones + "-" + item.espaniol
        })
        let options2 = CF.slice(5,11);
        options2.map(item => {
            item.label = item.japones + "-" + item.espaniol
        })
        let options3 = CF.slice(11,16);
        options3.map(item => {
            item.label = item.japones + "-" + item.espaniol
        })
        let options4 = CF.slice(16,20);
        options4.map(item => {
            item.label = item.japones + "-" + item.espaniol
        })
        cf[0].options[0].options = options1;
        cf[0].options[1].options = options2;
        cf[1].options = options3;
        cf[2].options = options4;
        cf[3].options = concatenar([CF[20]]);

        /* parte del pl */
        let pl = [
            {label: "変動費 - Costo variable", options:[
                {label: "広告費-Costo de publicidad" , options:[]},
                {label: "販売手数料-Comisión de ventas" , options:[]},
                {label: "運搬費-Costo de transporte" , options:[]},
            ]},
            {label: "固定費 - Costo fijo", options:[
                {label: "消耗品費/追加設備費/月次経費-Consumibles / equipo adicional / gastos mensuales.", options:[]},
                {label: "通信費 - Costo de comunicación.", options:[]},
                {label: "人件費 - Gastos de personal.", options:[]},
                {label: "採用活動費 - Costo de reclutamiento.", options:[]},
                {label: "商品/サービス開発費 - Costo de desarrollo del producto / servicio.", options:[]},
                {label: "支払い手数料 - Cuota de pago.", options:[]},
                {label: "その他販管費 - Otros gastos de SG&A.", options:[]},
                {label: "税金、保険 - Impuestos, seguros.", options:[]},
                {label: "消耗品費/追加設備費/月次経費- Consumibles / equipo adicional / gastos mensuales", options:[]},
            ]},
            {
                label: "初期投資 - Inversión inicial", options:[]
            }
        ]
        options1 = PL.slice(0,7);

        pl[0].options[0].options = concatenar(options1);
        pl[0].options[1].options = concatenar([PL[7],PL[8]]);
        pl[0].options[2].options = concatenar([PL[9]]);

        pl[1].options[0].options = concatenar([PL[10]]);
        pl[1].options[1].options = concatenar(PL.slice(11,14));
        pl[1].options[2].options = concatenar(PL.slice(14,19));

        pl[1].options[3].options = concatenar([PL[19]]);
        pl[1].options[4].options = concatenar([PL[20]]);
        pl[1].options[5].options = concatenar(PL.slice(21,24));
        pl[1].options[6].options = concatenar(PL.slice(24,28));
        pl[1].options[7].options = concatenar(PL.slice(28,31));
        pl[2].options = concatenar(PL.slice(31,34))
        this.setState({cf: cf,pl: pl})
        if(this.props.match.params.id){
            this.props.getCategoria(this.props.match.params.id);
            this.setState({editar: true})
        }

    }
    render() {
        const { crearCategoria, actualizarCategoria } = this.props;
        const { infoCategoria, loaderCategoria } = this.props;
        return(
            <Card titulo="Categoria Gasto">
                <LoadMask loading={loaderCategoria} blur_1>
                    {
                        this.state.editar ?
                            <CategoriaUpdateForm cf={this.state.cf} pl={this.state.pl} editar={true} updateData={infoCategoria} onSubmit={actualizarCategoria}/>
                        :
                            <Form cf={this.state.cf} pl={this.state.pl} onSubmit={crearCategoria}/>
                    }
                </LoadMask>
            </Card>
        )

    }
}
