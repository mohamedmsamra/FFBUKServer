<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
    //Table Name
    protected $table= 'templates';

    // Primary Key field
    public $primaryKey ='id';

    //Timestamps
    public $timestamps= true;

    //that means that each single post has a relationship with a user and belongs to a user
    public function assignment(){
        return $this-> belongsTo('App\Assignment');
    }

}
