import React from 'react';
import Chart from 'chart.js';

class BalanceOfComments extends React.Component {
    componentDidMount() {
        var ctx = document.getElementById('balanceOfCommentsChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',

            // The data for our dataset
            data: {
                labels: ['Positive', 'Constructive'],
                datasets: [{
                    data: [
                        this.props.comments.filter(c => c.type == 'positive').reduce((a, b) => a + b.count, 0),
                        this.props.comments.filter(c => c.type == 'negative').reduce((a, b) => a + b.count, 0)
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
                <canvas id="balanceOfCommentsChart"></canvas>
            </div>
        );
    }
}

export default BalanceOfComments;