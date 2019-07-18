<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Assignment;
use App\Models\Section;
use App\Models\Comment;
use App\Models\CoursePermission;
use App\Models\MarkingSession;
use App\Models\CommentUse;

use Auth;

class AnalyticsController extends Controller
{
    
    public function apiStoreSession(Request $request) {
        $this -> validate($request,[
            'assignment_id' => 'required',
            'words' => 'required',
            'time' => 'required'
        ]);

        $user_id = Auth::user()->id;
        
        //Create Session
        $session = new MarkingSession;
        $session->assignment_id = $request->input('assignment_id');
        $session->user_id = $user_id;
        $session->words = $request->input('words');
        $session->time = $request->input('time');
        $session->save();

        return json_encode($session);
    }

    // One session info
    public function apiShowSession($id) {
        $session = MarkingSession::find($id);
        return json_encode($session);
    }    

    public function apiStoreCommentUse(Request $request) {
        $this -> validate($request,[
            'comment_id' => 'required'
        ]);

        $user_id = Auth::user()->id;
        
        //Create Session
        $commentUse = new CommentUse;
        $commentUse->comment_id = $request->input('comment_id');
        $commentUse->user_id = $user_id;
        $commentUse->save();

        return json_encode($commentUse);
    }

    public function apiUpdateCommentUse(Request $request) {
        $user_id = Auth::user()->id;
        $commentUse = CommentUse::where('comment_id', $request->comment_id)->where('user_id', $user_id)->first();
        
        if (is_null($commentUse)) {
            $this->apiStoreCommentUse($request);
            $commentUse = CommentUse::where('comment_id', $request->comment_id)->where('user_id', $user_id)->first();
        } 
        $commentUse->count = $commentUse->count + 1;
        $commentUse->save();

        return json_encode($commentUse);
    }

    public function apiShowCommentUse($id) {
        $commentUse = CommentUse::find($id);
        return json_encode($commentUse);
    }

    public function apiShowAnalytics($assignment_id) {
        $user_id = Auth::user()->id;
        $assignment = Assignment::find($assignment_id);
        $course_id = $assignment->course_id;

        // User access level
        $isOwner = Course::find($course_id)->user()->first()->id == $user_id;
        $isInvited = CoursePermission::where('course_id', $course_id)->where('user_id', $user_id)->first() != null;

        // If the authenticted user is netiher the owner of the course nor invited to the course, don't return analytics
        if (! ($isOwner || $isInvited)) {
            return json_encode(["message" => "no access"]);
        }

        $analytics = (object)[];     

        // Personal average time and words for the authenticated user
        $averages = $this->getAverageWordsAndTime($user_id, $assignment_id);
        $analytics->personal_average_words = $averages->average_words;
        $analytics->personal_average_time = $averages->average_time;

        // List of comments by popularity for all users of the assignment
        $commentsList = (object)[];
        $sections = Section::where('assignment_id', $assignment_id)->pluck('id');
        $commentsList = Comment::whereIn('section_id', $sections)->get();

        foreach($commentsList as $comment) {

            $comment->private = !is_null($comment->private_to_user);
            $comment->section = $comment->section()->first();
            $comment->count = $this->getTotalCommentCount($comment->id);
            
            // Unset unnecessary properties
            unset($comment->id);
            unset($comment->section_id);
            unset($comment->section->assignment_id);
            unset($comment->section->created_at);
            unset($comment->section->updated_at);
            unset($comment->section->marking_scheme);
            unset($comment->private_to_user);
            unset($comment->created_at);
            unset($comment->updated_at);
        }
        $analytics->comments = $commentsList;

        // Analytics specific to the assignment owner
        if ($isOwner) {
            // Get all user ids (except owner) from marking sessions for this assignment
            $guests = MarkingSession::where('assignment_id', $assignment_id)->where('user_id', '!=', $user_id)->pluck('user_id');
            $guests = array_unique(json_decode(json_encode($guests, true)));
            // Arrays to hold the averages for all guest users
            $guests_words = array();
            $guests_times = array();

            foreach ($guests as $guest) {
                // Get the average words and time for each guest user and add those to the arrays
                $res = $this->getAverageWordsAndTime($guest, $assignment_id);
                array_push($guests_words, $res->average_words);
                array_push($guests_times, $res->average_time);
            }

            $analytics->guests_average_words = $guests_words;
            $analytics->guests_average_times = $guests_times;
            // the overall
            $analytics->total_average_words = round(($analytics->personal_average_words + array_sum(json_decode(json_encode($guests_words), true))) / (count($guests_words) + 1));

        // Analytics specific to the assignment guests
        } else if ($isInvited) {
            // Get the word count and time for each session by the current user
            $sessions_words = MarkingSession::where('assignment_id', $assignment_id)->where('user_id', $user_id)->pluck('words');
            $sessions_times = MarkingSession::where('assignment_id', $assignment_id)->where('user_id', $user_id)->pluck('time');

            $analytics->all_sessions_words = $sessions_words;
            $analytics->all_sessions_times = $sessions_times;
        }

        return json_encode($analytics);        
    }
    
    
    public function getAverageWordsAndTime($user_id, $assignment_id) {
        // $result = (object)[];
        $sessions = MarkingSession::where('assignment_id', $assignment_id)->where('user_id', $user_id)->get();
        $totalWords = array_sum(json_decode(json_encode($sessions->pluck('words')), true));
        $totalTime = array_sum(json_decode(json_encode($sessions->pluck('time')), true));
        $count = count($sessions);

        if ($count != 0) {
            $result = (object) [
                'average_words' => round($totalWords / $count),
                'average_time' => round($totalTime / $count),
            ];
        } else {
            $result = (object) [
                'average_words' => $totalWords,
                'average_time' => $totalTime,
            ];
        }
        

        return $result;
    }

    public function getTotalCommentCount($comment_id) {
        $count = 0;
        
        $uses = CommentUse::where('comment_id', $comment_id)->get();
        if (sizeof($uses) != 0) {
            foreach ($uses as $use) {
                $count += $use->count;
            }
        }
        
        return $count;
    }
    
}
