<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCoverImageToPosts extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add cover_image column to posts table (holds the path to the post image within the storage folder)
        Schema::table('posts', function (Blueprint $table) {
            $table ->string('cover_image');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Remove cover_image column from posts table
        Schema::table('posts', function (Blueprint $table) {
            $table ->dropColumn('cover_image');
        });
    }
}
