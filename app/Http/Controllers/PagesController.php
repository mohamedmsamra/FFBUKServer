<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Assignment;

class PagesController extends Controller
{
    public function index(){
        $title = 'Welcome To SWiFT!';
        //these are the two ways to pass a variable, either by calling compact, or just using with
        //return view('pages.index', compact('title'));
        
        //with (what we want to call the passed variable, its name in this context)
        return view('pages.index') -> with('title', $title);
    }

    public function about(){
        $title = 'About';
        return view('pages.about')-> with('title', $title);
    }
    public function courses(){
        $title = 'Courses';
        return view('pages.courses')-> with('title', $title);
    }
    public function marking($assignment_id){
        $title = 'Marking';
        // Find assignment
        $assignment = Assignment::where('id', '=', $assignment_id)->first();
        if ($assignment === null) {
            abort(404);
        } else {
            return view('pages.newMarking', ['title' => $title, 'assignment' => $assignment]);
        }
    }
    public function faqs(){
        $title = 'Frequently Asked Questions';
        return view('pages.faqs')-> with('title', $title);
    }

    public function services(){
        //this is how we can pass multiple variables through an array 
        $data = array(
            'title' => 'Services',
            'services' =>  ['Web Design', 'Programming', 'Web Hosting']
        );
        return view('pages.services')-> with($data);
    }

    public function survey1(){
        $title = 'Survey 1';
        return view('pages.survey1')-> with('title', $title);
    }

    public function survey2(){
        $title = 'Survey 2';
        return view('pages.survey2')-> with('title', $title);
    }
}

