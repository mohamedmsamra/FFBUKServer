<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'SWiFT') }}</title>
    
    <link rel="icon" href="/svg/book-solid.png"/>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Raleway:400,700&display=swap"
        rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('builds/css/app.css') }}" rel="stylesheet">

    {{-- jQuery --}}
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous">
    </script>
</head>

<body>
    <div id="app">
        @include('inc.navbar')
        <div class="container">

            <h1 class="mt-3 mb-3">Frequently Asked Questions</h1>
            <a href="/home">Go Back Home</a>

            <div class="card shadow-sm mt-3 mb-3">
                <h1 class="card-header">Tutorial Videos</h1>
                <div class="p-3">
                    <p>This series of videos will take you through all the functionality of the fFBUK software. Click on
                        the
                        icon in the top left of the video to skip to other videos in the playlist.</p>
                    <iframe width="100%" height="500"
                        src="https://www.youtube.com/embed/videoseries?list=PL3k51Gbd96lYLxLhES9asWtfWisC70hfV"
                        frameborder="0" allowfullscreen>
                    </iframe>
                </div>
            </div>

            <div class="card shadow-sm mb-3">
                <h1 class="card-header">Frequently Asked Questions</h1>
                <div class="p-3">
                    <strong>Why isn't the PDF loading?</strong>
                    <p>The software requires you use an up-to-date version of Google Chrome. To update or check the
                        version
                        of Google Chrome, follow the instructions <a
                            href="https://support.google.com/chrome/answer/95414?co=GENIE.Platform%3DDesktop&hl=en">here</a>.
                    </p>
                    <strong>Why isn't my template/feedback saving?</strong>
                    <p>Did any error messages appear when you clicked 'Save Form'? You must make sure all sections are
                        completed.</p>
                    <p>If no error messages appear but the download does not start, check that you have not blocked
                        downloads for the page. If you have blocked downloads, there will be a red icon on the right end
                        of
                        the URL bar. Click this to change the download settings to allow downloads from the page.</p>
                </div>
            </div>

            <div class="card shadow-sm mb-3">
                <h1 class="card-header">Further Queries</h1>
                <div class="p-3">
                    <p>If you have a question that isn't answered here, please contact us at&nbsp;<a
                            href="mailto:ffbukcontact@gmail.com">ffbukcontact@gmail.com</a>.</p>
                </div>
            </div>
        </div>
    </div>

</body>

</html>