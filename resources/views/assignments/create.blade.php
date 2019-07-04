@extends('layouts.app')

@section('content')
    <h1> Add a New Assignment </h1>
    <!-- this is here to determine the action this form will be calling
        and in this case will be calling the store function with POST method-->
    {!! Form::open(['action' => ['AssignmentsController@store'], 'method' =>'POST', 'enctype' =>'multipart/form-data']) !!}
        <div class= "form-group">
            <!-- define label for title=  Title-->
            {{ Form::hidden('course_id', $course_id) }}
            {{Form::label('title', 'Assignment Title')}}
            <!-- this for the text input, name of the field is title
                (name of the variable, value, any other attributes such as Class (bootstrap and a placeholder))-->
            {{Form::text('title','',['class' =>'form-control','placeholder' => 'Title'])}}
        </div>   
        
        <!-- when we submit , it is going to make a post request to store function in PostsController.php-->
        {{Form::submit('Submit', ['class'=> 'btn btn-primary'])}}
    {!! Form::close() !!}


@endsection
