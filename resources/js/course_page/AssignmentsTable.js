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
        // this.idCounter = -1;
        // this.handleCreateClick = this.handleCreateClick.bind(this);
    }

    rowDataToComponents(data) {
        return <></>;
    //     return (
    //         <>
    //             <td>
    //                 <p hidden={data.editing || data.creating}>{data.name}</p>
    //                 <FocusingBox
    //                     hidden={!data.editing}
    //                     handleEditText={target => this.handleEditText(data.id, target)}
    //                     assignment_id={data.id}
    //                     value={data.editName}
    //                     onEnter={() => this.handleConfirmEdit(data.id)} />
    //                 <FocusingBox
    //                     hidden={!data.creating}
    //                     handleEditText={target => this.handleEditCreateName(data.id, target)}
    //                     assignment_id={data.id}
    //                     value={data.createName}
    //                     onEnter={() => this.handleConfirmCreate(data.id)} />
    //             </td>
    //             <td>
    //                 {this.renderButtons(assignment)}
    //             </td>
    //         </>
    //     );
    }

    // mapDBAssignmentToLocal(assignment) {
    //     Object.assign(assignment, {
    //         editing: false,
    //         editName: assignment.name,
    //         waitingForResponse: false,
    //         deleted: false,
    //         creating: false
    //     });
    //     return assignment;
    // }

    // setRef(ref) {
    //     this.inputRefs.push(ref);
    // }

    // handleEditText(id, value) {
    //     this.setState((prevState) => {
    //         prevState.assignments.find(x => x.id == id).editName = value;
    //         return prevState;
    //     });
    // }

    // handleEditClick(id) {
    //     this.setState((prevState) => {
    //         const assignment = prevState.assignments.find(x => x.id == id);
    //         assignment.editName = assignment.name;
    //         assignment.editing = true;
    //         return prevState;
    //     });
    // }

    // handleConfirmEdit(id) {
    //     fetch("/api/assignments/edit-name", {
    //         method: 'post',
    //         body: JSON.stringify({id: id, name: this.state.assignments.find(x => x.id == id).editName}),
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json, text-plain, */*",
    //             "X-Requested-With": "XMLHttpRequest",
    //             "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
    //         }
    //     })
    //     .then(data => {if (!data.ok) throw new Error('Error'); return data;})
    //     .then(data => data.json())
    //     .then(data => {
    //         this.setState((prevState) => {
    //             const assignment = prevState.assignments.find(x => x.id == id);
    //             assignment.waitingForResponse = false;
    //             assignment.editName = data.name;
    //             assignment.name = data.name;
    //             return prevState;
    //         });
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         this.setState((prevState) => {
    //             const assignment = prevState.assignments.find(x => x.id == id);
    //             assignment.waitingForResponse = false;
    //             assignment.name = assignment.editName;
    //             return prevState;
    //         });
    //     });

    //     this.setState((prevState) => {
    //         const assignment = prevState.assignments.find(x => x.id == id);
    //         assignment.editing = false;
    //         let temp = assignment.name;
    //         assignment.name = assignment.editName;
    //         assignment.editName = temp;
    //         assignment.waitingForResponse = true;
    //         return prevState;
    //     });
    // }

    // handleCancelEdit(id) {
    //     this.setState((prevState) => {
    //         const assignment = prevState.assignments.find(x => x.id == id);
    //         assignment.editing = false;
    //         assignment.editName = assignment.name;
    //         return prevState;
    //     });
    // }

    // handleDeleteClick(id) {
    //     this.setState((prevState) => {
    //         const assignment = prevState.assignments.find(x => x.id == id);
    //         assignment.waitingForResponse = true;
    //         return prevState;
    //     });

    //     fetch("/api/assignments/" + id, {
    //         method: 'delete',
    //         body: JSON.stringify({}),
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json, text-plain, */*",
    //             "X-Requested-With": "XMLHttpRequest",
    //             "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
    //         }
    //     })
    //     .then(data => {if (!data.ok) throw new Error('Error'); return data;})
    //     .then(data => data.json())
    //     .then(data => {
    //         this.setState((prevState) => {
    //             const assignment = prevState.assignments.find(x => x.id == id);
    //             assignment.deleted = true;
    //             return prevState;
    //         });
    //     })
    //     .catch(error => {
    //         console.log(error);
    //         this.setState((prevState) => {
    //             const assignment = prevState.assignments.find(x => x.id == id);
    //             assignment.waitingForResponse = false;
    //             assignment.name = assignment.editName;
    //             return prevState;
    //         });
    //     });
    // }

    // handleCreateClick() {
    //     this.setState((prevState) => {
    //         prevState.assignments.push({id: this.idCounter--, creating: true, createName: ""});
    //         return prevState;
    //     })
    // }

    // handleEditCreateName(id, val) {
    //     this.setState((prevState) => {
    //         const assignment = prevState.assignments.find(x => x.id == id);
    //         assignment.createName = val;
    //         return prevState;
    //     });
    // }

    // handleConfirmCreate(id) {
    //     this.setState(prevState => {
    //         const assignment = prevState.assignments.find(x => x.id == id);
    //         assignment.creating = false;
    //         assignment.name = assignment.createName;
    //         assignment.waitingForResponse = true;
    //         return prevState;
    //     }, () => {
    //         fetch("/api/assignments", {
    //             method: 'post',
    //             body: JSON.stringify({course_id: course_id, title: this.state.assignments.find(x => x.id == id).name}),
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Accept": "application/json, text-plain, */*",
    //                 "X-Requested-With": "XMLHttpRequest",
    //                 "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
    //             }
    //         })
    //         .then(data => {if (!data.ok) throw new Error('Error'); return data;})
    //         .then(data => data.json())
    //         .then(data => {
    //             this.setState((prevState) => {
    //                 const assignment = prevState.assignments.find(x => x.id == id);
    //                 assignment.name = data.name;
    //                 assignment.id = data.id;
    //                 Object.assign(assignment, this.mapDBAssignmentToLocal(data));
    //                 return prevState;
    //             });
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             this.setState((prevState) => {
    //                 const assignment = prevState.assignments.find(x => x.id == id);
    //                 assignment.deleted = true;
    //                 return prevState;
    //             });
    //         });
    //     });
    // }

    // handleCancelCreate(id) {
    //     this.setState((prevState) => {
    //         const assignment = prevState.assignments.find(x => x.id == id);
    //         assignment.deleted = true;
    //         return prevState;
    //     });
    // }

    // renderButtons(assignment) {
    //     if (assignment.editing) {
    //         return (
    //             <>
    //                 <Button variant="success" size="sm" onClick={() => this.handleConfirmEdit(assignment.id)}>
    //                     Confirm
    //                 </Button>
    //                 <Button variant="danger" size="sm" onClick={() => this.handleCancelEdit(assignment.id)}>
    //                     Cancel
    //                 </Button>
    //             </>
    //         )
    //     } else if (assignment.creating) {
    //         return (
    //             <>
    //                 <Button variant="success" size="sm" onClick={() => this.handleConfirmCreate(assignment.id)}>
    //                     Create
    //                 </Button>
    //                 <Button variant="danger" size="sm" onClick={() => this.handleCancelCreate(assignment.id)}>
    //                     Cancel
    //                 </Button>
    //             </>
    //         )
    //     } else {
    //         return (
    //             <>
    //                 {assignment.waitingForResponse ?
    //                     <img className="loading" src="/svg/loading.svg" />
    //                 :
    //                     <>
    //                         <a href={"/marking/" + assignment.id}>
    //                             <button type="button" className="btn btn-primary btn-sm" disabled={assignment.waitingForResponse}>Start marking</button>
    //                         </a>
    //                         <button type="button" className="btn btn-info btn-sm" disabled={assignment.waitingForResponse} onClick={() => this.handleEditClick(assignment.id)}>Edit</button>
    //                         <button type="button" className="btn btn-danger btn-sm" disabled={assignment.waitingForResponse} onClick={() => this.handleDeleteClick(assignment.id)}>Delete</button>
    //                     </>
    //                 }
    //             </>
    //         )
    //     }
    // }

    componentDidMount() {
        this.props.setTableRows([
            {key: 0, isLoading: false, content: {}},
            {key: 1, isLoading: true, content: {}},
            {key: 0, isLoading: false, content: {}}
        ])
    }

    render() {
        return this.props.renderTable();
    }
}

export default withTable(AssignmentsTable, rowDataToComponents, ["Assignments", "Actions"]);
