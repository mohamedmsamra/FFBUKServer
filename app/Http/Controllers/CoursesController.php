<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\User;
use App\Models\CoursePermission;
use Auth;
//if we want to use normal SQL we need to call DB
use DB;

/**
 * The Courses controller deals with storing and returning information relating to courses.
 */
class CoursesController extends Controller
{
    /**
     * Display a page with the list of all courses you own or are invited to.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Find the authenticated user
        $user_id = auth()->user()->id;
        $user = User::find($user_id);

        // Find all the courses this user owns
        $courses = $user->courses()->orderBy('created_at', 'desc')->paginate(10);

        // Find all the courses this user is invited to and retrieve all the relevant information about it (e.g. the course owner)
        $invitations = $user->course_permissions()->orderBy('pending', 'DESC')->paginate(10);
        foreach ($invitations as $invite) {
            $t2 = Course::find($invite->course_id);
            $invite->course = Course::find($invite->course_id);
            $invite->owner = User::find($t2->user_id);
            $invite->assignments = Assignment::where('course_id',$t2->id)->get();
        }

        // Return a page with this information
        return view('courses.index')->with('courses', $courses)
                                    ->with('invitations', $invitations);
    }

    /**
     * Display the page for one course
     *
     * @param  int  $id the id of the course you want to display;
     * @return \Illuminate\Http\Response the page for one course
     */
    public function show($id)
    {
        // If the uthenticated user does not have permission to see this course (is not owner or invited), abort
        if (!$this->canView($id)) abort(401);

        // Find the course, all of its assignments and all the sharing permissions it has
        $course = Course::find($id);
        $assignments = Assignment::where('course_id',$course->id)->get();
        $permissions = $this->permissions($id);

        // Return a page with that information
        return view('courses.show') -> with('course', $course)
                                    -> with('assignments', $assignments)
                                    -> with('permissions', $permissions);
    }

    /**
     * Show the form for creating a new course
     *
     * @return \Illuminate\Http\Response the page with the form to create a new course
     */
    public function create()
    {
        // Return a page that allows you to create a new course
        return view('courses.create');
    }

    /**
     * Store a newly created course in storage.
     *
     * @param  \Illuminate\Http\Request  $request what needs to be sent in the post request
     * @return \Illuminate\Http\Response the courses page with a confirmation
     */
    public function store(Request $request)
    {
        // Validation rules the request must comply with
        $rules = [
            'title' => 'required',
            // The course image is not required and has a max size of 1999mb
            'cover_image' => 'image | mimes:jpeg,png,jpg,gif,svg | nullable | max:2048'
        ];
    
        // Custom messages to display when validation fails
        $customMessages = [
            'required' => 'The :attribute field is required',
            'image' => 'The :attribute field must be an image.',
            'max' => ':attribute no bigger than 3mb'
        ];
    
        // Apply the validation rules with the custom messages
        $this->validate($request, $rules, $customMessages);

        // Create a new course with the information provided
        $course = new Course;
        $course ->title = $request->input('title');
        if ($request->input('body') == null) {
            $course ->body = "";
        } else {
            $course ->body = $request->input('body');
        }

        // Set the course "owner" to the user that is authenticated
        $course ->user_id = auth()->user()->id;
        $course ->cover_image = "default";
        // Save the course to storage
        $course ->save();

        // Set the course image
        $this -> apiImageUpload($request, $course['id']);

        // If nothing fails, return to the courses page with a success message
        return redirect('/courses')-> with('success', 'Your Course has been added successfully!');
    }

    /**
     * Remove the specified course from storage.
     *
     * @param  \Illuminate\Http\Request  $request what needs to be sent in the delete request
     * @param  int  $id the id of the course to be removed
     * @return \Illuminate\Http\Response the courses page
     */
    public function destroy(Request $request, $id)
    {
        // If the authenticated user is not the course owner, abort
        if (!$this->canEdit($id)) abort(401);
       
        // Find the course
        $course = Course::find($id);
        // Save to course title for the confirmation alert
        $title = $course->title;
        // Remove the course
        $course -> delete();

        // Return to the courses page
        return redirect('courses')-> with('success', "The course '".$title."' has been removed");
    }

