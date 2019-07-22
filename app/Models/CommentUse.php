<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A comment use records a relationship between a comment and a user.
 * It hold the use count for a particular comment by a particular user.
 */
class CommentUse extends Model
{
    // Table Name
    protected $table = 'comment_uses';

    // Primary Key field
    public $primaryKey = 'id';

    // Timestamps
    // It is NOT recorded when comment uses are created and updated
    public $timestamps = false;

    // Default values for attributes
    // The count should be 0 at first
    protected $attributes = [
        'count' => 0
    ];

    // Return the comment this comment use concerns
    public function comment() {
        return $this->belongsTo('App\Models\Comment');
    }

    // Return the user this comment use refers to
    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}
