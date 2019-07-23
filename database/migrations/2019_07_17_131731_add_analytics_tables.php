<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddAnalyticsTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create the marking sessions table
        // A marking session is a relation between a user and an assignment
        // A marking session is recorded every time a users uses an assignment to mark a student report
        Schema::create('marking_sessions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('assignment_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('words')->unsigned()->default('0');
            $table->integer('time')->default('0');

            // Add a foreign key constraint that references the assignment (that the marking session belongs to)
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');
            // Add a foreign key constraint that references the user (that the marking session belongs to)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // Create the comment uses table
        // A comment use is a relation between a user and a comment
        // It keeps a record of how many time a user has used that comment
        Schema::create('comment_uses', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('comment_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('count')->unsigned()->default('0');;
            
            // Add a foreign key constraint that references the comment (that the coment use belongs to)
            $table->foreign('comment_id')->references('id')->on('comments')->onDelete('cascade');
            // Add a foreign key constraint that references the user (that the comment use belongs to)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop the marking sessions and the comment uses tables
        Schema::dropIfExists('marking_sessions');
        Schema::dropIfExists('comment_uses');
    }
}
