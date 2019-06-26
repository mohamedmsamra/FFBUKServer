import React from 'react';

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
                <a onClick={() => this.handleClick(template)}  onDoubleClick={() => {this.handleClick(template); this.props.handleSelectTemplate(this.state.template)}} className="list-group-item list-group-item-action" href={'#' + template.id} key={template.id} data-toggle="list" role="tab">
                    {template.name}
                    <p className="float-right date"><span>{template.created_at}</span></p>
                </a>
            )});
        return (
            <div className="modal fade" id="loadTemplateModal" tabIndex="-1" role="dialog" aria-labelledby="loadTemplateModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content loadTemplate">

                        {/* Modal Header */}
                        <div className="modal-header">
                            <h5 className="modal-title" id="loadTemplateModalLabel">Load Template</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body">
                                
                            {/* Templates */}
                            <div className="list-group" role="tablist">
                                {displayTemplates}
                            </div>

                        </div>
                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button onClick={() => this.props.handleSelectTemplate(this.state.template)} type="button" className="btn btn-primary">Load Template</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LoadTemplateModal;