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
        this.handleNextPdf = this.handleNextPdf.bind(this);
        this.isLastPdf = this.isLastPdf.bind(this);
    }

    handlePdfsSelected(files) {
        const pdfsSelected = [];
        for (let i = 0; i < files.length; i++) {
            pdfsSelected[i] = {name: files[i].name, url: URL.createObjectURL(files[i])};
        }
        this.setState({pdfsSelected: pdfsSelected, pdfPointer: 0});
    }

    handleNextPdf() {
        this.setState(prevState => {
            console.log(this.isLastPdf());
            if (this.isLastPdf()) {
                prevState.pdfPointer = -1;
                prevState.pdfsSelected = [];
            } else {
                prevState.pdfPointer++;
            }
            return prevState;
        });
    }

    isLastPdf() {
        return this.state.pdfsSelected.length == (this.state.pdfPointer + 1);
    }

    render() {
        return (
            <div className="row cont">
                <PDFSide
                    handlePdfsSelected={this.handlePdfsSelected}
                    pdfsSelected={this.state.pdfsSelected}
                    pdfPointer={this.state.pdfPointer} />

                <MarkingSide
                    pdfsSelected={this.state.pdfsSelected}
                    pdfPointer={this.state.pdfPointer}
                    handleNextPdf={this.handleNextPdf}
                    isLastPdf={this.isLastPdf} />
            </div>
        )
    }
}

export default App;