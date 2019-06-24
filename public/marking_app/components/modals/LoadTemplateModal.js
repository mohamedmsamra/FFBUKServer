class LoadTemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            template_id: 1
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(id) {
        this.setState({template_id: id}, function() {
        console.log(this.state.template_id)});
    }


    render() {
        // const templates = [{name:'template 1', id: 1}, {name: 'template 2', id: 2}, {name:'template 3', id: 3}, {name: 'template 4', id: 4}];
        
        const displayTemplates = this.props.templates.map(template => {
            return (
                <a onClick={() => this.handleClick(template.id)} class="list-group-item list-group-item-action" href={'#' + template.id} data-toggle="list" role="tab">
                    {template.name}
                </a>
            )});
        return (
            <div class="modal fade" id="loadTemplateModal" tabindex="-1" role="dialog" aria-labelledby="loadTemplateModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content loadTemplate">

                        {/* Modal Header */}
                        <div class="modal-header">
                            <h5 class="modal-title" id="loadTemplateModalLabel">Load Template</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div class="modal-body">
                                
                            {/* Templates */}
                            <div class="list-group" role="tablist">
                                {displayTemplates}
                            </div>

                        </div>
                        {/* Modal Footer */}
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button onClick={() => this.props.handleSelectTemplate(this.state.template_id)} type="button" class="btn btn-primary">Load Template</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}