<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;

use App\Http\Controllers\Controller;
use App\User;
use App\Course;
use App\Models\CoursePermission;

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
        $permission -> pending = 0;
        $permission -> save();

        // return back()->with('success', 'Joined Course');
        return $permission;
    }
}
