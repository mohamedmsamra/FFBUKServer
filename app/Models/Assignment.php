<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * An assignment belongs to a course and is made up of sections.
 * It is what users use to produce feedback
 */

class Assignment extends Model
{

    // Table Name
    protected $table= 'assignments';

    // Primary Key field
    public $primaryKey ='id';

    // Timestamps
    // It is recorded when assignments are created and updated
    public $timestamps= true;

    // Return the course this assignment belongs to
    public function course(){
        return $this->belongsTo('App\Models\Course');
    }

    // Return the sections in this assignment
    public function sections() {
        return $this->hasMany('App\Models\Section');
    }

    // Return the marking sessions for this assignment
    public function marking_sessions() {
        return $this->hasMany('App\Models\MarkingSession');
    }
}

