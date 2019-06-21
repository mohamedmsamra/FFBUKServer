class Section extends React.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            openComments: "",
            posComments: this.props.posComments,
            negComments: this.props.negComments,
            value: ''
        }
        this.openComments = this.openComments.bind(this);
        this.handleCommentClick = this.handleCommentClick.bind(this);
        this.handleEditTitle = this.handleEditTitle.bind(this);
        this.handleTextareaChange = this.handleTextareaChange.bind(this);
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

    handleEditTitle() {

    }

    handleTextareaChange() {
        this.setState({value: event.target.value});
    }

    render() {
        let openComments;
        const posCommentsToRender = this.state.posComments.map(comment => <li onClick={() => this.handleCommentClick(comment)} className="list-group-item  list-group-item-action">{comment.text}</li>);
        const negCommentsToRender = this.state.negComments.map(comment => <li onClick={() => this.handleCommentClick(comment)} className="list-group-item  list-group-item-action">{comment.text}</li>);

        if (this.state.openComments == "positive") {
            openComments =  <ul className="list-group commentsList">
                                {posCommentsToRender}
                            </ul>
        } else if (this.state.openComments == "negative") {
            openComments =  <ul className="list-group commentsList">
                                {negCommentsToRender}
                            </ul>
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
            <button onClick={() => this.props.handleDeleteClick(this.props.id)} type="button" class="close" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        );
        return (
            <div className="section">
                {/* Delete section button */}
                {this.props.removeable ? removeBtn : ''}

                <h3 onClick={this.handleEditTitle}>{this.props.title}</h3>

                <div class="form-group">
                    <textarea class="form-control" value={this.state.value} onChange={this.handleTextareaChange}></textarea>
                </div>

                {/* If this section should have comments, display them */}
                {this.props.hasComments ? commentsDiv : ''}
                
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