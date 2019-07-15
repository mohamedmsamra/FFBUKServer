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
        if (!$this->canView($id)) abort(401);
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
            $publicComments = Comment::where('section_id', $section['id'])->where('private_to_user', null);
            $privateComments = Comment::where('section_id', $section['id'])->where('private_to_user', Auth::user()->id);

            $userComments = $publicComments->union($privateComments)->get();

            $section['positiveComments'] = array_values(array_filter($userComments->toArray(), function ($c) {return $c['type'] == 'positive'; }));
            $section['negativeComments'] = array_values(array_filter($userComments->toArray(), function ($c) {return $c['type'] == 'negative'; }));
        }
        
        $assignment['sections'] = $sections;
        $assignment['permissionLevel'] = ($isOwner || $permission->level == 1) ? 1 : 0;
        
        return $assignment ? json_encode($assignment) : json_encode(['error' => 'Assignment not found']);
    }
    
    public function apiStore(Request $request) {
        $this -> validate($request,[
            'title' => 'required',
            'course_id' => 'required'
        ]);
        if (!CoursesController::canEdit($request->course_id)) abort(401);
        //Create Assignment
        $assignment = new Assignment;
        $assignment->name = $request->input('title');
        $assignment->course_id = $request->input('course_id');
        $assignment->save();

        return json_encode($assignment);
    }

    public function apiEditName(Request $request, $id) {
        if (!$this->canManage($id)) abort(401);
        $this -> validate($request,[
            'name' => 'required'
        ]);
        $assignment = Assignment::find($id);
        $assignment->name = $request->name;
        $assignment->save();
        return json_encode(['name' => $assignment->name]);
    }

    public function apiDestroy($id) {
        if (!$this->canManage($id)) abort(401);
        $assignment = Assignment::find($id);
        $assignment -> delete();
        return json_encode(['ok' => true]);
    }

    // Owner of the course
    // e.g. to create and remove assigments
    public static function canManage($assignment_id) {
        $course = Assignment::find($assignment_id)->course()->first();
        return $course->user_id == Auth::user()->id;
    }

    // Read/write permissions in course
    // e.g. manage the assign by adding/removing sections
    public static function canEdit($assignment_id) {
        $course = Assignment::find($assignment_id)->course()->first();

        $hasEditRights = CoursePermission::where('course_id', $course->id)
                                         ->where('user_id', Auth::user()->id)
                                         ->where('level', 1)
                                         ->where('pending', false);

        return $hasEditRights->first() || AssignmentsController::canManage($assignment_id);
    }

    // Read permission only
    public static function canView($assignment_id) {
        $course = Assignment::find($assignment_id)->course()->first();

        $hasReadRights = CoursePermission::where('course_id', $course->id)
                                         ->where('user_id', Auth::user()->id)
                                         ->where('pending', false);

        return $hasReadRights->first() || AssignmentsController::canManage($assignment_id);
    }
}
