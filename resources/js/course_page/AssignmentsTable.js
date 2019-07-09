import React from 'react';
import Button from 'react-bootstrap/Button';
import FocusingBox from './FocusingBox';
import withTable from '../global_components/withTable';
import { timeout } from 'q';

class AssignmentsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // assignments: assignments.map(a => this.mapDBAssignmentToLocal(a))
        }
        this.idCounter = -1;
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.renderRow = this.renderRow.bind(this);
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
        fetch("/api/assignments/edit-name", {
            method: 'post',
            body: JSON.stringify({id: id, name: this.props.tableRows.find(x => x.key == id).data.editName}),
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
    }

    handleCreateClick() {
        this.props.addTableRows([{key: this.idCounter, data: {id: this.idCounter--, creating: true, createName: ""}}]);
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
                    <button type="button" className="btn btn-info btn-sm" disabled={isLoading} onClick={() => this.handleEditClick(data.id)}>Edit</button>
                    <button type="button" className="btn btn-danger btn-sm" disabled={isLoading} onClick={() => this.handleDeleteClick(data.id)}>Delete</button>
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
                        onEnter={() => this.handleConfirmEdit(data.id)} />
                    <FocusingBox
                        hidden={!data.creating}
                        handleEditText={target => this.handleEditCreateName(data.id, target)}
                        assignment_id={data.id}
                        value={data.createName}
                        onEnter={() => this.handleConfirmCreate(data.id)} />
                </td>
                <td>{this.renderButtons({isLoading, data})}</td>
            </>
        );
    }

    componentDidMount() {
        this.props.addTableRows(assignments.map(a => {return {key: a.id, data: this.mapDBAssignmentToLocal(a)}}));
    }

    render() {
        return (
            <>
                <this.props.ReactiveTable
                    headers={['Assignments', 'Actions']}
                    renderRow={this.renderRow} />
                <Button variant="primary" size="sm" onClick={this.handleCreateClick}>Create new assignment</Button>
            </>
        );
    }
}

export default withTable(AssignmentsTable);
