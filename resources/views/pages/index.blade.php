@extends('layouts.app')

{{-- The home page of the website (/home) --}}
@section('content')
<div class="jumbotron text-center homePage">
    <h1> {{$title}} </h1>
    <p>An awesome app to help you give quality feedback.</p>
    
    @if (Auth::check())
    <div class="mb-2 mt-4">
        <a href={{ "/assignments/".$assignment1.'/mark' }} class="btn btn-primary mr-1">Assignment 1</a>
        <a href={{ "/assignments/".$assignment2.'/mark' }} class="btn btn-primary">Assignment 2</a>
    </div>
    <a href="/survey1" class="btn btn-info mr-1">Pre-Workshop Survey</a>
    <a href="/survey2" class="btn btn-info">Post-Workshop Survey</a>
    @endif

</div>

@endsection