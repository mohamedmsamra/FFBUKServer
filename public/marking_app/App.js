
// Placeholder Sections
let section1 = {
    'id' : '1',
    'title' : 'section title',
    positiveComments : [
        'comment 1',
        'comment 2'
    ],
    negativeComments : [
        'neg comment 1',
        'neg comment 2'
    ]
};

let section2 = {
    'id' : '2',
    'title' : 'section title 2',
    positiveComments : [
        {text: 'comment 11', added: false},
        'comment 21'
    ],
    negativeComments : [
        'neg comment 11',
        'neg comment 21'
    ]
};

let sections = [];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.state = {sections: sections};
    }

    deleteSection(id){
        let items = this.state.sections.filter(item => item.id !== id);
        this.setState({sections: items});
    }

    handleClick() {
        const newItem = {
            'id': Date.now(),
            'title': 'Section Title',
            positiveComments: [{text: 'placeholder positive comment', added: false}, {text: 'placeholder positive comment 2', added: false}],
            negativeComments: [{text: 'placeholder negative comment', added: false}, {text: 'placeholder negative comment 2', added: false}]
          };
          this.setState(state => ({
            sections: state.sections.concat(newItem)
          }));    
        }

    render() {
        const sectionsToRender = this.state.sections.map(section => <Section handleDeleteClick={this.deleteSection} id={section.id} title={section.title} posComments={section.positiveComments} negComments={section.negativeComments}/>)

        return (
            <div class="markingSide">
                <button onClick={this.handleClick} type="button" class="mb-3 btn btn-lg btn-block btn-light">Add Section</button>
                <div class="sections">
                    {sectionsToRender}
                    <Section title="3 Points Done Well" hasComments={false} removeable={false}/>
                    <Section title="3 Points To Impove" hasComments={false} removeable={false}/>
                </div>
            
            </div>
        );
    }
}