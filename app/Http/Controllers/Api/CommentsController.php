<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Section;

class CommentsController extends Controller
{
    public function store(Request $request) {
        $this -> validate($request,[
            'text' => 'required',
            'type' => 'required',
            'section_id' => 'required'
        ]);
        
        //Create Section
        $comment = new Comment;
        $comment->text = $request->input('text');
        $comment->type = $request->input('type');
        $comment->section_id = $request->input('section_id');
        $comment->save();

        $returnComment = Comment::find($comment['id']);
        
        return json_encode($returnComment);
    }

    public function show($id) {
        $comment =  Comment::find($id);
        return $comment;
    }

    public function destroy($id) {
        $comment = Comment::find($id);
        $comment -> delete();
        return json_encode("done");
    }

    public function update(Request $request, $id)
    {
        $this -> validate($request,[
            'text' => 'required',
            'type' => 'required',
            'section_id' => 'required'
        ]);

        //update this Post, find it by id
        $comment = Comment::find($id);
        $comment -> text = $request->input('text');

        $comment -> save();

        //direct the page back to the index
        //set the success message to Post Created
        return json_encode("Comment Updated!");
    }
}
