import React from 'react';

class ListOption extends React.Component {
    render() {
        return (
            <div className="list-option">
                <div className="material-switch float-right">
                    <input id={this.props.id} type="checkbox" name={'' + Math.floor(Math.random() * 10000)} className={this.props.value ? 'checked' : ''} onChange={this.props.onChange}/>
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