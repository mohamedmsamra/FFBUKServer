<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\CoursePermission;
use App\Models\Section;
use App\Models\Comment;

use Auth;

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
        $assignment = Assignment::find($id);
        
        $course = $assignment->course()->first();
        $isOwner = $course->user_id == Auth::user()->id;

        if (!$isOwner) {
            // Check if user has permission to the course
            $permission = CoursePermission::where('course_id', $course->id)->where('user_id', Auth::user()->id)->where('pending', false)->first();
            if (!$permission) return json_encode(['success' => false, 'message' => 'no permission']);
        }

        // Add sections
        $sections = Section::where('assignment_id', $assignment['id'])->get();
        foreach ($sections as $section) {
            $pos_comments = Comment::where('section_id', $section['id'])->where('type', 'positive')->get();
            $neg_comments = Comment::where('section_id', $section['id'])->where('type', 'negative')->get();
            $section['positiveComments'] = $pos_comments;
            $section['negativeComments'] = $neg_comments;
        }
        
        $assignment['sections'] = $sections;
        $assignment['permissionLevel'] = ($isOwner || $permission->level == 1) ? 1 : 0;
        
        return $assignment ? json_encode($assignment) : json_encode(['error' => 'Assignment not found']);
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
