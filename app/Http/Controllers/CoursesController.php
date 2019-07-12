<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//return the course Model so we can use it here
use Illuminate\Support\Facades\Storage;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\User;
use App\Models\CoursePermission;
use Auth;
//if we want to use normal SQL we need to call DB
use DB;


class CoursesController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user_id = auth()->user()->id;
        $user = User::find($user_id);
        $courses = $user->courses()->orderBy('created_at', 'desc')->paginate(10);
        $invitations = $user->course_permissions()->orderBy('pending', 'DESC')->paginate(10);

        // $temp = new stdClass();
        foreach ($invitations as $invite) {
            $t2 = Course::find($invite->course_id);
            // $owner = User::find($t2->user_id);
            // $assignments = Assignment::where('course_id',$t2->id)->get();
            $invite->course = Course::find($invite->course_id);
            $invite->owner = User::find($t2->user_id);
            $invite->assignments = Assignment::where('course_id',$t2->id)->get();
        }

        return view('courses.index')->with('courses', $courses)
                                    ->with('invitations', $invitations);
    }

        /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        //it gets the id from the URL
        //http://ffbuk.test/posts/1
        //return this specific post which its id is in the link
        $course = Course::find($id);
        $assignments = Assignment::where('course_id',$course->id)->get();
        $permissions = $this->permissions($id);
            
        return view('courses.show') -> with('course', $course)
                                    -> with('assignments', $assignments)
                                    -> with('permissions', $permissions);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //return a view within the post folder
        return view('courses.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //here we do our form validation first before returnging that the storage was successful
        // so the form does not submit until the title and the body are there

        $this -> validate($request,[
            'title' => 'required',
            'body' => 'required',
            //adding some validation to the image to upload, it has to be an image, optional to include or not, not required
            //and finally has a max size of 1999mb
            'cover_image' => 'image | mimes:jpeg,png,jpg,gif,svg | nullable | max:1999'
        ]);

        //Create Post
        $course = new Course;
        $course ->title = $request->input('title');
        $course ->body = $request->input('body');
        //the user_id is not coming from the form, we read it from auth(), which will read the id of current signed_in user
        $course ->user_id = auth()->user()->id;
        $course ->cover_image = "default";
        $course ->save();

        $this -> apiImageUpload($request, $course['id']);

        // $returnCourse

        //direct the page back to the index
        //set the success message to Post Created
        return redirect('/courses')-> with('success', 'Your Course has been added successfully!');
    }

        /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {

        $course=  Course::find($id);
        //check if the correct user wants to edit his/her own post
        if(auth()->user()->id !==$course->user_id){
            //if the post owner is not the same, we direct the user to /posts with an error message of Unathourised Page
            return redirect('/courses')->with('error','Unauthorised Page');
        }

        return view('courses.edit') -> with('course', $course);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //to update we still need the validation
        $this -> validate($request,[
            'title' => 'required',
            'body' => 'required',
        ]);

        //Handle File upload
        //make sure an actual file was chosen, put if no image was chosen, do not override or display noImage.jpg
        //like what happened in create. because no override needed
        if($request -> hasFile('cover_image')){
            //Get Filename with the extension
            $filenameWithExt = $request->file('cover_image') ->getClientOriginalName();
            //Get just filename
            $filename= pathinfo( $filenameWithExt, PATHINFO_FILENAME);
            //Get just extenstion
            $extension = $request->file('cover_image')->getClientOriginalExtension();
            //Filename to store (to make the filename to be stored veru unique and avoid any possible overriding)
            $fileNameToStore = $filename.'_'.time().'_'.$extension;
            //Upload Image
            $path = $request -> file('cover_image') -> storeAs('public/cover_images',$fileNameToStore);

        }
         //update this Post, find it by id
         $course = Course::find($id);
         $course -> title = $request->input('title');
         $course -> body = $request->input('body');
         if($request->hasFile('cover_image')){
             $course->cover_image = $fileNameToStore;
         }
         $course -> save();

         //direct the page back to the index
         //set the success message to Post Created
         return redirect('/courses')-> with('success', 'Course Updated!');

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        //needed to delete the post
        $course = Course::find($id);
        if(auth()->user()->id !==$course->user_id){
            //if the post owner is not the same, we direct the user to /posts with an error message of Unathourised Page
            return redirect('/courses')->with('error','Unauthorised Page');
        }

        // if($course -> cover_image != 'default'){
        //     //Delete Image
        //     $path = storage_path('app/public/'.$course->cover_image);
        //     unlink($path);
        //     // Storage::delete('public/cover_images/'.$course->cover_image);
        // }
        $title = $course -> title;
        $course -> delete();

        // return redirect('/courses');
        // $this -> index();
        // $request->session()->flash('alert-success', 'User was successful added!');
        // return json_encode($title);
        Session::flash('success', 'This is a message!'); 

        return redirect()->route('courses');    
    }

    public function apiImageUpload(Request $request, $id) 
    {
        $this -> validate($request,[
            'cover_image' => 'image | mimes:jpeg,png,jpg,gif,svg | nullable | max:1999'
        ]);

        $course = Course::find($id);

        //Handle File upload
        //make sure an actual file was chosen
        if($request -> hasFile('cover_image')){

            $img = $request -> cover_image;

            $user_id = auth()->user()->id;

            // Check if user folder exists and create it if not
            $path = storage_path('app/public/user_'.$user_id);
            if(!file_exists($path)) {
                // path does not exist
                \File::makeDirectory($path);
            }

            $matches = glob($path.'/course_'.$course->id.'*');
            foreach ($matches as $match) {
                \Log::info($match);
                unlink($match);
            }

            $imageName = 'course_'.$course->id.'_'.date("YmdHis").'.'.$img->getClientOriginalExtension();

            // Save image to user folder
            $img->move($path, $imageName);

            $fileNameToStore = 'user_'.$user_id.'/'.$imageName;
            
        } else{
            //so if the user has not chosen an image, this default image will show
            $fileNameToStore= 'default';
        }
        $course -> cover_image = $fileNameToStore;
        $course -> save();

        return json_encode($fileNameToStore);
    }

    public function apiShowImage($id) {
        $course = Course::find($id);
        return json_encode($course->cover_image);
    }

    public function apiShow(Request $request, $id)
    {
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
        // if ()
        $coursePermission = CoursePermission::find($id);
        if ($coursePermission->course()->first()->user_id == Auth::user()->id) {
            $coursePermission -> delete();
            return json_encode(['success' => true]);
        } else {
            return json_encode(['success' => false]);
        }
    }

    public function apiGetPermissions($id) {
        return json_encode($this->permissions($id));
    }

    public function apiUpdatePermission(Request $request, $course_id, $user_id) {
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
}
