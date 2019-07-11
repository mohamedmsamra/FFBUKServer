<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AssignmentsRedesign extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('courses', function($table) {
            $table->integer('user_id')->unsigned()->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('assignments', function($table) {
            $table->dropColumn('desc');

            $table->integer('course_id')->unsigned()->change();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        Schema::create('sections', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->integer('assignment_id')->unsigned();
            $table->string('marking_scheme')->nullable();
            $table->timestamps();

            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->text('text');
            $table->string('type');
            $table->integer('section_id')->unsigned();
            $table->integer('private_to_user')->unsigned()->nullable();
            $table->timestamps();

            $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
            $table->foreign('private_to_user')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('templates', function (Blueprint $table) {
            $table->drop();
        });

        Schema::create('course_permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('course_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('level')->unsigned()->default('0');; // 0 - Read, 1 - Read/Write
            $table->boolean('pending')->default('1');

            $table->unique(array('course_id', 'user_id'));
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
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
        //
    }
}
