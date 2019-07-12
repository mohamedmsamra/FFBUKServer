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
            emailInput: ''
        }
    }

    handleInputChange(e) {
        this.setState({emailInput: e.target.value});
    } 

    handleInvite() {
        if (this.state.emailInput.trim() !== '')  {
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
                        this.props.alert.success({text: data.course_permission.user.name + ' has been invited to this course'});
                    } else {
                        this.props.alert.error({text: data.message});
                    }
                });
        }
    }

    handleRemovePermission(id) {
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
    }

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
        })
    }

    renderRow(row) {
        return (
            <>
                <td className={row.data.pending ? 'user-pending' : ''} >{row.data.user.name + (row.data.pending ? ' (Pending)' : '')}</td>
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

    componentDidMount() {
        this.props.addTableRows(PERMISSIONS.map(r => ({key: r.id, data: r})));
    }

    render() {
        return (
            <>
                <this.props.ReactiveTable
                    headers={['User', 'Permissions'].concat(HAS_COURSE_EDIT_PERMISSION ? ['Actions'] : [])}
                    renderRow={this.renderRow} />
                {HAS_COURSE_EDIT_PERMISSION && 
                    <InputGroup size="sm" className="mb-3">
                        <FormControl
                            placeholder="Enter email address"
                            aria-label="Enter email address"
                            aria-describedby="basic-addon2" 
                            value={this.state.emailInput}
                            onChange={this.handleInputChange}/>
                        <InputGroup.Append>
                            <Button 
                                variant="outline-secondary"
                                onClick={this.handleInvite}>
                                Invite to course
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>
                }
                
            </>
        )
    }
}

export default withTable(withAlert()(PermissionsTable));