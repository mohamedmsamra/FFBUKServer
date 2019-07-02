<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Assignment;

class AssignmentsController extends Controller {
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
}
