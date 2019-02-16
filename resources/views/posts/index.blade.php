@extends('layouts.app')


@section('content')
    <h1> Courses </h1>
    @if(count($posts)>0)
        @foreach ($posts as $post)
            <div class="card" style="padding:7px">

                <div class="row">
                    <div class="col-md-4 col-sm-4">
                    <img style= "width:100%" src="/storage/cover_images/{{$post->cover_image}}">
                    </div>
                    <div class="col-md-8 col-sm-4">
                        <!-- this the title, when clickable it take us to the indiviual page of each post-->
                        <!-- it load the show function in the PostsController-->
                        <h3 class="card-title"><a href="/posts/{{$post->id}}"> {{$post->title}}</a></h3>
                        <small> Written On {{$post->created_at}} by {{$post->user->name}}</small>
                    </div>
                </div>
               
                
            </div>   
            <br>
        @endforeach
        <!-- add the links of pages into the end of the page-->
        {{$posts->links()}}
    @else 
        <p> No Posts Found </p>
    @endif
@endsection
