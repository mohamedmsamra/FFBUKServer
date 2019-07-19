import React from 'react';
import Comment from './Comment.js';
import ConfirmationModal from './modals/ConfirmationModal';
import TextEditor from './TextEditor';
import { withAlert } from 'react-alert';
import FocusingInput from '../../global_components/FocusingInput.js';

class Section extends React.Component {
    constructor(props) {
        super(props);
        // console.log(this.props);
        this.state = {
            openComments: "",
            posComments: this.props.posComments,
            negComments: this.props.negComments,
            newComment: '',
            commentID: 0,
            editTitle: false,
            editTitleText: this.props.title,
            schemeOpen: false,
            hasScheme: false,
            markingScheme: this.props.marking_scheme,
            selectedPermissionCommentType: 'private'
        }
        this.openComments = this.openComments.bind(this);
        this.handleCommentClick = this.handleCommentClick.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleRemoveComment = this.handleRemoveComment.bind(this);
        this.handleEditTitleChange = this.handleEditTitleChange.bind(this);
        this.updateTitle = this.updateTitle.bind(this);
        this.renderAddCommentInput = this.renderAddCommentInput.bind(this);
        this.renderTitleEditView = this.renderTitleEditView.bind(this);
        this.addComment = this.addComment.bind(this);
        this.handleUploadScheme = this.handleUploadScheme.bind(this);
        this.handleOpenScheme = this.handleOpenScheme.bind(this);
        this.handlePermissionCommentType = this.handlePermissionCommentType.bind(this);
    }

    handlePermissionCommentType(type) {
        this.setState({selectedPermissionCommentType: type});
    }

