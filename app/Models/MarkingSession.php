<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * A marking session is a relation between a user and an assignment.
 * Every time a user marks a report using an assignment, information about that marking session is recorded
 * namely, the time spent and the number of words used on that marking session
 */
class MarkingSession extends Model
{
    // Table Name
    protected $table = 'marking_sessions';

    // Primary Key field
    public $primaryKey = 'id';

    // Timestamps
    // It is NOT recorded when marking sessions are created and updated
    public $timestamps = false;

    // Default values for attributes
    // By default, the number of words and the time spent should be 0
    protected $attributes = [
        'words' => 0,
        'time' => 0
    ];

    // Return the assignment this marking session belongs to
    public function assignment() {
        return $this->belongsTo('App\Models\Assignment');
    }

    // Return the user this marking session belongs to
    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}
