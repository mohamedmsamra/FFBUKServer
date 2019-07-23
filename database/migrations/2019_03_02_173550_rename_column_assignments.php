<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class RenameColumnAssignments extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Rename the post_id column to course_id in the assignments table
        Schema::table('assignments', function(Blueprint $table) {
            $table->renameColumn('post_id', 'course_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('assignments', function(Blueprint $table) {
            $table->renameColumn('post_id', 'course_id');
        });
    }
}
