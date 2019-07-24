@extends('layouts.app')

{{-- The course creation page (/courses/create) --}}
@section('content')
    <h1 class="mb-4"> Add a New Course </h1>
    {{-- Use react for this page --}}
    <div id="react-create-course"></div>

    <script src="/builds/js/create_course_form/index.js"></script>
@endsection
