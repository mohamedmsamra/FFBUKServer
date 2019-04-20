<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class SidebarController extends Controller
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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user_id = auth()->user()->id;
        $user = User::find($user_id);

        return response()->json([
            'courses' => $user->courses->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title
                ];
            })
        ]);
    }
}
