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
            'template_id' => 'required'
        ]);
        
        //Create Section
        $section = new Section;
        $section->title = $request->input('title');
        $section->template_id = $request->input('template_id');
        $section->save();
        
        return json_encode("done");
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

    // Used to create a section and the corresponding comments
    public function apiPostNewSection(Request $request) {
        $this -> validate($request,[
            'title' => 'required',
            'template_id' => 'required',
            'positiveComments' => 'present|array',
            'negativeComments' => 'present|array',
            'marking_scheme' => 'string|nullable'
        ]);

        $section = new Section;
        $section->title = $request->input('title');
        $section->template_id = $request->input('template_id');
        $section->marking_scheme = $request->input('marking_scheme');
        $section->save();
        
        foreach ($request->positiveComments as $pc) {
            $comment = new Comment;
            $comment->text = $pc;
            $comment->type = "positive";
            $comment->section_id = $section['id'];
            $comment->save();
        }

        foreach ($request->negativeComments as $nc) {
            $comment = new Comment;
            $comment->text = $nc;
            $comment->type = "negative";
            $comment->section_id = $section['id'];
            $comment->save();
        }

        $returnSection = Section::find($section['id']);
        $pos_comments = Comment::where('section_id', '=', $section['id'])->where('type', '=', 'positive')->get();
        $neg_comments = Comment::where('section_id', '=', $section['id'])->where('type', '=', 'negative')->get();
        $returnSection['positiveComments'] = $pos_comments;
        $returnSection['negativeComments'] = $neg_comments;

        return json_encode($returnSection);
    }

    public function apiDestroy($id) {
        $section = Section::find($id);
        $title = $section->title;
        $section -> delete();
        return json_encode($title);
    }

    public function apiUpdate(Request $request, $id)
    {
        $this -> validate($request,[
            'title' => 'required',
            'template_id' => 'required',
            'positiveComments' => 'present|array',
            'negativeComments' => 'present|array',
            'marking_scheme' => 'string|nullable'
        ]);

         //update this Post, find it by id
         $section = Section::find($id);
         $section -> title = $request->input('title'); 
         $section -> marking_scheme = $request->input('marking_scheme'); 
         $section -> save();
 
         //direct the page back to the index
         //set the success message to Post Created
         return json_encode("Section Updated!");
    }

    public function apiImageUpload($id)
    {
        $section =  Section::find($id);
        return json_encode($section->marking_scheme);
    }

    public function apiImageUploadPost(Request $request, $id)
    {
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
}
