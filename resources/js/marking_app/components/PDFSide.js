import React from 'react';

class PDFSide extends React.Component {
    render() {
        return (
            <div className="col">
                <form>
                    <div id="select-pdfs" className="input-group mb-3">
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" name="pdfChoose" id="pdfChoose" accept=".pdf" multiple />
                            <label className="custom-file-label" htmlFor="inputGroupFile01">Choose files to mark</label>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default PDFSide;