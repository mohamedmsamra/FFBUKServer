class NewSectionModal extends React.Component {
    constructor() {
        super();
        this.state = {
            newSectionTitle: "",
            selectedCategory: "positive",
            posComments: [],
            negComments: [],
            newComment: "",
            idCounter: 0
        };
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleChangeCommentType = this.handleChangeCommentType.bind(this);
        this.handleRemoveComment = this.handleRemoveComment.bind(this);
    }

    handleAddComment() {
        if (this.state.newComment != "") {
            this.setState(prevState => {
                const category = prevState.selectedCategory == "positive" ? "posComments" : "negComments";
                prevState[category].push({id: prevState.idCounter, text: this.state.newComment});
                prevState.idCounter++;
                prevState.newComment = "";
                return prevState;
            });
        }
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
                            <form>
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
                                            onClick={this.handleAddComment}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                {/* Added Comments */}
                                <ul class="list-group">
                                    {displayComments}
                                </ul>
                            </form>
                        </div>
                        {/* Modal Footer */}
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary">Add section</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}