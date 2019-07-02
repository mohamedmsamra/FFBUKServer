import React from 'react';

class PDFSide extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const currentPdf = this.props.pdfsSelected[this.props.pdfPointer];
        return (
            <div className="col" id="pdf-side">
                {this.props.pdfPointer < 0 ?
                    <form>
                        <div id="select-pdfs" className="input-group mb-3">
                            <div className="custom-file">
                                <input onChange={(e) => this.props.handlePdfsSelected(e.target.files)} type="file" className="custom-file-input" name="pdfChoose" id="pdfChoose" accept=".pdf" multiple />
                                <label className="custom-file-label" htmlFor="inputGroupFile01">Choose files to mark</label>
                            </div>
                        </div>
                    </form>
                :
                    <div>
                        <div id="pdf-name-display">
                            <p>{"Marking " + currentPdf.name}</p>
                            <p className="disp-num">{(this.props.pdfPointer + 1) + "/" + this.props.pdfsSelected.length}</p>
                        </div>
                        <embed
                            src={currentPdf.url}
                            type="application/pdf">
                        </embed>
                    </div>
                }
            </div>
        )
    }
}

export default PDFSide;