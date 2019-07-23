<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSchoolAndRoleToUser extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Add school, department and role columns to the users table
        Schema::table('users', function (Blueprint $table) {
            $table ->string('school');
            $table ->string('department');
            $table ->string('role');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop the school, department and role columns from the users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('school');
            $table->dropColumn('department');
            $table->dropColumn('role');
        });
    }
}
