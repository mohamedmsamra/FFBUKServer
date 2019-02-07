<!-- we need here to check for three things
    errors created  when validation fails
    and also check for sessions values, session success, session error -->

@if(count($errors) > 0)
    @foreach($errors->all() as $error)
        <div class="alert alert-danger">
            {{$error}}
        </div>
    @endforeach
@endif    

@if(session('success'))
    <div class="alert alert-success">
        {{session('success')}}
    </div>    
@endif

@if(session('error'))
    <div class="alert alert-danger">
        {{session('error')}}
    </div>    
@endif