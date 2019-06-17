class Section extends React.Component {
    constructor() {
        super();
        this.state = {
            openComments: ""
        }
        this.openComments = this.openComments.bind(this);
    }

    openComments(type) {
        if (type == this.state.openComments) {
            this.setState({openComments: ""});
        } else {
            this.setState({openComments: type});
        }
    }

    render() {
        let openComments;
        if (this.state.openComments == "positive") {
            openComments =  <ul className="list-group">
                                <li className="list-group-item">Positive</li>
                                <li className="list-group-item">Dapibus ac facilisis in</li>
                                <li className="list-group-item">Morbi leo risus</li>
                                <li className="list-group-item">Porta ac consectetur ac</li>
                                <li className="list-group-item">Vestibulum at eros</li>
                            </ul>
        } else if (this.state.openComments == "negative") {
            openComments =  <ul className="list-group">
                                <li className="list-group-item">Negative</li>
                                <li className="list-group-item">Dapibus ac facilisis in</li>
                                <li className="list-group-item">Morbi leo risus</li>
                                <li className="list-group-item">Porta ac consectetur ac</li>
                                <li className="list-group-item">Vestibulum at eros</li>
                            </ul>
        }
        return (
            <div className="section">
                <h3>Template name</h3>
                <textarea></textarea>
                <div className="comments">
                    <div className="buttons">
                        <button type="button" className="btn btn-success" onClick={() => this.openComments("positive")}> Positive</button>
                        <button type="button" className="btn btn-danger" onClick={() => this.openComments("negative")} >Negative</button>
                    </div>
                   {openComments}
                </div>
            </div>
        );
    }
}