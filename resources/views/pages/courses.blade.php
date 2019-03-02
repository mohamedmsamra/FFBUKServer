@extends('layouts.app')

@section('content')
<h1> {{$title}} </h1>
    <p> This is the about page for an awesome app to give  your feedback </p>
    <p> This is more information about the app </p>
    <vue-sidebar></vue-sidebar>
    <class-component class="alert-flash" message ="Working"></class-component>
@endsection