<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
//return the course Model so we can use it here
use Illuminate\Support\Facades\Storage;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\User;
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
        //so doing this, we are prevening the guest to the website from seeing to anything
        //related to posts except index and show, so guests now can not create post
        //so creating a post became available only if you are a signed-in/authenicated user
        $this->middleware('auth', ['except' => ['index', 'show']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //this is the page that index retrieve
        //http://ffbuk.test/posts
        //return a view named index from posts folder

        // a model function that retrieve all the data from post table without using SQL queries
        // and that actual use Eloquent (object relational mapper) without any sql queries
        //$posts= Post::all();


        //we can control how we can return posts so ordered asc or desc by title
        //$posts = Post::orderBy('title','desc')->get();

        //we can also how many items we can return
        //returns only one item from the whole list
        //$posts = Post::orderBy('title','desc')-> take(1) ->get();

        //or even we can do conditions on the retrival (built in Eliqounet)
        //return only posts which has title== Post Two
        //$posts = Post::where('title','Post Two')->get();

        //we can also use normal sql
        //$posts = DB::select('SELECT * FROM posts');

        //put the posts into pages, each page takes 10 items for now per page
        $user_id = auth()->user()->id;
        $user = User::find($user_id);
        $courses = $user->courses()->orderBy('created_at', 'desc')->paginate(10);
        $invitations = $user->course_permissions()->orderBy('pending', 'DESC')->paginate(10);
        $invitedCourses = [];
        // $temp = new stdClass();
        foreach ($invitations as $invite) {
            $t2 = Course::find($invite->course_id);
            // $owner = User::find($t2->user_id);
            // $assignments = Assignment::where('course_id',$t2->id)->get();
            $invite->course = Course::find($invite->course_id);
            $invite->owner = User::find($t2->user_id);
            $invite->assignments = Assignment::where('course_id',$t2->id)->get();
            // $temp = (object) [
            //     'id' => $invite->id,
            //     'course_id' => $invite->course_id,
            //     'user_id' => $invite->user_id,
            //     'level' => $invite->level,
            //     'pending' => $invite->pending,
            //     'course' => Course::find($invite->course_id),
            //     'owner' => User::find($t2->user_id),
            //     'title' => $t2->title,
            //     'body' => $t2->body,
            //     'created_at' => $t2->created_at,
            //     'owner_id' => $owner->id,
            //     'owner_name' => $owner->name,
            //     'assignments' => $assignments
            // ];
            // array_push($invitedCourses,$temp);
        }

        return view('courses.index')->with('courses', $courses)
                                    ->with('invitations', $invitations)
                                    ->with('invitedCourses', $invitedCourses);
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

        $this -> imageUpload($request, $course['id']);

        // $returnCourse

        //direct the page back to the index
        //set the success message to Post Created
        return redirect('/courses')-> with('success', 'Your Course has been added successfully!');
    }

    public function imageUpload(Request $request, $id) 
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

    public function showImage($id) {
        $course = Course::find($id);
        return json_encode($course->cover_image);
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
        $permissions = \App\Http\Controllers\Api\CoursesController::permissions($id);
            
        return view('courses.show') -> with('course', $course)
                                    -> with( 'assignments', $assignments)
                                    -> with('permissions', $permissions);
    }

    public function showJSON(Request $request, $id)
    {
        $course = Course::find($id);

        return json_encode([
            'image' => $course->cover_image,
            'body' => $course->body,
            'createdAt' => $course->created_at,
            'username' => $course->user->name
        ]);
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
         return redirect('/dashboard')-> with('success', 'Course Updated!');

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

        // return redirect('/dashboard');
        // $this -> index();
        // $request->session()->flash('alert-success', 'User was successful added!');
        // return json_encode($title);
        Session::flash('success', 'This is a message!'); 

        return redirect()->route('courses');    
    }
}
