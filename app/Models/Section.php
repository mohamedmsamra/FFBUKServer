<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A section belongs to an assignment and it can have many comments.
 * Section have text boxes where users can write the feedback
 * and comments which can be used to write feedback more quickly.
 */
class Section extends Model
{
    // Table Name
    protected $table = 'sections';

    // Primary Key field
    public $primaryKey = 'id';

    // Timestamps
    // It is recorded when sections are created and updated
    public $timestamps = true;

    // Return the assignment this section belongs to
    public function assignment() {
        return $this->belongsTo('App\Models\Assignment');
    }

    // Return the comments of the section
    public function comments() {
        return $this->hasMany('App\Models\Comment');
    }
}
