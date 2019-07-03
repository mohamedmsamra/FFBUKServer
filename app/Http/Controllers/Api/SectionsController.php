<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Models\Comment;

class SectionsController extends Controller
{
    public function store(Request $request) {
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

    public function show($id) {
        $section =  Section::find($id);
        // // Add comments
        // foreach ($templates as $template) {
        //     $sections = Section::where('template_id', "=", $template['id'])->get();
        //     $template['sections'] = $sections;
        // }
        return $section;
    }

    // Used to create a section and the corresponding comments
    public function postNewSection(Request $request) {
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

    public function destroy($id) {
        $section = Section::find($id);
        $title = $section->title;
        $section -> delete();
        return json_encode($title);
    }

    public function update(Request $request, $id)
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

    public function imageUpload($id)
    {
        $section =  Section::find($id);
        return json_encode($section->marking_scheme);
    }

    public function imageUploadPost(Request $request, $id)
    {
        $this -> validate($request,[
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg'
        ]);
        
        $img = $request -> image;
        $imageName = 'marking'.$id.'.'.$img->getClientOriginalExtension();
        \Log::info($imageName);
        $img->move(public_path('images'), $imageName);
        // \Image::make($request->get('image'))->save(public_path('images/').$imageName);

        $section = Section::find($id);
        $section -> marking_scheme = $imageName; 
        $section -> save();

        return json_encode($imageName);
    }
}
