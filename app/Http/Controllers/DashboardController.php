<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        //get the user id from the session and find this user from the database using its id
        $user_id = auth()->user()->id;
        $user= User::find($user_id);
        //here we return the view with the posts of this specific user
        //we can do that simply because we add the relationshop between user and posts in User.php and Post.Php
        return view('dashboard')->with('courses', $user->courses);
    }
}
