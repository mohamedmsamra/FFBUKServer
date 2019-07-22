<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// there are a  lot of functions built in already in "Model" that Post extends
// for example returning all the posts such as Post:all() is already built in function in Model
// that is why we are not going to add much to this class
/**
 * A course blongs to a user and it can have many assignments.
 * The user that created the course is the course owner. 
 * Other users can be invited to the course. 
 * Users invited to a course can see all assignments in that course and can use them for marking.
 */
class Course extends Model
{
    // Table Name
    protected $table= 'courses';

    // Primary Key field
    public $primaryKey ='id';

    // Timestamps
    // It is recorded when courses are created and updated
    public $timestamps= true;

    // that means that each single post has a relationship with a user and belongs to a user
    // Return the user this course belongs to (was created by)
    public function user(){
        return $this-> belongsTo('App\Models\User');
    }

    // Return all the assignments inside this course
    public function assignments(){
        return $this->hasMany('App\Models\Assignment');
    }

    // Return all permissions associated with this course
    // (i.e. who is invited to it and with what type of permission)
    public function permissions() {
        return $this->hasMany('App\Models\CoursePermission');
    }
}
