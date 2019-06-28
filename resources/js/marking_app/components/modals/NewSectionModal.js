import React from 'react';
import Loading from '../Loading';

class NewSectionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initialState();
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleChangeCommentType = this.handleChangeCommentType.bind(this);
        this.handleRemoveComment = this.handleRemoveComment.bind(this);
        this.handleSubmitSection = this.handleSubmitSection.bind(this);
    }

    initialState() {
        return {
            submitting: false,
            newSectionTitle: "",
            selectedCategory: "positive",
            posComments: [],
            negComments: [],
            newComment: "",
            idCounter: 0
        };
    }

    handleAddComment(event) {
        if (this.state.newComment != "") {
            this.setState(prevState => {
                const category = prevState.selectedCategory == "positive" ? "posComments" : "negComments";
                prevState[category].push({id: prevState.idCounter, text: this.state.newComment});
                prevState.idCounter++;
                prevState.newComment = "";
                return prevState;
            });
        }
        event.preventDefault();
    }

    handleFormChange(event) {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    handleChangeCommentType(type) {
        this.setState({selectedCategory: type});
    }

    handleRemoveComment(idToRemove) {
        this.setState(prevState => {
            const category = prevState.selectedCategory == "positive" ? "posComments" : "negComments";
            for (var i = 0; i < prevState[category].length; i++) { 
                if (prevState[category][i].id == idToRemove) {
                    prevState[category].splice(i, 1); 
                }
            }
            return prevState;
        });
    }

    handleSubmitSection() {
        this.setState({submitting: true});
        const postBody = JSON.stringify({
            title: this.state.newSectionTitle,
            template_id: this.props.template_id,
            positiveComments: this.state.posComments.map(c => c.text),
            negativeComments: this.state.negComments.map(c => c.text)
        });
        console.log(postBody)
        // Submit the section to the server
        fetch("/api/sections/new-section", {
            method: 'post',
            body: postBody,
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
                this.props.addSection(data);
                $("#newSectionModal").removeClass("fade");
                $("#newSectionModal").modal('hide');
                $("#newSectionModal").addClass("fade");
                console.log(this.initialState());
                this.setState(this.initialState());
            });
    }

    render() {
        const category = this.state.selectedCategory == "positive" ? this.state.posComments : this.state.negComments;
        const displayComments = category.map(comment => {
            return (
                <li className="list-group-item">
                    {comment.text}
                    <button type="button" className="close" aria-label="Close" onClick={() => this.handleRemoveComment(comment.id)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </li>
            )});
        
        const modalBody = () => {
            if (this.state.submitting) {
                return (
                    <Loading text="Creating new section..." />
                );
            }
            return (
                <div>
                    {/* Section Title input */}
                    <div className="form-group">
                        <input
                            name="newSectionTitle"
                            value={this.state.newSectionTitle}
                            onChange={this.handleFormChange}
                            type="text"
                            className="form-control form-control-lg"
                            id="newSectionTitle"
                            placeholder="Section title"
                        />
                    </div>
                    {/* Positive/Negative Buttons */}
                    <div className="commentsToggle btn-group btn-group-toggle" data-toggle="buttons">
                        <label className="btn btn-light active" onClick={() => this.handleChangeCommentType("positive")}>
                            <input
                                type="radio"
                                name="selectedCategory"
                                value="positive"
                                defaultChecked={this.state.selectedCategory === "positive"}
                                id="addPostive"
                            /> Positive
                        </label>
                        <label className="btn btn-light" onClick={() => this.handleChangeCommentType("negative")}>
                            <input
                                type="radio"
                                name="selectedCategory"
                                value="negative"
                                defaultChecked={this.state.selectedCategory === "negative"}
                                id="addNegative"
                            /> Negative
                        </label>
                    </div>
                    {/* Add New Comment */}
                    <form onSubmit={this.handleAddComment}>
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
                    {/* Added Comments */}
                    <ul className="list-group">
                        {displayComments}
                    </ul>
                </div>
            );
        }

        return (
            <div className="modal fade" id="newSectionModal" tabIndex="-1" role="dialog" aria-labelledby="newSectionModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content newSection">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="newSectionModalLabel">Add new section</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                            {modalBody()}
                        </div>
                        {/* Modal Footer */}
                        {!this.state.submitting &&
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={this.handleSubmitSection}>Add section</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default NewSectionModal;