    /**
     * Store a course cover image in storage and return the stored filename.
     * 
     * @param \Illuminate\Http\Request $request the image to be sent in the post request
     * @param int $id the id of the course the image needs to be uploaded to
     * @return string the filename the image was stored with
     */
    public function apiImageUpload(Request $request, $id) 
    {
        // If the authenticated user is not the owner (he can't edit the course), abort
        if (!$this->canEdit($id)) abort(401);
        // Validation rules the request must comply with
        $rules = [
            'cover_image' => 'image | mimes:jpeg,png,jpg,gif,svg | nullable | max:2048'
        ];
    
        // Custom messages to display when validation fails
        $customMessages = [
            'image' => 'The :attribute field must be an image.',
            'max' => ':attribute no bigger than 3mb'
        ];
    
        // Apply the validation rules with the custom messages
        $this->validate($request, $rules, $customMessages);

        // Find the course
        $course = Course::find($id);

        // If a file was chosen
        if($request -> hasFile('cover_image')){

            $img = $request -> cover_image;
            $user_id = auth()->user()->id;

            // Check if user storage folder exists and create it if not
            $path = storage_path('app/public/user_'.$user_id);
            if(!file_exists($path)) {
                // Path does not exist, so create it
                \File::makeDirectory($path);
            }

            // If the user already has any other images for this course, remove them
            $matches = glob($path.'/course_'.$course->id.'*');
            foreach ($matches as $match) {
                unlink($match);
            }

            // Create a unique file name to store the image
            $imageName = 'course_'.$course->id.'_'.date("YmdHis").'.'.$img->getClientOriginalExtension();

            // Save image to the user folder using the created filename
            $img->move($path, $imageName);

            // Save the image path inside the storage folder to store to the database
            $fileNameToStore = 'user_'.$user_id.'/'.$imageName;
            
        } else{
            // If the user has not chosen an image, this default image will show
            $fileNameToStore= 'default';
        }

        // Save the image path to the database
        $course -> cover_image = $fileNameToStore;
        $course -> save();

        // Return the path that is saved in the database
        return json_encode($fileNameToStore);
    }

    /**
     * Get the file path of the image of a course
     * 
     * @param int $id the id of the course
     * @return string the course image file path
     */
    public function apiShowImage($id) {
        // If the authenticated user doesn't have permission to see the course (is not the owner or invited), abort
        if (!$this->canView($id)) abort(401);

        // Find the course and return the image path
        $course = Course::find($id);
        return json_encode($course->cover_image);
    }

    /**
     * Get a JSON course object
     * 
     * @param int $id the id of the course to retrieve
     * @return string a string containing the JSON representation of a course object
     */
    public function apiShow($id)
    {
        if (!$this->canView($id)) abort(401);
        $course = Course::find($id);

        return json_encode([
            'image' => $course->cover_image,
            'body' => $course->body,
            'createdAt' => $course->created_at,
            'username' => $course->user->name
        ]);
    }

    /**
     * Accept an invitation to join a course
     * 
     * @param int $id the id of the invitation (a course permission with pending set to true)
     * @return \Illuminate\Http\Response the previous page, with an appropriate message
     */
    public function apiJoinCourse($id) {
        // Find the invitation
        $permission = CoursePermission::find($id);

        // Check that it is for the authenticated user
        if ($permission -> user_id == Auth::user()->id) {
            // Set the pending to false, meaning that the invitation was accepted
            $permission -> pending = 0;
            $permission -> save();
    
            // Return to the previous page with a success message
            return back()->with('success', 'Joined Course');
        }
        // Otherwise (invitation is not for this user), return to the previous page with an error message
        return back()->with('error', "You don't have permission to do that");
    }

    /**
     * Invite a user to a course by their email
     * 
     * @param \Illuminate\Http\Request $request the information that needs to be sent in the post request
     * @param int $course_id the id of the coure to add the user to
     * @return string a string containing the JSON representation of an object dictating the success of the request
     */
    public function apiInviteToCourse(Request $request, $course_id) {
        // If the authenticated user is not the owner of the course, abort
        if (!$this->canEdit($course_id)) abort(401);

        // An email address must be provided
        $this -> validate($request,[
            'email' => 'required'
        ]);

        // Find the user by the email
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            // No user with this email address, so send an error message
            return json_encode(['success' => false, 'message' => 'This email cannot be found.']);   
        }

        // Find the course by the id
        $user_id = $user->id;
        $course = Course::find($course_id);

        if (!$course) {
            // No course with this id exists, so sent an error message
            return json_encode(['success' => false, 'message' => 'This course does not exist.']);   
        }
        
        if ($user_id == $course->user_id) {
            // The invited user is the course owner, so send an error message (owner can't be invited to the course they own)
            return json_encode(['success' => false, 'message' => 'You are the owner of this course.']);   
        }

        if (CoursePermission::where('course_id', $course_id)->where('user_id', $user_id)->first()) {
            // The invited user has already been ivited, so send an error message
            return json_encode(['success' => false, 'message' => 'This user is already invited to this course.']);   
        }

        // If all checks are passed, create a new pending course permission for this user on this course
        $coursePermission = new CoursePermission();
        $coursePermission -> course_id = $course_id;
        $coursePermission -> user_id = $user_id;
        $coursePermission -> save();
        unset($coursePermission['user_id']);
        $coursePermission['user'] = ['id' => $user->id, 'name' => $user->name];

