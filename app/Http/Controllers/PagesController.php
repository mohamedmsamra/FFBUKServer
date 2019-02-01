<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PagesController extends Controller
{
    public function index(){
        $title = 'Welcome To Laravel!';
        //these are the two ways to pass a variable, either by calling compact, or just using with
        //return view('pages.index', compact('title'));
        
        //with (what we want to call the passed variable, its name in this context)
        return view('pages.index') -> with('title', $title);
    }

    public function about(){
        $title = 'About';
        return view('pages.about')-> with('title', $title);
    }

    public function services(){
        //this is how we can pass multiple variables through an array 
        $data = array(
            'title' => 'Services',
            'services' =>  ['Web Design', 'Programming', 'Web Hosting']
        );
        return view('pages.services')-> with($data);
    }
}

