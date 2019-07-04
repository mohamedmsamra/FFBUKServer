<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class SectionsTemplatesAssignmentsOnCascadeDelete extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('sections', function($table) {
            $table->dropForeign('sections_template_id_foreign');
            $table->foreign('template_id')->references('id')->on('templates')->onDelete('cascade');
        });

        Schema::table('templates', function($table) {
            $table->dropForeign('templates_assignment_id_foreign');
            $table->foreign('assignment_id')->references('id')->on('assignments')->onDelete('cascade');
        });

        Schema::table('assignments', function($table) {
            $table->integer('course_id')->unsigned()->change();
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        Schema::table('courses', function($table) {
            $table->integer('user_id')->unsigned()->change();
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
