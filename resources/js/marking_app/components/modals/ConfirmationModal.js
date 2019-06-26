import React from 'react';

class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            // Modal
            <div className="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title" id="createTemplateModalLabel">Confirmation</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        Are you sure you want to {this.props.message}?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={this.props.handleConfirmation}>Confirm</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }
}

ConfirmationModal.defaultProps = {
    message: 'do this'
}

export default ConfirmationModal;