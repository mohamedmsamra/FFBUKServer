import React from 'react';
import { withAlert } from 'react-alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import TextEditor from './TextEditor';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleUploadCover = this.handleUploadCover.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.state = {
            cover_image: '',
            description: ''
        }

    }

    componentDidMount() {
        this.validate();
    }

    handleUploadCover(e) {
        if(e.target.files[0] != undefined && e.target.files[0].size > 2097152) {
            this.props.alert.error({text: "Image too large! Please pick one smaller than 2mb"});
            $('#uploadCoverImage').removeClass('goodHighlight');
            $('#uploadCoverImage').addClass('badHighlight');
        } else {
            this.setState({cover_image: e.target.value.split('\\').pop().split('/').pop()});
            $('#uploadCoverImage').removeClass('badHighlight');
            $('#uploadCoverImage').addClass('goodHighlight');
        }
        
    }

    handleDescriptionChange(val) {
        this.setState({description: val});
    }

    validate() {
        'use strict';
        window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function(form) {
                form.addEventListener('submit', function(event) {
                    if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                    }   
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    };


 
    render() {
        return (
            <form className="needs-validation" noValidate method="POST" action="/courses" encType="multipart/form-data">
                <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')} />
                <div className="form-group">
            
                    <label htmlFor="validationCustom01">Course Title</label>
                    <input type="text" name="title" className="form-control" id="validationCustom01" placeholder="Course Title" required/>
                    <div className="valid-feedback">
                        Looks good!
                    </div>
                    <div className="invalid-feedback">
                        Please input a title
                    </div>
                </div>

                
                <div className="form-group">
                    <label htmlFor="body">Course Description</label>
                    <input type="hidden" value={this.state.description} name="body" id="body"/>
                    <TextEditor 
                        value={this.state.description}
                        handleSectionTextChange={(val) => this.handleDescriptionChange(val)}
                        value={this.state.description}
                    />
                </div>

                <div className="form-group">
                    <input 
                        onChange={this.handleUploadCover}
                        name="cover_image"
                        type="file" 
                        id="cover_image"
                        className="hiddenFileInput" 
                        accept="image/*"/>
                    <button 
                        type="button" 
                        id={"uploadCoverImage"}
                        className="btn btn-light shadow-sm btn-block mb-3" 
                        onClick={() => {$("#cover_image").click()}} 
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Upload Cover Image">
                            {this.state.cover_image ? this.state.cover_image : 'Choose Cover Image'}
                    </button>
                    <div className="valid-feedback">
                        Looks good!
                    </div>
                    <div className="invalid-feedback">
                        Please input a title
                    </div>
                </div>

                <button className="btn btn-primary shadow-sm" type="submit">Create Course</button>
            </form>

       
        );
        
    }
}

export default withAlert()(App);