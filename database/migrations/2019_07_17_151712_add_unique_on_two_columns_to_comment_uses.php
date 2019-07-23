<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUniqueOnTwoColumnsToCommentUses extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('comment_uses', function (Blueprint $table) {
            // The comment and user pair should be unique for comment uses.
            // A user cannot have multiple different counts for the same comment
            $table->unique(['comment_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('comment_uses', function (Blueprint $table) {
            // Drop the unique pair constraint between comments and users on comment uses
            $table->dropUnique('comment_uses_comment_id_user_id_unique');
        });
    }
}
