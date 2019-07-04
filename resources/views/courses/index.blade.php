@extends('layouts.app')

@section('content')
    <h1>Courses</h1>
   
    @if(count($courses) > 0)
        @foreach ($courses as $course)
            <div class="card" style="padding:7px">
                <div class="row">
                    <div class="col-md-4 col-sm-4 courses-images" style="background-image: url({{ $course->cover_image == 'default'  ?  '/stuff/default-1.jpg' : '/'.'storage/'.$course->cover_image}})">
                    {{-- <img class="courses-images" src="{{ $course->cover_image == 'default'  ?  '../stuff/default-1.jpg' : '../storage/'.$course->cover_image}}"> --}}
                    </div>
                    <div class="col-md-8 col-sm-4">
                        <!-- this the title, when clickable it take us to the indiviual page of each post-->
                        <!-- it load the show function in the PostsController-->
                        <h3 class="card-title"><a href="/courses/{{$course->id}}"> {{$course->title}}</a></h3>
                        @foreach ($course->assignments()->get() as $assignment)
                            <p><a href="/marking/{{ $assignment->id }}">{{ $assignment->name }}</a></p>
                        @endforeach
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
