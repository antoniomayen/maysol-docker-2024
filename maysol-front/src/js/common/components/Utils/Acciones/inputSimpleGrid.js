import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './acciones.css';
import Swal from 'sweetalert2';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';


class InputSimpleGrid extends Component {

    constructor(props) {
        super(props);
        this.state = { plazo: props.contenido.plazo};

    }
    onChangeValueInput = (ev) => {
        const { editable, contenido } = this.props;
        this.setState({ plazo: ev.currentTarget.value})
        this.props.addComentarios({id: contenido.id, plazo: ev.currentTarget.value})
    }
    componentDidUpdate(prevProps, prevState){
        const { contenido } = this.props;
        if(this.props.editable !== prevProps.editable){

            if (this.props.editable) {
                this.setState({plazo: contenido.plazo})
            }
        }
    }
    pluralMeses = (plazo) => {
        if(!plazo){
            return "--"
        }
        if(plazo > 1){
            return plazo + "meses"
        }else{
            return plazo + "mes"
        }
    }
    render() {
        const { editable, contenido, rowIndex } = this.props;
        return (
            <div>
                {
                    editable && rowIndex > 0  ? (
                        <div>
                            <div className="col-md-12 text-center">
                                <label htmlFor="fecha">Plazo en meses:</label>
                            </div>
                            <div className="col-md-12">
                                <input
                                    ref='inputRef'
                                    className={  ' col-md-12 form-control editor edit-text' }
                                    style={ { display: 'block', width: '100%' } }
                                    value={ this.state.plazo }
                                    onChange={ this.onChangeValueInput}
                                    style={{ resize: "none" }}
                                    rows={ 3}
                                    className={'col-md-12 form-control editor edit-text'}/>
                            </div>

                        </div>


                    ) : (
                        rowIndex == 0 ? <span></span> :


                                contenido.plazo &&(

                                        contenido.plazo == 1 ? (
                                            <span>{contenido.plazo} mes</span>
                                        )

                                         : (
                                            <span>{contenido.plazo} meses</span>
                                         )



                                )

                    )
                }
            </div>
        )
    }
}
InputSimpleGrid.propTypes = {
};

export function inputSimpleFormater(acciones) {
    return ( cell, row, columnIndex,rowIndex) => {
        return (<InputSimpleGrid id={cell} contenido={row} rowIndex={rowIndex} {...acciones} />)
    };
}
