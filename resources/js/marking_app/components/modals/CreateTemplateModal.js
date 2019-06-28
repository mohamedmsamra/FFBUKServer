import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const initialState = {
    validated: false,
    titleInput: ""
}

class CreateTemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    handleFormChange(event) {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (this.state.titleInput) {
            this.setState({ validated: true });
            fetch('/api/templates', {
                method: 'post',
                body: JSON.stringify({assignment_id: assignment_id, name: this.state.titleInput}),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                }
            }).then(function(response) {
                return response.json();
            }).then((data) => {
                this.props.handleCreate(data);
                $("#createTemplateModal").removeClass("fade");
                $("#createTemplateModal").modal('hide');
                $("#createTemplateModal").addClass("fade");
            });
        }
    } 

    handleCancel(e) {
        e.preventDefault;
        this.setState(initialState);
    }

 
    render() {
        const validated = this.state.validated;
        return (
            <div className="modal fade" id="createTemplateModal" tabIndex="-1" role="dialog" aria-labelledby="createTemplateModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content createTemplate">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="createTemplateModalLabel">New Template</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCancel}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div> 
                            
                        <Form 
                            noValidate
                            validated={validated}
                            onSubmit={e => this.handleSubmit(e)}
                        >
                            {/* Modal Body */}
                            <div className="modal-body">
                                {/* Title Input */}
                                <Form.Control 
                                    size="lg"
                                    required
                                    type="text"
                                    placeholder="Template Title"
                                    id="titleInput"
                                    value={this.state.titleInput}
                                    onChange={this.handleFormChange}
                                    name="titleInput"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please choose a title.
                                </Form.Control.Feedback>
                            </div>

                            {/* Modal Footer */}
                            <div className="modal-footer">
                                {/* Cancel Button */}
                                <Button 
                                    type="button" 
                                    className="btn btn-secondary" 
                                    data-dismiss="modal" 
                                    onClick={this.handleCancel}>
                                    Cancel
                                </Button>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="btn btn-primary">
                                    Create
                                </Button>

                            </div>
                        </Form>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateTemplateModal;