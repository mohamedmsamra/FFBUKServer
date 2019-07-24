<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title>{{ config('app.name', 'SWiFT') }}</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Raleway:400,700&display=swap" rel="stylesheet">


        <!-- Styles -->
        <link href="{{ asset('builds/css/app.css') }}" rel="stylesheet">

        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    </head>
    <body>
        <div id="app">
            @include('inc.navbar')
            <div class="course-page">
                
                    
                <div id="react-root"></div>
            </div>
        </div>
            <script>
                const COURSE_ID = {{$course->id}};
            </script>
            <script src="/builds/js/course_page/index.js"></script>
        

        <!-- Scripts -->
        <script src="{{ asset('js/app.js') }}"></script>
    </body>
</html>
