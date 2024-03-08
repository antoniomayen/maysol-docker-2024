import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Polar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { PL, CF } from '../../../../utility/constants'
import { dateFormatter } from '../../../Utils/renderField/renderReadField'
import _ from 'lodash';


export default class GraficascfContainer extends React.Component {

    componentDidUpdate(prevProps, prevState){


    }
    render(){
        const { grafica1 , grafica2, tipo} = this.props;

        return(
            <div className="col-md-12 bordes-izquierdos py-4">
                <div className="grid-container" >
                    <div style={{flex: "1"}}>
                        <h3 className="text-primary"><b>Gastos mensuales:</b></h3>
                    </div>
                    {
                        this.props.monedaTab === 'USD' ? (
                            <Polar data={grafica1}
                                height={250}
                                options={{
                                    responsive: true,
                                    tooltips: {
                                        callbacks: {
                                            label: function(tooltipItem, data) {
                                                let value = tooltipItem.yLabel
                                                value = parseFloat(value)
                                                let value_abs = Math.abs(value)
                                                if (value_abs >= 1000) {
                                                    return data.labels[tooltipItem.index] + ': $ ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                } else {
                                                    return data.labels[tooltipItem.index] + ': $ ' + value.toFixed(2);
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        display: true,
                                        position:'bottom',
                                        labels: {
                                            usePointStyle: true,
                                        }
                                    }
                                }}/>
                        ) : (
                            <Polar data={grafica1}
                                height={250}
                                options={{
                                    responsive: true,
                                    tooltips: {
                                        callbacks: {
                                            label: function(tooltipItem, data) {
                                                let value = tooltipItem.yLabel
                                                value = parseFloat(value)
                                                let value_abs = Math.abs(value)
                                                if (value_abs >= 1000) {
                                                    return data.labels[tooltipItem.index] + ': Q ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                } else {
                                                    return data.labels[tooltipItem.index] + ': Q ' + value.toFixed(2);
                                                }
                                            }
                                        }
                                    },
                                    legend: {
                                        display: true,
                                        position:'bottom',
                                        labels: {
                                            usePointStyle: true,
                                        }
                                    }
                                }}/>
                        )
                    }

                </div>
                <div className="col-md-12 mt-5" style={{minHeight: 200}} >
                    <div style={{flex: "1"}}>
                        <h3 className="text-primary"><b>Gastos por semana:</b></h3>
                    </div>
                    {
                        this.props.monedaTab === 'USD' ? (
                                    <Line
                                data={grafica2}
                                height={300}
                                width={400}
                                options={{
                                    responsive: true,
                                    scales: {
                                        xAxes: [{ stacked: true, barThickness: 20 }],
                                        yAxes: [
                                            {
                                                stacked: true,
                                                ticks: {
                                                    beginAtZero: true,
                                                    callback: function (value, index, values) {
                                                        value = parseFloat(value)
                                                        let value_abs = Math.abs(value)
                                                        if (value_abs >= 1000) {
                                                            return '$ ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                        } else {
                                                            return '$ ' + value.toFixed(2);
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    tooltips: {
                                        callbacks: {
                                            label: function(tooltipItem, data) {
                                                let value = tooltipItem.yLabel

                                                value = parseFloat(value)
                                                let value_abs = Math.abs(value)
                                                if (value_abs >= 1000) {
                                                    return  data.datasets[tooltipItem.datasetIndex].label + ': $ ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                } else {
                                                    return data.datasets[tooltipItem.datasetIndex].label + ': $ ' + value.toFixed(2);
                                                }
                                            },
                                            title : function(tooltipItem, data){
                                                return   dateFormatter(tooltipItem[0].xLabel);
                                            }
                                        }
                                    },
                                    legend: {
                                        display: true,
                                        position:'bottom',
                                        labels: {
                                            usePointStyle: true,
                                        }
                                    },

                                }}
                            />
                        ):(
                            <Line
                        data={grafica2}
                        height={300}
                        width={400}
                        options={{
                            responsive: true,
                            scales: {
                                xAxes: [{ stacked: true, barThickness: 20 }],
                                yAxes: [
                                    {
                                        stacked: true,
                                        ticks: {
                                            beginAtZero: true,
                                            callback: function (value, index, values) {
                                                value = parseFloat(value)
                                                let value_abs = Math.abs(value)
                                                if (value_abs >= 1000) {
                                                    return 'Q ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                                } else {
                                                    return 'Q ' + value.toFixed(2);
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem, data) {
                                        let value = tooltipItem.yLabel

                                        value = parseFloat(value)
                                        let value_abs = Math.abs(value)
                                        if (value_abs >= 1000) {
                                            return  data.datasets[tooltipItem.datasetIndex].label + ': Q ' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                        } else {
                                            return data.datasets[tooltipItem.datasetIndex].label + ': Q ' + value.toFixed(2);
                                        }
                                    },
                                    title : function(tooltipItem, data){
                                        return   dateFormatter(tooltipItem[0].xLabel);
                                    }
                                }
                            },
                            legend: {
                                display: true,
                                position:'bottom',
                                labels: {
                                    usePointStyle: true,
                                  }
                            },

                        }}
                    />
                        )
                    }


                </div>
            </div>
        )
    }
}
