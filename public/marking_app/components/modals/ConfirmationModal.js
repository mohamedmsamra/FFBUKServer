class ConfirmationModal extends React.Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            // Modal
            <div class="modal fade" id="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">

                    {/* Modal Header */}
                    <div class="modal-header">
                        <h5 class="modal-title" id="createTemplateModalLabel">Confirmation</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        Are you sure you want to {this.props.message}?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onClick={this.props.handleConfirmation}>Confirm</button>
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