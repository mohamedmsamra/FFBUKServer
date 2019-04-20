@extends('layouts.app')

@section('content')
    <h1>Courses</h1>
   
    @if(count($courses) > 0)
        @foreach ($courses as $course)
            <div class="card" style="padding:7px">
                <div class="row">
                    <div class="col-md-4 col-sm-4">
                    <img style= "width:50%" src="/storage/cover_images/{{$course->cover_image}}">
                    </div>
                    <div class="col-md-8 col-sm-4">
                        <!-- this the title, when clickable it take us to the indiviual page of each post-->
                        <!-- it load the show function in the PostsController-->
                        <h3 class="card-title"><a href="/courses/{{$course->id}}"> {{$course->title}}</a></h3>
                        <small> Written On {{$course->created_at}} by {{$course->user->name}}</small>
                    </div>
                </div>
            </div>   
            <br>
        @endforeach
        <!-- add the links of pages into the end of the page-->
        {{$courses->links()}}
    @else 
        <p> No Courses Found </p>
    @endif
@endsection
