<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A course permission is a relation between a course and a user.
 * It expresses what type of permission a user has for a course. 
 * When a user is invited to a course, they can have read only permission
 * or read/write permission, which allows them to edit the content of assignments
 */
class CoursePermission extends Model
{
    //Table Name
    protected $table = 'course_permissions';

    // Primary Key field
    public $primaryKey = 'id';

    // Timestamps
    // It is NOT recorded when course permissions are created and updated
    public $timestamps = false;

    // Default values for attributes
    // By default, the permission level for a course invitation should be 0 (read only)
    // and pending should be true (i.e. the invited user has to approve the invitation)
    protected $attributes = [
        'level' => 0,
        'pending' => true,
    ];

    // Return the course this course permission concerns
    public function course() {
        return $this->belongsTo('App\Models\Course');
    }

    // Return the user this course permission refers to
    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}
