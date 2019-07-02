import React from 'react';
import PDFSide from './components/PDFSide';
import MarkingSide from './components/MarkingSide';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfsSelected: [],
            pdfPointer: -1
        }
        this.handlePdfsSelected = this.handlePdfsSelected.bind(this);
    }

    handlePdfsSelected(files) {
        const pdfsSelected = [];
        for (let i = 0; i < files.length; i++) {
            pdfsSelected[i] = {name: files[i].name, url: URL.createObjectURL(files[i])};
        }
        this.setState({pdfsSelected: pdfsSelected, pdfPointer: 0});
    }

    render() {
        return (
            <div className="row">
                <PDFSide
                    handlePdfsSelected={this.handlePdfsSelected}
                    pdfsSelected={this.state.pdfsSelected}
                    pdfPointer={this.state.pdfPointer} />
                <MarkingSide />
            </div>
        )
    }
}

export default App;