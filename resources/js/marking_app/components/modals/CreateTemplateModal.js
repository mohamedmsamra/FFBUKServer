import React from 'react';
import DangerAlert from '../alerts/DangerAlert.js';
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
        this.submit = this.submit.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
    }

    handleFormChange(event) {
        console.log("New Section Form Change " + event.target.value);
        const {name, value, type, checked} = event.target;
        console.log({name, value, type, checked});
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    submit() {
        const title = document.getElementById("titleInput").value;
        if (title != '') {
            this.props.handleCreate(title);
            // this.setState(initialState);
        }
    }

    handleSubmit(event) {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.setState({ validated: true });
        this.submit();
    } 

 
    render() {
        const validated = this.state.validated;
        console.log(validated);
        return (
            <div className="modal fade" id="createTemplateModal" tabIndex="-1" role="dialog" aria-labelledby="createTemplateModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content createTemplate">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="createTemplateModalLabel">New Template</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
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
                                    onClick={(e)=> {e.preventDefault();this.hideAlert}}>
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