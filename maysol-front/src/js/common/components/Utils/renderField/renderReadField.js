import React from 'react';
import NumberFormat from 'react-number-format';
import moment from 'moment';

export const RenderNumber = ({value, decimalScale, className}) => {
    return (
        <NumberFormat className={className}
                      decimalScale={decimalScale ? decimalScale : 0} fixedDecimalScale={true}
                      value={value} thousandSeparator={true} prefix={''} displayType={"text"}
        />
    )
};

export const RenderCurrency = ({value, className, simbolo='Q'}) => {
    return (
        <NumberFormat className={className}
                      decimalScale={2} fixedDecimalScale={true}
                      value={value? value.toFixed(2): 0} thousandSeparator={true} prefix={simbolo} displayType={"text"}
        />
    )
};

export const RenderDateTime = ({value, className}) => {
    if (value) {
        const fecha = new Date(value);
        return (
            <span className={className}>{moment(value).format('DD/MM/YYYY')} {fecha.toLocaleTimeString()}</span>
        );
    }
    return (<span className={className}>{value}</span>);
};
export const cellTachado = (cell, row) => {
    if(row.anulado){
        return {textDecoration: "line-through", whiteSpace: 'normal'}
    }
    return {whiteSpace: 'normal'}
}
export const  dateFormatter = (cell)  => {
    if (!cell) {
          return "";
    }

    try
    {
        let date = moment(cell).format('DD/MM/YYYY')
        return date
    }
    catch(e){
        return cell;
    }

};

export const  dateFormatterTimeZone = (cell)  => {
    if (!cell) {
          return "";
    }

    try
    {
        let date = moment.parseZone(cell).format("DD/MM/YYYY")
        return date
    }
    catch(e){
        return cell;
    }

};

export const  dateTimeFormatter = (cell)  => {
    if (!cell) {
          return "";
    }

    try
    {
        let date = moment(cell).format('DD/MM/YYYY hh:mm:ss')
        return date
    }
    catch(e){
        return cell;
    }

}

export const formatoMoneda = (cell, simbolo) =>{
    if ((typeof simbolo) === "object"){
        simbolo = simbolo.simbolo ? simbolo.simbolo : 'Q';
    }
    if(!cell) {
        return "-- --"
    }
    try{
        return (
             <NumberFormat
                decimalScale={2}
                fixedDecimalScale={true}
                value={cell !== null ? cell.toFixed(2) : 0}
                displayType={'text'}
                thousandSeparator={true}
                prefix={simbolo?simbolo: "Q"} />
        )
    }catch(e){
        return cell;
    }
}

export const formatoFraccion = (cell, row, enumObject, index) => {
    let fracion = '';
    let cantidad = cell;
    let unidades = cell;
    Object.entries(row.fraccionesPrecentacion).forEach(([key, value], ind) => {
        cantidad = Math.floor(
            unidades / parseFloat(value.existencias)
        );
        unidades %= value.existencias;
        if (cantidad > 0) {
            if (ind > 0 && fracion !== '') fracion += ' - ';
            fracion += `${cantidad} ${value.presentacion}(s)`;
        }
    });
    if (unidades > 0) {
        if (unidades === cell) fracion += ` ${unidades} Unidades`;
        else if (unidades !== cell) fracion += ` - ${unidades} Unidades`;
    }
    return fracion;
};

export const ReadFields = {
    renderCurrency : RenderCurrency,
    renderNumber: RenderNumber,
    renderDateTime: RenderDateTime,
    dateFormatter: dateFormatter,
    dateTimeFormatter: dateTimeFormatter,
};
