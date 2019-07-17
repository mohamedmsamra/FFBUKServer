import React from 'react';
import { withAlert } from 'react-alert';
import FocusingInput from '../../global_components/FocusingInput';

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
        this.setState(prevState => Object.assign(prevState, {edit: !prevState.edit, editingText: prevState.text}));
    }

    handleFormChange(event) {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    update() {
        // Submit the section to the server
        fetch("/api/comments/" + this.props.id + "/edit-text", {
            method: 'post',
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
        });
        this.setState({edit: false});
        this.props.handleCommentChange(this.props.section_id, this.props.id, this.props.type, this.state.editingText);
    }

    renderEditCommentView() {
        return (
            <div className="input-group editView">
                <FocusingInput
                    value={this.state.editingText}
                    onChange={this.handleFormChange}
                    name="editingText"
                    onEnterKey={this.update}
                    onEscapeKey={this.handleEditChange}
                />
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
                            className="invisibleBtn text-muted" 
                            data-placement="top"
                            title={(this.props.visibility === 'public' ? "Public" : "Private") + " Comment"}>
                            {this.props.visibility === 'public' && <i className={"fas " + (this.props.permissionLevel == 1 ? 'fa-lock-open' : 'fa-lock')}></i>}
                        </button>
                        {(this.props.visibility === 'private' || this.props.permissionLevel === 1) &&
                            <>
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
                                    onClick={() => this.props.alert.show({
                                        text: "Are you sure you want to remove this comment?",
                                        onConfirm: () => this.props.handleRemove(this.props.id)
                                    })}
                                    data-placement="top" 
                                    title="Delete Comment">
                                    <i className="fas fa-times"></i>
                                </button>
                            </>
                        }
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

export default withAlert()(Comment);