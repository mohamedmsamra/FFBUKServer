import React from 'react';
import Button from 'react-bootstrap/Button';
import FocusingInput from '../global_components/FocusingInput';
import withTable from '../global_components/withTable';
import { withAlert } from 'react-alert';
import CloneAssignmentsModal from './CloneAssignmentsModal';

class AssignmentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            coursesWithAssignments: []
        }
        this.idCounter = -1;
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.handleCloneClick = this.handleCloneClick.bind(this);
        this.handleConfirmCreate = this.handleConfirmCreate.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.fetchAssignments = this.fetchAssignments.bind(this);
        this.handleSelectCloningAssignment = this.handleSelectCloningAssignment.bind(this);
    }

    /* Fetch the assignments from the database */
    fetchAssignments() {
        fetch("../api/assignments")
        .then(data => data.json())
        .then(data => {this.setState({coursesWithAssignments: data})});
    }

    /* Used to convert an assignment object coming from the backend to an object that is used on the front end. */
    mapDBAssignmentToLocal(assignment) {
        Object.assign(assignment, {
            editing: false,
            editName: assignment.name,
            deleted: false,
            creating: false
        });
        return assignment;
    }

    /* Runs when a change to the editing text has been made. Updates the new value in the state. */
    handleEditText(id, value) {
        this.props.setTableRowsData((prevRows) => {
            prevRows.find(x => x.key == id).data.editName = value;
            return prevRows;
        });
    }

    /* Runs when the edit button is next to an assignment is clicked. Enables edit mode for the assigment name. */
    handleEditClick(id) {
        this.props.setTableRowsData((prevRows) => {
            const assignment = prevRows.find(x => x.key == id);
            assignment.data.editName = assignment.data.name;
            assignment.data.editing = true;
            return prevRows;
        });
    }

    /* Runs when a user confirms the edit they made to the name of the assignment. Submits the edited name to the
     * server. Updates the name if successful.
     */
    handleConfirmEdit(id) {
        fetch("/api/assignments/" + id + "/edit-name", {
            method: 'post',
            body: JSON.stringify({name: this.props.tableRows.find(x => x.key == id).data.editName}),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            }
        })
        .then(data => {if (!data.ok) throw new Error('Error'); return data;})
        .then(data => data.json())
        .then(data => {
            this.props.setTableRowsData((prevRows) => {
                const assignment = prevRows.find(x => x.key == id);
                assignment.isLoading = false;
                assignment.data.editName = data.name;
                assignment.data.name = data.name;
                return prevRows;
            });
        })
        .catch(error => {
            console.log(error);
            this.props.setTableRowsData((prevRows) => {
                const assignment = prevRows.find(x => x.key == id);
                assignment.isLoading = false;
                assignment.data.name = assignment.editName;
                return prevRows;
            });
        });

        this.props.setTableRowsData((prevRows) => {
            const assignment = prevRows.find(x => x.key == id);
            const data = assignment.data;
            data.editing = false;
            let temp = data.name;
            data.name = data.editName;
            data.editName = temp;
            assignment.isLoading = true;
            return prevRows;
        });
    }

    /* Runs if the edit is cancelled. Resets the name to the name before the edit. */
    handleCancelEdit(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.data.editing = false;
            prevRow.data.editName = prevRow.data.name;
        });
    }

    /* Runs if the user clicks on delete. Asks the user for confirmation before making the delete request. */
    handleDeleteClick(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.isLoading = true;
        }, () => {
            this.props.alert.show({
                text: "Are you sure you want to delete this assignment?",
                onConfirm: () => {
                    fetch("/api/assignments/" + id, {
                        method: 'delete',
                        body: JSON.stringify({}),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json, text-plain, */*",
                            "X-Requested-With": "XMLHttpRequest",
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                        }
                    })
                    .then(data => {if (!data.ok) throw new Error('Error'); return data;})
                    .then(data => data.json())
                    .then(data => {
                        this.props.setTableRowData(id, prevRow => {
                            prevRow.deleted = true;
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.setTableRowData(id, prevRow => {
                            prevRow.isLoading = false;
                        });
                    });
                },
                onCancel: () => {
                    this.props.setTableRowData(id, prevRow => {
                        prevRow.isLoading = false;
                    });
                }
            });
        });
    }

    /* Runs when the user clicks on creating a new assignment. */
    handleCreateClick() {
        this.props.addTableRows([{key: this.idCounter, data: {id: this.idCounter--, creating: true, createName: ""}}]);
    }
    
    /* Runs when the user clicks on cloning an assignment. */
    handleCloneClick() {
        this.fetchAssignments();
        $("#cloneAssignmentsModal").modal('show');
    }

    /* Resets the cloning modal to its initial state. */
    resetModal() {
        $("#cloneAssignmentsModal").removeClass("fade");
        $("#cloneAssignmentsModal").modal('hide');
        $("#cloneAssignmentsModal").addClass("fade");
        $(".cloneModalAssignmentInstance").removeClass('active');
        $(".collapse").removeClass('show');
    }

    /* Submits a request to clone an assignment. If successful, it adds the new assignment to the table. */
    handleSelectCloningAssignment(id) {
        fetch('../api/assignments/' + id + '/clone', {
            method: 'post',
            body: JSON.stringify({
                course_id: this.props.course.course_id
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            }
        })
        .then(function(response) {
            return response.json();
        }).then(data => {
            this.props.addTableRows([{key: data.id, data: this.mapDBAssignmentToLocal(data)}]);
            // this.props.alert.success({text: "Cloned assignment \n '" + data.name + "'"});
        }).then(() => {
            this.resetModal();
        });
    }

    /* Edit the text in the create new assignment input. */
    handleEditCreateName(id, val) {
        this.props.setTableRowData(id, (prevRow) => {
            prevRow.data.createName = val;
        });
    }

    /* Runs when the user confirms the creation of the assignment. Sends a request to the server to create the
     * assignment. If successful, adds the new assignment to the table.
     */
    handleConfirmCreate(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.data.creating = false;
            prevRow.data.name = prevRow.data.createName;
            prevRow.isLoading = true;
        }, () => {
            fetch("/api/assignments", {
                method: 'post',
                body: JSON.stringify({course_id: this.props.course.course_id, title: this.props.tableRows.find(x => x.key == id).data.name}),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                }
            })
            .then(data => {if (!data.ok) throw new Error('Error'); return data;})
            .then(data => data.json())
            .then(data => {
                this.props.setTableRowData(id, prevRow => {
                    prevRow.key = data.id;
                    prevRow.data.name = data.name;
                    prevRow.data.id = data.id;
                    Object.assign(prevRow.data, this.mapDBAssignmentToLocal(data));
                    prevRow.isLoading = false;
                });
            })
            .catch(error => {
                console.log(error);
                this.props.setTableRowData(id, prevRow => {
                    prevRow.deleted = true;
                });
            });
        });
    }

    /* Runs when the user clicks cancel when creating a new assignment. */
    handleCancelCreate(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.deleted = true;
        });
    }

    /* Render the control buttons next to each assignment in the table. */
    renderButtons({isLoading, data}) {
        if (data.editing) {
            return (
                <>
                    <Button variant="success" size="sm" onClick={() => this.handleConfirmEdit(data.id)}>
                        Confirm
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => this.handleCancelEdit(data.id)}>
                        Cancel
                    </Button>
                </>
            );
        } else if (data.creating) {
            return (
                <>
                    <Button variant="success" size="sm" onClick={() => this.handleConfirmCreate(data.id)}>
                        Create
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => this.handleCancelCreate(data.id)}>
                        Cancel
                    </Button>
                </>
            );
        } else {
            return (
                <>
                    <a href={`/assignments/${data.id}/mark`}>
                        <button type="button" className="btn btn-primary btn-sm" disabled={isLoading}>Start marking</button>
                    </a>
                    <a href={`/assignments/${data.id}/statistics`}>
                        <button type="button" className="btn btn-secondary btn-sm" disabled={isLoading}>View analytics</button>
                    </a>
                    {this.props.course.can_manage && 
                        <>
                            <button type="button" className="btn btn-info btn-sm" disabled={isLoading} onClick={() => this.handleEditClick(data.id)}>Edit</button>
                            <button type="button" className="btn btn-danger btn-sm" disabled={isLoading} 
                                onClick={() => {this.handleDeleteClick(data.id)}}>
                                Delete
                            </button>
                        </>
                    }
                </>
            );
        }
    }

    /* Render the name, or the input boxes for the assignments in the table. */
    renderContent(data) {
        if (data.editing) {
            return (
                <FocusingInput
                    value={data.editName}
                    onChange={e => this.handleEditText(data.id, e.target.value)}
                    onEnterKey={() => this.handleConfirmEdit(data.id)}
                    onEscapeKey={() => this.handleCancelEdit(data.id)}
                    size="sm" />
            );
        } else if (data.creating) {
            return ( 
                <FocusingInput
                    value={data.createName}
                    onChange={e => this.handleEditCreateName(data.id, e.target.value)}
                    onEnterKey={() => this.handleConfirmCreate(data.id)}
                    onEscapeKey={() => this.handleCancelCreate(data.id)}
                    size="sm" />
            );
        } else {
            return <p>{data.name}</p>;
        }
    }

    /* Render the row of the table. */
    renderRow({isLoading, data}) {
        return (
            <>
                <td>{this.renderContent(data)}</td>
                <td>{this.renderButtons({isLoading, data})}</td>
            </>
        );
    }

    /* Adds the assignments to the table when the component mounts. */
    componentDidMount() {
        this.props.addTableRows(this.props.course.assignments.map(a => {return {key: a.id, data: this.mapDBAssignmentToLocal(a)}}));
    }

    render() {
        return (
            <>
                <this.props.ReactiveTable
                    headers={['Assignments', 'Actions']}
                    renderRow={this.renderRow} />
                {this.props.course.can_manage && 
                    <div className="text-center newAssignmentBtns">
                        <Button className="mr-1" variant="primary" size="sm" onClick={this.handleCreateClick}><i className="fas fa-plus"></i>  Create Assignment</Button>
                        <Button variant="info" size="sm" onClick={this.handleCloneClick}><i className="fas fa-clone"></i>  Duplicate Assignment</Button>
                    </div>
                }
                <CloneAssignmentsModal coursesWithAssignments={this.state.coursesWithAssignments} handleSelectAssignment={this.handleSelectCloningAssignment} resetModal={this.resetModal}/>
            </>
        );
    }
}

export default withTable(withAlert()(AssignmentsTable));
