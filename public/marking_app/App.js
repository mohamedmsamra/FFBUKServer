
class App extends React.Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.setTemplate = this.setTemplate.bind(this);
        this.loadTemplate = this.loadTemplate.bind(this);
        this.addSection = this.addSection.bind(this);
        this.state = {
            loading: false,
            templates: [],
            sections: [],
            templateLoaded: false,
            action: '',
            template: {},
            content: (<h1>Nothing</h1>)
        };
    }

    componentDidMount() {
        fetch('/api/templates')
            .then(data => data.json())   
            .then(data => this.setState({templates: data}));

        fetch('/api/templates/' + this.state.template.id)
            .then(data => data.json())
            .then(data => this.setState({sections: data.sections, loading: false}));           
    }

    deleteSection(id){
        let items = this.state.sections.filter(item => item.id !== id);
        this.setState({sections: items});
    }

    handleCreateClick(templateName) {
        // post()
        this.setState({loadButtons: false, action: 'create'}, function () {
            console.log(this.state.action)});

        fetch('/api/templates', {
            method: 'post',
            body: JSON.stringify({assignment_id: assignment_id, name: templateName}),
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
            this.setTemplate(data.id);
            $("#createTemplateModal").removeClass("fade");
            $("#createTemplateModal").modal('hide');
            $("#createTemplateModal").addClass("fade");
        });
        
    }

    setTemplate(temp) {
        this.setState({template: temp, action: 'load'}, function() {
            this.loadTemplate();
        });
    }

    addSection(section) {
        this.setState(prevState => prevState.sections.push(section));
    }

    loadTemplate() {
        // console.log(templateId);
        // console.log(this.state.templates)
        console.log('Template selected in app has id: ' + this.state.template.id);
        fetch('/api/templates/' + this.state.template.id)
            .then(data => data.json())
            .then(data => this.setState({sections: data.sections, loading: false}))  
            .then()
            .then(() => {
                $("#loadTemplateModal").removeClass("fade");
                $("#loadTemplateModal").modal('hide');
                $("#loadTemplateModal").addClass("fade");
                this.setState({loading: false, templateLoaded: true});
            });

        // const sectionsToRender = this.state.sections.map(section => <Section handleDeleteClick={this.deleteSection} id={section.id} title={section.title} posComments={section.positiveComments} negComments={section.negativeComments}/>)
        this.setState({loading: true});
        
    }


    render() {
        const sectionsToRender = this.state.sections.map(section => <Section handleDeleteClick={this.deleteSection} id={section.id} title={section.title} posComments={section.positiveComments} negComments={section.negativeComments}/>)

        return (
            <div>
                {/* <div className="markingSide">
                
                </div> */}
                <div className="loadCreateBtns">
                    <button type="button" className="btn btn-outline-primary btn-lg" onClick={() => $("#loadTemplateModal").modal('show')}>Load Template</button>
                    <button onClick={() => $("#createTemplateModal").modal('show')} type="button" className="btn btn-outline-success btn-lg">Create Template</button>
                </div>
                {/* // onClick={this.handleCreateClick} */}
                
                <div>
                    {this.state.loading
                    ?
                        <Loading text="Loading..." />
                    :
                        this.state.templateLoaded &&
                            (<div>
                                <h2>{this.state.template.name}</h2>
                                <button type="button" class="mb-3 btn btn-lg btn-block btn-light" onClick={() => $("#newSectionModal").modal('show')}>
                                + Add new section
                                </button>
                                <div class="sections">
                                    {sectionsToRender}
                                    <Section title="3 Points Done Well" hasComments={false} removeable={false}/>
                                    <Section title="3 Points To Impove" hasComments={false} removeable={false}/>
                                </div>
                            </div>)
                    }
                </div>

                <NewSectionModal addSection={this.addSection} data={this.state} />
                <LoadTemplateModal templates={this.state.templates} handleSelectTemplate={this.setTemplate}/>
                <CreateTemplateModal handleSubmit={this.handleCreateClick}/>
            </div>
        );
    }
}