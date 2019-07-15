@extends('layouts.app')

@section('content')
    <h1> Add a New Course </h1>
    <!-- this is here to determine the action this form will be calling
        and in this case will be calling the store function with POST method-->
    <div id="react-create-course"></div>

    {{-- {!! Form::open(['action' => 'CoursesController@store', 'method' =>'POST', 'enctype' =>'multipart/form-data']) !!} --}}



    <script src="/builds/js/create_course_form/index.js"></script>
@endsection
