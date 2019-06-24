
class App extends React.Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.state = {
            loading: true,
            sections: [],
            loadButtons: true 
        };
    }

    componentDidMount() {
        fetch('/api/templates/1')
            .then(data => data.json())
            .then(data => this.setState({sections: data.sections, loading: false}));
    }

    deleteSection(id){
        let items = this.state.sections.filter(item => item.id !== id);
        this.setState({sections: items});
    }

    // handleClick() {
    //     const newItem = {
    //         'id': Date.now(),
    //         'title': 'Section Title',
    //         positiveComments: [{text: 'placeholder positive comment', added: false}, {text: 'placeholder positive comment 2', added: false}],
    //         negativeComments: [{text: 'placeholder negative comment', added: false}, {text: 'placeholder negative comment 2', added: false}]
    //     };
    //     this.setState(state => ({
    //         sections: state.sections.concat(newItem)
    //     }));
    // }

    handleCreateClick() {
        this.setState({loadButtons: false});
    }

    render() {
        const sectionsToRender = this.state.sections.map(section => <Section handleDeleteClick={this.deleteSection} id={section.id} title={section.title} posComments={section.positiveComments} negComments={section.negativeComments}/>)
        return (
            <div>

                <div className="markingSide">

                </div>
                <div className={this.state.loadButtons ? 'loadCreateBtns' : 'loadCreateBtns d-none'}>
                    <button type="button" className="btn btn-outline-primary btn-lg">Load Template</button>
                    <button onClick={this.handleCreateClick} type="button" className="btn btn-outline-success btn-lg">Create Template</button>
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
            </div>
        );
    }
}