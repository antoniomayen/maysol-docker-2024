import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './acciones.css';
import Swal from 'sweetalert2';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import { PL, CF } from '../../../utility/constants';

class CategoriaGrid extends Component {

    constructor(props) {
        super(props);

    }
    onChangeValueInput = (ev) => {

    }
    componentDidUpdate(prevProps, prevState){

    }
    render() {
        const { editable, contenido, rowIndex, tipo, id } = this.props;
        let row= {
            espaniol: '',
            japones: ''
        }
        let idTipo = 0;

        if(tipo == "CF"){
            idTipo = id;
            if(contenido.cf){
                idTipo = contenido.cf
            }
            row = CF.find(x =>  x.id === idTipo)
        }else if(tipo == "PL"){
            idTipo = id;
            if(contenido.pl){
                idTipo = contenido.pl;
            }
            row = PL.find(x  => x.id === idTipo)
        }
        return (
            <div>
                {
                    row !== undefined && (
                        <div>
                            <p className="m-0">
                                {row.espaniol}
                            </p>
                            <p className="m-0">
                            {row.japones}
                            </p>
                        </div>

                    )
                }


            </div>
        )
    }
}
CategoriaGrid.propTypes = {
};

export function categoriaFormater(acciones) {
    return ( cell, row, columnIndex,rowIndex) => {
        return (<CategoriaGrid id={cell} contenido={row} rowIndex={rowIndex} {...acciones} />)
    };
}
