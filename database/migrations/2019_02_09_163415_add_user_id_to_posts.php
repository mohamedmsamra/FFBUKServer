<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserIdToPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add user_id column to posts table
        Schema::table('posts', function (Blueprint $table) {
            $table->integer('user_id'); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop user_id column from posts table
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('user_id');
        });
    }
}
