<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\CoursePermission;
use App\Models\Section;
use App\Models\Comment;

use Auth;
/**
 * The Assignments controller deals with saving and returning information to and from storage about assignments.
 */
class AssignmentsController extends Controller
{

    /**
     * Get all the information for one assignment given its id
     * 
     * @param int $id the assignment id
     * @return string a string containing the JSON representation of the assignment object
     */
    public function apiShow($id) {
        // If the authenticated user does not have access to view this assignment (is not invited or the course owner), abort
        if (!$this->canView($id)) abort(401);

        // Find the assignment and its course
        $assignment = Assignment::find($id);
        $course = $assignment->course()->first();
    
        $isOwner = $course->user_id == Auth::user()->id;

        // If the authenticated user is not the owner
        if (!$isOwner) {
            // Check if user has permission to the course
            $permission = CoursePermission::where('course_id', $course->id)->where('user_id', Auth::user()->id)->where('pending', false)->first();
            // If he doesn't, return an error message
            if (!$permission) return json_encode(['success' => false, 'message' => 'no permission']);
        }

        // Add the assignment sections
        $sections = Section::where('assignment_id', $assignment['id'])->get();
        foreach ($sections as $section) {
            // For each section, add its comments, both public and private to the current user
            $publicComments = Comment::where('section_id', $section['id'])->where('private_to_user', null);
            $privateComments = Comment::where('section_id', $section['id'])->where('private_to_user', Auth::user()->id);

            $userComments = $publicComments->union($privateComments)->get();

            // Devide the comments in positive comments and negative comments
            $section['positiveComments'] = array_values(array_filter($userComments->toArray(), function ($c) {return $c['type'] == 'positive'; }));
            $section['negativeComments'] = array_values(array_filter($userComments->toArray(), function ($c) {return $c['type'] == 'negative'; }));
        }
    
        $assignment['sections'] = $sections;
        // Add the user permission level
        $assignment['permissionLevel'] = ($isOwner || $permission->level == 1) ? 1 : 0;
        
        // If the assignment exists, return it as a JSON representation, otherwise return error message
        return $assignment ? json_encode($assignment) : json_encode(['error' => 'Assignment not found']);
    }
    
    /**
     * Save a new assignment to storage
     * 
     * @param Illuminate\Http\Request $request what needs to be sent in the post request
     * @return string a string containing the JSON representation of the assignment object
     */
    public function apiStore(Request $request) {
        // Validate the request data
        // The assignment title and course id are mandatory
        $this -> validate($request,[
            'title' => 'required',
            'course_id' => 'required'
        ]);
        // If the authenticated user is not the course owner, abort
        if (!CoursesController::canEdit($request->course_id)) abort(401);

        //Create new assignment with the given information and save it to storage
        $assignment = new Assignment;
        $assignment->name = $request->input('title');
        $assignment->course_id = $request->input('course_id');
        $assignment->save();

        // Return the assignment object in JSON representation
        return json_encode($assignment);
    }

    /**
     * Change the name of an assignment
     * 
     * @param Illuminate\Http\Request $request what needs to be sent in the update request
     * @param int $id the id of the assignment
     * @return string the new name of the assignment
     */
    public function apiEditName(Request $request, $id) {
        // If the authenticated user does not have authorisation to edit the assignment name, abort
        if (!$this->canManage($id)) abort(401);
        // The new assignment name is required
        $this -> validate($request,[
            'name' => 'required'
        ]);

        // Find the assignemnt and change its name
        $assignment = Assignment::find($id);
        $assignment->name = $request->name;
        $assignment->save();

        // Return the new name
        return json_encode(['name' => $assignment->name]);
    }

    /**
     * Remove an assignment from storage
     * 
     * @param int $id the id of the assignment
     * @return string the success of the removal
     */
    public function apiDestroy($id) {
        // If the authenticated user does not have authorisation to remove this assignment, abort
        if (!$this->canManage($id)) abort(401);

        // Find the assignment and remove it from storage
        $assignment = Assignment::find($id);
        $assignment -> delete();

        // If everything works, return ok
        return json_encode(['ok' => true]);
    }

    /**
     * Clone an existing assignment
     * 
     * @param Illuminate\Http\Request $request what needs to be sent in the post request
     * @param int $id the id of the assignment to be cloned
     * @return string a string containing the JSON representation of the new created assignment
     */
    public function apiCloneAssignment(Request $request, $id) {
        // The id of the course where the assignment must be cloned is required
        $this -> validate($request,[
            'course_id' => 'required'
        ]);

        // Find the assignment by its id
        $assignment = Assignment::find($id);
        // Replicate the assignment
        $newAssignment = $assignment->replicate();
        // Change the course id of the new assignment to the one from the request
        $newAssignment->course_id = $request->course_id;
        // Add 'copy' to the new assignment's name
        $newAssignment->name .= ' (copy)';
        // Save the assignment copy
        $newAssignment->save();

        // Clone all the section from the existing assignment to the new assignment
        $sections = Section::where('assignment_id', $id)->get();
        foreach ($sections as $section) {
            $newSection = $section->replicate();
            $newSection->assignment_id = $newAssignment->id;
            $newSection->save();

            // Clone all the comments from the existing assignment to the new assignment
            $publicComments = Comment::where('section_id', $section['id'])->where('private_to_user', null);
            $privateComments = Comment::where('section_id', $section['id'])->where('private_to_user', Auth::user()->id);

            $userComments = $publicComments->union($privateComments)->get();
            foreach ($userComments as $comment) {
                $newComment = $comment->replicate();
                $newComment->section_id = $newSection->id;
                $newComment->save();
            }
        }
        
        // Return the new assignment
        return json_encode($newAssignment);
    }

