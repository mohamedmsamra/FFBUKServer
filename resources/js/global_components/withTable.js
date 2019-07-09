import React from 'react';
import Table from 'react-bootstrap/Table';

/* Render a table from given data. The wrapped component should store in its
 * state an array with objects containing the following attributes:
 * {
 *     key: A key the item can be identified by
 *     isLoading: Boolean, indicating whether the row is waiting for response
 *     content: An object that contains the data of the row.
 * }
 *
 * The wrapped component should also contain and pass to this HOC the function
 * rowDataToComponents, which takes the content object of the row, and returns
 * the td elements to be rendered in the table row.
 */

function withTable(WrappedComponent, rowDataToComponents, headers) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                tableRows: []
            }
            this.renderTable = this.renderTable.bind();
        }

        setTableRows(tableRows) {
            this.setState({tableRows: tableRows});
        }

        renderTableRow(row) {
            return (
                <tr key={row.key} className={row.isLoading ? 'disabled' : ''}>
                    {rowDataToComponents(row.content)}
                </tr>
            );
        }

        renderTableRows(rows) {
            return tableRows.map(tr => this.renderTableRow(tr));
        }

        renderTable(table) {
            // const assignments = this.state.assignments.map(assignment => (
            //     !assignment.deleted &&
            //     <tr key={assignment.id} className={assignment.waitingForResponse ? "disabled" : ''}>
                    
            //     </tr>
            // ));

            // [
            //     {key: 0, isLoading: false, content: {}},
            //     {key: 0, isLoading: false, content: [0, 0, 0]},
            //     {key: 0, isLoading: false, content: [0, 0, 0]},
            //     {key: 0, isLoading: false, content: [0, 0, 0]},
            // ]
            // const headersElements = headers.map(c => <th scope="col">{c.content}</th>);
            
            // const rowsElements = data[0].content.map(c => (
            //     <td>c</td>
            // ));
            
            return (
                <>
                    <Table id="assignments-table">
                        <thead>
                            <tr>
                                {headers.map(h => <th key={h} scope="col">{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {renderTableRows()}
                        </tbody>
                    </Table>
                    {/* <Button variant="primary" size="sm" onClick={this.handleCreateClick}>Create new assignment</Button> */}
                </>
            );
        }

        render() {
            return <WrappedComponent
                renderTable={this.renderTable}
                {...this.props} />
        }
    }
}

export default withTable;