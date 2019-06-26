import React from 'react';

class CreateTemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

 
    render() {
        return (
            <div className="modal fade" id="createTemplateModal" tabIndex="-1" role="dialog" aria-labelledby="createTemplateModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content createTemplate">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="createTemplateModalLabel">Create Template</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                                
                            {/* Templates */}
                            <div className="input-group input-group-lg">
                                <input id="newTemplateNameInput" placeholder="Template Name" type="text" className="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm"/>
                            </div>

                        </div>
                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button onClick={() => this.props.handleSubmit(document.getElementById("newTemplateNameInput").value)} type="button" className="btn btn-primary">Create Template</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateTemplateModal;