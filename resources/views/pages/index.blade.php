@extends('layouts.app')

{{-- The home page of the website (/home) --}}
@section('content')
<div class="jumbotron text-center homePage">
    <h1> {{$title}} </h1>
    <p>An awesome app to help you give quality feedback.</p>
    <p>You can find tutorials on how to use SWiFT <a href="/faqs">here</a>.</p>

    @if (Auth::check())
    <a href="/survey1" class="btn btn-info mr-1">Pre-Workshop Survey</a>
    <a href= "https://drive.google.com/file/d/1R8F8PZtv4kHDRnfw2h4RDPgI_0jLo6Ap/view?usp=sharing" target="_blank" class="btn btn-primary">Assignment 2</a>
    <div class="mb-2 mt-4">
        <a href= "https://drive.google.com/file/d/1DmJn7BmAPplxWGowbsH9AB5S1T9oEL6Z/view?usp=sharing" target="_blank" class="btn btn-primary mr-1">Assignment 1</a>
        <a href="/survey2" class="btn btn-info">Post-Workshop Survey</a>

    </div>

    @endif



</div>

@endsection