    /**
     * Get all the assignments the authenticated user has access to 
     * i.e. assignments belonging to courses owned by the user
     * or assignments belonging to courses the user is invited to
     * 
     * @return string a string containing the JSON representation of a list of courses and their subsequent assignments
     */
    public function apiGetAllAssignments() {
        // Get the list of all ids of courses owned by the authenticated user
        $createdCourses = Course::where('user_id', Auth::user()->id)->pluck('id');
        // Get the list of all ids of courses the authenticated user is invited to (has a course permission)
        $invitedCourses = CoursePermission::where('user_id', Auth::user()->id)->pluck('course_id');
        // Merge the two lists of courses
        $userCourses = $createdCourses->merge($invitedCourses);

        $courses = [];
        $course = (object)[];
        foreach($userCourses as $id) {
            // For each course the user has access to, get all relevant information
            // i.e. the course itself, the assignments and the owner
            $assignments = Assignment::where('course_id', $id)->get();
            if(count($assignments) > 0) {
                $course = Course::where('id',$id)->first();
                $course->assignments = $assignments;
                $course->owner = User::where('id',$course->user_id)->first()->name;
                // Remove all other irrelevant properties
                unset($course->body);
                unset($course->created_at);
                unset($course->updated_at);
                unset($course->user_id);
                unset($course->cover_image);
                
                // Add the course to the list of courses
                array_push($courses, $course);
            }
        }
    
        // Return the list of courses in JSON representation
        return json_encode($courses);
    }


    /**
     * Get the marking page for a given assignment id
     * 
     * @param int $assignment_id the id of the assignment to start marking with
     * @return \Illuminate\Http\Response the marking page for the given assignment
     */
    public function getMarking($assignment_id){
        if (!$this->canView($assignment_id)) abort(401);
        $title = 'Marking';
        // Find the assignment
        $assignment = Assignment::where('id', '=', $assignment_id)->first();
        // Abort if it doesn't exist
        if ($assignment === null) {
            abort(404);
        } else {
            // Otherwise, return the marking page with the assignment information
            return view('pages.newMarking', ['title' => $title, 'assignment' => $assignment]);
        }
    }

    /**
     * Get the statistics/analytics page for a given assignment id
     * 
     * @param int $id the id of the assignment to display statistics for
     * @return \Illuminate\Http\Response the statistics/analytics page for the given assignment
     */
    public function getStatistics($id) {
        if (!$this->canView($id)) abort(401);
        // Find the assignment and the course it belongs to
        $assignment = Assignment::find($id);
        $course = $assignment->course()->first();
        // Check if the authenticated user is the course owner
        $is_owner = $course->user_id == Auth::user()->id;

        // Return the statistics/analytics page with the assignment information
        return view('assignments.statistics', [
            'course' => $course,
            'assignment' => $assignment,
            'is_owner' => $is_owner
        ]);
    }

    
    /**
     * Check if the authenticated user can manage an assignment given its id (Owner of the course e.g. to create and remove assigments)
     * 
     * @param int $assignment_id the id of the assignment to check
     * @return boolean if the authenticated user can manage the assignment
     */
    public static function canManage($assignment_id) {
        // Find the course the assignment belongs to
        $course = Assignment::find($assignment_id)->course()->first();
        // Return if the course owner id is the same as the authenticated user id
        return $course->user_id == Auth::user()->id;
    }

    /**
     * Check if the authenticated user can edit an assignment given the assignment id (Read/write permissions in course e.g. manage the assign by adding/removing sections)
     * 
     * @param int $assignment_id the id of the assignment to check
     * @return boolean if the authenticated user can edit the assignment
     */
    public static function canEdit($assignment_id) {
        // Find the course the assignment belongs to
        $course = Assignment::find($assignment_id)->course()->first();

        // Check if there exists a course permission on this course for the authenticated user
        // that is not pending and has read/write permission level (level == 1)
        $hasEditRights = CoursePermission::where('course_id', $course->id)
                                         ->where('user_id', Auth::user()->id)
                                         ->where('level', 1)
                                         ->where('pending', false);

        // Return if the authenticated user either has read/write permission to the course or is the course owner
        return $hasEditRights->first() || AssignmentsController::canManage($assignment_id);
    }

    /**
     * Check if the authenticated user has permission to view an assignment given the assignment id
     * 
     * @param int $assignment_id the id of the assignment to check
     * @return boolean if the authenticated user has permission to view the assignment
     */
    public static function canView($assignment_id) {
        // Find the course this assignment belongs to
        $course = Assignment::find($assignment_id)->course()->first();

        // Check if there exists a course permission on this course for the authenticated user
        // that is not pending (can have any permission level)
        $hasReadRights = CoursePermission::where('course_id', $course->id)
                                         ->where('user_id', Auth::user()->id)
                                         ->where('pending', false);

        // Return if the authenticated user either has permission to the course or is the course owner
        return $hasReadRights->first() || AssignmentsController::canManage($assignment_id);
    }
}
