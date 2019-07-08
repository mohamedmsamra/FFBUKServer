<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class TemplateSharing extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('course_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('level')->unsigned(); // 0 - Read, 1 - Read/Write
            $table->boolean('pending');
        });

        Schema::table('permissions', function($table) {
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('comments', function (Blueprint $table) {
            /* If not null (comment is a modification to the section), the comment is only
             * visible to the creator of the comment, not shared
             */
            $table->integer('modification')->unsigned()->nullable();
        });

        Schema::table('comments', function($table) {
            $table->foreign('modification')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
