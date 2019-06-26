import React from 'react';
import Loading from '../Loading';

const initialState = {
    submitting: false,
    newSectionTitle: "",
    selectedCategory: "positive",
    posComments: [],
    negComments: [],
    newComment: "",
    idCounter: 0
};

class NewSectionModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleChangeCommentType = this.handleChangeCommentType.bind(this);
        this.handleRemoveComment = this.handleRemoveComment.bind(this);
        this.handleSubmitSection = this.handleSubmitSection.bind(this);
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
        console.log(JSON.stringify({
            title: this.state.newSectionTitle,
            template_id: 1,
            positiveComments: this.state.posComments.map(c => c.text),
            negativeComments: this.state.negComments.map(c => c.text)
        }))
        // Submit the section to the server
        fetch("/api/sections/new-section", {
            method: 'post',
            body: JSON.stringify({
                title: this.state.newSectionTitle,
                template_id: this.props.data.template.id,
                positiveComments: this.state.posComments.map(c => c.text),
                negativeComments: this.state.negComments.map(c => c.text)
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
                this.props.addSection(data);
                $("#newSectionModal").removeClass("fade");
                $("#newSectionModal").modal('hide');
                $("#newSectionModal").addClass("fade");
                this.setState(initialState);
            });
    }

    render() {
        const category = this.state.selectedCategory == "positive" ? this.state.posComments : this.state.negComments;
        const displayComments = category.map(comment => {
            return (
                <li class="list-group-item">
                    {comment.text}
                    <button type="button" class="close" aria-label="Close" onClick={() => this.handleRemoveComment(comment.id)}>
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
                    <div class="form-group">
                        <input
                            name="newSectionTitle"
                            value={this.state.newSectionTitle}
                            onChange={this.handleFormChange}
                            type="text"
                            class="form-control form-control-lg"
                            id="newSectionTitle"
                            placeholder="Section title"
                        />
                    </div>
                    {/* Positive/Negative Buttons */}
                    <div class="commentsToggle btn-group btn-group-toggle" data-toggle="buttons">
                        <label class="btn btn-light active" onClick={() => this.handleChangeCommentType("positive")}>
                            <input
                                type="radio"
                                name="selectedCategory"
                                value="positive"
                                checked={this.state.selectedCategory === "positive"}
                                id="addPostive"
                            /> Positive
                        </label>
                        <label class="btn btn-light" onClick={() => this.handleChangeCommentType("negative")}>
                            <input
                                type="radio"
                                name="selectedCategory"
                                value="negative"
                                checked={this.state.selectedCategory === "negative"}
                                id="addNegative"
                            /> Negative
                        </label>
                    </div>
                    {/* Add New Comment */}
                    <form onSubmit={this.handleAddComment}>
                        <div class="input-group mb-3">
                            <input
                                value={this.state.newComment}
                                name="newComment" type="text"
                                onChange={this.handleFormChange}
                                class="form-control"
                                placeholder="New comment"
                                aria-label="New comment"
                                aria-describedby="newCommentText"
                            />
                            <div class="input-group-append">
                                <button
                                    class="btn btn-outline-secondary"
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
                    <ul class="list-group">
                        {displayComments}
                    </ul>
                </div>
            );
        }

        return (
            <div class="modal fade" id="newSectionModal" tabindex="-1" role="dialog" aria-labelledby="newSectionModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content newSection">
                        {/* Modal Header */}
                        <div class="modal-header">
                            <h5 class="modal-title" id="newSectionModalLabel">Add new section</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div class="modal-body">
                            {modalBody()}
                        </div>
                        {/* Modal Footer */}
                        {!this.state.submitting &&
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" onClick={this.handleSubmitSection}>Add section</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default NewSectionModal;