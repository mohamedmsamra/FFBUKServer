@extends('layouts.app')


@section('content')
    <a href="/posts" class="btn btn-link"> Go Back </a>
    <h1> {{$post->title}}</h1>
    <img style= "width:30%, height:30%" src="/storage/cover_images/{{$post->cover_image}}">
    <div>
        {!! $post->body!!}
    </div>
    <small> Added on {{$post->created_at}} by {{$post->user->name}}</small>
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
   
   
    
@endsection
