import React from 'react';
import { withAlert } from 'react-alert';
import TextEditor from './TextEditor';

class App extends React.Component {
    constructor(props) {
        // Call parent constructor
        super(props);
        this.handleUploadCover = this.handleUploadCover.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.state = {
            cover_image: '',
            description: ''
        }
    }

    componentDidMount() {
        // When the component load, add validation to the form
        this.validate();
    }

    // Validate selected cover image
    handleUploadCover(e) {
        // If the file size is larger than 2mb, display alert and add suggestive styling
        if(e.target.files[0] != undefined && e.target.files[0].size > 2097152) {
            this.props.alert.error({text: "Image too large! Please pick one smaller than 2mb"});
            $('#uploadCoverImage').removeClass('goodHighlight');
            $('#uploadCoverImage').addClass('badHighlight');
        } else {
            // Otherwise, set the new cover image
            this.setState({cover_image: e.target.value.split('\\').pop().split('/').pop()});
            $('#uploadCoverImage').removeClass('badHighlight');
            $('#uploadCoverImage').addClass('goodHighlight');
        }
        
    }

    // Change the course description to the input value
    handleDescriptionChange(val) {
        this.setState({description: val});
    }

    // Add form validation
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

    // Render the component
    render() {
        return (
            <form className="needs-validation" noValidate method="POST" action="/courses" encType="multipart/form-data">
                {/* CSRF token input */}
                <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')} />

                {/* Course Title input */}
                <div className="form-group">
                    <label htmlFor="validationCustom01">Course Title</label>
                    <input type="text" name="title" className="form-control" id="validationCustom01" placeholder="Course Title" required/>
                    {/* Confirmation message - displayed if form is submitted with the title set */}
                    <div className="valid-feedback">
                        Looks good!
                    </div>
                    {/* Error message - displayed if form is submitted without the title set */}
                    <div className="invalid-feedback">
                        Please input a title
                    </div>
                </div>

                {/* Course Description input */}
                <div className="form-group">
                    <label htmlFor="body">Course Description</label>
                    {/* Hidden input used to store the value in the state */}
                    <input type="hidden" value={this.state.description} name="body" id="body"/>
                    {/* Text Editor component that allows html formatting */}
                    <TextEditor 
                        value={this.state.description}
                        handleSectionTextChange={(val) => this.handleDescriptionChange(val)}
                        value={this.state.description}
                    />
                </div>

                {/* Image Upload Input */}
                <div className="form-group">
                    {/* Hidden file upload input because it can't be styled to look nice */}
                    <input 
                        onChange={this.handleUploadCover}
                        name="cover_image"
                        type="file" 
                        id="cover_image"
                        className="hiddenFileInput" 
                        accept="image/*"/>
                    {/* Button the triggers the file upload input on click - because this can be styled to look nice*/}
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
                    {/* Confirmation message */}
                    <div className="valid-feedback">
                        Looks good!
                    </div>
                    {/* Error message */}
                    <div className="invalid-feedback">
                        Picture is not suitable
                    </div>
                </div>

                {/* Submit new course button */}
                <button className="btn btn-primary shadow-sm" type="submit">Create Course</button>
            </form>      
        );
    }
}

export default withAlert()(App);