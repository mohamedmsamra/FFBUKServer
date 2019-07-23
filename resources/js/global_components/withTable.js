import React from 'react';
import Table from 'react-bootstrap/Table';

/* Render a table from given data. The wrapped component should store in its state an array with objects containing the
 * following properties:
 *     key                 - A key the item can be identified by
 *     isLoading (boolean) - Indicates whether the row is waiting for response, can be used to render the row
 *                           accordingly
 *     deleted   (boolean) - When true, the row will not be displayed to the user
 *     data                - An object that contains the data of the row.
 *
 * The wrapped component should implement the following function:
 *     renderRow(row) - Given the data of the row, return the array of td elements to be rendered in the row.
 * 
 * This class provides the following functions the wrapped component can make use of:
 *     addTableRows(rows)
 *     setTableRows(rows)
 *     setTableRowsData(tableRows, next)
 *     setTableRowData(key, f, next)
 *     getTableRowsData(key)
 * 
 * Each of these functions are explained below.
 * 
 * In addition, the HOC provides a component ReactiveTable to the wrapped component, which the wrapped component must
 * itself render in order to render the table.
 */

function withTable(WrappedComponent, headers) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                tableRows: []
            }
            this.addTableRows = this.addTableRows.bind(this);
            this.addTableRow = this.addTableRow.bind(this);
            this.setTableRowsData = this.setTableRowsData.bind(this);
            this.getTableRowData = this.getTableRowData.bind(this);
            this.setTableRowData = this.setTableRowData.bind(this);
            this.ReactiveTable = this.ReactiveTable.bind(this);
        }

        /* Adds the provided rows to the state of the table. The rows should be objects with the following properties:
         *     key  - Key the row is identified by
         *     data - Data of the row, can be an object 
         * 
         * Alongside these properties, the properties isLoading and deleted are added by with the default values.
         */
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

        /* Same as addTableRows, but adds a single row. */
        addTableRow(row) {
            this.addTableRows([row]);
        }

        /* A function that sets the table rows in the state. It takes two parameters:
         *     tableRows, which is either:
         *         - a function, that is applied to the table rows array.
         *         - an array, which is set to be the table rows.
         *     next, a callback function to run after the rows have been updated.
         */
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

        /* Returns the row from the state by the given key. */
        getTableRowData(key) {
            return this.state.tableRows.find(r => r.key == key);
        }

        /* Applies a function to a given row of the table. Can be used to update rows.
         * key             - The key the row can be identified by.
         * f    (function) - The function to be applied to the row.
         * next (function) - A callback function to run after the row has been updated.
         */
        setTableRowData(key, f, next) {
            this.setState(prevState => {
                const row = prevState.tableRows.find(r => r.key == key);
                f(row);
                return prevState;
            }, next);
        }

        /* The table that the wrapped component must render. It is passed to the wrapped component by its props. */
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
                <div className="card shadow-sm mb-3">
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