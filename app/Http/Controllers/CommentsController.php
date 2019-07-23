<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Section;

use Auth;

/**
 * The Comments Controller deals with saving and returning information to and from storage about comments.
 */
class CommentsController extends Controller
{
    /**
     * Save a new comment to storage
     * 
     * @param Illuminate\Http\Request $request what needs to be sent in the post request
     * @return string a string containing the JSON representation of the comment object
     */
    public function apiStore(Request $request) {
        // Validate the request data
        // The comment text, type and section id are mandatory
        $this -> validate($request,[
            'text' => 'required',
            'type' => 'required',
            'section_id' => 'required',
        ]);
        
        // If the comment is private to a user
        if ($request->input('private_to_user')) {
            // And the authenticated user does not have permission to view the section, abort
            if (!SectionsController::canView($request->section_id)) abort(401);
        } else {
            // And the authenticated user does not have permission to edit the section, abort
            if (!SectionsController::canEdit($request->section_id)) abort(401);
        }
        
        // Create a new comment with the information provided
        $comment = new Comment;
        $comment->text = $request->input('text');
        $comment->type = $request->input('type');
        $comment->section_id = $request->input('section_id');
        $comment->private_to_user = $request->input('private_to_user') ? Auth::user()->id : null;
        $comment->save();

        // Get the newly created comment
        $returnComment = Comment::find($comment['id']);
        
        // Return the created comment in JSON representation
        return json_encode($returnComment);
    }

    /**
     * Get all the information for one comment given its id
     * 
     * @param int $id the comment id
     * @return object the comment object
     */
    public function apiShow($id) {
        // If the authenticated user does not have authorisation to see this comment, abort
        // i.e. if the comment is private to different user
        if (!$this->canView($id)) abort(401);
        // Find the comment and return it
        $comment =  Comment::find($id);
        return $comment;
    }

    /**
     * Remove a comment from storage
     * 
     * @param int $id the id of the comment
     * @return string the text of the removed comment
     */
    public function apiDestroy($id) {
        // If the authenticated user does not have authorisation to remove this comment, abort
        // i.e. if the comment is not private to them and they are not the course owner nor have read/write permissions for the course
        if (!$this->canEdit($id)) abort(401);

        // Find the comment, save the text and remove the comment from storage
        $comment = Comment::find($id);
        $text = $comment->text;
        $comment -> delete();

        // Return the text of the deleted comment
        return json_encode($text);
    }

    /**
     * Change the text of a comment
     * 
     * @param Illuminate\Http\Request $request what needs to be sent in the update request
     * @param int $id the id of the comment
     * @return string a confirmation message
     */
    public function apiEditText(Request $request, $id)
    {
        // If the authenticated user does not have authorisation to edit the comment text, abort
        // i.e. if the comment is not private to them and they are not the course owner nor have read/write permissions for the course
        if (!$this->canEdit($id)) abort(401);

        // The new comment text is required
        $this -> validate($request,[
            'text' => 'required'
        ]);

        // Find the comment, change the text and save the changes to storage
        $comment = Comment::find($id);
        $comment->text = $request->input('text');
        $comment->save();

        // Return a success message
        return json_encode("Comment Updated!");
    }

    // User has permission to edit this comment
    // ie either private to this user, or public and user has edit rights
    /**
     * Check if the authenticated user has permission to edit this comment
     * i.e. the comment is either private to this user, or public and the user has read/write permissions on the course
     * 
     * @param int $id the id of the comment to check
     * @return boolean if the authenticated user can edit the comment
     */
    public static function canEdit($id) {
        // Get the comment with this id that is private to a user
        // Can be null if private to user is null, i.e. the comment is public
        $isCommentPrivateToUser = Comment::where('id', $id)->whereNotNull('private_to_user')->first();

        // If the comment is private to a user, return if that user is the authenticated user
        if ($isCommentPrivateToUser) return $isCommentPrivateToUser->private_to_user == Auth::user()->id;

        // Get the comment with this id that is public
        // i.e. private to user is null
        $isCommentPublic = Comment::where('id', $id)->whereNull('private_to_user')->first();
        // If the comment is public (it exists)
        if ($isCommentPublic) {
            // Check and return if user has read/write permissions for the assignment
            $assignment = Comment::find($id)->section()->first()->assignment()->first();
            return $assignment && AssignmentsController::canEdit($assignment->id);
        }

        // If none of the previous checks are passed, the user does not have edit permission on this comment
        // i.e. the comment is either private to a different user 
        // or the user is not the owner nor does he have read/write permission to the assignment
        return false;
    }

    /**
     * Check if the authenticated user has permission to view this comment
     * i.e. the comment is either private to this user, or public
     * 
     * @param int $id the id of the comment to check
     * @return boolean if the authenticated user can edit the comment
     */
    public static function canView($id) {
        // Get the comment with this id that is private to a user this user
        // Can be null if private to user is not this user's id
        $isCommentPrivateToUser = Comment::where('id', $id)->whereNotNull('private_to_user')->where('private_to_user', Auth::user()->id)->first();

        // If the comment is private to this user, the user has permission to view it so return true
        if ($isCommentPrivateToUser) return true;

        // Get the comment with this id that is public
        // Can be null if private to user is not null, i.e. the comment is private 
        $isCommentPublic = Comment::where('id', $id)->whereNull('private_to_user')->first();
        // If the comment is public
        if ($isCommentPublic) {
            // Check and return if user has permission to view the assignment
            $assignment = Comment::find($id)->section()->first()->assignment()->first();
            return $assignment && AssignmentsController::canView($assignment->id);
        }

        // If none of the previous checks are passed, the user does not have view permission on this comment
        // i.e. the comment is either private to a different user or the user does not have access to the assignment
        return false;
    }
}
