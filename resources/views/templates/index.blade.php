@extends('layouts.app')


@section('content')
    <h1> Feedback </h1>
      @if(count($templates)>0)
        @foreach ($templates as $template)
            <div class="card" style="padding:7px">

                <div class="row">
                    <div class="col-md-8 col-sm-4">
                        <!-- this the title, when clickable it take us to the indiviual page of each post-->
                        <!-- it load the show function in the PostsController-->
                        <h2 class="card-title">Section: {{$template->heading}}</h2>
                        <small>Category: {{$template->category}}</small>
                        <br>
                        <small> Text: {{$template->comment}}</small>
                    </div>
                </div>
 
            </div>   
            <br>
        @endforeach
        <!-- add the links of pages into the end of the page-->
        {{$templates->links()}}
  @else 
      <p> No Templates Found </p>
  @endif
@endsection
