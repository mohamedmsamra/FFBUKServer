import React from 'react';
import PDFSide from './components/PDFSide';
import MarkingSide from './components/MarkingSide';

class App extends React.Component {
    render() {
        return (
            <div className="row">
                <PDFSide />
                <MarkingSide />
            </div>
        )
    }
}

export default App;