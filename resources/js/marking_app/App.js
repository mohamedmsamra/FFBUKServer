import React from 'react';
import PDFSide from './components/PDFSide';
import MarkingSide from './components/MarkingSide';
import Loading from '../global_components/Loading';
import CreateTemplateModal from './components/modals/CreateTemplateModal';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfsSelected: [],
            pdfPointer: -1,
            // assignment: {},
            loading: false
        }
        this.handlePdfsSelected = this.handlePdfsSelected.bind(this);
        this.handleNextPdf = this.handleNextPdf.bind(this);
        this.finishEarly = this.finishEarly.bind(this);
        this.setPdfMark = this.setPdfMark.bind(this);
        this.isLastPdf = this.isLastPdf.bind(this);
    }

    // componentDidMount() {
    //     this.fetchAssignment();
        
    // }

    // fetchAssignment() {
    //     fetch('/api/assignments/' + assignment_id)
    //         .then(data => data.json())   
    //         .then(data => {this.setState(prevState => ({assignment: Object.assign(prevState.assignment, this.assignmentFromDBFormat(data)), loading: false}))});
    // }

    formatDate(date) {
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
      
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
      
        return hour + ':' + minute + ' - ' + day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    handlePdfsSelected(files) {
        const pdfsSelected = [];
        for (let i = 0; i < files.length; i++) {
            pdfsSelected[i] = {name: files[i].name, url: URL.createObjectURL(files[i]), mark: -1};
        }
        this.setState({pdfsSelected: pdfsSelected, pdfPointer: 0});
    }

    handleNextPdf() {
        this.setState(prevState => {
            if (this.isLastPdf()) {
                prevState.pdfPointer = -1;
                prevState.pdfsSelected = [];
            } else {
                prevState.pdfPointer++;
            }
            return prevState;
        });
    }

    setPdfMark(mark, next) {
        this.setState(prevState => {
            prevState.pdfsSelected[prevState.pdfPointer].mark = mark;
        }, next);
    }

    finishEarly() {
        return new Promise(next => {
            // Discard the rest of the PDFs
            this.setState(prevState => {
                prevState.pdfsSelected.length = prevState.pdfPointer + 1;
                return prevState;
            }, next);
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
                    finishEarly={this.finishEarly}
                    setPdfMark={this.setPdfMark}
                    handleNextPdf={this.handleNextPdf}
                    isLastPdf={this.isLastPdf} 
                    loading={this.state.loading}
                    formatDate={this.formatDate} />
            </div>
        )
    }
}

export default App;