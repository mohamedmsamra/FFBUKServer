<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Comment;

class SectionsController extends Controller
{
    public function apiStore(Request $request) {
        $this -> validate($request,[
            'title' => 'required',
            'assignment_id' => 'required'
        ]);

        if (!AssignmentsController::canEdit($request->assignment_id)) abort(401);
        
        //Create Section
        $section = new Section;
        $section->title = $request->input('title');
        $section->assignment_id = $request->input('assignment_id');
        $section->save();
        
        return json_encode($section);
    }

    public function apiShow($id) {
        $section =  Section::find($id);
        // // Add comments
        // foreach ($templates as $template) {
        //     $sections = Section::where('template_id', "=", $template['id'])->get();
        //     $template['sections'] = $sections;
        // }
        return $section;
    }

    public function apiDestroy($id) {
        if (!$this->canEdit($id)) abort(401);

        $section = Section::find($id);
        $title = $section->title;
        $section -> delete();
        return json_encode($title);
    }

    public function apiEditTitle(Request $request, $id)
    {
        if (!$this->canEdit($id)) abort(401);

        $this -> validate($request,[
            'title' => 'required'
        ]);

         //update this Post, find it by id
         $section = Section::find($id);
         $section -> title = $request->input('title'); 
         $section -> save();
 
         //direct the page back to the index
         //set the success message to Post Created
         return json_encode("Section Updated!");
    }

    public function apiUploadImage(Request $request, $id)
    {
        if (!$this->canEdit($id)) abort(401);
        
        $this -> validate($request,[
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);

        // Get image from request
        $img = $request -> image;

        $user_id = auth()->user()->id;

        // Check if user folder exists and create it if not
        $path = storage_path('app/public/user_'.$user_id);
        if(!file_exists($path)) {
            // path does not exist
            \File::makeDirectory($path);
        }

        $matches = glob($path.'/markingScheme_'.$id.'*');
        foreach ($matches as $match) {
            \Log::info($match);
            unlink($match);
        }

        // Generate image name
        $imageName = 'markingScheme_'.$id.'_'.date("YmdHis").'.'.$img->getClientOriginalExtension();

        // Save image to user folder
        $img->move($path, $imageName);
        \Log::info(date("YmdHis"));
               

        $toDB = 'user_'.$user_id.'\\'.$imageName;

        $section = Section::find($id);
        $section -> marking_scheme = $toDB; 
        $section -> save();

        return json_encode($toDB);
    }

    public static function canEdit($id) {
        $assignment = Section::find($id)->assignment()->first();

        return $assignment && AssignmentsController::canEdit($assignment->id);
    }

    public static function canView($id) {
        $assignment = Section::find($id)->assignment()->first();

        return $assignment && AssignmentsController::canView($assignment->id);
    }
}
