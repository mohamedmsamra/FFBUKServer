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

/**
 * Storing and retrieveing information relating to the analytics for assignments
 * i.e. marking sessions and comment use counts
 */
class AnalyticsController extends Controller
{
    /**
     * Store a new marking session
     *
     * @param Request what needs to be sent in the post request
     */
    public function apiStoreSession(Request $request) {
        // Ensure the request information is complete
        $this -> validate($request,[
            'assignment_id' => 'required',
            'words' => 'required',
            'time' => 'required',
            'comments' => 'required'
        ]);

        // Get the authenticated user id
        $user_id = Auth::user()->id;
        
        // Given a list of all the ids of comments that were used in the session
        // increase the use count of this comment by this user
        foreach ($request->comments as $comment_id) {
            $this->apiUpdateCommentUse($comment_id);
        }

        // Create a new marking session with the given information
        $session = new MarkingSession;
        $session->assignment_id = $request->input('assignment_id');
        $session->user_id = $user_id;
        $session->words = $request->input('words');
        $session->time = $request->input('time');
        // Store the new marking session
        $session->save();

        // Return the resulting marking session
        return json_encode($session);
    }

    // Get the information for one particular session by the session id
    public function apiShowSession($id) {
        $session = MarkingSession::find($id);
        return json_encode($session);
    }    

    // Store a new comment use by the authenticated user for a given comment id
    private function apiStoreCommentUse($comment_id) {
        // Get the authenticated user id 
        $user_id = Auth::user()->id;
        
        // Create a new comment use with the given information
        $commentUse = new CommentUse;
        $commentUse->comment_id = $comment_id;
        $commentUse->user_id = $user_id;
        // Store the comment use
        $commentUse->save();

        // Return the created comment use
        return json_encode($commentUse);
    }

    /**
     * Increase the use count for a comment use given the comment id
     * @param integer $id the id of the comment we want to increase the count for
     */
    private function apiUpdateCommentUse($id) {
        // Get the authenticated user
        $user_id = Auth::user()->id;
        // Find the comment use that refers to the authenticated user and the comment id given
        $commentUse = CommentUse::where('comment_id', $id)->where('user_id', $user_id)->first();
        
        // If no comment use exists for this pair (i.e. this user hasn't used this comment before)
        // create a new comment use
        if (is_null($commentUse)) {
            $this->apiStoreCommentUse($id);
            // Retrieve the newly created comment use
            $commentUse = CommentUse::where('comment_id', $id)->where('user_id', $user_id)->first();
        } 

        // Increase the comment use count by one
        $commentUse->count = $commentUse->count + 1;
        // Save the changes
        $commentUse->save();

        // Return the modified comment use
        return json_encode($commentUse);
    }

    // Get a comment use by its id
    public function apiShowCommentUse($id) {
        $commentUse = CommentUse::find($id);
        return json_encode($commentUse);
    }

    /**
     * Get all analytics for the authenticated user for a given assignment
     * @param integer $assignment_id the id of the assignment we want analytics for
     * @return string $analytics a string containing the JSON representation of the object containing all analytics for this assignment and the authenticated user
     */
    public function apiShowAnalytics($assignment_id) {
        // Get the authenticated user id
        $user_id = Auth::user()->id;
        // Find the assignment
        $assignment = Assignment::find($assignment_id);
        // Store the id of the course this assignment belongs to for easy access
        $course_id = $assignment->course_id;

        // Compute boolean values that indicate the user access level
        // if the user created this course he is the owner
        $isOwner = Course::find($course_id)->user()->first()->id == $user_id;
        // if the user has a course permission to this course he is invited
        $isInvited = CoursePermission::where('course_id', $course_id)->where('user_id', $user_id)->first() != null;

        // If the authenticted user is neither the owner of the course nor invited to the course, don't return analytics
        if (! ($isOwner || $isInvited)) {
            return json_encode(["message" => "no access"]);
        }

        // Otherwise, build the analytics object
        $analytics = (object)[];     

        /** GENERAL STATISTICS - present for all users either invited or owners */ 

        // Get personal average time and words for the authenticated user
        $averages = $this->getAverageWordsAndTime($user_id, $assignment_id);
        $analytics->personal_average_words = $averages->average_words;
        $analytics->personal_average_time = $averages->average_time;
        $analytics->name = $assignment->name;

        // Get list of comments by popularity (for all users of the assignment, including all comments)
        $commentsList = (object)[];
        // Find all comments from this assignment
        $sections = Section::where('assignment_id', $assignment_id)->pluck('id');
        $commentsList = Comment::whereIn('section_id', $sections)->get();

        // Format each comment to only send relevant data
        foreach($commentsList as $comment) {
            // Save the comment text, type, if it's private (boolean), the section it belongs to and its total use count
            $comment->private = !is_null($comment->private_to_user);
            $comment->section = $comment->section()->first();
            $comment->count = $this->getTotalCommentCount($comment->id);
            
            // Unset all other unnecessary properties
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

        // Personal balance of positive and negative comments
        // Find all comment uses by this user
        // CONTINUE COMMENTS HERE
        $personalUses = CommentUse::where('user_id', $user_id)->get();
        $pos = 0;
        $neg = 0;

        foreach ($personalUses as $use) {
            $comm = Comment::find($use->comment_id);
            if (in_array($comm->section_id, json_decode(json_encode($sections), true))) {
                $comm->type == "positive" ? $pos += $use->count : $neg += $use->count;
            }
        }

        $analytics->balance_positive_comments = $pos;
        $analytics->balance_negative_comments = $neg;

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
            $analytics->total_average_times = round(($analytics->personal_average_time + array_sum(json_decode(json_encode($guests_times), true))) / (count($guests_times) + 1));

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
    
    /**
     * Get the average number of words and average time spent on a marking session by a given user on a given assignment
     * @param integer $user_id the id of the user
     * @param integer $assignment_id the id of the assignment
     * @return object an object containing the average number of words and the average time per marking session (by this user with this assignment)
     */
    public function getAverageWordsAndTime($user_id, $assignment_id) {
        // Find all marking sessions between this user id and assignment id
        $sessions = MarkingSession::where('assignment_id', $assignment_id)->where('user_id', $user_id)->get();
        // Compute the sum of word counts from all sessions
        $totalWords = array_sum(json_decode(json_encode($sessions->pluck('words')), true));
        // Compute the sum of times from all sessions
        $totalTime = array_sum(json_decode(json_encode($sessions->pluck('time')), true));
        $count = count($sessions);

        // Compute the average time and number of words
        if ($count != 0) {
            // if there are sessions for this user and assignment pair, compute the average
            $result = (object) [
                'average_words' => round($totalWords / $count),
                'average_time' => round($totalTime / $count),
            ];
        } else {
            // otherwise, set both averages to 0
            $result = (object) [
                'average_words' => $totalWords,
                'average_time' => $totalTime,
            ];
        }

        // Return the object containing the average time and average number of words
        return $result;
    }

    /**
     * Get the total number of times this comment been used
     * @param integer $comment_id the id of the comment
     * @return integer $count how many time this comment has been used by all users
     */
    public function getTotalCommentCount($comment_id) {
        $count = 0;
        
        // Find all comment uses that refer to this comment
        $uses = CommentUse::where('comment_id', $comment_id)->get();

        // Add all counts from the comment uses to the total count
        if (sizeof($uses) != 0) {
            foreach ($uses as $use) {
                $count += $use->count;
            }
        }
        
        // Return the total count
        return $count;
    }
    
}
