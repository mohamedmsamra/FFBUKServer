<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Assignment;

class AssignmentsController extends Controller {
    public function store(Request $request) {
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

    public function editName(Request $request) {
        $this -> validate($request,[
            'id' => 'required',
            'name' => 'required'
        ]);
        $assignment = Assignment::find($request->id);
        $assignment->name = $request->name;
        $assignment->save();
        return json_encode(['name' => $assignment->name]);
    }

    public function destroy($id) {
        $assignment = Assignment::find($id);
        $assignment -> delete();
        return json_encode(['ok' => true]);
    }
}
