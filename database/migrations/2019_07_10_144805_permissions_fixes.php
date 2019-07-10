<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PermissionsFixes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('course_permissions', function (Blueprint $table) {
            $table->unique(array('course_id', 'user_id'));
        });
        
        Schema::table('template_permissions', function (Blueprint $table) {
            $table->dropForeign('template_permissions_user_id_foreign');
            $table->dropColumn('user_id');
            $table->integer('template_id')->unsigned();
            $table->unique(array('template_id', 'course_permission_id'));
        });

        Schema::table('template_permissions', function($table) {
            $table->foreign('template_id')->references('id')->on('templates')->onDelete('cascade');
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
