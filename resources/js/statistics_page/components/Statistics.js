import React from 'react';
import CommentsList from './CommentsList';
import AverageLine from './AverageLine';
import BalanceOfComments from './BalanceOfComments';

class Statistics extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
           <div>
               <div className="row">
                    <div className="col-sm">
                        <CommentsList comments={this.props.assignment.comments}/>
                    </div>
                    <div className="col-sm">
                        <AverageLine
                            chartID="avgWordsGraph"
                            title="Average words"
                            unit="words"
                            total_average={this.props.total_average_words}
                            points={this.props.assignment.guests_average_words.concat(this.props.assignment.personal_average_words)}
                            formatAverage={(n) => Math.round(n) + " words"}
                            tooltipCallback={(tooltipItem, data) => tooltipItem.xLabel + " words" + (tooltipItem.datasetIndex == 1 ? ' (Average)' : '')} />
                        <AverageLine
                            chartID="avgTimeGraph"
                            title="Average time"
                            unit="seconds"
                            total_average={5}
                            points={this.props.assignment.guests_average_times.concat(this.props.assignment.personal_average_time)(t => t / 60)}
                            formatAverage={(n) => {
                                const mins = Math.floor(n);
                                const secs = Math.round((n - mins) * 60);
                                return `${mins} mins ${secs} secs`
                            }}
                            tooltipCallback={(tooltipItem, data) => {
                                const mins = Math.floor(tooltipItem.xLabel);
                                const secs = Math.round((tooltipItem.xLabel - mins) * 60);
                                const isAverage = (tooltipItem.datasetIndex == 1 ? ' (Average)' : '');
                                return `${mins} mins ${secs} secs${isAverage}`;
                            }} />
                        <BalanceOfComments comments={this.props.assignment.comments}/>
                    </div>
                </div>
           </div> 
        );
    }
}

export default Statistics;