<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Assignment;
use Auth;

/**
 * The Pages controller deals with returning the appropriate pages for page routes.
 */
class PagesController extends Controller
{
    /**
     * @return \Illuminate\Http\Response the index page
     */
    public function index(){
        // If a user is authenticated, redirect to their courses page, otherwise redirect to home
        return Auth::user() ? redirect('/courses') : redirect('/home');
    }

    /**
     * @return \Illuminate\Http\Response the home page of the website
     */
    public function home(){
        $title = 'Welcome To SWiFT!';
        //these are the two ways to pass a variable, either by calling compact, or just using with
        //return view('pages.index', compact('title'));
        
        // Return the home page with the information it needs
        // For the workshop we need two assignments to link to
        return view('pages.index') -> with('title', $title)
                                   -> with('assignment1', 2)
                                   -> with('assignment2', 13);
    }

    /**
     * @return \Illuminate\Http\Response the about page
     */
    public function about(){
        $title = 'About';
        return view('pages.about')-> with('title', $title);
    }

    /**
     * @return \Illuminate\Http\Response the courses page
     */
    public function courses(){
        $title = 'Courses';
        return view('pages.courses')-> with('title', $title);
    }

    /**
     * @return \Illuminate\Http\Response the faqs page
     */
    public function faqs(){
        $title = 'Frequently Asked Questions';
        return view('pages.faqs')-> with('title', $title);
    }

    /**
     * @return \Illuminate\Http\Response the services page
     */
    public function services(){
        //this is how we can pass multiple variables through an array 
        $data = array(
            'title' => 'Services',
            'services' =>  ['Web Design', 'Programming', 'Web Hosting']
        );
        return view('pages.services')-> with($data);
    }

    /**
     * @return \Illuminate\Http\Response the pre workshop survey page
     */
    public function survey1(){
        $title = 'Survey 1';
        return view('pages.survey1')-> with('title', $title);
    }

    /**
     * @return \Illuminate\Http\Response the post workshop survey page
     */
    public function survey2(){
        $title = 'Survey 2';
        return view('pages.survey2')-> with('title', $title);
    }
}

