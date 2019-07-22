<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Course;
use App\Models\User;
use App\Models\CoursePermission;

class WorkshopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $passwords = require('./database/seeds/workshop_passwords.php');
        // User::create([
        //     'name' => $data['name'],
        //     'email' => $data['email'],
        //     'school_department' => $data['school_department'],
        //     'role' => $data['role'],
        //     'password' => Hash::make($data['password']),
        // ])
        // Create module lead account
        $moduleLead = new User;
        $moduleLead->name = 'Workshop Lead';
        $moduleLead->email = 'workshoplead@work.shop';
        $moduleLead->password = Hash::make('WorkshopLead456');
        $moduleLead->role = '';
        $moduleLead->school_department = '';
        $moduleLead->save();

        // Create course
        $course = new Course;
        $course->title = 'Mechanics 1';
        $course->body = '<p>This is a mechanics course.</p>';
        $course->user_id = $moduleLead->id;
        $course->cover_image = 'default';
        $course->save();

        // Create users
        for ($i = 0; $i < 50; $i++) {
            // Create the user
            $user = new User;
            $user->name = "user" . ($i + 1);
            $user->email = "user" . ($i + 1) . '@work.shop';
            $user->password = Hash::make($passwords[$i]);
            $user->role = '';
            $user->school_department = '';
            $user->save();

            // Create course permission
            $coursePermission = new CoursePermission;
            $coursePermission->course_id = $course->id;
            $coursePermission->user_id = $user->id;
            $coursePermission->level = 0;
            $coursePermission->pending = 0;
            $coursePermission->save();
        }
    }
}
