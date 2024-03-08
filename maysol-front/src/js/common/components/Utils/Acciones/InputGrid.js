import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './acciones.css';
import Swal from 'sweetalert2';
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';


class InputInGrid extends Component {

    constructor(props) {
        super(props);
        this.state = { comentario: props.contenido.comentario};

    }
    onChangeValueInput = (ev) => {
        const { editable, contenido } = this.props;
        this.setState({ comentario: ev.currentTarget.value})
        this.props.addComentarios({id: contenido.id, comentario: ev.currentTarget.value})
    }
    componentDidUpdate(prevProps, prevState){
        const { contenido } = this.props;
        if(this.props.editable !== prevProps.editable){

            if (this.props.editable) {
                this.setState({comentario: contenido.comentario})
            }
        }
    }
    render() {
        const { editable, contenido, rowIndex } = this.props;
        return (
            <div>
                {
                    editable && rowIndex > 0  ? (
                        <textarea
                        ref='inputRef'
                        className={  ' col-md-12 form-control editor edit-text' }
                        style={ { display: 'block', width: '100%' } }
                        value={ this.state.comentario }
                        onChange={ this.onChangeValueInput}
                        style={{ resize: "none" }}
                        rows={ 3}
                        className={'col-md-12 form-control editor edit-text'}
                        />
                    ) : (
                        <span>{contenido.comentario}</span>
                    )
                }
            </div>
        )
    }
}
InputInGrid.propTypes = {
};

export function editableFormater(acciones) {
    return ( cell, row, columnIndex,rowIndex) => {
        return (<InputInGrid id={cell} contenido={row} rowIndex={rowIndex} {...acciones} />)
    };
}
