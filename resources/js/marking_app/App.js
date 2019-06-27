import React from 'react';
import jsPDF from 'jspdf';
import Section from './components/Section';
import NewSectionModal from './components/modals/NewSectionModal';
import LoadTemplateModal from './components/modals/LoadTemplateModal';
import CreateTemplateModal from './components/modals/CreateTemplateModal';
import Loading from './components/Loading';
import Comment from './components/Comment.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.setTemplate = this.setTemplate.bind(this);
        this.loadTemplate = this.loadTemplate.bind(this);
        this.addSection = this.addSection.bind(this);
        this.handleSectionTextChange = this.handleSectionTextChange.bind(this);
        this.handleAppendComment = this.handleAppendComment.bind(this);
        this.generatePDF = this.generatePDF.bind(this);
        this.state = {
            loading: false,
            templates: [],
            sections: [],
            templateLoaded: false,
            action: '',
            template: {},
            content: (<h1>Nothing</h1>),
            sectionValues: []
        };
    }

    deleteSection(id){
        // let idToRemove = this.state.commentID;
        fetch('/api/sections/' + id, {
            method: 'delete',
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
            $("#confirmationModal").removeClass("fade");
            $("#confirmationModal").modal('hide');
            $("#confirmationModal").addClass("fade");
        });
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
        $("#loadTemplateModal").removeClass("fade");
        $("#loadTemplateModal").modal('hide');
        $("#loadTemplateModal").addClass("fade");
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
            .then(data => this.setState({sections: data.sections.map(s => {s.value = ''; return s;}), loading: false}))  
            .then()
            .then(() => {
                this.setState({loading: false, templateLoaded: true});
            });

        // const sectionsToRender = this.state.sections.map(section => <Section handleDeleteClick={this.deleteSection} id={section.id} title={section.title} posComments={section.positiveComments} negComments={section.negativeComments}/>)
        this.setState({loading: true});
        
    }

    handleSectionTextChange(id, value) {
        this.setState(prevState => {prevState.sections.find(x => x.id == id).value = value; return prevState;});
    }

    handleAppendComment(id, comment) {
        this.setState(prevState => {
            prevState.sections.find(x => x.id == id).value += "<p>" + comment + "</p>";
            return prevState;
        });
    }

    generatePDF() {
        let html = "";
        const sections = this.state.sections;
        for (let i = 0; i < sections.length; i++) {
            if (sections[i].value != "") {
                html += "<h1>" + sections[i].title + "</h1>";
                html += sections[i].value;
            }
        }

        var doc = new jsPDF();
        doc.fromHTML(html, 15, 15, {
            'width': 170,
        });
        doc.save('sample-file.pdf');
    }

    render() {
        const sectionsToRender = this.state.sections.map(section => { return (
            <Section
                handleDeleteClick={this.deleteSection}
                handleSectionTextChange={this.handleSectionTextChange}
                handleAppendComment={this.handleAppendComment}
                id={section.id}
                key={section.id}
                title={section.title}
                value={section.value}
                posComments={section.positiveComments}
                negComments={section.negativeComments}
                template_id={this.state.template.id}
            />
        )});

        return (
            <div>
                <div className="loadCreateBtns">
                    <button type="button" className="btn btn-outline-primary" onClick={() => $("#loadTemplateModal").modal('show')}>Load Template</button>
                    <button onClick={() => $("#createTemplateModal").modal('show')} type="button" className="btn btn-outline-success">Create New Template</button>
                </div>
                
                <div>
                    {this.state.loading
                    ?
                        <Loading text="Loading template..." />
                    :
                        this.state.templateLoaded &&
                            (<div>
                                <h2>{this.state.template.name}</h2>
                                <button type="button" className="mb-3 btn btn-lg btn-block btn-light" onClick={() => $("#newSectionModal").modal('show')}>
                                + Add new section
                                </button>
                                <div className="sections">
                                    {sectionsToRender}
                                    <Section title="3 Points Done Well" hasComments={false} removeable={false}/>
                                    <Section title="3 Points To Impove" hasComments={false} removeable={false}/>
                                </div>

                                <div className="save">
                                    <button type="button" className='btn btn-danger' onClick={() => {if(confirm('All entered text will be deleted. Are you sure?')) setup()}} id="clearButton">Clear All</button>
                                    <button type="button" className='btn btn-success' id="nextButton" onClick={this.generatePDF}>Save and Load Next Document</button>
                                    Save as:
                                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                        <label className="btn btn-secondary active">
                                            <input type="radio" name="options" id="option1" autoComplete="off" defaultChecked /> PDF
                                        </label>
                                        <label className="btn btn-secondary">
                                            <input type="radio" name="options" id="option2" autoComplete="off" /> Text
                                        </label>
                                    </div>
                                </div>
                                
                            </div>)
                    }
                </div>

                <NewSectionModal addSection={this.addSection} data={this.state} />
                <LoadTemplateModal handleSelectTemplate={this.setTemplate}/>
                <CreateTemplateModal handleSubmit={this.handleCreateClick}/>
                
            </div>
        );
    }
}

export default App;