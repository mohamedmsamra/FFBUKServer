<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommentUse extends Model
{
    //Table Name
    protected $table = 'comment_uses';

    // Primary Key field
    public $primaryKey = 'id';

    //Timestamps
    public $timestamps = false;

    protected $attributes = [
        'count' => 0
    ];

    public function comment() {
        return $this->belongsTo('App\Models\Comment');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}
