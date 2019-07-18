import React from 'react';
import Chart from 'chart.js';

class AverageLine extends React.Component {
    calculateAverage() {
        return this.props.points.reduce((a, b) => a + b, 0) / this.props.points.length;
    }

    componentDidMount() {
        var ctx = document.getElementById(this.props.chartID).getContext('2d');
        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'User average',
                        data: this.props.points.map(p => ({x: p, y: 0}))
                    },
                    {
                        label: 'Overall average',
                        backgroundColor: 'red',
                        data: [{x: this.calculateAverage(), y: 0}]
                    }
                ]
            },
            options: {
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            return tooltipItem.xLabel + ' ' + this.props.unit;
                        }
                    }
                }
            }
            // options: {
            //     scales: {
            //         xAxes: [{
            //             type: 'linear',
            //             position: 'bottom'
            //         }]
            //     }
            // }
        });
        // var myBarChart = new Chart(ctx, {
        //     type: 'bar',
        //     data: [{x:'2016-12-25', y:20}, {x:'2016-12-26', y:10}]
        // });
    }

    render() {
        return (
            <>
                <h3>{this.props.title + ': ' + this.calculateAverage()}</h3>
                <canvas id={this.props.chartID}></canvas>
            </>
        );
    }
}

export default AverageLine;