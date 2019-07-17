<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;
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
}
