<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    //because we have a model called Post, a table alraedy created in the database witht he same name
    // we can change this table name as follow

    //Table Name
    protected $table= 'assignments';

    // Primary Key field
    public $primaryKey ='id';

    //Timestamps
    public $timestamps= true;

    public function course(){
        return $this->belongsTo('App\Models\Course');
    }

    // Return the sections of the template
    public function sections() {
        return $this->hasMany('App\Models\Section');
    }
}

