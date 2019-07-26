<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'SWiFT') }}</title>

    <link rel="icon" href="/svg/book-solid.png" />

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
                <h3 class="card-header">Tutorial Videos</h3>
                <div class="p-3">

                    <div class="accordion" id="accordionExample">
                        <div class="card">
                            <div class="card-header use-pointer" id="headingOne" data-toggle="collapse"
                            data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                <h2 class="mb-0">
                                    <button class="btn btn-link" type="button">
                                        Creating a Course
                                    </button>
                                </h2>
                            </div>

                            <div id="collapseOne" class="collapse" aria-labelledby="headingOne"
                                data-parent="#accordionExample">
                                <div class="card-body">
                                    <iframe width="100%" height="550" src="https://www.youtube.com/embed/iHECzWSPOMg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header use-pointer" id="headingTwo" data-toggle="collapse"
                            data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button">
                                        Managing Course Permissions
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo"
                                data-parent="#accordionExample">
                                <div class="card-body">
                                    <iframe width="100%" height="550" src="https://www.youtube.com/embed/h19wMf4h4xM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header use-pointer" id="headingThree" data-toggle="collapse"
                            data-target="#collapseThree" aria-expanded="false"
                            aria-controls="collapseThree">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button">
                                        Marking Assignments
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseThree" class="collapse" aria-labelledby="headingThree"
                                data-parent="#accordionExample">
                                <div class="card-body">
                                    <iframe width="100%" height="550" src="https://www.youtube.com/embed/MBBHDvuTg7A" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>

                        <div class="card">
                            <div class="card-header use-pointer" id="headingFour" data-toggle="collapse"
                            data-target="#collapseFour" aria-expanded="false"
                            aria-controls="collapseFour">
                                <h2 class="mb-0">
                                    <button class="btn btn-link collapsed" type="button" >
                                        Understanding Analytics
                                    </button>
                                </h2>
                            </div>
                            <div id="collapseFour" class="collapse" aria-labelledby="headingFour"
                                data-parent="#accordionExample">
                                <div class="card-body">
                                    <iframe width="100%" height="550" src="https://www.youtube.com/embed/WXcHPABGiCc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card shadow-sm mb-3">
                <h3 class="card-header">Frequently Asked Questions</h3>
                <div class="p-3">
                    <strong>Why isn't the PDF loading?</strong>
                    <p>The software requires you use an up-to-date version of Google Chrome. To update or check the
                        version
                        of Google Chrome, follow the instructions <a
                            href="https://support.google.com/chrome/answer/95414?co=GENIE.Platform%3DDesktop&hl=en">here</a>.
                    </p>
                </div>
            </div>

            <div class="card shadow-sm mb-3">
                <h3 class="card-header">Further Queries</h3>
                <div class="p-3">
                    <p>If you have a question that isn't answered here, please contact us at&nbsp;<a
                            href="mailto:swift.feedback.tool@gmail.com">swift.feedback.tool@gmail.com</a>.</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}"></script>
</body>

</html>