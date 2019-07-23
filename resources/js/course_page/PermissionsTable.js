import React from 'react';
import withTable from '../global_components/withTable';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import { withAlert } from 'react-alert';

class PermissionsTable extends React.Component {
    constructor(props) {
        super(props);
        this.renderRow = this.renderRow.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInvite = this.handleInvite.bind(this);
        this.handleRemovePermission = this.handleRemovePermission.bind(this);
        this.state = {
            emailInput: '',
            awaitingInvitationResponse: false
        }
    }

    handleInputChange(e) {
        this.setState({emailInput: e.target.value});
    }

    /* Runs when the user enters an email address to invite. The email address is submitted to the server, and if the
     * invitation was successful, the name of the invited user is added to the table.
     */
    handleInvite() {
        if (this.state.emailInput.trim() !== '')  {
            this.setState({awaitingInvitationResponse: true}, () => {
                fetch('/api/courses/' + course_id + '/invite', {
                    method: 'post',
                    body: JSON.stringify({
                        email: this.state.emailInput
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json, text-plain, */*",
                        "X-Requested-With": "XMLHttpRequest",
                        "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                    }
                })
                .then(data => data.json())
                .then(data => {
                    if (data.success) {
                        this.props.addTableRows([{key: data.course_permission.id, data: data.course_permission}]);
                        this.setState({emailInput: ''});
                        this.props.alert.success({text: data.course_permission.user.name + ' has been invited to this course.'});
                    } else {
                        this.props.alert.error({text: data.message});
                    }
                    this.setState({awaitingInvitationResponse: false});
                });
            });
        }
    }

    /* Runs when the user wants the remove the permission from the user. Submits the request to the server. */
    handleRemovePermission(id) {
        this.props.setTableRowData(id, prevRow => {
            prevRow.isLoading = true;
        }, () => {
            this.props.alert.show({
                text: `Are you sure you want to remove ${this.props.getTableRowData(id).data.name} from this course?`,
                onConfirm: () => {
                    fetch('/api/course-permissions/' + id, {
                        method: 'delete',
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json, text-plain, */*",
                            "X-Requested-With": "XMLHttpRequest",
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                        }
                    })
                    .then(data => data.json())
                    .then(data => {
                        console.log(data);
                        if (data.success) {
                            this.props.setTableRowData(id, (prevRow) => {prevRow.deleted = true}, () => {
                                this.props.alert.success({text: this.props.getTableRowData(id).data.user.name + ' has been removed from the course.'});
                            });
                        }
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

    /* Runs when the course owner selects a new permission for one of the invited users. Asks for confirmation, and then
     * submits the request to the server to have the permission changed.
     */
    handlePermissionChange(key, {value}) {
        const originalValue = this.props.getTableRowData(key).data.level;
        this.props.setTableRowData(key, (prevRow) => {
            prevRow.isLoading = true;
            prevRow.data.level = value;
        }, () => {
            this.props.alert.show({
                text: "Change " + this.props.getTableRowData(key).data.user.name + "'s permissions to " + (value == 1? 'read/write' : 'read only') + "?",
                onConfirm: () => {
                    fetch("/api/courses/" + course_id + "/permissions/" + this.props.getTableRowData(key).data.user.id, {
                        method: 'post',
                        body: JSON.stringify({level: value}),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json, text-plain, */*",
                            "X-Requested-With": "XMLHttpRequest",
                            "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                        }
                    })
                    .then(data => {
                        if (!data.ok) throw new Error('Error'); return data;})
                    .then(data => data.json())
                    .then(data => {
                        if (data.error) {
                            throw new Error(data.error);
                        }
                        this.props.setTableRowData(key, prevRow => {
                            prevRow.isLoading = false;
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        this.props.setTableRowData(key, prevRow => {
                            prevRow.level = prevRow.level ? 0 : 1;
                            prevRow.data.level = originalValue;
                        });
                    });
                },
                onCancel: () => {
                    this.props.setTableRowData(key, prevRow => {
                        prevRow.isLoading = false;
                        prevRow.data.level = originalValue;
                    });
                }
            });
        });
    }

    /* Function that specifies how to render a single row in the table based on the table row's data. */
    renderRow(row) {
        return (
            <>
                <td className={row.data.pending ? 'user-pending' : ''} >
                    <p>
                        {row.data.user.name + (row.data.pending ? ' (Pending)' : '')}
                    </p>
                </td>
                <td>
                    {HAS_COURSE_EDIT_PERMISSION ?
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Control
                                size="sm"
                                as="select"
                                disabled={row.isLoading}
                                className="select-permission"
                                onChange={(e) => this.handlePermissionChange(row.key, e.target)}
                                value={row.data.level} >
                                <option value={0}>Read only</option>
                                <option value={1}>Read/Write</option>
                            </Form.Control>
                        </Form.Group>
                    :
                        <p>{row.data.level == 1 ? 'Read/Write' : 'Read only'}</p>
                    }
                </td>
                {HAS_COURSE_EDIT_PERMISSION && 
                    <td>
                        <Button 
                            variant="danger" 
                            size="sm" 
                            disabled={row.isLoading}
                            onClick={() => {this.handleRemovePermission(row.data.id)}}>
                            Remove
                        </Button>
                    </td>
                }
            </>
        );
    }

    /* Adds the permissions to the table when the component mounts. The permissions are stored in an object compiled in
     * blade on the backend (should be changed to a fetch request in this function in the future).
     */
    componentDidMount() {
        this.props.addTableRows(PERMISSIONS.map(r => ({key: r.id, data: r})));
    }

    render() {
        return (
            <>
                {/* Displayed information for course owner */}
                {HAS_COURSE_EDIT_PERMISSION && 
                    <div className="mb-3 ml-1">
                        <small><i className="fas fa-asterisk fa-sm text-muted"></i> People you invite to the course can see all existing assignments</small>
                        <br />
                        <small><i className="fas fa-asterisk fa-sm text-muted"></i> People you give read/write permission to can modify all existing assignments</small>
                    </div>
                }
                {/* Table to display permissions */}
                <this.props.ReactiveTable
                    headers={['User', 'Permissions'].concat(HAS_COURSE_EDIT_PERMISSION ? ['Actions'] : [])}
                    renderRow={this.renderRow} />
                {/* Controls to invite new users to the course */}
                {HAS_COURSE_EDIT_PERMISSION && 
                    <InputGroup size="sm" className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1"><i className="fas fa-plus"></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="Enter email address"
                            aria-label="Enter email address"
                            aria-describedby="basic-addon2" 
                            value={this.state.emailInput}
                            onChange={this.handleInputChange}
                            disabled={this.state.awaitingInvitationResponse}
                            onKeyPress={(e) => {e.charCode==13 && this.handleInvite()}}/>
                        <InputGroup.Append>
                            <Button 
                                variant="outline-primary"
                                onClick={this.handleInvite}
                                disabled={this.state.awaitingInvitationResponse} >
                                Invite to course
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                }
            </>
        );
    }
}

export default withTable(withAlert()(PermissionsTable));