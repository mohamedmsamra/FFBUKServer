import React from 'react';
import CommentsList from './CommentsList';
import AverageLine from './AverageLine';
import BalanceOfComments from './BalanceOfComments';

class Statistics extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCharts() {
        const formatAverageTime = (n) => {
            const mins = Math.floor(n);
            const secs = Math.round((n - mins) * 60);
            return `${mins}m ${secs}s`
        };

        if (IS_OWNER) {
            return (
                <div className="col-sm">
                    <h2>Overall statistics</h2>
                    <p>These statistics are only visible to the course lead, and include the statistics of each member</p>
                    <AverageLine
                        chartID="avgWordsGraph"
                        title="Average words"
                        unit="words"
                        total_average={this.props.assignment.total_average_words}
                        personal_average={this.props.assignment.personal_average_words}
                        points={this.props.assignment.guests_average_words}
                        formatAverage={(n) => Math.round(n) + " words"}
                        tooltipCallback={(tooltipItem, data) => tooltipItem.xLabel + " words" + (tooltipItem.datasetIndex == 1 ? ' (Average)' : '') + (tooltipItem.datasetIndex == 2 ? ' (You)' : '')} />
                    <AverageLine
                        chartID="avgTimeGraph"
                        title="Average time"
                        unit="seconds"
                        total_average={this.props.assignment.total_average_times / 60}
                        personal_average={this.props.assignment.personal_average_time / 60}
                        points={this.props.assignment.guests_average_times.map(t => t / 60)}
                        formatAverage={formatAverageTime}
                        tooltipCallback={(tooltipItem, data) => {
                            const mins = Math.floor(tooltipItem.xLabel);
                            const secs = Math.round((tooltipItem.xLabel - mins) * 60);
                            const isAverage = (tooltipItem.datasetIndex == 1 ? ' (Average)' : '');
                            const isYou = (tooltipItem.datasetIndex == 2 ? ' (You)' : '');
                            return `${mins} mins ${secs} secs${isAverage}${isYou}`;
                        }} />
                    <BalanceOfComments
                        id="chartBalanceCommentsOverall"
                        title="Balance of Comments (overall)"
                        positive={this.props.assignment.comments.filter(c => c.type == 'positive').reduce((a, b) => a + b.count, 0)}
                        negative={this.props.assignment.comments.filter(c => c.type == 'negative').reduce((a, b) => a + b.count, 0)} />
                    <h2>Personal statistics</h2>
                    <BalanceOfComments
                        id="chartBalanceCommentsPersonal"
                        title="Balance of Comments (personal)"
                        positive={this.props.assignment.balance_positive_comments}
                        negative={this.props.assignment.balance_negative_comments} />
                </div>
            );
        } else {
            return (
                <div className="col-sm">
                    <h2>Personal statistics</h2>
                    <h4>Average words: {Math.round(this.props.assignment.personal_average_words)} words</h4>
                    <h4>Average time: {formatAverageTime(this.props.assignment.personal_average_time)}</h4>
                    <BalanceOfComments
                        id="chartBalanceCommentsPersonal"
                        title="Balance of Comments"
                        positive={this.props.assignment.balance_positive_comments}
                        negative={this.props.assignment.balance_negative_comments} />
                </div>
            );
        }
    }

    render() {
        return (
           <div>
               <div className="row">
                    <div className="col-sm">
                        <CommentsList comments={this.props.assignment.comments} />
                    </div>
                    {this.renderCharts()}
                </div>
           </div> 
        );
    }
}

export default Statistics;