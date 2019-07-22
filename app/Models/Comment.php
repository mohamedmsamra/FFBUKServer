<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A comment belongs to a section. 
 * It can be either private or public.
 * Public means it can be seen by all users.
 * Private means it can only be seen by the user that created it
 */
class Comment extends Model
{
    // Table Name
    protected $table = 'comments';

    // Primary Key field
    public $primaryKey = 'id';

    // Timestamps
    // It is recorded when comments are created and updated
    public $timestamps = true;

    // Return the section this comment belongs to
    public function section() {
        return $this->belongsTo('App\Models\Section');
    }

    // Return the user this comment is private to
    // (can be null, which means the comment is public to everyone)
    public function private_to_user() {
        return $this->belongsTo('App\Models\User');
    }

    // Return the use count of this comment for all users that have used it
    public function comment_uses() {
        return $this->hasMany('App\Models\CommentUse');
    }
}
