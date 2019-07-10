<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\User;
use App\Course;
use App\Models\CoursePermission;
use Auth;

class CoursesController extends Controller
{
    public function getPermissions($id) {
        return json_encode($this->permissions($id));
    }

    public static function permissions($id) {
        $course = Course::find($id);

        $permissions = $course->permissions;

        $return = [];
        foreach ($permissions as $permission) {
            $r = [];
            $r['id'] = $permission->id;
            $user = User::find($permission->user_id);
            $r['user'] = array('id' => $user->id, 'name' => $user->name);
            $r['level'] = $permission->level;
            $r['pending'] = $permission->pending;
            array_push($return, $r);
        }

        return $return;
    }

    public function updatePermission(Request $request, $id, $user_id) {
        $this -> validate($request,[
            'level' => 'required'
        ]);
        
        if ($this->hasPermissionToUpdatePermissions($id, Auth::user()->id))
        // First check if user in the course has read/write permissions
        $permission = CoursePermission::find($id)->where('user_id', '=', $user_id)->first();
        $permission->level = $request->input('level');
        $permission->save();
        return json_encode("done");
    }

    public static function hasPermissionToUpdatePermissions($course_id, $user_id) {
        // Check if the user is the owner
        if (Course::find($course_id)->where('user_id', $user_id)->first()) return true;
        return false;

        // Check if the user has read/write permissions ??
    }
}
