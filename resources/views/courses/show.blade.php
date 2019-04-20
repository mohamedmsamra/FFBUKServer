@extends('layouts.app')


@section('content')
    <div class="course-page" style="padding-left:50px">
        <a href="/courses" class="btn btn-link"> Go Back </a>
        <h1> {{$course->title}}</h1>
        <img style= "width:10%, height:10%" src="{{ asset('stuff/classroom-1209820_640.jpg') }}">
        <div>
            {!! $course->body!!}
        </div>
        <small> Added on {{$course->created_at}} by {{$course->user->name}}</small>
        <hr>
        {{--
        @auth
            @if(Auth::user()->id == $post->user_id)
                <a href="/posts/{{$post->id}}/edit" class="btn btn-primary"> Edit </a>
                {!!Form::open(['action' => ['PostsController@destroy', $post->id], 'method' => 'POST','class' => 'float-right'])!!}
                    {{Form::hidden('_method','DELETE')}}
                    {{Form::submit('Delete',['class' => 'btn btn-danger'])}}
                {!!Form::close()!!}
            @endif    
        @endauth
        --}}

    <h1> List of Assignments</h1>
    @if(count($assignment)>0)  
        @foreach ($assignment as $assignment)
        <a href="/marking" class="btn btn-mark" style="font-size:1.35rem;padding-bottom:0px">{{$assignment->name}}<a>
        <div>
            {!!$assignment->desc!!}
        </div>
        <a href="/assignments/{{$assignment->id}}/edit" class="btn btn-primary">Edit</a>
        {!!Form::open(['action' => ['AssignmentsController@destroy', $assignment->id], 'method' => 'POST','class' => 'float-right'])!!}
            {{Form::hidden('_method','DELETE')}}
            {{Form::submit('Delete',['class' => 'btn btn-danger'])}}
        {!!Form::close()!!}
        <br><br><br>
        @endforeach
    @else 
        <p> No Assignments Found </p>    
    @endif   
    <a href='/courses/{{$course->id}}/assignments/create' class="btn btn-primary"> Add New Assignment </a>
    <br><br>
    <h1> Templates</h1>
    <a href="/templates/create" class="btn btn-primary">Create Template</a>
@endsection
