import React from 'react';
import PermissionsTable from './PermissionsTable';
import AssignmentsTable from './AssignmentsTable';
import { withAlert } from 'react-alert';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cover_image: '',
            imageLoaded: false,
            body: '',
            username: '',
            created_at: ''
        }
        this.loadCourse = this.loadCourse.bind(this);
    }

    componentDidMount() {
        this.loadCourse();
    }

    formatDate(date) {
        var monthNames = [
          "January", "February", "March",
          "April", "May", "June", "July",
          "August", "September", "October",
          "November", "December"
        ];
      
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var hour = date.getHours();
        var minute = date.getMinutes();
      
        return day + ' ' + monthNames[monthIndex] + ' ' + year + ' at ' + hour + ':' + minute;
      }

    loadCourse() {
        fetch("/courses/" + course_id + "/json")
            .then(data => data.json())
            .then(data => {
                console.log(data);       
                this.setState({
                    cover_image: data.image,
                    imageLoaded: true,
                    body: data.body,
                    created_at: this.formatDate(new Date(data.createdAt.date)),
                    username: data.username
                });
            });
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
                console.log(data);
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
 
    render() {
        return (
        <div>
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
                <button 
                    className="courseBtn deleteBtn float-left" 
                    onClick={() => {this.props.alert.show({
                        text: "Are you sure you want to delete this course?",
                        onConfirm: () => this.handleDeleteCourse()
                    })}}>
                    <i className="fas fa-trash-alt"></i> 
                    Delete Course
                </button>
            </div>
            <div className="clear"></div>
            {this.state.imageLoaded ?
                <img 
                    className="course-img" 
                    src={this.state.cover_image == 'default'  ?  '../stuff/default-1.jpg' : '../storage/' + this.state.cover_image} 
                />
                :
                'Loading'
                
            }
            <div>
                {<div dangerouslySetInnerHTML={{ __html: this.state.body }} />}
            </div>
            <small> Added by <strong>{this.state.username}</strong> on {this.state.created_at}</small>
            <hr/>

            <h2>List of Assignments</h2>
            <AssignmentsTable />
            <hr/>
            <h2>Sharing permissions</h2>
            <p>All assignments are visible with the people you share the course with. Templates can be shared individually on the template's page.</p>
            <PermissionsTable />
        </div>
        );
    }
}

export default withAlert()(App);