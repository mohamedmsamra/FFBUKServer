<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    //Table Name
    protected $table = 'comments';

    // Primary Key field
    public $primaryKey = 'id';

    //Timestamps
    public $timestamps = true;

    public function section() {
        return $this->belongsTo('App\Models\Section');
    }

    public function private_to_user() {
        return $this->belongsTo('App\Models\User');
    }

    public function comment_uses() {
        return $this->hasMany('App\Models\CommentUse');
    }
}
