@extends('layouts.app')

@section('content')

{{-- <h1> {{$title}} </h1> --}}
<a href="/home" class="btn btn-link"> Go Back </a>
<h1>Post Workshop Survey</h1>
<p> Please Fill This Survey at The end of This Workshop </p>
<br> <br>
<iframe
    src="https://docs.google.com/forms/d/e/1FAIpQLSe4NLKG7RoVnbNPA4kZgYLGlhZJpuqhLaCP9yLGgclkiYWjUA/viewform?embedded=true"
    width="640" height="492" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
@endsection