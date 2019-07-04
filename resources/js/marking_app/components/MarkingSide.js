import React from 'react';
import jsPDF from 'jspdf';
import { withAlert } from 'react-alert'
import Section from './Section';
import NewSectionModal from './modals/NewSectionModal';
import LoadTemplateModal from './modals/LoadTemplateModal';
import CreateTemplateModal from './modals/CreateTemplateModal';
import Loading from './Loading';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { timingSafeEqual } from 'crypto';

class MarkingSide extends React.Component {
    constructor(props) {
        super(props);
        // this.handleClick = this.handleClick.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.addSection = this.addSection.bind(this);
        this.handleCreatedNewTemplate = this.handleCreatedNewTemplate.bind(this);
        this.handleSectionTextChange = this.handleSectionTextChange.bind(this);
        this.handleCompulsoryTextChange = this.handleCompulsoryTextChange.bind(this);
        this.handleAppendComment = this.handleAppendComment.bind(this);
        this.handleSelectTemplate = this.handleSelectTemplate.bind(this);
        this.handleMarkingEnabledChange = this.handleMarkingEnabledChange.bind(this);
        this.handleMarkChange = this.handleMarkChange.bind(this);
        this.handleSubmitSection = this.handleSubmitSection.bind(this);
        this.handleCommentAdded = this.handleCommentAdded.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.handleSaveAndLoad = this.handleSaveAndLoad.bind(this);
        this.generatePDF = this.generatePDF.bind(this);
        this.clearSectionsContent = this.clearSectionsContent.bind(this);
        this.state = {
            submitting: false,
            loading: false,
            template: null,
            content: (<h1>Nothing</h1>),
            enableMarking: false,
            selectedExportType: 'pdf'
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
            this.props.alert.success({text: "Removed section '" + data + "'"});
        });
        this.setState(prevState => {
            prevState.template.sections.custom = prevState.template.sections.custom.filter(item => item.id !== id);
            return prevState;
        });

        

    }

    addSection(section) {
        this.setState(prevState => prevState.template.sections.custom.push(section));
    }

    handleSubmitSection() {
        this.setState({submitting: true});
        const postBody = JSON.stringify({
            title: "Section Title",
            template_id: this.state.template.id,
            positiveComments: [],
            negativeComments: [],
            marking_scheme: ''
        });
        console.log(postBody)
        // Submit the section to the server
        fetch("/api/sections/new-section", {
            method: 'post',
            body: postBody,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            }
        })
            .then(data => data.json())
            .then(data => {
                console.log(data);
                this.addSection(data);
                this.setState({submitting: false});

                this.scrollToElement("#section" + data.id);
                
            });
    }

    scrollToElement(element_id) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(element_id).offset().top - 15
        }, 1000);
    }

    templateFromDBFormat(dbTemplate) {
        return {
            name: dbTemplate.name,
            id: dbTemplate.id,
            totalMark: 0,
            sections: {
                custom: dbTemplate.sections ? dbTemplate.sections.map(s => {
                    s.value = '';
                    s.mark = 0;
                    s.negativeComments.map(c => {c.added = false; return c});
                    s.positiveComments.map(c => {c.added = false; return c});
                    s.marking_scheme = '';
                    return s;
                }) : [],
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

    handleFormChange(event) {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    handleSelectTemplate(templateID) {
        fetch('/api/templates/' + templateID)
            .then(data => data.json())
            .then(data => {
                this.setState( {
                    template: this.templateFromDBFormat(data),
                    loading: false
                });
            });

        this.setState({loading: true});
        $("#loadTemplateModal").removeClass("fade");
        $("#loadTemplateModal").modal('hide');
        $("#loadTemplateModal").addClass("fade");
    }

    handleCreatedNewTemplate(data) {
        this.setState({template: this.templateFromDBFormat(data)});
    }

    handleSectionTextChange(id, value) {
        this.setState(prevState => {prevState.template.sections.custom.find(x => x.id == id).value = value; return prevState;});
    }

    handleCompulsoryTextChange(id, value) {
        this.setState(prevState => {prevState.template.sections.compulsory[id].value = value; return prevState;});
    }

    handleAppendComment(id, comment) {
        this.setState(prevState => {
            const section = prevState.template.sections.custom.find(x => x.id == id);
            // Check if the section is empty after inputting values
            if (section.value == "<p><br></p>") {
                section.value = "<p>" + comment + "</p>";
            } else {
                section.value += "<p>" + comment + "</p>";
            }
            
            return prevState;
        });
    }

    handleMarkingEnabledChange() {
        this.setState((prevState) => Object.assign(prevState, {enableMarking: !prevState.enableMarking}));
    }

    handleMarkChange(sectionID, markInput) {
        let mark = markInput.value;
        if(mark == null || (0 <= mark && mark <= 100)) {
            $($(markInput)[0]).tooltip('hide');
            this.setState(prevState => {
                prevState.template.sections.custom.find(x => x.id == sectionID).mark = mark;
                prevState.template.totalMark = prevState.template.sections.custom.reduce((a, s) => (a + parseFloat(s.mark || 0)), 0);
                return prevState;
            });
        } else {
            $($(markInput)[0]).tooltip('show');
        }
        
    }

    handleCommentAdded(sectionID, commentID, type) {
        this.updateComment(sectionID, commentID, type, c => {c.added = true; return c});
    }

    handleCommentChange(sectionID, commentID, type, text) {
        this.updateComment(sectionID, commentID, type, c => {c.text = text; c.added = false; return c});
    }

    handleSaveAndLoad() {
        let name = this.props.pdfsSelected[this.props.pdfPointer].name;
        this.generatePDF(name).then(() => {
            this.clearSectionsContent();
            this.props.handleNextPdf();
            // if (this.props.isLastPdf) alert.success({text: "Session complete!", isConfirm: false});
        });
    }

    updateComment(sectionID, commentID, type, f) {
        this.setState(prevState => {
            let section = prevState.template.sections.custom.find(section => section.id == sectionID);
            let comments = (type == 'positive') ? section.positiveComments : section.negativeComments;
            let comment = comments.find(c => c.id == commentID);
            comment = f(comment);
            return prevState;
        });
    }

    generatePDF(name) {
        return new Promise(next => {
            const isEmpty = htmlString => {
                const parser = new DOMParser();
                const { textContent } = parser.parseFromString(htmlString, "text/html").documentElement;
                return !textContent.trim();
            }
            let section;
            for(let i = 0; i < this.state.template.sections.compulsory.length; i++) {
                section = this.state.template.sections.compulsory[i];
                console.log("value of " + section.title + ' is ' + section.value);
                if(isEmpty(section.value)) {
                    this.props.alert.error({text: "Entering " + section.title + " is compulsory!"});
                    return;
                }
            }
            let html = "";
            if (this.state.enableMarking) {
                html += "<h3>Total mark: " + this.state.template.totalMark + "</h3>";
            }
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
            doc.save(name);
            next();
        });
    }

    clearSectionsContent() {
        this.setState(prevState => {
            const sections = prevState.template.sections;
            sections.compulsory.forEach(s => s.value = "");
            sections.custom.forEach(s => s.value = "");
            sections.custom.forEach(custom => {
                custom.positiveComments.forEach(c => c.added = false);
                custom.negativeComments.forEach(c => c.added = false);
            });
            // prevState = prevState.template.sections.custom.map(s => s.positiveComments.map(c => Object.assign(c, {added: false})));
            // prevState = prevState.template.sections.custom.map(s => s.negativeComments.map(c => Object.assign(c, {added: false})));
            return prevState;
        })
    }

    renderSections() {
        const sections = this.state.template.sections;
        const customSections = sections.custom.map(section => { return (
            <Section
                handleDeleteClick={this.deleteSection}
                handleSectionTextChange={this.handleSectionTextChange}
                handleAppendComment={this.handleAppendComment}
                handleCommentAdded={this.handleCommentAdded}
                handleCommentChange={this.handleCommentChange}
                handleMarkChange={this.handleMarkChange}
                id={section.id}
                mark={section.mark}
                key={section.id}
                title={section.title}
                value={section.value}
                posComments={section.positiveComments}
                negComments={section.negativeComments}
                template_id={this.state.template.id}
                enableMarking={this.state.enableMarking}
                marking_scheme={section.marking_scheme}
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

    renderNextPdfButton() {
        if (this.props.pdfPointer >= 0) {
            return <button type="button" className='btn btn-success' id="nextButton" onClick={this.handleSaveAndLoad}>{this.props.isLastPdf() ? 'Save and finish' : 'Save and Load Next Document'}</button>
        }
    }

    render() {
        const loadingNewSection = () => {this.state.submitting &&  <Loading text="Creating new section..." />};

        return (
            <div className="col-6">
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
                        // Template
                        <div className="template shadow-sm">
                            {/* Template title */}
                            <h2 className="templateTitle text-center">{this.state.template.name}</h2>
                            <hr></hr>

                            <div className="templateBody">
                                {/* Toggle marking switch */}
                                <div className="markingSwitch">
                                    <p className="float-left">Enable Marking</p>
                                    <div className="material-switch float-right">
                                        <input id="enableMarking" name="someSwitchOption001" type="checkbox" className={this.state.enableMarking ? 'checked' : ''} onChange={this.handleMarkingEnabledChange}/>
                                        {/* {console.log($("#enableMarking").val())} */}
                                        <label htmlFor="enableMarking" className="bg-primary"></label>
                                    </div>
                                </div>

                                {/* Total Mark Display */}
                                {this.state.enableMarking &&
                                    <div className="totalMark">
                                        <p className="float-left">Total Mark</p>
                                        <p className="float-right">{this.state.template.totalMark}</p>
                                    </div>  
                                }
                                                   
                            
                                {/* Add new section button */}
                                <button 
                                    type="button" 
                                    className="mb-3 btn btn-lg btn-block btn-light shadow-sm" 
                                    // onClick={() => $("#newSectionModal").modal('show')}
                                    onClick={this.handleSubmitSection}
                                    >
                                    + Add new section
                                </button>

                                {loadingNewSection()}

                                {/* Template sections */}
                                <div className="sections">
                                    {this.renderSections()}
                                </div>
                            </div>

                            {/* Buttons to export feedback */}
                            <div className="save">
                                <button type="button" className='btn btn-danger' onClick={() => {if(confirm('All entered text will be deleted. Are you sure?')) this.clearSectionsContent()}} id="clearButton">Clear All</button>
                                {this.renderNextPdfButton()}
                                Save as:
                                <ToggleButtonGroup type="radio" name="selectedExportType" defaultValue={'pdf'} onChange={() => console.log('change')}>
                                    <ToggleButton value={'pdf'}>PDF</ToggleButton>
                                    <ToggleButton value={'text'}>Text</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                            {/* <NewSectionModal template_id={this.state.template.id} addSection={this.addSection} data={this.state} /> */}
                        </div>
                    )
                }
            </div>

                <LoadTemplateModal handleSelectTemplate={this.handleSelectTemplate}/>
                <CreateTemplateModal handleCreate={this.handleCreatedNewTemplate}/>

            </div>
        );
    }
}

export default withAlert()(MarkingSide);