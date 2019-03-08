@extends('layouts.app')


@section('content')
    <div class="course-page" style="padding-left:50px">
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

<<<<<<< HEAD
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
   
    
=======
        <h1> List of Assignments</h1>
        <div class="col-md-8">
            @foreach ($assignment as $assignment)         
            <div class="card card-default" style="width:100%;margin-bottom:10px">
                <div class="card-header" style="padding:0px 0px 0px 0px">
                    <a href="/marking" class="btn btn-mark" style="font-size:1.35rem;padding-bottom:0px">{{$assignment->name}}<a>
                </div>

                <div class="card-body" style="padding:5px 5px 5px 10px">
                    {!!$assignment->desc!!}
                </div>
            </div>
            @endforeach
        </div>
        
    </div>  
>>>>>>> dca40000b0f6a5b2626a43780ab32c491a40db15
@endsection
