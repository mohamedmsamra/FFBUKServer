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

    @foreach ($assignment as $assignment)
    <h3> {{$assignment->name}}</h3>
    <div>
        {!!$assignment->desc!!}
    </div>
    @endforeach
    <vue-sidebar></vue-sidebar>
    <class-component class="alert-flash" message ="Working"></class-component>
   
    
@endsection
