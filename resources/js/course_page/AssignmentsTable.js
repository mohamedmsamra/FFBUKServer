import React from 'react';
import Button from 'react-bootstrap/Button';
import FocusingBox from './FocusingBox';
import withTable from '../global_components/withTable';
import { timeout } from 'q';
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
        this.renderRow = this.renderRow.bind(this);
        this.fetchAssignments = this.fetchAssignments.bind(this);
        this.handleSelectCloningAssignment = this.handleSelectCloningAssignment.bind(this);
    }

    fetchAssignments() {
        fetch("../api/assignments")
        .then(data => data.json())
        .then(data => {this.setState({coursesWithAssignments: data})});
    }

    mapDBAssignmentToLocal(assignment) {
        Object.assign(assignment, {
            editing: false,
            editName: assignment.name,
            deleted: false,
            creating: false
        });
        return assignment;
    }

    // setRef(ref) {
    //     this.inputRefs.push(ref);
    // }

    handleEditText(id, value) {
        this.props.setTableRowsData((prevRows) => {
            prevRows.find(x => x.key == id).data.editName = value;
            return prevRows;
        });
    }

    handleEditClick(id) {
        this.props.setTableRowsData((prevRows) => {
            const assignment = prevRows.find(x => x.key == id);
            assignment.data.editName = assignment.data.name;
            assignment.data.editing = true;
            return prevRows;
        });
    }

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

    handleCancelEdit(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.data.editing = false;
            prevRow.data.editName = prevRow.data.name;
        });
    }

    handleDeleteClick(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.isLoading = true;
        });
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
    }

    handleCreateClick() {
        this.props.addTableRows([{key: this.idCounter, data: {id: this.idCounter--, creating: true, createName: ""}}]);
    }

    handleCloneClick() {
        this.fetchAssignments();
        $("#cloneAssignmentsModal").modal('show');
    }

    resetModal() {
        $("#cloneAssignmentsModal").removeClass("fade");
        $("#cloneAssignmentsModal").modal('hide');
        $("#cloneAssignmentsModal").addClass("fade");
        $(".cloneModalAssignmentInstance").removeClass('active');
        $(".collapse").removeClass('show');
    }

    handleSelectCloningAssignment(id) {
        fetch('../api/assignments/' + id + '/clone', {
            method: 'post',
            body: JSON.stringify({
                course_id: course_id
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
        }).then((data) => {
            this.props.addTableRows([{key: data.id, data: this.mapDBAssignmentToLocal(data)}]);
            // this.props.alert.success({text: "Cloned assignment \n '" + data.name + "'"});
        }).then( () => {
            
            this.resetModal();
        });
    }

    handleEditCreateName(id, val) {
        this.props.setTableRowData(id, (prevRow) => {
            prevRow.data.createName = val;
        });
    }

    handleConfirmCreate(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.data.creating = false;
            prevRow.data.name = prevRow.data.createName;
            prevRow.isLoading = true;
        }, () => {
            fetch("/api/assignments", {
                method: 'post',
                body: JSON.stringify({course_id: course_id, title: this.props.tableRows.find(x => x.key == id).data.name}),
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

    handleCancelCreate(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.deleted = true;
        });
    }

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
                    <a href={"/marking/" + data.id}>
                        <button type="button" className="btn btn-primary btn-sm" disabled={isLoading}>Start marking</button>
                    </a>
                    {HAS_COURSE_EDIT_PERMISSION && 
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

    renderRow({isLoading, data}) {
        return (
            <>
                <td>
                    <p hidden={data.editing || data.creating}>{data.name}</p>
                    <FocusingBox
                        hidden={!data.editing}
                        handleEditText={target => this.handleEditText(data.id, target)}
                        assignment_id={data.id}
                        value={data.editName}
                        onEnter={() => this.handleConfirmEdit(data.id)}
                        size="sm" />
                    <FocusingBox
                        hidden={!data.creating}
                        handleEditText={target => this.handleEditCreateName(data.id, target)}
                        assignment_id={data.id}
                        value={data.createName}
                        onEnter={() => this.handleConfirmCreate(data.id)}
                        size="sm" />
                </td>
                <td>{this.renderButtons({isLoading, data})}</td>
            </>
        );
    }

    componentDidMount() {
        // this.props.alert.show({text: 'test'})
        this.props.addTableRows(assignments.map(a => {return {key: a.id, data: this.mapDBAssignmentToLocal(a)}}));
    }

    render() {
        return (
            <>
                <this.props.ReactiveTable
                    headers={['Assignments', 'Actions']}
                    renderRow={this.renderRow} />
                {HAS_COURSE_EDIT_PERMISSION && 
                <>
                    <Button className="mr-1" variant="primary" size="sm" onClick={this.handleCreateClick}>Create new assignment</Button>
                    <Button variant="info" size="sm" onClick={this.handleCloneClick}>Clone Existing Assignment</Button>
                </>
                }
                <CloneAssignmentsModal coursesWithAssignments={this.state.coursesWithAssignments} handleSelectAssignment={this.handleSelectCloningAssignment} resetModal={this.resetModal}/>
            </>
        );
    }
}

export default withTable(withAlert()(AssignmentsTable));
// export default withTable(AssignmentsTable);
