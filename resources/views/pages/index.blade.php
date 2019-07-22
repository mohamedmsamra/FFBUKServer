@extends('layouts.app')

@section('content')
<div class="jumbotron text-center homePage">
    <h1> {{$title}} </h1>
    <p> This is the index page for an awesome app to give  your feedback </p>
    @if (Auth::check())
        <div class="mb-2 mt-2">
            <a href={{ "/assignments/".$assignment1.'/mark' }} class="btn btn-primary mr-1">Assignment 1</a>
            <a  href={{ "/assignments/".$assignment2.'/mark' }} class="btn btn-primary">Assignment 2</a>
        </div>
        <a href="/survey1" class="btn btn-info mr-1">Pre-Workshop Survey</a>
        <a href="/survey2" class="btn btn-info">Post-Workshop Survey</a>
    @endif
    
</div>    

@endsection