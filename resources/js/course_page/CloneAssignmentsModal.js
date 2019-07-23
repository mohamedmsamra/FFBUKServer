import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

class CloneAssignmentsModal extends React.Component {
    constructor(props) {
        super(props);
        this.displayAssignments = this.displayAssignments.bind(this);
        this.state = {
            selectedAssignmentID: -1
        };
    }

    /* Display the assignments in the modal. */
    displayAssignments(assignment) {
        return (
            <a 
                onClick={() => {
                    $(".cloneModalAssignmentInstance").removeClass('active');
                    this.setState({selectedAssignmentID: assignment.id})
                }} 
                onDoubleClick={() => {this.props.handleSelectAssignment(assignment.id)}} 
                className="list-group-item list-group-item-action cloneModalAssignmentInstance" href={'#' + assignment.id} 
                key={assignment.id} data-toggle="list" role="tab">
                {assignment.name}
                <p className="float-right"><small>{assignment.created_at}</small></p>
            </a>
        );
    }

    /* Render the modal. */
    renderModalBody() {
        // Display the assignments that can be cloned, once they are loaded.
        if (this.props.loadingAssignments) {
            return "Loading assignments..."
        } else {
            const displayCourses = this.props.coursesWithAssignments.map(course => {
                return (
                    <Card key={"course" + course.id}>
                        <Accordion.Toggle as={Card.Header} eventKey={course.id}>
                        {course.title} by {course.owner}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={course.id}>
                            
                        <Card.Body>
                            <div className="list-group" role="tablist">
                                {course.assignments.map(assignment => this.displayAssignments(assignment))}
                            </div>
                        </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                )
            });
            
            return (
                this.props.coursesWithAssignments.length == 0 ?
                <div className="loadEmpty modal-body">
                    There are no assignments to clone. 
                </div>
                :
                <div>
                    {/* Modal Body */}
                    <div className="modal-body">
                        {/* Assignments */}
                        {/* <div className="list-group" role="tablist"> */}
                        <Accordion defaultActiveKey="0">
                            {displayCourses}
                        </Accordion>
                        {/* </div> */}

                    </div>
                    {/* Modal Footer */}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.props.resetModal}>Cancel</button>
                        <button disabled={this.state.selectedAssignmentID == -1} onClick={() => this.props.handleSelectAssignment(this.state.selectedAssignmentID)} type="button" className="btn btn-primary">Clone Assignment</button>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="modal fade" id="cloneAssignmentsModal" tabIndex="-1" role="dialog" aria-labelledby="cloneAssignmentsModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content loadTemplate">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="cloneAssignmentsModalLabel">Clone Assignment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.resetModal}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {this.renderModalBody()}
                    </div>
                </div>
            </div>
        );
    }
}

export default CloneAssignmentsModal;