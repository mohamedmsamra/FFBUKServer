class CreateTemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

 
    render() {
        return (
            <div class="modal fade" id="createTemplateModal" tabindex="-1" role="dialog" aria-labelledby="createTemplateModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content createTemplate">

                        {/* Modal Header */}
                        <div class="modal-header">
                            <h5 class="modal-title" id="createTemplateModalLabel">Create Template</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div class="modal-body">
                                
                            {/* Templates */}
                            <div class="input-group input-group-lg">
                                <input id="newTemplateNameInput" placeholder="Template Name" type="text" class="form-control" aria-label="Large" aria-describedby="inputGroup-sizing-sm"/>
                            </div>

                        </div>
                        {/* Modal Footer */}
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button onClick={() => this.props.handleSubmit(document.getElementById("newTemplateNameInput").value)} type="button" class="btn btn-primary">Create Template</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}