import React from 'react';
import ConfirmationModal from './modals/ConfirmationModal'

class Section extends React.Component {
    constructor(props) {
        super(props);
        // console.log(this.props);
        this.state = {
            title: this.props.title,
            openComments: "",
            posComments: this.props.posComments,
            negComments: this.props.negComments,
            value: '',
            newComment: '',
            idCounter: 0, 
            commentID: 0,
            editTitle: false
        }
        this.openComments = this.openComments.bind(this);
        this.handleCommentClick = this.handleCommentClick.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.setCommentId = this.setCommentId.bind(this);
        this.handleRemoveComment = this.handleRemoveComment.bind(this);

    }

    // Display list of comments 
    openComments(type) {
        if (type == this.state.openComments) {
            this.setState({openComments: ""});
        } else {
            this.setState({openComments: type});
        }
    }

    setCommentAdded(comment,value) {
        this.setState({posComments: this.state.posComments.map(x => x === comment ? {text : x.text, added : value} : x)});
        this.setState({negComments: this.state.negComments.map(x => x === comment ? {text : x.text, added : value} : x)});
    }

    // On click, add comment to the text box if it wasn't added already
    handleCommentClick(comment) {
        if(!comment.added) {
            // Add text to text box
            this.setState({value: this.state.value + comment.text + '\n'});
            // Remember that the comment was added (i.e. find the comment and set added = true)
            this.setCommentAdded(comment,true);
        }
    }

    handleEditTitle(e) {
        this.setState({editTitle: !this.state.editTitle});
        // const prev = e.target;
        // let editable = (
        //     <div className="input-group">
        //         <input type="text" className="form-control" placeholder="Recipient's username" aria-label="Recipient's username with two button addons" aria-describedby="button-addon4" />
        //         <div className="input-group-append" id="button-addon4">
        //             <button className="btn btn-outline-secondary" type="button"><i className="fas fa-times"></i></button>
        //             <button className="btn btn-outline-secondary" type="button"><i className="fas fa-check"></i></button>
        //         </div>
        //     </div>
        // );
    }

    handleTextareaChange() {
        this.setState({value: event.target.value});
    }

    setCommentId(id) {
        this.setState({commentID: id});
    }

    handleRemoveComment(idToRemove) {
        // let idToRemove = this.state.commentID;
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

    handleAddComment(event) {
        if (this.state.newComment != "") {
            this.setState(prevState => {
                const category = prevState.openComments == "positive" ? "posComments" : "negComments";
                prevState[category].push({id: prevState.idCounter, text: this.state.newComment});
                prevState.idCounter++;
                prevState.newComment = "";
                return prevState;
            });
        }
        event.preventDefault();
    }

    renderTitleEditView() {
        return <div className="input-group">
                    <input type="text" className="form-control" defaultValue={this.state.title}/>
                    <div className="input-group-append" id="button-addon4">
                        <button onClick={this.handleEditTitle} className="btn btn-outline-danger" type="button"><i className="fas fa-times"></i></button>
                        <button onClick={this.updateTitle} className="btn btn-outline-success" type="button"><i className="fas fa-check"></i></button>
                    </div>
                </div>
    }

    updateTitle() {
        this.setState({editTitle: false, title: edited});
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
                <li key={'comment' + comment.id} className="list-group-item  list-group-item-action sectionComment">
                    <div 
                        className="float-left clickableComment" 
                        onClick={() => this.handleCommentClick(comment)}  
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Click to Add">
                        {comment.text}
                    </div>
                    <div className="float-right commentBtns">
                        <button type="button" className="invisibleBtn"  data-toggle="tooltip" data-placement="top" title="Edit Comment">
                            <i className="far fa-edit"></i>
                        </button>
                        <button type="button" className="invisibleBtn" onClick={() => this.handleRemoveComment(comment.id)/*{$("#confirmationModal").modal('show'); this.setCommentId(comment.id)}*/} data-placement="top" title="Edit Comment">
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </li>
                
            )});
            
        let inputComm = this.renderAddCommentInput();

        let openComments;

        if (this.state.openComments != "") {
            openComments =  (
                <div className="commentsList">
                    {inputComm}
                    <div className="list-group commentsList">
                        {displayComments}
                    </div>
                </div>
                
            );
        } 

        // The comments part of the section
        let commentsDiv = (
            <div className="comments">
                <div className="buttons">
                    <button type="button" className="btn btn-success" onClick={() => this.openComments("positive")}> Positive</button>
                    <button type="button" className="btn btn-danger" onClick={() => this.openComments("negative")} >Negative</button>
                </div>
                
                {openComments}
            </div>
        );

        // The button to delete a section
        let removeBtn = (
            <button onClick={() => this.props.handleDeleteClick(this.props.id)} type="button" className="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        );

        return (
            <div className="section">
                {/* Delete section button */}
                {this.props.removeable ? removeBtn : ''}

                {this.state.editTitle ? 
                    this.renderTitleEditView()
                    :
                    <h3 onDoubleClick={this.handleEditTitle}>{this.props.title}</h3>
                }

                <div className="form-group">
                    <textarea className="form-control" value={this.state.value} onChange={this.handleTextareaChange}></textarea>
                </div>

                {/* If this section should have comments, display them */}
                {this.props.hasComments ? commentsDiv : ''}
                <ConfirmationModal message="remove this comment" handleConfirmation={this.handleRemoveComment}/>
            </div>
        );
    }
}

Section.defaultProps = {
    title: 'Section Title',
    posComments: [],
    negComments: [],
    hasComments: true,
    removeable: true
}

export default Section;