        // Return the created course permission
        return json_encode(['success' => true, 'course_permission' => $coursePermission]);
    } 

    /**
     * Remove a user from a course
     * 
     * @param int $id the id of the course permission to delete
     * @return string a string containing the JSON representation of an object that says whether the removal was a success or not
     */
    public function apiRemoveFromCourse($id) {
        // Find the course permission
        $coursePermission = CoursePermission::find($id);
        // If the autenticated user is not the course owner, abort
        if (!$this->canEdit($coursePermission->course_id)) abort(401);
        // Otherwise, remove the course permission and return success true
        $coursePermission->delete();
        return json_encode(['success' => true]);
    }

    /**
     * Reject an invitation to a course
     * 
     * @param int $id the id of the invitation (course permission with pending set to true)
     * @return \Illuminate\Http\Response the previous page with an appropriate message
     */
    public function apiRejectCourseInvite($id) {
        // Find the course permission
        $coursePermission = CoursePermission::find($id);
        // Check that the course permission is still pending and that the authenticated user is the one invited
        if ($coursePermission->pending == true && $coursePermission->user_id == Auth::user()->id) {
            // Save the course name for confirmation alert
            $name = Course::find($coursePermission->course_id)->title;
            // Remove the course permission from storage
            $coursePermission -> delete();
            // Return to the previous page with a confirmation alert
            return back()->with('warning', 'Rejected invitation to '.$name);
        } else {
            // Otherwise (course permission is either not pending or doesn't concern the authenticated user)
            // Return to the previous page with a failure alert
            return back()->with('error', 'Failed to reject course invitation');
        }
    }

    /**
     * Get all permissions for a course
     * 
     * @param int $id the id of the course
     * @return string a string containing the JSON representation of the list of permissions for this course
     */
    public function apiGetPermissions($id) {
        if (!$this->canView($id)) abort(401);
        return json_encode($this->permissions($id));
    }

    /**
     * Update the permission level for a user on a course
     * 
     * @param \Illuminate\Http\Request $request what needs to be sent in the update request
     * @param int $course_id the id of the course this permission is for
     * @param int $user_id the id of the user whose permission should be updated
     * @return string the success of the update
     */
    public function apiUpdatePermission(Request $request, $course_id, $user_id) {
        // If the authenticated user is not the course owner, abort
        if (!$this->canEdit($course_id)) abort(401);

        // The new permission level must pe provided
        $this -> validate($request,[
            'level' => 'required'
        ]);
        
        if ($this->hasPermissionToUpdatePermissions($course_id, Auth::user()->id)) {
            // First check if user in the course has read/write permissions
            // Find the course permission for the give course and user pair
            $permission = CoursePermission::where('course_id', $course_id)->where('user_id', $user_id)->first();
            // Update the permission level to the new one and save the changes
            $permission->level = $request->input('level');
            $permission->save();
            // Return a relevant message
            return json_encode("done");
        }
        // Return an error message
        return json_encode(['error' => 'You don\'t have permission for that']);
    }

    /**
     * Check if a given user has permission to update course permissions for a given course
     * 
     * @param int $course_id the id of the course 
     * @param int $user_id the id of the user
     * @return boolean if the user has permission to edit the course permissions for this course
     */
    private static function hasPermissionToUpdatePermissions($course_id, $user_id) {
        // Check if the user is the owner
        if (Course::where('id', $course_id)->where('user_id', $user_id)->first()) return true;
        return false;

        // Check if the user has read/write permissions ??
    }

    /**
     * Get all the permission for a given course
     * 
     * @param int $id the id of the course
     * @return array a list of all permissions for this course
     */
    private static function permissions($id) {

        // Find the course and all the permissions for it
        $course = Course::find($id);
        $permissions = $course->permissions;

        // Build the list of permission with only the relevant information
        $return = [];
        foreach ($permissions as $permission) {
            $r = [];
            $r['id'] = $permission->id;
            $user = User::find($permission->user_id);
            $r['user'] = array('id' => $user->id, 'name' => $user->name);
            $r['level'] = $permission->level;
            $r['pending'] = $permission->pending;
            array_push($return, $r);
        }
        return $return;
    }
    
    /**
     * Get the course with the given id created by the authenticated user
     * 
     * @param int $id the id of the course
     * @return object the course with this id created by the authenticated user (can be null)
     */
    public static function canManage($id) {
        // Get a list of all courses that match the criteria (have the given course id and are created by the authenticated user)
        $isOwner = Course::where('id', $id)->where('user_id', Auth::user()->id);
        // Return the first object from that list
        return $isOwner->first();
    }

    /**
     * Get the course with the given id and created by the authenticated user 
     * (if it exists, the authenticated user is the owner)
     * (if it does not exist, the authenticated user is not the owner so he does not have edit permission)
     * 
     * @param int $id the course id
     * @return object the course with the given id and created by the authenticated user 
     */
    public static function canEdit($id) {
        // Only the manager (owner) can edit course details
        return CoursesController::canManage($id);
    }

    /**
     * Check if the authenticated user has permission to view the given course
     * 
     * @param int $id the id of the course
     * @return boolean if the authenticated user has permission to view the course
     */
    private static function canView($id) {
        // Get the course with the given id and created by the authenticated user 
        // if this exists, the user is the course wner and has access to view the course
        $isOwner = Course::where('id', $id)->where('user_id', Auth::user()->id);

        // Get the course permission for this user to this course that is not pending
        // if this exists, the user is invited to the course and has access to view it
        $hasReadRights = CoursePermission::where('course_id', $id)
                                         ->where('user_id', Auth::user()->id)
                                         ->where('pending', false);
        
        // Return if the authenticated user is either the owner or is invited to the course
        return ($isOwner->first() || $hasReadRights->first());
    }
}
