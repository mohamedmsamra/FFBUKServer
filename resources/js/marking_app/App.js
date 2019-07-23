import React from 'react';
import PDFSide from './components/PDFSide';
import MarkingSide from './components/MarkingSide';
import Loading from '../global_components/Loading';
import interact from 'interactjs';

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

    componentDidMount() {
        // Add resizing the PDF side and marking side using the interact.js library
        interact('.resize-drag')
        .resizable({
            edges: {
                right : true    // Resize if pointer target is the given Element
            },
            modifiers: [
                // minimum size
                interact.modifiers.restrictSize({
                    min: {width: 350}
                })
            ]
        })
        .on('resizemove', event => {
            let { x, y } = event.target.dataset
            x = parseFloat(x) || 0
            y = parseFloat(y) || 0
            Object.assign(event.target.style, {
                width: `${(() => Math.min(event.rect.width, $($('.resize-container')[0]).width() - 350))()}px`,
                height: `${event.rect.height}px`,
                transform: `translate(${event.deltaRect.left}px, ${event.deltaRect.top}px)`
            })

            Object.assign(event.target.dataset, { x, y })
        });
    }

    // fetchAssignment() {
    //     fetch('/api/assignments/' + assignment_id)
    //         .then(data => data.json())   
    //         .then(data => {this.setState(prevState => ({assignment: Object.assign(prevState.assignment, this.assignmentFromDBFormat(data)), loading: false}))});
    // }


    // Code used to format date
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

    // Runs when PDFs have been loaded for marking
    handlePdfsSelected(files) {
        this.setState({start: Date.now()}); // Start measuring time for analytics
        const pdfsSelected = [];
        for (let i = 0; i < files.length; i++) {
            // Add the loaded PDFs to the state
            pdfsSelected[i] = {name: files[i].name, url: URL.createObjectURL(files[i]), mark: -1};
        }
        this.setState({pdfsSelected: pdfsSelected, pdfPointer: 0});
    }

    // Runs when the user clicks 'Save and Load next' to start marking the next PDF
    handleNextPdf() {
        this.setState({start: Date.now()});
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

    /* Set record the total mark for the current marked PDF, which will be used to export the list of marks at the end
     * of the session.
     */
    setPdfMark(mark, next) {
        this.setState(prevState => {
            prevState.pdfsSelected[prevState.pdfPointer].mark = mark;
        }, next);
    }

    // Runs when the user discards the remaining PDFs
    finishEarly() {
        return new Promise(next => {
            // Discard the rest of the PDFs
            this.setState(prevState => {
                prevState.pdfsSelected.length = prevState.pdfPointer + 1;
                return prevState;
            }, next);
        });
    }

    // Check if there are no other remaining PDFs
    isLastPdf() {
        return this.state.pdfsSelected.length == (this.state.pdfPointer + 1);
    }

    render() {
        return (
            <div className="resize-container">
                <div className="resize-drag">
                    <div className="resize-drag-content">
                        <PDFSide
                            handlePdfsSelected={this.handlePdfsSelected}
                            pdfsSelected={this.state.pdfsSelected}
                            pdfPointer={this.state.pdfPointer} />
                    </div>
                    <div id="divider">
                        <div id="bar">
                            <i className="fas fa-ellipsis-v"></i>
                        </div>
                        
                    </div>
                </div>
                <MarkingSide
                    pdfsSelected={this.state.pdfsSelected}
                    pdfPointer={this.state.pdfPointer}
                    finishEarly={this.finishEarly}
                    setPdfMark={this.setPdfMark}
                    handleNextPdf={this.handleNextPdf}
                    isLastPdf={this.isLastPdf} 
                    loading={this.state.loading}
                    formatDate={this.formatDate}
                    start={this.state.start} />
            </div>
        );
    }
}

export default App;