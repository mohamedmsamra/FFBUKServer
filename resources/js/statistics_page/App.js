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
        this.setState({
            assignment: {
                name: 'Assignment 1',
                guests_average_words: [500, 1500, 200, 158],
                guests_average_times: [1200, 500, 145, 1000],
                comments: [
                    {
                        id: 1,
                        type: 'negative',
                        count: 50,
                        private: true,
                        section: {id: 1, name: 'Section 1'},
                        text: "Negative 1"
                    },
                    {
                        id: 2,
                        type: 'negative',
                        count: 4,
                        private: false,
                        section: {id: 2, name: 'Section 2'},
                        text: "This is a comment"
                    },
                    {
                        id: 3,
                        type: 'positive',
                        count: 5,
                        private: true,
                        section: {id: 3, name: 'Section 3'},
                        text: "New comment"
                    },
                    {
                        id: 4,
                        type: 'positive',
                        count: 8,
                        private: false,
                        section: {id: 1, name: 'Section 1'},
                        text: "Sample comment"
                    },
                    {
                        id: 5,
                        type: 'negative',
                        count: 12,
                        private: true,
                        section: {id: 2, name: 'Section 2'},
                        text: "Bad comment"
                    },
                    {
                        id: 6,
                        type: 'positive',
                        count: 42,
                        private: true,
                        section: {id: 1, name: 'Section 1'},
                        text: "Good comment"
                    },
                    {
                        id: 7,
                        type: 'negative',
                        count: 68,
                        private: false,
                        section: {id: 3, name: 'Section 3'},
                        text: "Okay comment"
                    },
                    {
                        id: 8,
                        type: 'positive',
                        count: 1,
                        private: true,
                        section: {id: 1, name: 'Section 1'},
                        text: "Коммент по-русски"
                    },
                ]
            },
        });
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