import React from 'react';
import CommentsList from './CommentsList';
import AverageLine from './AverageLine';
import BalanceOfComments from './BalanceOfComments';

class Statistics extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCharts() {
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
                        title="Average time per assignment"
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
                    <BalanceOfComments comments={this.props.assignment.comments} />
                    <h2>Personal statistics</h2>
                </div>
            );
        } else {
            return (
                <div className="col-sm">

                </div>
            );
        }
    }

    render() {
        const formatAverageTime = (n) => {
            const mins = Math.floor(n);
            const secs = Math.round((n - mins) * 60);
            return `${mins}m ${secs}s`
        };

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