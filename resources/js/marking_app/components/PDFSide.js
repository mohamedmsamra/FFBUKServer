import React from 'react';

class PDFSide extends React.Component {
    render() {
        return (
            <div className="col">
                <form>
                    <div id="select-pdfs" class="input-group mb-3">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input" name="pdfChoose" id="pdfChoose" accept=".pdf" multiple />
                            <label class="custom-file-label" for="inputGroupFile01">Choose files to mark</label>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default PDFSide;