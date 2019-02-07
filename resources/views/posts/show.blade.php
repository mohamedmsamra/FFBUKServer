@extends('layouts.app')


@section('content')
    <a href="/posts" class="btn btn-default"> Go Back </a>
    <h1> {{$post->title}}</h1>
    
    <div>
        {!! $post->body!!}
    </div>
    <small> Written On {{$post->created_at}}</small>
    <hr>
    <a href="/posts/{{$post->id}}/edit" class="btn btn-default"> Edit </a>
@endsection
