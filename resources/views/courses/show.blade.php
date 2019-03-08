@extends('layouts.app')


@section('content')
    <a href="/courses" class="btn btn-link"> Go Back </a>
    <h1> {{$course->title}}</h1>
    <img style= "width:30%, height:30%" src="/storage/cover_images/{{$course->cover_image}}">
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
        <h3> {{$assignment->name}}</h3>
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
   
    
@endsection
