class NewSectionModal extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div class="modal fade" id="newSectionModal" tabindex="-1" role="dialog" aria-labelledby="newSectionModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="newSectionModalLabel">Add new section</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <input type="text" class="form-control" id="newSectionTitle" placeholder="Section title" />
                            </div>
                            <div class="btn-group btn-group-toggle" data-toggle="buttons">
                                <label class="btn btn-secondary active">
                                    <input type="radio" name="comment_type" id="addPostive" autocomplete="off" checked /> Positive
                                </label>
                                <label class="btn btn-secondary">
                                    <input type="radio" name="comment_type" id="addNegative" autocomplete="off" /> Negative
                                </label>
                            </div>
                            <div class="input-group mb-3">
                                <input type="text" class="form-control" placeholder="New comment" aria-label="New comment" aria-describedby="newCommentText" />
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" id="newCommentText">Add</button>
                                </div>
                            </div>
                            <ul class="list-group">
                                <li class="list-group-item">Cras justo odio</li>
                                <li class="list-group-item">Dapibus ac facilisis in</li>
                                <li class="list-group-item">Morbi leo risus</li>
                                <li class="list-group-item">Porta ac consectetur ac</li>
                                <li class="list-group-item">Vestibulum at eros</li>
                            </ul>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary">Add</button>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}