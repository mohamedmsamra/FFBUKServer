import React from 'react';

/* This component is used as toggle inputs to select whether the list of the comments should have a specific filter or
 * sort applied to it.
 */
class ListOption extends React.Component {
    render() {
        return (
            <div className="list-option">
                {/* Material switch, added to the project by CSS */}
                <div className="material-switch float-right">
                    <input id={this.props.id} type="checkbox" className={this.props.value ? 'checked' : ''} onChange={this.props.onChange}/>
                    <label htmlFor={this.props.id} className="bg-primary"></label>
                </div>
                <p>
                    {this.props.text}
                </p>
            </div>
        );
    }
}

export default ListOption;