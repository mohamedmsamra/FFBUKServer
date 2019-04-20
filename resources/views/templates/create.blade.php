@extends('layouts.app')

@section('content')
    <h1> Add a New Template </h1>
    <!-- this is here to determine the action this form will be calling
        and in this case will be calling the store function with POST method-->
    {!! Form::open(['action' => ['TemplatesController@store'], 'method' =>'POST', 'enctype' =>'multipart/form-data']) !!}
        <div class= "form-group">
            <!-- define label for heading=  Section Heading-->
            {{Form::label('heading', 'Section Heading')}}
            <!-- this for the text input, name of the field is title
                (name of the variable, value, any other attributes such as Class (bootstrap and a placeholder))-->
            {{Form::text('heading','',['class' =>'form-control','placeholder' => 'Heading'])}}
        </div>   
        <div class= "form-group">
            <!-- define label for title=  Title-->
            {{Form::label('category', 'Category for Comment (i.e. positive/negative)')}}
            <!-- this for the text input, name of the field is category
                (name of the variable, value, any other attributes such as Class (bootstrap and a placeholder))-->
            {{Form::text('category','',['class' =>'form-control','placeholder' => 'Category'])}}
        </div>   
        <div class= "form-group">
            <!-- define label for comment=  Comment Text-->
            {{Form::label('comment', 'Comment Text')}}
            <!-- this for the text input, name of the field is category
                (name of the variable, value, any other attributes such as Class (bootstrap and a placeholder))-->
            {{Form::text('comment','',['class' =>'form-control','placeholder' => 'Comment Text'])}}
        </div> 
        <!-- when we submit , it is going to make a post request to store function in TemplatesController.php-->
        {{Form::submit('Submit', ['class'=> 'btn btn-primary'])}}
    {!! Form::close() !!}


@endsection
