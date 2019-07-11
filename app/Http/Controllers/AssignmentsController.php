<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;

class AssignmentsController extends Controller
{
    // /**
    //  * Display the specified resource.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function show($id)
    // {
    //     //
    // }

    // /**
    //  * Remove the specified resource from storage.
    //  *
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function destroy($id)
    // {
    //     $assignment = Assignment::find($id);
    //     $assignment -> delete();
    //     return redirect('/courses')-> with('success', 'Assignment Removed!');
    // }

    public function apiShow($id) {
        $template = Template::find($id);

        // Add sections
        $sections = Section::where('template_id', "=", $template['id'])->get();
        \Log::info($sections);
        foreach ($sections as $section) {
            \Log::info('Section '.$section->id.': ');
            \Log::info($section->marking_scheme);
            $pos_comments = Comment::where('section_id', '=', $section['id'])->where('type', '=', 'positive')->get();
            $neg_comments = Comment::where('section_id', '=', $section['id'])->where('type', '=', 'negative')->get();
            $section['positiveComments'] = $pos_comments;
            $section['negativeComments'] = $neg_comments;
        }
        
        $template['sections'] = $sections;
        \Log::info($template['sections']);

        return $template ? json_encode($template) : "{error: 'Template not found'}";
    }
    
    public function apiStore(Request $request) {
        \Log::info($request);
        $this -> validate($request,[
            'title' => 'required',
            'course_id' => 'required'
        ]);
        //Create Assignment
        $assignment = new Assignment;
        $assignment->name = $request->input('title');
        $assignment->course_id = $request->input('course_id');
        $assignment->save();

        return json_encode($assignment);
    }

    public function apiEditName(Request $request, $id) {
        $this -> validate($request,[
            'name' => 'required'
        ]);
        $assignment = Assignment::find($id);
        $assignment->name = $request->name;
        $assignment->save();
        return json_encode(['name' => $assignment->name]);
    }

    public function apiDestroy($id) {
        $assignment = Assignment::find($id);
        $assignment -> delete();
        return json_encode(['ok' => true]);
    }
}
