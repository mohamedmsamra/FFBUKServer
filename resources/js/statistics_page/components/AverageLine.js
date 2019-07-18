import React from 'react';
import Chart from 'chart.js';

class AverageLine extends React.Component {
    componentDidMount() {
        var chart = document.getElementById(this.props.chartID);
        var ctx = chart.getContext('2d');
        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'User average',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderColor: 'rgba(0,0,0,0.6)',
                        data: this.props.points.map(p => ({x: p, y: 0})),
                        pointRadius: 7,
                        pointHoverRadius: 7,
                    },
                    {
                        label: 'Overall average',
                        backgroundColor: 'rgba(255,0,0,0.6)',
                        borderColor: 'rgba(255,0,0,0.8)',
                        data: [{x: this.props.total_average, y: 0}],
                        pointRadius: 9,
                        pointHoverRadius: 9,
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        display: false,
                        ticks: {
                            display: false,
                            min: 0,
                            max: 0.1
                        },
                        gridLines: {
                            display: false
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }],
                },
                tooltips: {
                    callbacks: {
                        label: this.props.tooltipCallback
                    }
                },
                maintainAspectRatio: false
            }
        });
        scatterChart.canvas.parentNode.style.height = '50px';
    }

    render() {
        return (
            <div className="statistics-block">
                <h3>{this.props.title + ': ' + this.props.formatAverage(this.props.total_average)}</h3>
                <div className="chart-container" style={{height: 50}}>
                    <canvas id={this.props.chartID}></canvas>
                </div>
            </div>
        );
    }
}

export default AverageLine;