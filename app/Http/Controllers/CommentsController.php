<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Section;

use Auth;

class CommentsController extends Controller
{
    public function apiStore(Request $request) {
        $this -> validate($request,[
            'text' => 'required',
            'type' => 'required',
            'section_id' => 'required',
        ]);
        
        if ($request->input('private_to_user')) {
            if (!SectionsController::canView($request->section_id)) abort(401);
        } else {
            if (!SectionsController::canEdit($request->section_id)) abort(401);
        }
        
        //Create Section
        $comment = new Comment;
        $comment->text = $request->input('text');
        $comment->type = $request->input('type');
        $comment->section_id = $request->input('section_id');
        $comment->private_to_user = $request->input('private_to_user') ? Auth::user()->id : null;
        $comment->save();

        $returnComment = Comment::find($comment['id']);
        
        return json_encode($returnComment);
    }

    public function apiShow($id) {
        if (!$this->canView($id)) abort(401);
        $comment =  Comment::find($id);
        return $comment;
    }

    public function apiDestroy($id) {
        if (!$this->canEdit($id)) abort(401);
        $comment = Comment::find($id);
        $text = $comment->text;
        $comment -> delete();
        return json_encode($text);
    }

    public function apiEditText(Request $request, $id)
    {
        if (!$this->canView($id)) abort(401);
        $this -> validate($request,[
            'text' => 'required'
        ]);

        //update this Post, find it by id
        $comment = Comment::find($id);
        $comment -> text = $request->input('text');

        $comment -> save();

        //direct the page back to the index
        //set the success message to Post Created
        return json_encode("Comment Updated!");
    }

    public static function canEdit($id) {
        $isCommentPrivateToUser = Comment::where('id', $id)->whereNotNull('private_to_user')->first();

        if ($isCommentPrivateToUser) return $isCommentPrivateToUser->private_to_user == Auth::user()->id;

        $isCommentPublic = Comment::where('id', $id)->whereNull('private_to_user')->first();
        if ($isCommentPublic) {
            // Check if user has write privilege in assignment
            $assignment = Comment::find($id)->section()->first()->assignment()->first();
            return $assignment && AssignmentsController::canEdit($assignment->id);
        }

        return false;
    }

    public static function canView($id) {
        $isCommentPrivateToUser = Comment::where('id', $id)->whereNotNull('private_to_user')->where('private_to_user', Auth::user()->id)->first();
        if ($isCommentPrivateToUser) return true;

        $isCommentPublic = Comment::where('id', $id)->whereNull('private_to_user')->first();
        if ($isCommentPublic) {
            // Check if user has read privilege in assignment
            $assignment = Comment::find($id)->section()->first()->assignment()->first();
            return $assignment && AssignmentsController::canView($assignment->id);
        }

        return false;
    }
}
