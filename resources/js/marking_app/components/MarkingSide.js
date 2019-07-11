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
        this.deleteSection = this.deleteSection.bind(this);
        this.addSection = this.addSection.bind(this);
        this.handleSectionTextChange = this.handleSectionTextChange.bind(this);
        this.handleCompulsoryTextChange = this.handleCompulsoryTextChange.bind(this);
        this.handleAppendComment = this.handleAppendComment.bind(this);
        this.handleMarkingEnabledChange = this.handleMarkingEnabledChange.bind(this);
        this.handleMarkChange = this.handleMarkChange.bind(this);
        this.handleSubmitSection = this.handleSubmitSection.bind(this);
        this.handleCommentAdded = this.handleCommentAdded.bind(this);
        this.handleCommentChange = this.handleCommentChange.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.handleSaveAndLoad = this.handleSaveAndLoad.bind(this);
        this.generateHtmlOutput = this.generateHtmlOutput.bind(this);
        this.copyTextToClipboard = this.copyTextToClipboard.bind(this);
        this.generatePDF = this.generatePDF.bind(this);
        this.clearSectionsContent = this.clearSectionsContent.bind(this);
        this.state = {
            submitting: false,
            loading: this.props.loading,
            template: this.props.selectedTemplate,
            content: (<h1>Nothing</h1>),
            enableMarking: false,
            selectedExportType: 'pdf',
            loadingTemplates: false,
            templates: []
        };
    }

    deleteSection(id){
        
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

    loadTemplates() {
        this.setState({loadingTemplates: true});
        fetch('/api/templates?assignment_id=' + assignment_id)
            .then(data => data.json())   
            .then(data => this.setState({templates: data, loadingTemplates: false}));
    }

    addSection(section) {
        this.setState(prevState => prevState.template.sections.custom.push(section));
    }

    handleSubmitSection() {
        this.setState({submitting: true});
        const postBody = JSON.stringify({
            title: "Section Title",
            template_id: this.state.template.id
        });
        // Submit the section to the server
        fetch("/api/sections", {
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
                data.value = '';
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

    handleFormChange(event) {
        const {name, value, type, checked} = event.target;
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
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
        const methodToSave = this.state.selectedExportType == 'pdf' ? this.generatePDF : this.copyTextToClipboard;
        
        methodToSave(name).then(() => {
            this.clearSectionsContent();
            this.props.handleNextPdf();
            // if (this.props.isLastPdf) alert.success({text: "Session complete!", isConfirm: false});
        });
    }

    handleSelectedExportType(type) {
        this.setState({selectedExportType: type});
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

    generateHtmlOutput() {
        const isEmpty = htmlString => {
            const parser = new DOMParser();
            const { textContent } = parser.parseFromString(htmlString, "text/html").documentElement;
            return !textContent.trim();
        }
        let section;
        for(let i = 0; i < this.state.template.sections.compulsory.length; i++) {
            section = this.state.template.sections.compulsory[i];
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

        return html;
    }

    copyTextToClipboard() {
        function copyStringToClipboard (str) {
            var el = document.createElement('textarea');
            el.value = str;
            el.setAttribute('readonly', '');
            el.style = {position: 'absolute', left: '-9999px'};
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }

        return new Promise(next => {
            let html = this.generateHtmlOutput();
            html = html.replace(/<br>/g, "<br>\n");
            html = html.replace(/<p>/g, "<p>\n");
            html = html.replace(/<h1>/g, "<h1>\n\n");
            html = html.replace(/<h2>/g, "<h2>\n");
            html = html.replace(/<h3>/g, "<h3>\n");
            html = html.replace(/<li>/g, "<li>\n- ");
            function strip(html) {
                var tmp = document.createElement("DIV");
                tmp.innerHTML = html;
                return tmp.textContent || tmp.innerText || "";
            }
            copyStringToClipboard(strip(html).trim());
            this.props.alert.show({text: "Text copied to clipboard successfully!"});
            next();
        });
    }

    generatePDF(name) {
        return new Promise(next => {
            const html = this.generateHtmlOutput();
    
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
        const textWithMore = this.state.selectedExportType == 'pdf' ? 'Save and load next document' : 'Copy to clipboard and load next document';
        const textWithLast = this.state.selectedExportType == 'pdf' ? 'Save and finish' : 'Copy to clipboard and finish';
        if (this.props.pdfPointer >= 0) {
            return (<div>
                        <p>Save as:</p>
                        <div className="btn-group btn-group-toggle shadow-sm" data-toggle="buttons">
                            <label className="btn btn-light active" onClick={() => this.handleSelectedExportType("pdf")}>
                                <input
                                    type="radio"
                                    checked={this.state.selectedExportType === "pdf"}
                                    id="selectPositive"
                                    onChange={() => {}}
                                /> PDF
                            </label>
                            <label className="btn btn-light" onClick={() => this.handleSelectedExportType("text")}>
                                <input
                                    type="radio"
                                    checked={this.state.selectedExportType === "text"}
                                    id="addNegative"
                                    onChange={() => {}}
                                /> Text
                            </label>
                        </div>
                        <button type="button" className='btn btn-info btn-block shadow-sm' id="nextButton" onClick={this.handleSaveAndLoad}>{this.props.isLastPdf() ? textWithLast : textWithMore}</button>
                    </div>
                    )
        } else {
            return ("Load files you are marking in order to export your feedback")
        }
    }

    render() {
        const loadingNewSection = () => {this.state.submitting &&  <Loading text="Creating new section..." />};

        return (

            <div className="col-6">
                <div>
                    {this.state.loading
                    ?
                        <Loading text="Loading template..." />
                    :
                    this.state.template &&
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
                                
                                <div className="export text-center">
                                    {this.renderNextPdfButton()}
                                </div>
                                <button type="button" className='btn btn-danger btn-block shadow-sm' onClick={() => {if(confirm('All entered text will be deleted. Are you sure?')) this.clearSectionsContent()}} id="clearButton">Clear All</button>

                            </div>

                    
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withAlert()(MarkingSide);