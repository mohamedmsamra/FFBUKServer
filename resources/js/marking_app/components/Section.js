import React from 'react';
import Comment from './Comment.js';
import ConfirmationModal from './modals/ConfirmationModal';
import TextEditor from './TextEditor';

class Section extends React.Component {
    constructor(props) {
        super(props);
        // console.log(this.props);
        this.state = {
            title: this.props.title,
            openComments: "",
            posComments: this.props.posComments,
            negComments: this.props.negComments,
            newComment: '',
            commentID: 0,
            editTitle: false,
        }
        this.openComments = this.openComments.bind(this);
        this.handleCommentClick = this.handleCommentClick.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleRemoveComment = this.handleRemoveComment.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.renderAddCommentInput = this.renderAddCommentInput.bind(this);
        this.renderTitleEditView = this.renderTitleEditView.bind(this);
        this.addComment = this.addComment.bind(this);
    }

    // Display list of comments 
    openComments(type) {
        if (type == this.state.openComments) {
            this.setState({openComments: ""});
        } else {
            this.setState({openComments: type});
        }
    }

    // On click, add comment to the text box if it wasn't added already
    handleCommentClick(comment) {
        if(!comment.added) {
            this.props.handleAppendComment(this.props.id, comment.text);
        }
    }

    handleEditTitle(e) {
        this.setState({editTitle: !this.state.editTitle});
    }

    handleRemoveComment(idToRemove) {

        // console.log('Fetch method delete comment with id = ' + idToRemove);
        fetch('/api/comments/' + idToRemove, {
            method: 'delete',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            }
        }).then(function(response) {
            return response.json();
        }).then((data) => {
            console.log(data);
        }).then( () => {
            this.setState(prevState => {
                const category = prevState.openComments == "positive" ? "posComments" : "negComments";
                for (var i = 0; i < prevState[category].length; i++) { 
                    if (prevState[category][i].id == idToRemove) {
                        prevState[category].splice(i, 1); 
                    }
                }
                return prevState;
            });
            $("#confirmationModal").removeClass("fade");
            $("#confirmationModal").modal('hide');
            $("#confirmationModal").addClass("fade");
        });
        
    }

    handleFormChange(event) {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    addComment(comment) {
        if (comment.type === 'positive') {
            this.setState(prevState => prevState.posComments.push(comment));
        } else if (comment.type === 'negative') {
            this.setState(prevState => prevState.negComments.push(comment));
        }
    }

    handleAddComment(event) {
        if (this.state.newComment != "") {
            let cat = this.state.openComments;
            
            // Submit the section to the server
            fetch("/api/comments", {
                method: 'post',
                body: JSON.stringify({
                    text: this.state.newComment,
                    type: cat,
                    section_id: this.props.id
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                }
            })
                .then(data => data.json())
                .then(data => {
                    console.log(data);
                    this.addComment(data);
                    this.setState({newComment: ''});
                });
        }              
        event.preventDefault();
    }

    renderTitleEditView() {
        return <div className="input-group">
                    <input type="text" className="form-control form-control-lg" defaultValue={this.state.title} ref="sectionTitleInput"/>
                    <div className="input-group-append" id="button-addon4">
                        <button onClick={this.handleEditTitle} className="btn btn-outline-danger" type="button"><i className="fas fa-times"></i></button>
                        <button onClick={this.updateTitle} className="btn btn-outline-success" type="button"><i className="fas fa-check"></i></button>
                    </div>
                </div>
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

    renderAddCommentInput() {
        return <form onSubmit={this.handleAddComment}>
                    <div className="input-group mb-3">
                        <input
                            value={this.state.newComment}
                            name="newComment" type="text"
                            onChange={this.handleFormChange}
                            className="form-control"
                            placeholder="New comment"
                            aria-label="New comment"
                            aria-describedby="newCommentText"
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                id="newCommentText"
                                type="submit"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </form>
    }

    render() {
        const category = this.state.openComments == "positive" ? this.state.posComments : this.state.negComments;
        const displayComments = category.map(comment => {
            return (
                <li key={'comment' + comment.id} className={"list-group-item list-group-item-action sectionComment " + this.state.openComments}>
                    <Comment 
                        id={comment.id} 
                        text={comment.text} 
                        type={comment.type} 
                        section_id={comment.section_id} 
                        handleRemove={this.handleRemoveComment} 
                        handleClick={this.handleCommentClick}/>                    
                </li>
                
            )});

        // The comments part of the section
        let commentsDiv = (
            <div className="comments">
                <div className="buttons">
                    <button type="button" className="btn btn-success" onClick={() => this.openComments("positive")}> Positive</button>
                    <button type="button" className="btn btn-danger" onClick={() => this.openComments("negative")} >Negative</button>
                </div>
                
                {this.state.openComments &&
                    <div className="commentsList">
                        {this.renderAddCommentInput()}
                        <div className="list-group commentsList ">
                            {displayComments}
                        </div>
                    </div>
                }

            </div>
        );

        // The button to delete a section
        let removeBtn = (
            <button onClick={() => this.props.handleDeleteClick(this.props.id)} type="button" className="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        );
       
        return (
            <div className="card section shadow-sm">
                <div className="card-header">
                    <div className="float-left titleDiv">
                        {this.state.editTitle ? 
                            this.renderTitleEditView()
                            :
                            <div>
                                {(this.props.enableMarking && !this.props.compulsory) && (
                                    <div className="float-left">
                                        <input value={this.props.mark} onChange={(e) => this.props.handleMarkChange(this.props.id, e.target.value)} type="number" className="form-control markInput"  data-toggle="tooltip" data-placement="top" title="Mark"/>
                                    </div>)
                                }
                                <h4  className="float-left" onDoubleClick={this.handleEditTitle}>{this.state.title}</h4>
                                {!this.props.compulsory && (
                                        <button 
                                            type="button" 
                                            className="invisibleBtn float-left" 
                                            onClick={this.handleEditTitle} 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Edit Title">
                                            <i className="far fa-edit"></i>
                                        </button>)
                                }
                                
                            </div>
                            
                        }
                    </div>
                    <div>
                        {!this.props.compulsory && removeBtn}
                    </div>
                </div>
                <div className="card-body">
                    <div className="form-group">
                        <TextEditor 
                            id={this.props.id} 
                            value={this.props.value} 
                            handleSectionTextChange={(val) => this.props.handleSectionTextChange(this.props.id, val)}
                        />
                    </div>

                    {/* If this section should have comments, display them */}
                    {!this.props.compulsory && commentsDiv}
                </div>
            </div>
        );
    }
}

Section.defaultProps = {
    title: 'Section Title',
    posComments: [],
    negComments: [],
    compulsory: false
}

export default Section;