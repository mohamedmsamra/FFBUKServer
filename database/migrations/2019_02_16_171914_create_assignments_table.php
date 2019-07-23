<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAssignmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Create the assignments table
        Schema::create('assignments', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->mediumText('desc');
            $table->integer('post_id');
            $table->timestamps();
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop the assignments table
        Schema::dropIfExists('assignments');
    }
}
