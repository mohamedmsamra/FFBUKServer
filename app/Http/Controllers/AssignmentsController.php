<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Assignment;

class AssignmentsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        //put the posts into pages, each page takes 10 items for now per page
        
        return view('welcome');

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create($course_id)
    {

         //dd($course_id);
         //return a view within the post folder
         return view('assignments.create')-> with('course_id', $course_id);
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
            'course_id' => 'required'
        ]);
        
        //Create Assignment
        $assignment = new Assignment;
        $assignment ->name = $request->input('title');   
        $assignment ->desc = $request->input('body'); 
        //the user_id is not coming from the form, we read it from auth(), which will read the id of current signed_in user
        $assignment ->course_id = $request->input('course_id');
        $assignment ->save();
        
        //direct the page back to the index
        //set the success message to Post Created
        return redirect('/courses/')-> with('success', 'Your Assignment has been added successfully!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $assignment=  Assignment::find($id);
        //check if the correct user wants to edit his/her own post
        return view('assignments.edit') -> with('assignment', $assignment);
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
        $this -> validate($request,[
            'title' => 'required'
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
         $assignment = Assignment::find($id);
         $assignment -> name = $request->input('title');
         if($request->hasFile('cover_image')){
             $course->cover_image = $fileNameToStore;
         }
         $assignment -> save();
 
         //direct the page back to the index
         //set the success message to Post Created
         return redirect('/courses')-> with('success', 'Assignment Updated!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $assignment = Assignment::find($id);
        $assignment -> delete();
        return redirect('/courses')-> with('success', 'Assignment Removed!');
    }
}
