@extends('layouts.app')


@section('content')
    <h1> Posts </h1>
    @if(count($posts)>0)

        @foreach ($posts as $post)
            <div class="card" style="padding:7px">
                <!-- this the title, when clickable it take us to the indiviual page of each post-->
                <!-- it load the show function in the PostsController-->
                <h3 class="card-title"><a href="/posts/{{$post->id}}"> {{$post->title}}</a></h3>
                <small> Written On {{$post->created_at}}</small>
            </div>   
            <br>
        @endforeach
        <!-- add the links of pages into the end of the page-->
        {{$posts->links()}}
    @else 
        <p> No Posts Found </p>
    @endif
@endsection
