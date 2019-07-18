<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarkingSession extends Model
{
    //Table Name
    protected $table = 'marking_sessions';

    // Primary Key field
    public $primaryKey = 'id';

    //Timestamps
    public $timestamps = false;

    protected $attributes = [
        'words' => 0,
        'time' => 0
    ];

    public function assignment() {
        return $this->belongsTo('App\Models\Assignment');
    }

    public function user() {
        return $this->belongsTo('App\Models\User');
    }
}
