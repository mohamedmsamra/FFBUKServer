import React from 'react';
import jsPDF from 'jspdf';
import { withAlert } from 'react-alert'
import Section from './Section';
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
        this.handleSectionTitleChange = this.handleSectionTitleChange.bind(this);
        this.updateComment = this.updateComment.bind(this);
        this.handleSaveAndLoad = this.handleSaveAndLoad.bind(this);
        this.handleFinishEarly = this.handleFinishEarly.bind(this);
        this.generateHtmlOutput = this.generateHtmlOutput.bind(this);
        this.copyTextToClipboard = this.copyTextToClipboard.bind(this);
        this.generatePDF = this.generatePDF.bind(this);
        this.clearSectionsContent = this.clearSectionsContent.bind(this);
        this.assignmentFromDBFormat = this.assignmentFromDBFormat.bind(this);
        this.fetchAssignment = this.fetchAssignment.bind(this);
        this.handleSaveSession = this.handleSaveSession.bind(this);
        this.state = {
            submitting: false,
            loading: this.props.loading,
            assignment: null,
            content: (<h1>Nothing</h1>),
            enableMarking: false,
            selectedExportType: 'pdf'
        };
    }

    componentDidMount() {
        this.setState({start: Date.now()});
        this.fetchAssignment();
    }

    fetchAssignment() {
        fetch('/api/assignments/' + assignment_id)
            .then(data => data.json())   
            .then(data => {this.setState({assignment: this.assignmentFromDBFormat(data), loading: false})});
    }

    assignmentFromDBFormat(dbAssignment) {
        return {
            name: dbAssignment.name,
            id: dbAssignment.id,
            totalMark: 0,
            permissionLevel: dbAssignment.permissionLevel,
            sections: {
                custom: dbAssignment.sections ? dbAssignment.sections.map(this.sectionFromDBFormat) : [],
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

    sectionFromDBFormat(s) {
        s.value = '';
        s.mark = 0;

        // Only add public comments and comments private to this user
        // s.negativeComments = s.negativeComments ? s.negativeComments.filter(c => (c.private_to_user === null) || USER_ID === c.private_to_user) : [];
        // s.positiveComments = s.positiveComments ? s.positiveComments.filter(c => (c.private_to_user === null) || USER_ID === c.private_to_user) : [];
        
        s.negativeComments = s.negativeComments ? s.negativeComments.map(c => {c.private_to_user === null ? c.visibility = 'public' : c.visibility = 'private'; c.added = false; return c}) : [];
        s.positiveComments = s.positiveComments ? s.positiveComments.map(c => {c.private_to_user === null ? c.visibility = 'public' : c.visibility = 'private'; c.added = false; return c}) : [];
  
        return s;
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
            this.props.alert.success({text: "Removed section '" + data + "'"});
        });
        this.setState(prevState => {
            prevState.assignment.sections.custom = prevState.assignment.sections.custom.filter(item => item.id !== id);
            return prevState;
        });
    }

    addSection(section) {
        this.setState(prevState => prevState.assignment.sections.custom.push(section));
    }

    handleSubmitSection() {
        this.setState({submitting: true});
        const postBody = JSON.stringify({
            title: "Section Title",
            assignment_id: this.state.assignment.id
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
                this.addSection(this.sectionFromDBFormat(data));
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
        this.setState(prevState => {prevState.assignment.sections.custom.find(x => x.id == id).value = value; return prevState;});
    }

    handleCompulsoryTextChange(id, value) {
        this.setState(prevState => {prevState.assignment.sections.compulsory[id].value = value; return prevState;});
    }

    handleAppendComment(id, comment) {
        this.setState(prevState => {
            const section = prevState.assignment.sections.custom.find(x => x.id == id);
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
                prevState.assignment.sections.custom.find(x => x.id == sectionID).mark = mark;
                prevState.assignment.totalMark = prevState.assignment.sections.custom.reduce((a, s) => (a + parseFloat(s.mark || 0)), 0);
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

    handleSaveSession(words, seconds) {
        fetch('/api/marking-sessions', {
			method: 'post',
			body: JSON.stringify({
				assignment_id: this.state.assignment.id,
				words: words,
				time: seconds
			}),
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
        });
    }

    handleSaveAndLoad() {
        let wordCount = 0;
        // Check if compulsory fields are empty
        const isEmpty = htmlString => {
            const parser = new DOMParser();
            const { textContent } = parser.parseFromString(htmlString, "text/html").documentElement;
            return textContent.trim();
        }
        let section;
        let strippedText;
        for(let i = 0; i < this.state.assignment.sections.compulsory.length; i++) {
            section = this.state.assignment.sections.compulsory[i];
            strippedText = isEmpty(section.value);
            if(!strippedText) {
                this.props.alert.error({text: "Entering " + section.title + " is compulsory!"});
                return;
            } else {
                wordCount += this.countWords(strippedText);
            }
        }

        for(let i = 0; i < this.state.assignment.sections.custom.length; i++) {
            section = this.state.assignment.sections.custom[i];
            strippedText = isEmpty(section.value);
            if(!strippedText) {
                console.log(section.title + " is empty")
            } else {
                wordCount += this.countWords(strippedText);
            }
        }

        let name = this.props.pdfsSelected[this.props.pdfPointer].name;
        const methodToSave = this.state.selectedExportType == 'pdf' ? this.generatePDF : this.copyTextToClipboard;

        let time = (Date.now() -this.state.start ) / 1000;
        
        this.handleSaveSession(wordCount, time);
        methodToSave(name).then(() => {
            if (this.state.enableMarking) this.props.setPdfMark(this.state.assignment.totalMark);
            
            this.clearSectionsContent();
            if (this.props.isLastPdf()) {
                // Generate PDF with marks
                // No PDF will be generated if no assignments are marked
                this.generateMarksPDF(this.props.pdfsSelected.map(pdf => ({name: pdf.name, mark: pdf.mark})));
            }
            this.props.handleNextPdf();
            this.setState({start: Date.now()});
            // if (this.props.isLastPdf) alert.success({text: "Session complete!", isConfirm: false});
        });
    }

    handleFinishEarly() {
        this.props.alert.show({
            text: "Discard upcoming PDFs from session?",
            onConfirm: () => {
                this.props.finishEarly();
            }
        });
    }

    handleSelectedExportType(type) {
        this.setState({selectedExportType: type});
    }

    handleSectionTitleChange(id, title) {
        this.setState(prevState => {
            prevState.assignment.sections.custom.find(section => section.id == id).title = title;
            return prevState;
        })
    }

    updateComment(sectionID, commentID, type, f) {
        this.setState(prevState => {
            let section = prevState.assignment.sections.custom.find(section => section.id == sectionID);
            let comments = (type == 'positive') ? section.positiveComments : section.negativeComments;
            let comment = comments.find(c => c.id == commentID);
            comment = f(comment);
            return prevState;
        });
    }

    generateHtmlOutput() {
        let html = "";
        const stateSections = this.state.assignment.sections;
        const outSections = stateSections.custom.concat(stateSections.compulsory);

        for (let i = 0; i < outSections.length; i++) {
            if (outSections[i].value != "") {
                html += "<h1>" + outSections[i].title + "</h1>";
                html += outSections[i].value;
            }
        }

        return html;
    }

    countWords(str) {
        //exclude  start and end white-space
        str = str.replace(/(^\s*)|(\s*$)/gi,"");
        //convert 2 or more spaces to 1  
        str = str.replace(/[ ]{2,}/gi," ");
        // exclude newline with a start spacing  
        str = str.replace(/\n /,"\n");

        return str.split(' ').length;
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

    generateMarksPDF(marks) {
        return new Promise(next => {
            const rows = marks.reduce((a, m) => a + (m.mark >= 0 ? "<tr><td>" + m.name + "</td><td>" + m.mark + "</td></tr>" : ''), '');
            if (rows.length > 0) {
                this.props.alert.info({
                    text: "Export marks of marked PDF? If cancelled, marks will be lost.",
                    onConfirm: () => {
                        const html = [
                            `<h3>Marks for ${this.state.assignment.name}</h3>`,
                            `<p>Generated at ${this.props.formatDate(new Date())}</p>`,
                            `<p>Marked by ${USER_NAME}</p>`,
                            `<table style='font-size: 11px'><tr><th>Name</th><th>Marks</th></tr>${rows}</table>`,
                        ].reduce((a, c) => a + c, '');
                        console.log(rows);
                        var doc = new jsPDF();
                        doc.fromHTML(html, 15, 15, {
                            'width': 170,
                        });
                        doc.save('marks.pdf');
                        if (next) next();
                    }
                });
            }
        });
    }

    clearSectionsContent() {
        this.setState(prevState => {
            const sections = prevState.assignment.sections;
            sections.compulsory.forEach(s => s.value = "");
            sections.custom.forEach(s => {s.value = ""; s.mark = 0;});
            sections.custom.forEach(custom => {
                custom.positiveComments.forEach(c => c.added = false);
                custom.negativeComments.forEach(c => c.added = false);
            });
            prevState.assignment.totalMark = 0;
            // prevState = prevState.assignment.sections.custom.map(s => s.positiveComments.map(c => Object.assign(c, {added: false})));
            // prevState = prevState.assignment.sections.custom.map(s => s.negativeComments.map(c => Object.assign(c, {added: false})));
            return prevState;
        })
    }

    renderSections() {
        const sections = this.state.assignment.sections;
        const customSections = sections.custom.map(section => { return (
            <Section
                handleDeleteClick={this.deleteSection}
                handleSectionTextChange={this.handleSectionTextChange}
                handleAppendComment={this.handleAppendComment}
                handleCommentAdded={this.handleCommentAdded}
                handleCommentChange={this.handleCommentChange}
                handleMarkChange={this.handleMarkChange}
                handleSectionTitleChange={this.handleSectionTitleChange}
                id={section.id}
                mark={section.mark}
                key={section.id}
                title={section.title}
                value={section.value}
                posComments={section.positiveComments}
                negComments={section.negativeComments}
                enableMarking={this.state.enableMarking}
                marking_scheme={section.marking_scheme}
                permissionLevel={this.state.assignment.permissionLevel}
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
                        {!this.props.isLastPdf() && 
                            <button type="button" className='btn btn-secondary btn-block shadow-sm' id="nextButton" onClick={this.handleFinishEarly}>Discard other upcoming PDFs</button>
                        }
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
                        <Loading text="Loading assignment..." />
                    :
                    this.state.assignment &&
                        // assignment
                        <div className="template shadow-sm">
                            {/* assignment title */}
                            <h2 className="templateTitle text-center">{this.state.assignment.name}</h2>
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

                                {/* Add new section button */}
                                {this.state.assignment.permissionLevel == 1 &&
                                
                                <button 
                                    type="button" 
                                    className="mb-3 btn btn-lg btn-block btn-light shadow-sm"
                                    onClick={this.handleSubmitSection}
                                    >
                                    + Add new section
                                </button>
                                }

                                {loadingNewSection()}

                                {/* assignment sections */}
                                <div className="sections">
                                    {this.renderSections()}
                                </div>

                                {/* Total Mark Display */}
                                {this.state.enableMarking &&
                                    <div className="totalMark">
                                        <p className="float-left">Total Mark</p>
                                        <p className="float-right">{this.state.assignment.totalMark}</p>
                                        <div className="clear"></div>
                                    </div>  
                                }
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