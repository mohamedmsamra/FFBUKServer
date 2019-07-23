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
            // Make the user id unsigned (ids should not be negative)
            $table->integer('user_id')->unsigned()->change();
            // Add a foreign key constraint that references the user (that created the course)
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        Schema::table('assignments', function($table) {
            // Remove the assignments description column
            $table->dropColumn('desc');

            // Make the course id unsigned (ids should not be negative)
            $table->integer('course_id')->unsigned()->change();
            // Add a foreign key constraint that references the course (that the assignment belongs to)
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // Create the sections table
        // Sections belong to assignments and have comments
        Schema::create('sections', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->integer('assignment_id')->unsigned();
            $table->string('marking_scheme')->nullable();
            $table->timestamps();

            // Add a foreign key constraint that references the assignment (that the section belongs to)
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');
        });

        // Create the comments table
        // Comments belong to sections and may be private to a user
        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->text('text');
            $table->string('type');
            $table->integer('section_id')->unsigned();
            $table->integer('private_to_user')->unsigned()->nullable();
            $table->timestamps();

            // Add a foreign key constraint that references the section (that the comment belongs to)
            $table->foreign('section_id')->references('id')->on('sections')->onDelete('cascade');
            // Add a foreign key constraint that references the user (that the comment is private to / was created by)
            $table->foreign('private_to_user')->references('id')->on('users')->onDelete('cascade');
        });

        // Dropt the templates table
        Schema::table('templates', function (Blueprint $table) {
            $table->drop();
        });

        // Create the course permissions table
        // A course permission is a relation between a course and a user
        // Users can receive access to a course they don't own fron the course owner
        // There are two course permission levels, 0 which mean read only, and 1 which means read and write
        // Course permissions are pending (pending = true) until the invited user accept the "invitation"
        Schema::create('course_permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('course_id')->unsigned();
            $table->integer('user_id')->unsigned();
            $table->integer('level')->unsigned()->default('0');; // 0 - Read, 1 - Read/Write
            $table->boolean('pending')->default('1');

            // The course and user pair should be unique. A user can't have multiple permissions for the same course
            $table->unique(array('course_id', 'user_id'));
            // Add a foreign key constraint that references the course (that the course permission belongs to)
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            // Add a foreign key constraint that references the user (that the course permission belongs to)
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
