<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Users are people who register on the website. 
 * They can own many courses.
 * They can be invited to many courses.
 * A user must verify their email address and can reset his account password.
 */
class User extends Authenticatable implements MustVerifyEmail, CanResetPassword
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'school_department', 'role', 'password'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Return all the courses created by this user
    public function courses(){
        return $this->hasMany('App\Models\Course');
    }

    // Return all the course permissions that refer to this user
    // i.e. invitations to courses with different levels of permission
    public function course_permissions() {
        return $this->hasMany('App\Models\CoursePermission');
    }

    // Return all the comments that are private to this user
    public function private_comments() {
        return $this->hasMany('App\Models\Comment');
    }

    // Return all the marking sessions this user has had
    public function marking_sessions() {
        return $this->hasMany('App\Models\MarkingSession');
    }

    // For comments this user used, return how many times they used each
    public function comment_uses() {
        return $this->hasMany('App\Models\CommentUse');
    }
}
