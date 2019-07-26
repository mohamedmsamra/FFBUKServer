import React from 'react';
import CommentsList from './CommentsList';
import AverageLine from './AverageLine';
import BalanceOfComments from './BalanceOfComments';

/* A page for the analytics of an assignment. */
class Analytics extends React.Component {
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
                    <h2>Overall analytics</h2>
                    <p>These analytics are only visible to the course lead, and include the analytics of each member</p>

                    {/* Line for averages of number of words */}
                    <AverageLine
                        chartID="avgWordsGraph"
                        title="Average words"
                        unit="words"
                        total_average={this.props.assignment.total_average_words}
                        personal_average={this.props.assignment.personal_average_words}
                        points={this.props.assignment.guests_average_words}
                        formatAverage={(n) => Math.round(n) + " words"}
                        tooltipCallback={(tooltipItem, data) => (
                            tooltipItem.xLabel + " words" +
                            (tooltipItem.datasetIndex == 1 ? ' (Average)' : '') +
                            (tooltipItem.datasetIndex == 2 ? ' (You)' : '')
                        )} />

                    {/* Line for average times */}
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

                    {/* Overall balance of comments */}
                    <BalanceOfComments
                        id="chartBalanceCommentsOverall"
                        title="Balance of Comments (overall)"
                        positive={this.props.assignment.comments.filter(c => c.type == 'positive').reduce((a, b) => a + b.count, 0)}
                        negative={this.props.assignment.comments.filter(c => c.type == 'negative').reduce((a, b) => a + b.count, 0)} />

                    <h2>Personal analytics</h2>

                    {/* Personal balance of comments */}
                    <BalanceOfComments
                        id="chartBalanceCommentsPersonal"
                        title="Balance of Comments (personal)"
                        positive={this.props.assignment.balance_positive_comments}
                        negative={this.props.assignment.balance_negative_comments} />
                </div>
            );
        } else {
            // Analyics when the user isn't the course owner
            return (
                <div className="col-sm">
                    <h2>Personal analytics</h2>
                    <h4>Average words: {Math.round(this.props.assignment.personal_average_words)} words</h4>
                    <h4>Average time: {formatAverageTime(this.props.assignment.personal_average_time / 60)}</h4>
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
                        {/* List of comments */}
                        <CommentsList comments={this.props.assignment.comments} />
                    </div>
                    {this.renderCharts()}
                </div>
           </div> 
        );
    }
}

export default Analytics;