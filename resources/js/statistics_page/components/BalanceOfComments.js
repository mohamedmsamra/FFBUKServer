import React from 'react';
import Chart from 'chart.js';

class BalanceOfComments extends React.Component {
    componentDidMount() {
        var ctx = document.getElementById(this.props.id).getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // The data for our dataset
            data: {
                labels: ['Positive', 'Constructive'],
                datasets: [{
                    data: [
                        this.props.positive,
                        this.props.negative
                    ],
                    backgroundColor: [
                        '#28a745',
                        '#ffc107'
                    ]
                }]
            },

            // Configuration options go here
            options: {
                animation: {
                    duration: 3000
                }
            }
        });
    }

    render() {
        return (
            <div className="statistics-block">
                <h4>Balance of Comments</h4>
                <canvas id={this.props.id}></canvas>
            </div>
        );
    }
}

export default BalanceOfComments;