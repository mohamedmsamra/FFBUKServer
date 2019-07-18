import React from 'react';
import PermissionsTable from './PermissionsTable';
import AssignmentsTable from './AssignmentsTable';
import { withAlert } from 'react-alert';
import dateformat from 'dateformat';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cover_image: COVER_IMAGE,
            imageLoaded: true,
            body: BODY
        }
    }

    handleUploadImage(e) {
        fetch(course_id + '/imageUpload', {
            method: 'post',
            body: new FormData($(e.target).parent()[0]),
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json, text-plain, */*",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr('content')
            }
        })
            .then(data => data.json())
            .then(data => {
                // console.log(data);
            });
    }          
    
    handleDeleteCourse() {
        fetch(course_id, {
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
            this.props.alert.success({text: "Removed course \n '" + data + "'"});
        });
    }

    handleEditCourse() {
        fetch('/courses/' + course_id + '/edit');
    }
 
    render() {
        let permission = PERMISSIONS.find(x => x.user.id == user_id);
        return (
        <div>
            
            <div>
                {this.state.imageLoaded ?
                    <img 
                        className="course-img" 
                        src={this.state.cover_image == 'default'  ?  '../stuff/default-1.jpg' : '../storage/' + this.state.cover_image} 
                    />
                    :
                    'Loading'
                }
            </div>
            <div className="container">
                
                <h1 className="mt-3">{ COURSE_TITLE }</h1>
                <a href="/courses" className="btn btn-link"> Go Back </a>
                <div id="courseActions">
                    {/* <form encType="multipart/form-data" action="" className="float-left">
                        <input 
                            onChange={this.handleUploadImage.bind(this)}
                            name="cover_image"
                            type="file" 
                            id={"course" + course_id} 
                            className="hiddenFileInput" 
                            accept="image/*"/>
                        <button 
                            type="button" 
                            id={"uploadCourseImg" + course_id}
                            className="courseBtn uploadBtn float-left" 
                            onClick={() => {$("#course" + course_id).click()}} 
                            data-toggle="tooltip" 
                            data-placement="top" 
                            title="Change Course Image">
                            <i className="fas fa-image"></i> Change Course Image
                        </button>
                    </form> */}
                    {/* <p>{console.log(PERMISSIONS)}</p>
                    <p>{console.log(user_id)}</p>
                    <p>{console.log(permission)}</p> */}

                    {course_owner_id !== user_id ? '' :
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
                    
                    {this.state.body != '' &&
                        <div className="card-body p-3">
                            {<div dangerouslySetInnerHTML={{ __html: this.state.body }} />}   
                        </div>
                    }
                    <div className="card-footer">
                            <small> Added by <strong>{CREATOR_NAME}</strong> on {dateformat(CREATED_AT, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</small>
                        </div>
                </div>
                
                <hr className="styled-hr"/>
                <h2>List of Assignments</h2>
                <AssignmentsTable />
                
                <hr className="styled-hr"/>
                <h2>Sharing permissions</h2>
                <PermissionsTable />
                </div>
        </div>
        );
    }
}

export default withAlert()(App);