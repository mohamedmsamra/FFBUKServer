<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;
use App\Models\MarkingSession;

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
}
