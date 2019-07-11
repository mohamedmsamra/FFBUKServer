<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoursePermission extends Model
{
    //Table Name
    protected $table = 'course_permissions';

    // Primary Key field
    public $primaryKey = 'id';

    //Timestamps
    public $timestamps = false;

    public function course() {
        return $this->belongsTo('App\Models\Course');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}
