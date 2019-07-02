import React from 'react';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            text: this.props.text,
            editingText: this.props.text,
            type: this.props.type,
            section_id: this.props.section_id,
            edit: false
        }
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.update = this.update.bind(this);
        this.renderCommentView = this.renderCommentView.bind(this);
        this.renderEditCommentView = this.renderEditCommentView.bind(this);
    }

    handleEditChange(e) {
        this.setState({edit: !this.state.edit});
    }

    handleFormChange(event) {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    update() {
        // Submit the section to the server
        console.log(this.props.id);
        fetch("/api/comments/" + this.props.id, {
            method: 'put',
            mode: 'cors',
            body: JSON.stringify({
                text: this.state.editingText,
                type: this.props.type,
                section_id: this.props.section_id
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            }
        }).then(function(data) {
            console.log(data);
        });
        this.setState({edit: false});
        this.props.handleCommentChange(this.props.section_id, this.props.id, this.props.type, this.state.editingText);
    }

    setCommentAdded(value) {
        this.setState({added : value});
    }

    renderEditCommentView() {
        return (
            <div className="input-group editView">
                <input type="text" 
                className="form-control" 
                value={this.state.editingText}
                onChange={this.handleFormChange}
                ref="commentInput"
                name="editingText" />
                <div className="input-group-append" id="button-addon4">
                    <button 
                        onClick={this.handleEditChange} 
                        className="btn btn-outline-danger" 
                        type="button">
                        <i className="fas fa-times"></i>
                    </button>
                    <button 
                        onClick={this.update} 
                        className="btn btn-outline-success" 
                        type="button">
                        <i className="fas fa-check"></i>
                    </button>
                </div>
            </div>
        );
    }

    renderCommentView() {
                
        return (<div>
                    <div 
                        className={"float-left clickableComment" + (this.props.added ? " added" : '')}
                        onClick={() => {if (!this.props.added) this.props.handleClick(this.props.id, this.props.type, this.props.text)}}
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Click to Add">
                        {this.props.text}
                    </div>
                    <div className="float-right commentBtns">
                        <button 
                            type="button" 
                            className="invisibleBtn"  
                            onClick={this.handleEditChange}
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Edit Comment">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button 
                            type="button" 
                            className="invisibleBtn" 
                            onClick={() => this.props.handleRemove(this.props.id)}
                            data-placement="top" 
                            title="Delete Comment">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>);
    }

    render() {
        return (
            this.state.edit ? 
                this.renderEditCommentView()
                :
                this.renderCommentView()
        );
    }
}

Comment.defaultProps = {
}

export default Comment;