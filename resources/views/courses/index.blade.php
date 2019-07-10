@extends('layouts.app')

@section('content')
    <div id="coursesPage">
        <h1>Courses</h1>
        <a href="/courses/create" class="btn btn-light btn-block btn-lg shadow-sm mb-4"> Add New Course </a>


        @if(count($invitations) > 0)

        <h1>Invited Courses</h1>
        @foreach ($invitations as $ic)
            @if($ic->pending == 1) 
            <div class="card shadow-sm mb-4 p-3">
            
                <!-- this the title, when clickable it take us to the indiviual page of each post-->
                <!-- it load the show function in the PostsController-->
                <div>
                    <div class="float-left">
                            <h3 class="card-title float-left"> {{$ic->course->title}}</h3>
                            <p class="text-muted font-italic float-left pt-2 pl-2">
                                Pending
                            </p>
                            <div class="clear"></div>
                            <small> Created by <strong>
                                {{ ($ic->owner->id == auth()->user()->id) ? "You" : $ic->owner->name }}
                            </strong>
                            </small>
                    </div>
                        
                    <div class="float-right p-3 inviteBtns">
                        <button type="button" class="btn btn-danger mr-1">Reject</button>
                        {{-- {!!Form::open(['action' => ['Api\CoursesController@joinCourse', $ic->id], 'method' => 'POST','class' => 'float-right'])!!}
                            {{Form::hidden('_method','PUT')}}
                            {{Form::submit('Join',['class' => 'btn btn-primary'])}}
                        {!!Form::close()!!} --}}
                        <form method="POST" action="{{'api/invites/'.$ic->id}}" class="float-right">
                                @method('PUT')
                                @csrf
                                <button type="submit" class="btn btn-primary">Join</button>
                            </form>
                        {{-- <button type="button" class="btn btn-primary">Join</button> --}}
                    </div>
                </div>
                <div class="clear"></div>
            </div>

            @else
            <div class="card shadow-sm mb-4">
                <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-sm-4 courses-images" style="background-image: url({{ $ic->course->cover_image == 'default'  ?  '/stuff/default-1.jpg' : '/'.'storage/'.$ic->course->cover_image}})">
                        {{-- <img class="courses-images" src="{{ $course->cover_image == 'default'  ?  '../stuff/default-1.jpg' : '../storage/'.$course->cover_image}}"> --}}
                        </div>
                        <div class="col-md-8 col-sm-4">
                            <!-- this the title, when clickable it take us to the indiviual page of each post-->
                            <!-- it load the show function in the PostsController-->
                            <h3 class="card-title float-left"><a href="/courses/{{$ic->course->id}}"> {{$ic->course->title}}</a></h3>
                            <p class="text-muted font-italic float-left pt-2 pl-2">
                                {{ ($ic->owner->id == auth()->user()->id) ? "Owner" : ($ic->level == 0) ? "Guest" : "Editor" }}
                            </p>
                            <div class="clear"></div>
                            @foreach ($ic->course->assignments()->get() as $assignment)
                                <p><a href="/marking/{{ $assignment->id }}">{{ $assignment->name }}</a></p>
                            @endforeach
                            <small> Created by 
                                <strong>
                                    {{ ($ic->owner->id == auth()->user()->id) ? "You" : $ic->owner->name }}
                                </strong>
                            </small>
                        </div>
                    </div>
                </div>
            </div>  
            @endif
        @endforeach
            <!-- add the links of pages into the end of the page-->
            {{-- {{$courses->links()}} --}}
        @else 
            <p> No Invitations Found </p>
        @endif
    
        @if(count($courses) > 0)
            @foreach ($courses as $course)
                <div class="card shadow-sm">
                    <div class="container">
                    <div class="row">
                        <div class="col-md-4 col-sm-4 courses-images" style="background-image: url({{ $course->cover_image == 'default'  ?  '/stuff/default-1.jpg' : '/'.'storage/'.$course->cover_image}})">
                        {{-- <img class="courses-images" src="{{ $course->cover_image == 'default'  ?  '../stuff/default-1.jpg' : '../storage/'.$course->cover_image}}"> --}}
                        </div>
                        <div class="col-md-8 col-sm-4">
                            <!-- this the title, when clickable it take us to the indiviual page of each post-->
                            <!-- it load the show function in the PostsController-->
                            <h3 class="card-title"><a href="/courses/{{$course->id}}"> {{$course->title}}</a></h3>
                            {{-- <p class="text-muted font-italic float-left p-1">
                                    {{ ($course->user->id == auth()->user()->id) ? "Owner" : "" }}
                                </p>
                                <div class="clear"></div> --}}
                            @foreach ($course->assignments()->get() as $assignment)
                                <p><a href="/marking/{{ $assignment->id }}">{{ $assignment->name }}</a></p>
                            @endforeach
                            <small> Created on {{$course->created_at}} by 
                                <strong>
                                    {{ ($course->user->id == auth()->user()->id) ? "You" : $course->user->name }}
                                </strong>
                            </small>
                        </div>
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
    </div>
@endsection
