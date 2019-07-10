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
        const PERMISSIONS = <?php echo json_encode($permissions) ?>;
        // const body = "<?php echo $course->body ?>";
        const body = "";
    </script>
    <script src="/builds/js/course_page/index.js"></script>
@endsection
