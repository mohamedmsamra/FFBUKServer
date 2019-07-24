@extends('layouts.app')

{{-- The courses page (/courses) --}}
{{-- Contains a list of the user's created and invited courses --}}
@section('content')
<div id="coursesPage">
    <h1>Courses</h1>
    <a href="/courses/create" class="btn btn-light btn-block btn-lg shadow-sm mb-4"> Create A New Course </a>

    {{-- First, display all courses you are invited to --}}
    @if(count($invitations) > 0)
    @foreach ($invitations as $ic)
    {{-- If the course is pending, i.e. you haven't accepted the invitation yet, display join and reject buttons --}}
    @if($ic->pending == 1)

    <div class="card shadow-sm mb-4 p-3">
        <div>
            <div class="float-left">
                <h3 class="card-title float-left"> {{$ic->course->title}}</h3>
                <p class="text-muted font-italic float-left pt-2 pl-2">
                    Pending
                </p>
                <div class="clear"></div>
                <small> Created by
                    <strong>
                        {{ ($ic->owner->id == auth()->user()->id) ? "You" : $ic->owner->name }}
                    </strong>
                </small>
            </div>

            <div class="float-right p-3 inviteBtns">
                {{-- Reject course invite button --}}
                <form method="POST" action="{{'/api/course-permissions/'.$ic->id.'/reject-invite'}}"
                    class="float-left mr-1 rejectInvite">
                    @method('DELETE')
                    @csrf
                    <button type="submit" class="btn btn-danger">Reject</button>
                </form>
                {{-- Accept course invite button --}}
                <form method="POST" action="{{'api/courses/'.$ic->id.'/join'}}" class="float-right">
                    @method('POST')
                    @csrf
                    <button type="submit" class="btn btn-primary">Join</button>
                </form>
            </div>
        </div>
        {{-- Clear float --}}
        <div class="clear"></div>
    </div>

    {{-- Otherwise, if you have already joined the course i.e. it is not pending --}}
    {{-- Display it as a normal course --}}
    @else
    <div class="card shadow-sm mb-4">
        <div class="container">
            <div class="row">
                <div class="col-md-4 col-sm-4 courses-images"
                    style="background-image: url({{ $ic->course->cover_image == 'default'  ?  '/stuff/default-1.jpg' : '/'.'storage/'.$ic->course->cover_image}})">
                </div>
                <div class="col-md-8 col-sm-4">
                    {{-- Clickable title that redirect to that course page --}}
                    <h3 class="card-title float-left"><a href="/courses/{{$ic->course->id}}"> {{$ic->course->title}}</a>
                    </h3>
                    <p class="text-muted font-italic float-left pt-2 pl-2">
                        {{ ($ic->owner->id == auth()->user()->id) ? "Owner" : ($ic->level == 0) ? "Guest" : "Editor" }}
                    </p>
                    <div class="clear"></div>
                    {{-- Display a list of all the assignments in the course --}}
                    @foreach ($ic->course->assignments()->get() as $assignment)
                    {{-- Clickable assignment name that redirects to the marking page for that assignment --}}
                    <p><a href="/assignments/{{ $assignment->id }}/mark">{{ $assignment->name }}</a></p>
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
    @endif

    {{-- Display the list of all owned courses --}}
    @if(count($courses) > 0)
    @foreach ($courses as $course)
    <div class="card shadow-sm">
        <div class="container">
            <div class="row">
                <div class="col-md-4 col-sm-4 courses-images"
                    style="background-image: url({{ $course->cover_image == 'default'  ?  '/stuff/default-1.jpg' : '/'.'storage/'.$course->cover_image}})">
                </div>
                <div class="col-md-8 col-sm-4">
                    {{-- Clickable title that redirects to that course page --}}
                    <h3 class="card-title"><a href="/courses/{{$course->id}}"> {{$course->title}}</a></h3>
                    {{-- The list of all assignments --}}
                    @foreach ($course->assignments()->get() as $assignment)
                    {{-- Clickable assignment name that redirects to the marking page for that assignment --}}
                    <p><a href="/assignments/{{ $assignment->id }}/mark">{{ $assignment->name }}</a></p>
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
    <p> You haven't created any courses </p>
    @endif
</div>

<script>
    $(".rejectInvite").on("submit", function(){
            return confirm("Are you sure you want to reject this course invitation?");
        });
</script>
@endsection