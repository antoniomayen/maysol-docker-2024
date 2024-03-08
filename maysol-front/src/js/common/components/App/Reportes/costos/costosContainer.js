import React from 'react'
import PropTypes from 'prop-types'
import { TableHeaderColumn } from 'react-bootstrap-table'
import { activeFormatter }  from 'Utils/Acciones/Acciones'
import { Link } from 'react-router-dom'
import { BreakLine } from 'Utils/tableOptions';
import Table from 'Utils/Grid'
import NumberFormat from "react-number-format";
import ToolbarCuenta from 'Utils/Toolbar/ToolbarSelect';
import { dateFormatter, formatoMoneda } from 'Utils/renderField/renderReadField'
import HeaderSimple from 'Utils/Headers/HeaderSimple';
import { BootstrapTable } from 'react-bootstrap-table';

function formatoEmpresa(cell, row) {
    return <span>{cell.nombre}</span>
}

export default class CostosContainer extends React.Component {

    componentWillMount() {
        // this.props.listar();

    }

    render(){
        const { data, cargando, page, me } = this.props;
        const { listar, search, filtro, destroy } = this.props;
        return(
            <div className="row d-flex justify-content-center">


            
            </div>
        )
    }
}
