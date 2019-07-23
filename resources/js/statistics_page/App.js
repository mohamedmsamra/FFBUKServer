import React from 'react';
import Analytics from './components/Analytics';
import Loading from '../global_components/Loading';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignment: null
        }
    }

    componentDidMount() {
        fetch(`/api/assignments/${ASSIGNMENT_ID}/analytics`)
        .then(data => data.json())
        .then(data => {this.setState({assignment: data})});
    }

    render() {
        return (
            <div className='container'>
                 <a href={`/courses/${COURSE_ID}`}>Back to {COURSE_NAME}</a>
                {!this.state.assignment ?
                    <Loading text="Loading analytics..." />
                :
                    <>
                        <h1>Analytics for {this.state.assignment.name}</h1>
                        <Analytics assignment={this.state.assignment}/>
                    </>
                }
            </div>
        );
    }
}

export default App;