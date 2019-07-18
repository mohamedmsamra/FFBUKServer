import React from 'react';
import Statistics from './components/Statistics';

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
        .then(data => {console.log(data); this.setState({assignment: data})});
    }

    render() {
        return (
            <div className='container'>
                {!this.state.assignment ?
                    <p>Loading...</p>
                :
                    <>
                        <h1>Statistics for {this.state.assignment.name}</h1>
                        <Statistics assignment={this.state.assignment}/>
                    </>
                }
            </div>
        );
    }
}

export default App;