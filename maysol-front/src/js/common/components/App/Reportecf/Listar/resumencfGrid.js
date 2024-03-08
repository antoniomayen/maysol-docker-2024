import React from 'react';
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from 'Utils/tableOptions';
import { BootstrapTable } from 'react-bootstrap-table';
import NumberFormat from "react-number-format";
import { dateFormatter, cellTachado, formatoMoneda } from 'Utils/renderField/renderReadField'
import { categoriaFormater } from 'Utils/Acciones/comentarioGrid';

export default class ResumencfGrid extends React.Component {
    formatoMoneda = (cell) =>{
        let simbolo = this.props.simbolo
        return(formatoMoneda(cell, simbolo))
    }
    render(){
        const { listarResumen, data, loader, tipo } = this.props;
        return (
            <div className="bordes-derechos tabla-103 resumen-cf" style={{height: '100%'}}>
            <BootstrapTable
                    data={ data }>
                <TableHeaderColumn
                                tdStyle={{paddingLeft: 60}}
                                isKey={true}
                                editable={ false }
                                dataFormat={categoriaFormater({tipo: tipo})}
                                dataField="categoria" dataSort>Descripción</TableHeaderColumn>
                <TableHeaderColumn
                    tdStyle={{paddingRight: 90}}
                    editable={ false }
                    columnClassName='text-derecha'
                    className='text-center'
                    dataFormat={this.formatoMoneda}
                    dataField="total" dataSort>Total</TableHeaderColumn>
            </BootstrapTable>

            </div>
        )
    }
}
