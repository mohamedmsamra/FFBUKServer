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
                        <AverageLine chartID="avgWordsGraph" title="Average words" unit="words" points={this.props.assignment.guests_average_words} />
                        <AverageLine chartID="avgTimeGraph" title="Average time" unit="seconds" points={this.props.assignment.guests_average_times} />
                        <BalanceOfComments comments={this.props.assignment.comments}/>
                    </div>
                </div>
           </div> 
        );
    }
}

export default Statistics;