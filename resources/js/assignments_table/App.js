import React from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import FocusingBox from './FocusingBox';
import { timeout } from 'q';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            assignments: assignments.map(a => Object.assign(a, {
                editing: false,
                editName: a.name,
                waitingForResponse: false
            }))
        }
    }

    setRef(ref) {
        this.inputRefs.push(ref);
    }

    handleEditText(id, value) {
        this.setState((prevState) => {
            prevState.assignments.find(x => x.id == id).editName = value;
            return prevState;
        });
    }

    handleEditClick(id) {
        this.setState((prevState) => {
            const assignment = prevState.assignments.find(x => x.id == id);
            assignment.editing = true;
            return prevState;
        });
    }

    handleConfirmEdit(id) {
        fetch("/api/assignments/edit-name", {
            method: 'post',
            body: JSON.stringify({id: id, name: this.state.assignments.find(x => x.id == id).editName}),
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
            this.setState((prevState) => {
                const assignment = prevState.assignments.find(x => x.id == id);
                assignment.waitingForResponse = false;
                assignment.editName = data.name;
                assignment.name = data.name;
                return prevState;
            });
        })
        .catch(error => {
            console.log(error);
            this.setState((prevState) => {
                const assignment = prevState.assignments.find(x => x.id == id);
                assignment.waitingForResponse = false;
                assignment.name = assignment.editName;
                return prevState;
            });
        });

        this.setState((prevState) => {
            const assignment = prevState.assignments.find(x => x.id == id);
            assignment.editing = false;
            let temp = assignment.name;
            assignment.name = assignment.editName;
            assignment.editName = temp;
            assignment.waitingForResponse = true;
            return prevState;
        });
    }

    handleCancelEdit(id) {
        this.setState((prevState) => {
            const assignment = prevState.assignments.find(x => x.id == id);
            assignment.editing = false;
            assignment.editName = assignment.name;
            return prevState;
        });
    }

    render() {
        const assignments = this.state.assignments.map(assignment => (
            <tr key={assignment.id} className={assignment.waitingForResponse ? "disabled" : ''}>
                        <td>
                            <p hidden={assignment.editing}>{assignment.name}</p>
                            <FocusingBox
                                hidden={!assignment.editing}
                                handleEditText={target => this.handleEditText(assignment.id, target)}
                                assignment_id={assignment.id}
                                value={assignment.editName}
                                onEnter={() => this.handleConfirmEdit(assignment.id)} />
                        </td>
                        {assignment.editing ?
                            <td>
                                <Button variant="success" size="sm" onClick={() => this.handleConfirmEdit(assignment.id)}>
                                    Confirm
                                </Button>
                                <Button variant="danger" size="sm" onClick={() => this.handleCancelEdit(assignment.id)}>
                                    Cancel
                                </Button>
                            </td>
                        :
                            <td>
                                {assignment.waitingForResponse ?
                                    <img className="loading" src="/svg/loading.svg" />
                                :
                                    <>
                                        <a href={"/marking/" + assignment.id}>
                                            <button type="button" className="btn btn-primary btn-sm" disabled={assignment.waitingForResponse}>Start marking</button>
                                        </a>
                                        <button type="button" className="btn btn-info btn-sm" disabled={assignment.waitingForResponse} onClick={() => this.handleEditClick(assignment.id)}>Edit</button>
                                        <button type="button" className="btn btn-danger btn-sm" disabled={assignment.waitingForResponse}>Delete</button>
                                    </>
                                }
                            </td>
                        }
            </tr>
        ));

        return (
            <Table id="assignments-table">
                <thead>
                    <tr>
                        <th scope="col">Assignment</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assignments}
                </tbody>
            </Table>
        );
    }
}

export default App;
