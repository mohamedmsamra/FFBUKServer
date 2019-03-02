<?php

namespace App;

use Illuminate\Database\Eloquent\Model;


//there are a  lot of functions built in already in "Model" that Post extends
// for example returning all the posts such as Post:all() is already built in function in Model
// that is why we are not going to add much to this class
class Post extends Model
{
    //because we have a model called Post, a table alraedy created in the database witht he same name
    // we can change this table name as follow

    //Table Name
    protected $table= 'posts';

    // Primary Key field
    public $primaryKey ='id';

    //Timestamps
    public $timestamps= true;

    //that means that each single post has a relationship with a user and belongs to a user
    public function user(){
        return $this-> belongsTo('App\User');
    }

    public function assignments(){
        return $this->hasMany('App\Assignment');
    }
}
