
class App extends React.Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.setTemplate = this.setTemplate.bind(this);
        this.state = {
            loading: true,
            templates: [],
            sections: [],
            loadButtons: true,
            action: '',
            template_id: 1
        };
    }

    componentDidMount() {
        fetch('/api/templates')
            .then(data => data.json())   
            .then(data => this.setState({templates: data}));

        fetch('/api/templates/' + this.state.template_id)
            .then(data => data.json())
            .then(data => this.setState({sections: data.sections, loading: false}));           
    }



    setTemplate(id) {
        this.setState({template_id: id, action: 'load'}, function() {
            console.log('Template selected in app has id: ' + this.state.template_id);
        });
        this.loadTemplate();
    }

    deleteSection(id){
        let items = this.state.sections.filter(item => item.id !== id);
        this.setState({sections: items});
    }

    handleCreateClick() {
        post()
        // this.setState({loadButtons: false, action: 'create'}, function () {
        //     console.log(this.state.action)});
    }

    loadTemplate(templateId) {
        console.log(templateId);
        console.log(this.state.templates)
        let template = this.state.templates.find(temp => temp.id === templateId);
        let content = (
            <h1>{template.name}</h1>
        );
    }


    render() {
        const sectionsToRender = this.state.sections.map(section => <Section handleDeleteClick={this.deleteSection} id={section.id} title={section.title} posComments={section.positiveComments} negComments={section.negativeComments}/>)
        const templatesTitles = this.state.templates.map(template => <p>{template.name}</p>);
        return (
            <div>

                <div className="markingSide">
                
                </div>
                <div className={this.state.loadButtons ? 'loadCreateBtns' : 'loadCreateBtns d-none'}>
                    <button type="button" className="btn btn-outline-primary btn-lg" data-toggle="modal" data-target="#loadTemplateModal">Load Template</button>
                    <button onClick={this.handleCreateClick} type="button" className="btn btn-outline-success btn-lg">Create Template</button>
                </div>

                <div>
                    {templatesTitles}
                </div>
                

                <div class={this.state.loadButtons ? 'markingSide d-none' : 'markingSide'}>
                    {this.state.loading
                    ?
                        <div className="loading">
                            <img src="/svg/loading.svg"></img>
                            <p>Loading...</p>
                        </div>
                    :
                        <div>
                            <button type="button" class="mb-3 btn btn-lg btn-block btn-light" data-toggle="modal" data-target="#newSectionModal">
                            + Add new section
                            </button>
                            <div class="sections">
                                {sectionsToRender}
                                <Section title="3 Points Done Well" hasComments={false} removeable={false}/>
                                <Section title="3 Points To Impove" hasComments={false} removeable={false}/>
                            </div>
                        </div>
                    }
                </div>
                <NewSectionModal data={this.state} />
                <LoadTemplateModal templates={this.state.templates} handleSelectTemplate={this.setTemplate}/>
            </div>
        );
    }
}