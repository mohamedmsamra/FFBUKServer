@section('content')
    <div class="template-page" style="padding-left:50px">
        <a href="/template" class="btn btn-link"> Go Back </a>
        <h1> {{$template->heading}}</h1>
        <div>
            {{$template->category}}
            {{$template->comment}}
        </div>
    </div>
@endsection
