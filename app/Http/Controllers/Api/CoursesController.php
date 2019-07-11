<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
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

    public function joinCourse($id) {
        $permission = CoursePermission::find($id);
        if ($permission -> user_id == Auth::user()->id) {
            $permission -> pending = 0;
            $permission -> save();
    
            return back()->with('success', 'Joined Course');
        }
        return back()->with('error', "Don't have permission to do that");
        // return $permission;
    }

    public function updatePermission(Request $request, $id, $user_id) {
        $this -> validate($request,[
            'level' => 'required'
        ]);
        
        if ($this->hasPermissionToUpdatePermissions($id, Auth::user()->id)) {
            // First check if user in the course has read/write permissions
            $permission = CoursePermission::where('course_id', $id)->where('user_id', $user_id)->first();
            $permission->level = $request->input('level');
            $permission->save();
            return json_encode("done");
        }
        return json_encode(['error' => 'You don\'t have permission for that']);
    }

    public static function hasPermissionToUpdatePermissions($course_id, $user_id) {
        // Check if the user is the owner
        if (Course::where('id', $course_id)->where('user_id', $user_id)->first()) return true;
        return false;

        // Check if the user has read/write permissions ??
    }
}
