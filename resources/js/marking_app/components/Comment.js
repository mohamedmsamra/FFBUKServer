import React from 'react';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            text: this.props.text,
            type: this.props.type,
            section_id: this.props.section_id
        }
    }

    handleEditTitle(e) {
        this.setState({editTitle: !this.state.editTitle});
    }

    updateTitle() {
        // Submit the section to the server
        fetch("/api/sections/" + this.props.id, {
            method: 'put',
            mode: 'cors',
            body: JSON.stringify({
                title: this.refs.sectionTitleInput.value,
                template_id: this.props.template_id,
                positiveComments: this.state.posComments.map(c => c.text),
                negativeComments: this.state.negComments.map(c => c.text)
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

        this.setState({editTitle: false, title: this.refs.sectionTitleInput.value});
    }

    updateComment() {

    }

    render() {
        return (
            <div>
                <div 
                    className="float-left clickableComment" 
                    // onClick={() => this.handleCommentClick(comment)}  
                    data-toggle="tooltip" 
                    data-placement="top" 
                    title="Click to Add">
                    {this.state.text}
                </div>
                <div className="float-right commentBtns">
                    <button 
                        type="button" 
                        className="invisibleBtn"  
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Edit Comment">
                        <i className="far fa-edit"></i>
                    </button>
                    <button 
                        type="button" 
                        className="invisibleBtn" 
                        // onClick={() => this.handleRemoveComment(this.state.id)/*{$("#confirmationModal").modal('show'); this.setCommentId(comment.id)}*/}
                        data-placement="top" 
                        title="Edit Comment">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
        );
    }
}

Comment.defaultProps = {
}

export default Comment;