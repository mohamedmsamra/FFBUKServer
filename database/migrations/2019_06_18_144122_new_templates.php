<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class NewTemplates extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->integer('template_id')->unsigned();
            $table->timestamps();
        });

        Schema::table('sections', function($table) {
            $table->foreign('template_id')->references('id')->on('templates');
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->increments('id');
            $table->text('text');
            $table->string('type');
            $table->integer('section_id')->unsigned();
            $table->timestamps();
        });

        Schema::table('comments', function($table) {
            $table->foreign('section_id')->references('id')->on('sections');
        });

        Schema::table('templates', function (Blueprint $table) {
            $table->dropColumn('heading');
            $table->dropColumn('category');
            $table->dropColumn('comment');
            $table->integer('assignment_id')->unsigned();
            $table->string('name');
        });

        Schema::table('templates', function($table) {
            $table->foreign('assignment_id')->references('id')->on('assignments');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
}
