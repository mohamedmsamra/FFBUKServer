@extends('layouts.app')

@section('content')
<div class="jumbotron text-center">
    <h1> {{$title}} </h1>
    <p> This is the index page for an awesome app to give  your feedback </p>
    <button type="button" class="btn btn-primary">Assignment 1</button>
    <button type="button" class="btn btn-primary">Assignment 2</button>
    <a href="/survey1" class="btn btn-info">Pre-Workshop Survey</a>
    <a href="/survey2" class="btn btn-info">Post-Workshop Survey</a>
</div>    

@endsection