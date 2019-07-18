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

function withTable(WrappedComponent, headers) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                tableRows: []
            }
            this.addTableRows = this.addTableRows.bind(this);
            this.setTableRowsData = this.setTableRowsData.bind(this);
            this.getTableRowData = this.getTableRowData.bind(this);
            this.setTableRowData = this.setTableRowData.bind(this);
            this.ReactiveTable = this.ReactiveTable.bind(this);
        }

        addTableRows(rows) {
            this.setState(prevState => {
                prevState.tableRows = prevState.tableRows.concat(rows.map(r => {
                    return {
                        key: r.key,
                        isLoading: false,
                        deleted: false,
                        data: r.data
                    };
                }));
                return prevState;
            })
        }

        setTableRowsData(tableRows, next) {
            if (typeof(tableRows) === 'function') {
                const f = tableRows;
                this.setState((prevState) => {
                    f(prevState.tableRows);
                    return prevState;
                }, next);
            } else {
                this.setState({tableRows: tableRows}, next);
            }
        }

        getTableRowData(key) {
            return this.state.tableRows.find(r => r.key == key);
        }

        setTableRowData(key, f, next) {
            this.setState(prevState => {
                const row = prevState.tableRows.find(r => r.key == key);
                f(row);
                return prevState;
            }, next);
        }

        ReactiveTable(props) {
            
            const renderedRows = this.state.tableRows.map(row => {
                return (
                    !row.deleted &&
                    <tr key={row.key} className={row.isLoading ? 'disabled' : ''}>
                        {props.renderRow(row)}
                        <td className="loading"><img src="/svg/loading.svg" /></td>
                    </tr>
                );
            });
            return (
                <div className="card">

                
                <Table className="reactive-table">
                    <thead>
                        <tr>
                            {props.headers.map(h => <th key={h} scope="col">{h}</th>)}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderedRows}
                    </tbody>
                </Table>
                </div>
            );
        }

        render() {
            return (
                <WrappedComponent
                    ReactiveTable={this.ReactiveTable}
                    setTableRowsData={this.setTableRowsData}
                    getTableRowData={this.getTableRowData}
                    setTableRowData={this.setTableRowData}
                    addTableRows={this.addTableRows}
                    tableRows={this.state.tableRows}
                    {...this.props} />
            );
        }
    }
}

export default withTable;