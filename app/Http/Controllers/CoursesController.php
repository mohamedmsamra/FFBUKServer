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
     * @return \Illuminate\Http\Response
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

    public function apiShowImage($id) {
        if (!$this->canView($id)) abort(401);
        $course = Course::find($id);
        return json_encode($course->cover_image);
    }

    public function apiShow(Request $request, $id)
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

    public function apiJoinCourse($id) {
        $permission = CoursePermission::find($id);
        if ($permission -> user_id == Auth::user()->id) {
            $permission -> pending = 0;
            $permission -> save();
    
            return back()->with('success', 'Joined Course');
        }
        return back()->with('error', "Don't have permission to do that");
        // return $permission;
    }

    // Add user to course
    public function apiInviteToCourse(Request $request, $course_id) {
        if (!$this->canEdit($course_id)) abort(401);
        $this -> validate($request,[
            'email' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return json_encode(['success' => false, 'message' => 'This email cannot be found.']);   
        }

        $user_id = $user->id;
        $course = Course::find($course_id);

        if (!$course) {
            return json_encode(['success' => false, 'message' => 'This course does not exist.']);   
        }
        
        if ($user_id == $course->user_id) {
            return json_encode(['success' => false, 'message' => 'You are the owner of this course.']);   
        }

        if (CoursePermission::where('course_id', $course_id)->where('user_id', $user_id)->first()) {
            return json_encode(['success' => false, 'message' => 'This user is already invited to this course.']);   
        }

        $coursePermission = new CoursePermission();
        $coursePermission -> course_id = $course_id;
        $coursePermission -> user_id = $user_id;
        $coursePermission -> save();
        unset($coursePermission['user_id']);
        $coursePermission['user'] = ['id' => $user->id, 'name' => $user->name];
        return json_encode(['success' => true, 'course_permission' => $coursePermission]);
    } 

    public function apiRemoveFromCourse($id) {
        $coursePermission = CoursePermission::find($id);
        if (!$this->canEdit($coursePermission->course_id)) abort(401);
        if ($coursePermission->course()->first()->user_id == Auth::user()->id) {
            $coursePermission->delete();
            return json_encode(['success' => true]);
        } else {
            return json_encode(['success' => false]);
        }
    }

    public function apiRejectCourseInvite($id) {
        $coursePermission = CoursePermission::find($id);
        if ($coursePermission->pending == true && $coursePermission->user_id == Auth::user()->id) {
            $name = Course::find($coursePermission->course_id)->title;
            $coursePermission -> delete();
            return back()->with('warning', 'Rejected invitation to '.$name);
        } else {
            return back()->with('error', 'Failed to reject course invitation');
        }
    }

    public function apiGetPermissions($id) {
        if (!$this->canView($id)) abort(401);
        return json_encode($this->permissions($id));
    }

    public function apiUpdatePermission(Request $request, $course_id, $user_id) {
        if (!$this->canEdit($course_id)) abort(401);
        $this -> validate($request,[
            'level' => 'required'
        ]);
        
        if ($this->hasPermissionToUpdatePermissions($course_id, Auth::user()->id)) {
            // First check if user in the course has read/write permissions
            $permission = CoursePermission::where('course_id', $course_id)->where('user_id', $user_id)->first();
            $permission->level = $request->input('level');
            $permission->save();
            return json_encode("done");
        }
        return json_encode(['error' => 'You don\'t have permission for that']);
    }

    private static function hasPermissionToUpdatePermissions($course_id, $user_id) {
        // Check if the user is the owner
        if (Course::where('id', $course_id)->where('user_id', $user_id)->first()) return true;
        return false;

        // Check if the user has read/write permissions ??
    }

    private static function permissions($id) {
        $course = Course::find($id);

        $permissions = $course->permissions;

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
    
    public static function canManage($id) {
        $isOwner = Course::where('id', $id)->where('user_id', Auth::user()->id);
        return $isOwner->first();
    }

    public static function canEdit($id) {
        // Only the manager (owner) can edit course details
        return CoursesController::canManage($id);
    }

    private static function canView($id) {
        $isOwner = Course::where('id', $id)->where('user_id', Auth::user()->id);
        $hasReadRights = CoursePermission::where('course_id', $id)
                                         ->where('user_id', Auth::user()->id)
                                         ->where('pending', false);
        return ($isOwner->first() || $hasReadRights->first());
    }
}
