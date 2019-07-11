<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    //Table Name
    protected $table = 'sections';

    // Primary Key field
    public $primaryKey = 'id';

    //Timestamps
    public $timestamps = true;

    public function assignment() {
        return $this->belongsTo('App\Models\Assignment');
    }

    // Return the comments of the section
    public function comments() {
        return $this->hasMany('App\Models\Comment');
    }
}
