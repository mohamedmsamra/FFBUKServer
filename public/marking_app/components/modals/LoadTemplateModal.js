class LoadTemplateModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            template: {}
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(temp) {
        this.setState({template: temp});
    }

    // as_json(){
    // super.merge(('created_at') => self.created_at.strftime("%d %b %Y"));
    // }
  

    render() {
        // const templates = [{name:'template 1', id: 1}, {name: 'template 2', id: 2}, {name:'template 3', id: 3}, {name: 'template 4', id: 4}];
        
        const displayTemplates = this.props.templates.map(template => {
            return (
                <a onClick={() => this.handleClick(template)}  onDoubleClick={() => {this.handleClick(template); this.props.handleSelectTemplate(this.state.template)}} class="list-group-item list-group-item-action" href={'#' + template.id} data-toggle="list" role="tab">
                    {template.name}
                    <p className="float-right date"><span>{template.created_at}</span></p>
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
                            <button onClick={() => this.props.handleSelectTemplate(this.state.template)} type="button" class="btn btn-primary">Load Template</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}