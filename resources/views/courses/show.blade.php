@extends('layouts.app')

@section('content')
    <div class="course-page" style="padding-left:50px">
        <a href="/courses" class="btn btn-link"> Go Back </a>
        <h1> {{$course->title}}</h1>
            
        <div id="react-root"></div>
    </div>
        
    <script>
        const assignments = <?php echo json_encode($assignments) ?>;
        const course_id = {{$course->id}};
        const course_owner_id = {{$course->user_id}};
        const user_id = {{auth()->user()->id}};
        const PERMISSIONS = <?php echo json_encode($permissions) ?>;
        const HAS_COURSE_EDIT_PERMISSION = course_owner_id == user_id;
        const CREATED_AT = new Date("{{$course->created_at}}");
        const CREATOR_NAME = "{{ $course->user->first()->name }}";
        const COVER_IMAGE = "{{$course->cover_image}}";
        const body = "";
    </script>
    <script src="/builds/js/course_page/index.js"></script>
@endsection
