<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    //Table Name
    protected $table = 'templates';

    // Primary Key field
    public $primaryKey = 'id';

    //Timestamps
    public $timestamps = true;

    // That means that each single post has a relationship with a user and belongs to a user
    public function assignment() {
        return $this->belongsTo('App\Assignment');
    }

    // Return the sections of the template
    public function sections() {
        return $this->hasMany('App\Models\Section');
    }
}
