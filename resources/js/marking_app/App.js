import React from 'react';
import PDFSide from './components/PDFSide';
import MarkingSide from './components/MarkingSide';
import Loading from './components/Loading';
import CreateTemplateModal from './components/modals/CreateTemplateModal';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdfsSelected: [],
            pdfPointer: -1,
            templateSelected: false,
            loadingTemplates: false,
            templates: [],
            template: null,
            loading: false,
            selectedTemplateID: -1
        }
        this.handlePdfsSelected = this.handlePdfsSelected.bind(this);
        this.handleNextPdf = this.handleNextPdf.bind(this);
        this.isLastPdf = this.isLastPdf.bind(this);
        this.templateList = this.templateList.bind(this);
        this.selectTemplate = this.selectTemplate.bind(this);
        this.templateFromDBFormat = this.templateFromDBFormat.bind(this);
        this.handleCreatedNewTemplate = this.handleCreatedNewTemplate.bind(this);
    }

    componentDidMount() {
        this.fetchTemplates();
    }

    fetchTemplates() {
        this.setState({loadingTemplates: true});
        fetch('/api/templates?assignment_id=' + assignment_id)
            .then(data => data.json())   
            .then(data => this.setState({templates: data, loadingTemplates: false}));
    }

    handlePdfsSelected(files) {
        const pdfsSelected = [];
        for (let i = 0; i < files.length; i++) {
            pdfsSelected[i] = {name: files[i].name, url: URL.createObjectURL(files[i])};
        }
        this.setState({pdfsSelected: pdfsSelected, pdfPointer: 0});
    }

    handleNextPdf() {
        this.setState(prevState => {
            console.log(this.isLastPdf());
            if (this.isLastPdf()) {
                prevState.pdfPointer = -1;
                prevState.pdfsSelected = [];
            } else {
                prevState.pdfPointer++;
            }
            return prevState;
        });
    }

    isLastPdf() {
        return this.state.pdfsSelected.length == (this.state.pdfPointer + 1);
    }

    templateFromDBFormat(dbTemplate) {
        // console.log('in temp format');
        console.log(dbTemplate);
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

    handleCreatedNewTemplate(data) {
        $("#createTemplateModal").removeClass("fade");
        $("#createTemplateModal").modal('hide');
        $("#createTemplateModal").addClass("fade");
        this.setState({
            template: this.templateFromDBFormat(data),
            templateSelected: true
        });
        
    }

    selectTemplate(templateID) {
        fetch('/api/templates/' + templateID)
            .then(data => data.json())
            .then(data => {
                this.setState( {
                    template: this.templateFromDBFormat(data),
                    loading: false,
                    templateSelected: true
                }, ()=> console.log(this.state));
            });
        // this.setState({templateSelected: true});
        this.setState({loading: true});
    }


    templateList() {
        if (this.state.loadingTemplates) {
            return <Loading text="Loading templates..."/>
        } else {
            const displayTemplates = this.state.templates.map(template => {
                return (
                    <a onClick={() => this.setState({selectedTemplateID: template.id})} onDoubleClick={() => {this.selectTemplate(template.id)}} className="list-group-item list-group-item-action" href={'#' + template.id} key={template.id} data-toggle="list" role="tab">
                        {template.name}
                        <p className="float-right date"><span>{template.created_at}</span></p>
                    </a>
                )
            });
            return (
                this.state.templates.length == 0 ?
                <div className="loadEmpty card-body">
                    There are no templates for this assignment yet. 
                </div>
                :
                <div>
                    {/* card Body */}
                    <div className="card-body">
                        {/* Templates */}
                        <div className="list-group" role="tablist">
                            {displayTemplates}
                        </div>

                    </div>
                    {/* card Footer */}
                    <div className="modal-footer">
                        <button onClick={() => $("#createTemplateModal").modal('show')} type="button" className="btn btn-success">Create New</button>
                        <button disabled={this.state.selectedTemplateID == -1} onClick={() => this.selectTemplate(this.state.selectedTemplateID)} type="button" className="btn btn-primary">Load Selected</button>
                    </div>
                </div>
            );
        }
    }

    render() {
        return (
            !this.state.templateSelected ?
            <div className="container">
                <div className="row" id="selectTemplate">
                    <div className="card col-md-8 offset-md-2 col-sm-12 shadow-sm">
                        <div className="card-header text-center">
                            <h3 className="text-center">Your templates</h3>
                        </div>
                        
                        {this.templateList()}
                        
                    </div>
                </div>
                <CreateTemplateModal handleCreate={this.handleCreatedNewTemplate}/>
            </div>
            
            :
            <div className="row cont">
                <PDFSide
                    handlePdfsSelected={this.handlePdfsSelected}
                    pdfsSelected={this.state.pdfsSelected}
                    pdfPointer={this.state.pdfPointer} />

                <MarkingSide
                    pdfsSelected={this.state.pdfsSelected}
                    pdfPointer={this.state.pdfPointer}
                    handleNextPdf={this.handleNextPdf}
                    isLastPdf={this.isLastPdf} 
                    selectedTemplate={this.state.template}
                    loading={this.state.loading}/>
            </div>
        )
    }
}

export default App;