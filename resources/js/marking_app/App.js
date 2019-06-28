import React from 'react';
import jsPDF from 'jspdf';
import Section from './components/Section';
import NewSectionModal from './components/modals/NewSectionModal';
import LoadTemplateModal from './components/modals/LoadTemplateModal';
import CreateTemplateModal from './components/modals/CreateTemplateModal';
import Loading from './components/Loading';

class App extends React.Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.addSection = this.addSection.bind(this);
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.handleSectionTextChange = this.handleSectionTextChange.bind(this);
        this.handleCompulsoryTextChange = this.handleCompulsoryTextChange.bind(this);
        this.handleAppendComment = this.handleAppendComment.bind(this);
        this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
        this.generatePDF = this.generatePDF.bind(this);
        this.state = {
            loading: false,
            template: null,
            content: (<h1>Nothing</h1>)
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
            $("#confirmationModal").removeClass("fade");
            $("#confirmationModal").modal('hide');
            $("#confirmationModal").addClass("fade");
        });
        this.setState(prevState => {
            prevState.template.sections.custom = prevState.template.sections.custom.filter(item => item.id !== id);
            return prevState;
        });

    }

    handleCreateClick(templateName) {
        this.setState({loadButtons: false});

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
            this.setState({template: this.templateFromDBFormat(data)});
            $("#createTemplateModal").removeClass("fade");
            $("#createTemplateModal").modal('hide');
            $("#createTemplateModal").addClass("fade");
        });
        
    }

    addSection(section) {
        this.setState(prevState => prevState.template.sections.custom.push(section));
    }

    templateFromDBFormat(dbTemplate) {
        return {
            name: dbTemplate.name,
            id: dbTemplate.id,
            sections: {
                custom: dbTemplate.sections ? dbTemplate.sections.map(s => {s.value = ''; return s;}) : [],
                compulsory: [
                    {
                        title: "3 Points Done Well",
                        value: ""
                    }, {
                        title: "3 Points To Improve",
                        value: ""
                    }
                ]
            }
        };
    }

    handleSelectTemplate(templateID) {
        fetch('/api/templates/' + templateID)
            .then(data => data.json())
            .then(data => {
                this.setState({
                    template: this.templateFromDBFormat(data),
                    templateLoaded: true,
                    loading: false
                });
                $("#loadTemplateModal").removeClass("fade");
                $("#loadTemplateModal").modal('hide');
                $("#loadTemplateModal").addClass("fade");
            });

        this.setState({loading: true});
    }

    handleSectionTextChange(id, value) {
        this.setState(prevState => {prevState.template.sections.custom.find(x => x.id == id).value = value; return prevState;});
    }

    handleCompulsoryTextChange(id, value) {
        this.setState(prevState => {prevState.template.sections.compulsory[id].value = value; return prevState;});
    }

    handleAppendComment(id, comment) {
        this.setState(prevState => {
            prevState.template.sections.custom.find(x => x.id == id).value += "<p>" + comment + "</p>";
            return prevState;
        });
    }

    generatePDF() {
        let val;
        for(let i = 0; i < 2; i++) {
            val = this.state.template.sections.compulsory[i];
            console.log("value of " + val.title + ' is ' + val.value);
            if(val.value === '') {
                console.log("compulsory");
                return;
            }
        }
        let html = "";
        const stateSections = this.state.template.sections;
        const outSections = stateSections.custom.concat(stateSections.compulsory);

        for (let i = 0; i < outSections.length; i++) {
            if (outSections[i].value != "") {
                html += "<h1>" + outSections[i].title + "</h1>";
                html += outSections[i].value;
            }
        }

        var doc = new jsPDF();
        doc.fromHTML(html, 15, 15, {
            'width': 170,
        });
        doc.save('sample-file.pdf');
        
    }

    renderSections() {
        const sections = this.state.template.sections;
        const customSections = sections.custom.map(section => { return (
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

        const compulsorySections = [];
        for (let i = 0; i < sections.compulsory.length; i++) {
            compulsorySections.push(
                <Section
                    key={-(i + 1)}
                    id={i}
                    title={sections.compulsory[i].title}
                    value={sections.compulsory[i].value}
                    compulsory={true}
                    handleSectionTextChange={this.handleCompulsoryTextChange}
                />
            );
        }
        return <div>{customSections}{compulsorySections}</div>;
    }

    render() {
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
                    (this.state.template &&
                        <div>
                            <h2>{this.state.template.name}</h2>
                            <button type="button" className="mb-3 btn btn-lg btn-block btn-light" onClick={() => $("#newSectionModal").modal('show')}>
                            + Add new section
                            </button>
                            <div className="sections">
                                {this.renderSections()}
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
                            <NewSectionModal template_id={this.state.template.id} addSection={this.addSection} data={this.state} />
                        </div>
                    )
                }
            </div>

                <LoadTemplateModal handleSelectTemplate={this.handleSelectTemplate}/>
                <CreateTemplateModal handleCreate={this.handleCreateClick}/>

            </div>
        );
    }
}

export default App;