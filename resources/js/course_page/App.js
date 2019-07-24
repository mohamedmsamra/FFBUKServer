import React from 'react';
import PermissionsTable from './PermissionsTable';
import AssignmentsTable from './AssignmentsTable';
import Loading from '../global_components/Loading';
import { withAlert } from 'react-alert';
import dateformat from 'dateformat';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: null
        }
    }

    componentDidMount() {
        fetch(`/api/courses/${COURSE_ID}`)
        .then(data => data.json())
        .then(data => {
            this.setState({course: data});
        });
    }

    /* Runs when a new image has been selected for the course. Submits the new image to the server. */
    handleUploadImage(e) {
        // Check image size
        if(e.target.files[0] != undefined && e.target.files[0].size > 2097152) {
            this.props.alert.error({text: "Image too large! Please pick one smaller than 2MB"});
        } else {
            var data = new FormData();
            data.append('cover_image', e.target.files[0]);
            
            const options = {
                method: 'post',
                body: data,                
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json, text-plain, */*",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
                }
            }
            delete options.headers['Content-Type'];
            fetch("../api/courses/" + COURSE_ID + "/image-upload", options)
            .then(function(response) {
                return response.json();
            }).then((data) => {
                // Update the uploaded image on the page
                this.setState(prevState => {
                    prevState.course.image = data;
                    return prevState;
                });
            });
        }
    }          
    
    /* Runs when the course is selected to be deleted. Sends a delete request to the server. On success, redirects to
     * /courses.
     */
    handleDeleteCourse() {
        fetch(COURSE_ID, {
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
            // console.log(data);
            window.location.href = '/courses';
        });
    }
 
    render() {
        if (!this.state.course) {
            // If the course hasn't been loaded yet
            return <Loading text="Loading course..." />;
        } else {
            return (
                <div>
                    <div>
                        <img 
                            className="course-img" 
                            src={this.state.course.image == 'default'  ?  '../stuff/default-1.jpg' : '../storage/' + this.state.course.image} />
                    </div>
                    <div className="container">
                        <h1 className="mt-3">{ this.state.course.title }</h1>
                        <a href="/courses" className="btn btn-link"> Go Back </a>
                        
                        <div id="courseActions">
                            {!this.state.course.can_manage ? '' :
                                <form encType="multipart/form-data" action="" className="float-left">
                                    <input type="hidden" name="_token" value={$('meta[name="csrf-token"]').attr('content')} />
                                    <input 
                                        onChange={this.handleUploadImage.bind(this)}
                                        name="cover_image"
                                        type="file" 
                                        id={"course" + COURSE_ID} 
                                        className="hiddenFileInput" 
                                        accept="image/*"/>
                                    <button 
                                        type="button" 
                                        id={"uploadCourseImg" + COURSE_ID}
                                        className="courseBtn uploadBtn float-left" 
                                        onClick={() => {$("#course" + COURSE_ID).click()}} 
                                        data-toggle="tooltip" 
                                        data-placement="top" 
                                        title="Change Course Image">
                                        <i className="fas fa-image"></i> Change Course Image
                                    </button>
                                </form>
                            }
                            {/* <p>{console.log(PERMISSIONS)}</p>
                            <p>{console.log(user_id)}</p>
                            <p>{console.log(permission)}</p> */}
    
                            {!this.state.course.can_manage ? '' :
                                <>
                                    {/* <button 
                                        className="courseBtn deleteBtn float-left" 
                                        onClick={this.handleEditCourse}>
                                        <i className="fas fa-pencil-alt"></i> 
                                        <span> Edit Course</span>
                                    </button> */}
                                    <button 
                                        className="courseBtn deleteBtn float-left" 
                                        onClick={() => {this.props.alert.show({
                                            text: "Are you sure you want to delete this course?",
                                            onConfirm: () => this.handleDeleteCourse()
                                        })}}>
                                        <i className="fas fa-trash-alt"></i> 
                                        <span> Delete Course</span>
                                    </button>
                                </>
                            }
                        </div>
                        <div className="clear"></div>
                        <div className="card shadow-sm mb-3">
                            {this.state.course.body != '' &&
                                <div className="card-body p-3">
                                    {<div dangerouslySetInnerHTML={{ __html: this.state.course.body }} />}   
                                </div>
                            }
                            <div className="card-footer">
                                {/* <small> Added by <strong>{this.state.course.creator_name}</strong> on {dateformat(new Date(this.state.course.created_at + ''), "dddd, mmmm dS, yyyy, h:MM:ss TT")}</small> */}
                            </div>
                        </div>
                        
                        {/* Table for the assignments */}
                        <hr className="styled-hr"/>
                        <h2>List of Assignments</h2>
                        <AssignmentsTable course={this.state.course} />
                        
                        {/* Table for the permissions */}
                        <hr className="styled-hr"/>
                        <h2 className="mb-0">Sharing permissions</h2>
                        <PermissionsTable course={this.state.course} />
                    </div>
                </div>
            );
        }
    }
}

export default withAlert()(App);