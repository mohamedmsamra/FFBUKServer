@extends('layouts.app')


@section('content')
    <h1> Edit Assignment </h1>

    <!-- we have changed the action to update not store anymore, and we added the post id so we know which post we are updating-->
    {!! Form::open(['action' => ['AssignmentsController@update', $assignment->id], 'method' =>'POST','enctype' =>'multipart/form-data']) !!}
        <div class= "form-group">
            {{Form::label('title', 'Title')}}
            {{Form::text('title',$assignment->name,['class' =>'form-control','placeholder' => 'Title'])}}
        </div>   
        
        <div class= "form-group">   
            {{Form::label('body', 'Body')}}
            {{Form::textArea('body',$assignment->desc,['id'=>'article-ckeditor', 'class' =>'form-control','placeholder' => 'Body Text'])}}
        </div> 
        <div class="form-group">
                {{Form::file('cover_image')}}
            </div>
        {{Form::hidden('_method','PUT')}}
        {{Form::submit('Submit', ['class'=> 'btn btn-primary'])}}
    {!! Form::close() !!}
@endsection
