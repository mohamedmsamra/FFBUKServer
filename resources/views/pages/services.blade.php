@extends('layouts.app')

@section('content')
    <h1> {{$title}} </h1>
    <!--checking the size of services array, loop through each item and add it to unordered list-->
    @if(count($services) > 0)   
        <ul class="list-group">
            @foreach ($services as $service)
                <li class="list-group-item">{{$service}}</li>
            @endforeach
        </ul>

    @endif 
@endsection
