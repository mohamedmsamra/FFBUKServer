@extends('layouts.app')

@section('content')
    <div class="course-page" style="padding-left:50px">
        <a href="/courses" class="btn btn-link"> Go Back </a>
        <div>
            <h1 class="float-left"> {{$course->title}}</h1>
            <button type="button" class="btn invisibleBtn float-left">
                <i class="fas fa-image"></i> Change Course Image
            </button>
        </div>
        <div class="clear"></div>
        <img class="course-img" src="{{ $course->cover_image == 'default'  ?  '../stuff/default-1.jpg' : '../storage/'.$course->cover_image }}">
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

    <h1> List of Assignments</h1>
    <div id="react-root"></div>
    {{-- @if(count($assignments)>0)  
        <table id="assignments-table" class="table">
            <thead>
                <tr>
                    <th scope="col">Assignment</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($assignments as $assignment)
                    <tr>
                        <td>{{ $assignment->name }}</td>
                        <td>
                            <a>

                            </a>
                            <button type="button" class="btn btn-primary btn-sm">Start marking</button>
                            <button type="button" class="btn btn-info btn-sm">Edit</button>
                            <button type="button" class="btn btn-danger btn-sm">Delete</button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table> --}}


        {{-- @foreach ($assignment as $assignment)
        <a href="/marking/{{ $assignment->id }}" class="btn btn-mark" style="font-size:1.35rem;padding-bottom:0px">{{$assignment->name}}<a>
        <div>
            {!!$assignment->desc!!}
        </div>
        <a href="/assignments/{{$assignment->id}}/edit" class="btn btn-primary">Edit</a>
        {!!Form::open(['action' => ['AssignmentsController@destroy', $assignment->id], 'method' => 'POST','class' => 'float-right'])!!}
            {{Form::hidden('_method','DELETE')}}
            {{Form::submit('Delete',['class' => 'btn btn-danger'])}}
        {!!Form::close()!!}
        <br><br><br>
        @endforeach --}}
    {{-- @else 
        <p> No Assignments Found </p>    
    @endif    --}}
    <script>
        const assignments = <?php echo json_encode($assignments) ?>;
        const course_id = {{$course->id}};
    </script>
    <script src="/builds/js/assignments_table/index.js"></script>
@endsection
