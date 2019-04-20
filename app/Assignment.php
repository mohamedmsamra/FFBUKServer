<?php

namespace App;

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
        return $this-> belongsTo('App\Course');
    }

    public function templates(){
        return $this->hasMany('App\Template');
    }
}

