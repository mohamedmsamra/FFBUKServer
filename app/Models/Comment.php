<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    //Table Name
    protected $table = 'comments';

    // Primary Key field
    public $primaryKey = 'id';

    //Timestamps
    public $timestamps = true;

    public function assignment() {
        return $this->belongsTo('App\Models\Section');
    }

}
