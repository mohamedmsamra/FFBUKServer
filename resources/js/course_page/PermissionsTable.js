import React from 'react';
import withTable from '../global_components/withTable';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';

class PermissionsTable extends React.Component {
    renderRow(row) {
        return (
            <>
                <td className={row.data.pending ? 'user-pending' : ''} >{row.data.user.name + (row.data.pending ? ' (Pending)' : '')}</td>
                <td>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control size="sm" as="select" className="select-permission">
                            <option>Read only</option>
                            <option>Read/Write</option>
                        </Form.Control>
                    </Form.Group>
                </td>
                <td><Button variant="danger" size="sm" disabled={row.isLoading}>Remove</Button></td>
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
                    headers={['User', 'Permissions', 'Actions']}
                    renderRow={this.renderRow} />
                <InputGroup size="sm" className="mb-3">
                    <FormControl
                        placeholder="Enter email address"
                        aria-label="Enter email address"
                        aria-describedby="basic-addon2" />
                    <InputGroup.Append>
                        <Button variant="outline-secondary">Invite to course</Button>
                    </InputGroup.Append>
                </InputGroup>
            </>
        )
    }
}

export default withTable(PermissionsTable);