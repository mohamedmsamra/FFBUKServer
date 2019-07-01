import React from 'react';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            text: this.props.text,
            type: this.props.type,
            section_id: this.props.section_id,
            edit: false,
            added: false
        }
        this.handleEditChange = this.handleEditChange.bind(this);
        this.update = this.update.bind(this);
        this.renderCommentView = this.renderCommentView.bind(this);
        this.renderEditCommentView = this.renderEditCommentView.bind(this);
        this.setCommentAdded = this.setCommentAdded.bind(this);
    }

    handleEditChange(e) {
        this.setState({edit: !this.state.edit});
    }

    update() {
        // Submit the section to the server
        console.log(this.props.id);
        fetch("/api/comments/" + this.props.id, {
            method: 'put',
            mode: 'cors',
            body: JSON.stringify({
                text: this.refs.commentInput.value,
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
        this.setState({edit: false, text: this.refs.commentInput.value, added: false});
    }

    setCommentAdded(value) {
        this.setState({added : value});
    }

    renderEditCommentView() {
        return (
            <div className="input-group editView">
                <input type="text" 
                className="form-control" 
                defaultValue={this.state.text} 
                ref="commentInput"/>
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
                        className={"float-left clickableComment" + (this.state.added ? " added" : '')}
                        onClick={() => {
                            let temp = {
                                id: this.props.id,
                                text: this.state.text,
                                type: this.props.type,
                                section_id: this.props.section_id,
                                added: this.state.added
                            };
                            this.props.handleClick(temp);
                            this.setCommentAdded(true);
                        }
                            }
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Click to Add">
                        {this.state.text}
                    </div>
                    <div className="float-right commentBtns">
                        <button 
                            type="button" 
                            className="invisibleBtn"  
                            onClick={this.handleEditChange}
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Edit Comment">
                            <i className="far fa-edit"></i>
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