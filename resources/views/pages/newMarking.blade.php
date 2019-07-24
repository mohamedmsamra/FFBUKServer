<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'SWiFT') }}</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Raleway:400,700&display=swap"
        rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('builds/css/app.css') }}" rel="stylesheet">

    {{-- Bootstrap --}}
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous">
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous">
    </script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous">
    </script>

    <script src="{{ asset('../js_ffbuk/pdfobject.js')}}"></script>

    <!-- zip file library -->
    <script src="{{ asset('../js_ffbuk/jszip.js')}}"></script>
    <script src="{{ asset('../js_ffbuk/fileSaver.js')}}"></script>
    <script mimeType=text/plain; charset=x-user-defined src="{{ asset('../js_ffbuk/jszip-utils.js')}}"></script>

    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>

<body>
    <div id="app">
        @include('inc.navbar')
        <div>
            @include('inc.messages')
            <h2 class="marking-heading text-center"> Marking assignment {{ $assignment['name'] }}</h2>
            {{-- Use react for this page --}}
            <div>
                <div id="marking-react-root"></div>
            </div>
        </div>

        <!-- Scripts -->
        <script src="{{ asset('js/app.js') }}"></script>
        <script>
            const USER_ID = {{auth()->user()->id}};
            const USER_NAME = "{{auth()->user()->name}}";
            const assignment_id = {{ $assignment['id'] }};
        </script>
        <script src="/builds/js/marking_app/index.js"></script>
</body>

</html>