    handleUploadScheme(e) {
        // debugger;
        $.ajax({
            // Your server script to process the upload
            url: '/api/sections/' + this.props.id + '/upload-image',
            type: 'POST',
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            },
            // Form data
            data: new FormData($(e.target).parent()[0]),

            // Tell jQuery not to process data or worry about content-type
            // You *must* include these options!
            cache: false,
            contentType: false,
            processData: false,

            // Custom XMLHttpRequest
            xhr: function () {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    // For handling the progress of the upload
                    myXhr.upload.addEventListener('load', function (e) {
                        console.log(e)
                    }, false);
                }
                return myXhr;
            },
            success: function(data){
                var json = $.parseJSON(data); // create an object with the key of the array
                if(this.state.markingScheme === json) {
                    console.log("they are the same");
                }
                this.setState({hasScheme: true, markingScheme: json});
            }.bind(this)
        });
    }


    handleOpenScheme() {
        this.setState((prevState) => Object.assign(prevState, {schemeOpen: !prevState.schemeOpen}));
               
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
    handleCommentClick(id, type, text) {
        this.props.handleCommentAdded(this.props.id, id, type);
        this.props.handleAppendComment(this.props.id, {id: id, text: text});
    }

    handleEditTitle(e) {
        this.setState(prevState => Object.assign(prevState, {editTitle: !prevState.editTitle, editTitleText: this.props.title}));
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
            if (data.length > 12) data = data.substring(0,12) + "...";
            this.props.alert.success({text: "Removed comment \n '" + data + "'"});
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

    handleEditTitleChange(event) {
        this.setState({editTitleText: event.target.value});
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

            let postBody = {
                text: this.state.newComment,
                type: cat,
                section_id: this.props.id,
            };

            if (this.state.selectedPermissionCommentType === 'private') {
                postBody.private_to_user = USER_ID;
            }
            
            // Submit the section to the server
            fetch("/api/comments", {
                method: 'post',
                body: JSON.stringify(postBody),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                }
            })
                .then(data => data.json())
                .then(data => {
                    data.visibility = this.state.selectedPermissionCommentType;
                    this.addComment(data);
                    this.setState({newComment: ''});
                });
        }              
        event.preventDefault();
    }

    renderTitleEditView() {
        return <div className="input-group">
                    <FocusingInput
                        size="lg"
                        value={this.state.editTitleText}
                        onEnterKey={this.updateTitle}
                        onEscapeKey={this.handleEditTitle}
                        onChange={this.handleEditTitleChange} />
                    <div className="input-group-append" id="button-addon4">
                        <button onClick={this.handleEditTitle} className="btn btn-outline-danger" type="button"><i className="fas fa-times"></i></button>
                        <button onClick={this.updateTitle} className="btn btn-outline-success" type="button"><i className="fas fa-check"></i></button>
                    </div>
                </div>
    }

    updateTitle() {
        // Submit the section to the server
        fetch("/api/sections/" + this.props.id + "/edit-title", {
            method: 'post',
            body: JSON.stringify({
                title: this.state.editTitleText
            }),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            }
        }).then(function(data) {
            // console.log(data);
        });

        this.setState({editTitle: false});
        this.props.handleSectionTitleChange(this.props.id, this.state.editTitleText);
    }

    renderAddCommentInput() {
        return <form onSubmit={this.handleAddComment} className="addCommentForm text-center">
            {(this.props.permissionLevel === 1) &&
                <div className="btn-group btn-group-toggle shadow-sm text-center" data-toggle="buttons">
                    <label className="btn btn-light active" onClick={() => this.handlePermissionCommentType("private")}>
                        <input
                            type="radio"
                            checked={this.state.selectedPermissionCommentType === "private"}
                            id="selectPrivate"
                            onChange={() => {}}
                        /> Private Comment
                    </label>
                    <label className="btn btn-light" onClick={() => this.handlePermissionCommentType("public")}>
                        <input
                            type="radio"
                            checked={this.state.selectedPermissionCommentType === "public"}
                            id="addPublic"
                            onChange={() => {}}
                        /> Public Comment
                    </label>
                </div>
            }
                    
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
        const displayComments = category
        .sort((a, b) => {
            if (a.private_to_user == null && b.private_to_user != null) return -1;
            if (a.private_to_user != null && b.private_to_user == null) return 1;
            return a.id - b.id;
        })
        .map(comment => {
            return (
                
                <li key={'comment' + comment.id} className={(comment.visibility === 'public' ? 'publicComment' :'') + " list-group-item list-group-item-action sectionComment " + this.state.openComments}>
                    <Comment 
                        id={comment.id} 
                        text={comment.text} 
                        type={comment.type}
                        added={comment.added}
                        visibility={comment.visibility}
                        section_id={comment.section_id} 
                        handleRemove={this.handleRemoveComment} 
                        handleClick={this.handleCommentClick}
                        handleCommentAdded={this.props.handleCommentAdded}
                        handleCommentChange={this.props.handleCommentChange} 
                        permissionLevel={this.props.permissionLevel} />
                </li>
                
            )
        });

        // The comments part of the section
        let commentsDiv = (
            <div className="comments">
                <div className="buttons">
                    <button type="button" className="btn btn-success" onClick={() => this.openComments("positive")}>Positive</button>
                    <button type="button" className="btn btn-warning" onClick={() => this.openComments("negative")}>Constructive</button>
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
            <button
            onClick={() => {this.props.alert.show({
                text: "Are you sure you want to delete this section?",
                onConfirm: () => this.props.handleDeleteClick(this.props.id)
            })}}
            type="button"
            className="close"
            aria-label="Close" >
                <span aria-hidden="true">&times;</span>
            </button>
        );
       
        return (
            <div id={"section" + this.props.id} className="card section shadow-sm">
                <div className="card-header">
                    <div className="float-left titleDiv">
                        {this.state.editTitle ? 
                            this.renderTitleEditView()
                            :
                            <div>
                                {(this.props.enableMarking && !this.props.compulsory) && (
                                    <div className="float-left">
                                        <input value={this.props.mark} onChange={(e) => this.props.handleMarkChange(this.props.id, e.target)} type="number" className="form-control markInput"  data-toggle="tooltip" data-placement="top" title="Mark must be between 0 and 100"/>
                                    </div>)
                                }
                                <h4  className="float-left" onDoubleClick={this.handleEditTitle}>{this.props.title}</h4>
                                {!this.props.compulsory && (
                                    <div className="float-left">

                                        {this.props.permissionLevel == 1 &&
                                        <>
                                        <button 
                                            type="button" 
                                            className="invisibleBtn float-left" 
                                            onClick={this.handleEditTitle} 
                                            data-toggle="tooltip" 
                                            data-placement="top" 
                                            title="Edit Title">
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <form encType="multipart/form-data" action="" className="float-left">
                                            <input 
                                                onChange={this.handleUploadScheme.bind(this)}
                                                name="image"
                                                type="file" 
                                                id={"scheme" + this.props.id} 
                                                className="hiddenFileInput" 
                                                accept="image/*"/>
                                            <button 
                                                type="button" 
                                                id={"upload" + this.props.id}
                                                className="invisibleBtn float-left" 
                                                onClick={() => {$("#scheme" + this.props.id).click()}} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Upload Marking Scheme">
                                                <i className="fas fa-upload"></i>
                                            </button>
                                        </form>
                                        </>
                                        }
                                        
                                        {(this.state.markingScheme != null) &&
                                            <button 
                                                type="button" 
                                                className="invisibleBtn float-left" 
                                                onClick={this.handleOpenScheme} 
                                                data-toggle="tooltip" 
                                                data-placement="top" 
                                                title="Toggle Marking Scheme">
                                                <i className="fas fa-file-image"></i>
                                                  <small> Toggle Marking Scheme</small>
                                            </button>}
                                                
                                    </div>)
                                }
                                
                            </div>
                            
                        }
                    </div>
                    
                    {/* Display the button to remove a section only if you have read/write permission and the section is not compulsory */}
                    {(this.props.permissionLevel === 1 && !this.props.compulsory) && removeBtn}
                </div>
                
                {(this.state.markingScheme != null) &&
                    <div className={this.state.schemeOpen ? "markingSchemeImg" : "markingSchemeImg hidden"}>
                        <img src={"/storage/" + this.state.markingScheme}/>
                    </div>
                } 
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

export default withAlert()(Section);